from unittest import mock

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.db import IntegrityError, connection
from django.test import TestCase
from django.urls import reverse
from google.auth.exceptions import TransportError
from rest_framework import status
from rest_framework.test import APITestCase

import jwt
import requests

from sources.models import PaymentSource
from users import google, services
from users.google import GoogleAuthError, GoogleEmailNotVerified, GoogleUnavailable
from users.models import User


def make_claims(**overrides):
    claims = {
        "sub": "google-sub-1",
        "email": "dewi@gmail.com",
        "email_verified": True,
        "given_name": "Dewi",
        "family_name": "Pertiwi",
    }
    claims.update(overrides)
    return claims


def cash_count(user):
    return PaymentSource.objects.filter(user=user, source_type="CA").count()


def token_response(status_code, body):
    response = mock.Mock(status_code=status_code, ok=status_code < 400, text=str(body))
    response.json.return_value = body
    return response


@mock.patch.object(google, "GOOGLE_CLIENT_SECRET", "test-secret")
@mock.patch.object(google, "GOOGLE_CLIENT_ID", "test-client-id")
@mock.patch.object(google.id_token, "verify_oauth2_token")
@mock.patch.object(google.requests, "post")
class GetGoogleClaimsTest(TestCase):
    def test_success_returns_verified_claims(self, post, verify):
        post.return_value = token_response(200, {"id_token": "the-id-token"})
        verify.return_value = make_claims()

        self.assertEqual(google.get_google_claims("the-code"), make_claims())

        data = post.call_args.kwargs["data"]
        self.assertEqual(data["code"], "the-code")
        self.assertEqual(data["client_id"], "test-client-id")
        self.assertEqual(data["client_secret"], "test-secret")
        self.assertEqual(data["grant_type"], "authorization_code")
        self.assertEqual(data["redirect_uri"], "postmessage")
        self.assertEqual(verify.call_args.args[0], "the-id-token")
        self.assertEqual(verify.call_args.args[1].keywords["timeout"], 10)
        self.assertEqual(verify.call_args.args[2], "test-client-id")

    def test_rejected_code_raises_auth_error(self, post, verify):
        post.return_value = token_response(400, {"error": "invalid_grant"})
        # The message tells this apart from the "no id_token" check, which
        # would also raise GoogleAuthError if the status check were missing.
        with self.assertRaisesRegex(GoogleAuthError, "Code exchange failed"):
            google.get_google_claims("the-code")

    def test_google_server_error_raises_unavailable(self, post, verify):
        post.return_value = token_response(503, {})
        with self.assertRaises(GoogleUnavailable):
            google.get_google_claims("the-code")

    def test_network_error_raises_unavailable(self, post, verify):
        post.side_effect = requests.Timeout("timed out")
        with self.assertRaises(GoogleUnavailable):
            google.get_google_claims("the-code")

    def test_response_without_id_token_raises_auth_error(self, post, verify):
        post.return_value = token_response(200, {"access_token": "a"})
        with self.assertRaises(GoogleAuthError):
            google.get_google_claims("the-code")

    def test_invalid_id_token_raises_auth_error(self, post, verify):
        post.return_value = token_response(200, {"id_token": "the-id-token"})
        verify.side_effect = ValueError("Could not verify token signature.")
        with self.assertRaises(GoogleAuthError):
            google.get_google_claims("the-code")

    def test_unreachable_certs_raise_unavailable(self, post, verify):
        post.return_value = token_response(200, {"id_token": "the-id-token"})
        verify.side_effect = TransportError("connection refused")
        with self.assertRaises(GoogleUnavailable):
            google.get_google_claims("the-code")

    def test_missing_client_config_raises_improperly_configured(self, post, verify):
        with mock.patch.object(google, "GOOGLE_CLIENT_ID", None):
            with self.assertRaises(ImproperlyConfigured):
                google.get_google_claims("the-code")
        post.assert_not_called()


class GetOrCreateGoogleUserTest(TestCase):
    def test_new_user_is_created_verified_with_cash_source(self):
        user = services.get_or_create_google_user(make_claims())

        self.assertEqual(user.email, "dewi@gmail.com")
        self.assertEqual(user.google_sub, "google-sub-1")
        self.assertEqual(user.first_name, "Dewi")
        self.assertEqual(user.last_name, "Pertiwi")
        self.assertTrue(user.is_verified)
        self.assertFalse(user.has_usable_password())
        self.assertEqual(cash_count(user), 1)

    def test_new_user_without_names(self):
        claims = make_claims()
        del claims["given_name"]
        del claims["family_name"]
        user = services.get_or_create_google_user(claims)

        self.assertEqual(user.first_name, "dewi")
        self.assertEqual(user.last_name, "")

    def test_returning_user_is_found_by_sub(self):
        user = services.get_or_create_google_user(make_claims())
        # email changed on Google's side and isn't verified yet
        again = services.get_or_create_google_user(
            make_claims(email="dewi@newjob.com", email_verified=False))

        self.assertEqual(again.pk, user.pk)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(cash_count(user), 1)

    def test_links_verified_account_and_keeps_password(self):
        existing = User.objects.create_user(email="dewi@gmail.com", password="old-password")
        existing.is_verified = True
        existing.save()
        PaymentSource.objects.create(name="Cash", source_type="CA", user=existing)

        user = services.get_or_create_google_user(make_claims())
        # assert on what was saved, not just on the returned in-memory object
        user.refresh_from_db()

        self.assertEqual(user.pk, existing.pk)
        self.assertEqual(user.google_sub, "google-sub-1")
        self.assertTrue(user.check_password("old-password"))
        self.assertEqual(cash_count(user), 1)

    def test_links_unverified_account_and_wipes_password(self):
        # someone registered this email first and never verified it
        squatter = User.objects.create_user(email="dewi@gmail.com", password="attacker-password")

        user = services.get_or_create_google_user(make_claims())
        user.refresh_from_db()

        self.assertEqual(user.pk, squatter.pk)
        self.assertTrue(user.is_verified)
        self.assertEqual(user.google_sub, "google-sub-1")
        self.assertFalse(user.check_password("attacker-password"))
        self.assertFalse(user.has_usable_password())
        self.assertEqual(cash_count(user), 1)

    def test_email_match_is_case_insensitive(self):
        existing = User.objects.create_user(email="Dewi@gmail.com", password="old-password")

        user = services.get_or_create_google_user(make_claims(email="dewi@gmail.com"))

        self.assertEqual(user.pk, existing.pk)
        self.assertEqual(User.objects.count(), 1)

    def test_unverified_email_without_sub_match_is_rejected(self):
        with self.assertRaises(GoogleEmailNotVerified):
            services.get_or_create_google_user(make_claims(email_verified=False))
        self.assertFalse(User.objects.exists())

    def test_email_verified_must_be_exactly_true(self):
        with self.assertRaises(GoogleEmailNotVerified):
            services.get_or_create_google_user(make_claims(email_verified="false"))

    def test_missing_email_or_sub_is_rejected(self):
        with self.assertRaises(GoogleAuthError):
            services.get_or_create_google_user(make_claims(email=None))
        with self.assertRaises(GoogleAuthError):
            services.get_or_create_google_user(make_claims(sub=None))

    def test_concurrent_create_falls_back_to_existing_user(self):
        def other_request_wins(claims):
            User.objects.create_social_user(email=claims["email"], google_sub=claims["sub"])
            raise IntegrityError("duplicate key value violates unique constraint")

        with mock.patch.object(services, "_get_or_create_google_user", side_effect=other_request_wins):
            user = services.get_or_create_google_user(make_claims())

        self.assertEqual(user.google_sub, "google-sub-1")

    def test_unexplained_integrity_error_is_raised(self):
        with mock.patch.object(services, "_get_or_create_google_user", side_effect=IntegrityError):
            with self.assertRaises(IntegrityError):
                services.get_or_create_google_user(make_claims())

    def test_cash_source_database_error_keeps_the_user(self):
        def database_error(*args, **kwargs):
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM table_that_does_not_exist")

        with mock.patch.object(PaymentSource.objects, "create", side_effect=database_error), \
                self.assertLogs("sources.services", level="ERROR"):
            user = services.get_or_create_google_user(make_claims())

        self.assertTrue(User.objects.filter(pk=user.pk, google_sub="google-sub-1").exists())
        self.assertEqual(cash_count(user), 0)


class GoogleLoginViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.url = reverse("users:google_login")

    def post(self, data={"code": "the-code"}):
        return self.client.post(self.url, data, format="json")

    @mock.patch("users.views.get_google_claims")
    def test_success_returns_token_pair(self, get_claims):
        get_claims.return_value = make_claims()

        response = self.post()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(set(response.data), {"access", "refresh"})
        payload = jwt.decode(response.data["access"], key=settings.SECRET_KEY, algorithms=["HS256"])
        user = User.objects.get(google_sub="google-sub-1")
        self.assertEqual(payload["user_id"], user.pk)
        self.assertTrue(payload["is_verified"])
        get_claims.assert_called_once_with("the-code")

    @mock.patch("users.views.get_google_claims")
    def test_missing_code_returns_400(self, get_claims):
        response = self.post({})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["message"], "Missing 'code' parameter")
        get_claims.assert_not_called()

    @mock.patch("users.views.get_google_claims")
    def test_unverified_email_returns_400_with_own_message(self, get_claims):
        get_claims.return_value = make_claims(email_verified=False)

        response = self.post()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("isn't verified", response.data["message"])
        self.assertFalse(User.objects.exists())

    @mock.patch("users.views.get_google_claims")
    def test_google_auth_error_returns_400_without_details(self, get_claims):
        get_claims.side_effect = GoogleAuthError('Code exchange failed (400): {"error": "invalid_grant"}')

        response = self.post()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["message"], "Google sign-in failed. Please try again.")

    @mock.patch("users.views.get_google_claims")
    def test_google_unavailable_returns_502(self, get_claims):
        get_claims.side_effect = GoogleUnavailable("timed out")

        # Django logs every 5xx to django.request. Capturing it here also keeps
        # it away from the admin-email handler, which crashes on Python 3.14
        # with Django 4.2.
        with self.assertLogs("django.request", level="ERROR"):
            response = self.post()

        self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)
        self.assertEqual(response.data["message"], "Couldn't reach Google. Please try again later.")
