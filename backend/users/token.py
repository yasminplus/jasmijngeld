from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.crypto import constant_time_compare, salted_hmac
from django.utils.http import base36_to_int, int_to_base36

# taken from django.contrib.auth.tokens.PasswordResetTokenGenerator
class TokenGenerator(PasswordResetTokenGenerator):
    def check_token(self, user, token, type):
        """
        Check that a password reset token is correct for a given user.
        """
        if not (user and token):
            return False
        # Parse the token
        try:
            ts_b36, _ = token.split("-")
        except ValueError:
            return False

        try:
            ts = base36_to_int(ts_b36)
        except ValueError:
            return False

        # Check that the timestamp/uid has not been tampered with
        if not constant_time_compare(self._make_token_with_timestamp(user, ts), token):
            return False
        
        if type == 'EMAIL':
            timeout = settings.VERIFY_EMAIL_TIMEOUT
        else:
            timeout = settings.PASSWORD_RESET_TIMEOUT

        # Check the timestamp is within limit.
        if (self._num_seconds(self._now()) - ts) > timeout:
            return False

        return True

default_token_generator = TokenGenerator()