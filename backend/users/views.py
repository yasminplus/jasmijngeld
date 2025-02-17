from django.conf import settings
# from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ImproperlyConfigured, ValidationError
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.urls import reverse, resolve
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.translation import gettext_lazy
from rest_framework import status
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.response import Response
from .token import default_token_generator
from .models import User
from .serializers import UserSerializer

# Create your views here.
class RegistrationView(CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_verification_email(user)
        return Response(status=status.HTTP_201_CREATED)
    
    # OPTIONS request work even without this
    # def options(self, request, *args, **kwargs):
    #     """
    #     Don't include the view description in OPTIONS responses.
    #     """
    #     meta = self.metadata_class()
    #     data = meta.determine_metadata(request, self)
    #     data.pop('description')
    #     return Response(data=data, status=status.HTTP_200_OK)

# create token
def send_verification_email(user):
    send_email(user, 'EMAIL')

def send_reset_password_email(user):
    send_email(user, 'PASSWORD')

def send_email(user, type):
    if type == 'EMAIL':
        expiration = settings.VERIFY_EMAIL_TIMEOUT
        plain_template = 'verify_email.txt'
        html_template = 'verify_email.html'
    else:
        expiration = settings.PASSWORD_RESET_TIMEOUT
        plain_template = 'reset_password.txt'
        html_template = 'reset_password.html'

    token = default_token_generator.make_token(user)
    user_pk_bytes = force_bytes(User._meta.pk.value_to_string(user))
    uid = urlsafe_base64_encode(user_pk_bytes)
    url = settings.FRONTEND_URL + '/verify/' + uid + "/" + token
    print(url)

    # convert expiration to human-readable language
    expiration = str(expiration // 3600) + " hour" + ("s" if expiration > 1 else "")

    data = {
        "expiration": expiration,
        "url": url
    }
    plain_content = render_to_string(plain_template, data)
    html_content = render_to_string(html_template, data)

    sender = settings.DEFAULT_FROM_EMAIL
    subject = settings.EMAIL_VERIFY_EMAIL_SUBJECT if type == 'EMAIL' else settings.EMAIL_RESET_PASSWORD_SUBJECT
    debug = settings.DEBUG

    try:
        send_mail(subject, 
                plain_content,
                sender,
                [user.email],
                fail_silently=not debug,
                html_message=html_content
        )
    except Exception as e:
        print(e)

class RequestVerifyView(GenericAPIView):
    def get(self, request, *args, **kwargs):
        pass

class VerifyAccountView(GenericAPIView):
    def get(self, request, *args, **kwargs):
        if "uidb64" not in kwargs or "token" not in kwargs:
            raise ImproperlyConfigured(
                "The URL path must contain 'uidb64' and 'token' parameters."
            )

        self.validlink = False
        user = self.get_user(kwargs["uidb64"])
        print(user)

        if user is not None:
            token = kwargs['token']
            print(token)
            if default_token_generator.check_token(user, token, 'EMAIL'):
                user.is_verified = True
                user.save()
                return Response(status=status.HTTP_200_OK)
            else:
                # expired or invalid
                return Response({"message": gettext_lazy("Expired token")}, status=status.HTTP_410_GONE)

        print(self.kwargs)
        print(request.query_params)
    
    # copied from django.contrib.auth.PasswordResetConfirmView
    def get_user(self, uidb64):
        try:
            # urlsafe_base64_decode() decodes to bytestring
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User._default_manager.get(pk=uid)
        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist,
            ValidationError,
        ):
            user = None
        return user

class RequestResetPasswordView(GenericAPIView):
    pass

