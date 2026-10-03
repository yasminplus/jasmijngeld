from django.db import IntegrityError, transaction
from sources.services import create_cash_source
from .google import GoogleAuthError, GoogleEmailNotVerified
from .models import User


def get_or_create_google_user(claims) -> User:
    """
    Get or create a user based on Google claims.
    """
    try:
        return _get_or_create_google_user(claims)
    except IntegrityError:
        # Another sign-in for the same new Google account (e.g. from a second
        # tab) created or linked it first, so the unique google_sub/email check
        # failed. Each request has its own auth code; codes are single-use.
        user = User.objects.filter(google_sub=claims.get("sub")).first()
        if user:
            return user
        raise


@transaction.atomic
def _get_or_create_google_user(claims) -> User:
    google_sub = claims.get("sub")
    email = claims.get("email")
    email_verified = claims.get("email_verified")

    if not email or not google_sub:
        raise GoogleAuthError("Google claims must include 'email' and 'sub'.")

    # search sub in the User database
    user = User.objects.filter(google_sub=google_sub).first()
    if user:
        return user

    if email_verified is not True:
        raise GoogleEmailNotVerified(f"Google account email {email} is not verified.")

    # search email in the User database
    user = User.objects.filter(email__iexact=email).first()
    if user:
        # accounts made via createsuperuser or the admin can have no name
        _fill_missing_names(user, claims)
        if user.is_verified:
            # If the user exists and is verified, we can link the Google account
            user.google_sub = google_sub
            user.save()
            return user
        else:
            user.is_verified = True
            user.google_sub = google_sub
            user.set_unusable_password()
            user.save()
            create_cash_source(user)
            return user

    # If the user does not exist, create a new one
    user = User.objects.create_social_user(
        email=email,
        google_sub=google_sub,
        first_name=claims.get("given_name", email.split('@')[0]),
        last_name=claims.get("family_name", ""),
        is_verified=True,
    )
    create_cash_source(user)
    return user


def _fill_missing_names(user, claims):
    """
    Take the names from Google only where the account has none.
    Never overwrites a name the user chose.
    """
    if not user.first_name:
        user.first_name = claims.get("given_name", "")
    if not user.last_name:
        user.last_name = claims.get("family_name", "")
