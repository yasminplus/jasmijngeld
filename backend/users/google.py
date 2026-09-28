"""
client for Google
"""

import requests
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from google.auth.exceptions import TransportError
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET = settings.GOOGLE_CLIENT_SECRET


class GoogleAuthError(Exception):
    """Google rejected the code, or the ID token failed verification."""


class GoogleEmailNotVerified(GoogleAuthError):
    """Google hasn't verified the account's email, so we can't create or link by it."""


class GoogleUnavailable(Exception):
    """Google couldn't be reached, or had a server error."""


def get_google_claims(code) -> dict:
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise ImproperlyConfigured(
            "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set."
        )

    try:
        response = requests.post("https://oauth2.googleapis.com/token",
                    data={
                        "code": code,
                        "client_id": GOOGLE_CLIENT_ID,
                        "client_secret": GOOGLE_CLIENT_SECRET,
                        "grant_type": "authorization_code",
                        "redirect_uri": "postmessage"
                    },
                    timeout=10
                )
    except requests.RequestException as e:
        raise GoogleUnavailable(f"Code exchange request failed: {e}") from e

    if response.status_code >= 500:
        raise GoogleUnavailable(f"Code exchange failed ({response.status_code})")
    if not response.ok:
        # e.g. 400 {"error": "invalid_grant"} for an expired or reused code
        raise GoogleAuthError(
            f"Code exchange failed ({response.status_code}): {response.text}"
        )

    token = response.json().get("id_token")
    if not token:
        raise GoogleAuthError("Google's response has no id_token")

    # Checks the signature, exp, aud == our client ID and iss.
    # A little clock skew avoids "Token used too early" if our clock is behind.
    try:
        return id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10,
        )
    except TransportError as e:
        # couldn't fetch Google's public keys
        raise GoogleUnavailable(f"Could not fetch Google's certs: {e}") from e
    except ValueError as e:
        raise GoogleAuthError(f"Invalid id_token: {e}") from e
