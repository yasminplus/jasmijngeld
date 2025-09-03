from django.conf import settings
# from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ImproperlyConfigured, ObjectDoesNotExist, ValidationError
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.urls import reverse, resolve
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.translation import gettext_lazy
from rest_framework import status
from rest_framework.generics import CreateAPIView, GenericAPIView, RetrieveAPIView, UpdateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .token import default_token_generator
from .models import User
from .serializers import UserSerializer, JGTokenObtainPairSerializer, UserAccountSerializer
from sources.models import *


class RegistrationView(CreateAPIView):
    authentication_classes = []
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

# copied from django.contrib.auth.PasswordResetConfirmView
def get_user(uidb64):
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

class JGTokenObtainPairView(TokenObtainPairView):
    serializer_class = JGTokenObtainPairSerializer

class RequestVerifyView(GenericAPIView):    
    def get(self, request, *args, **kwargs):
        pass


class ResendVerifTokenView(GenericAPIView):
    # with this, user data, if any, is still available
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        user = request.user

        if not user:
            if "uidb64" not in request.data:
                raise ImproperlyConfigured(
                "The URL path must contain 'uidb64' parameters."
            )
            user = get_user(request.data["uidb64"])

        if user is not None:
            send_verification_email(user)
            return Response(status=status.HTTP_200_OK)
        else:
            # TODO: check what should we return
            return Response(status=status.HTTP_401_UNAUTHORIZED)


# we can use this for reset pw
class RequestVerifTokenView(GenericAPIView):
    authentication_classes = []
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            send_verification_email(user)
        except ObjectDoesNotExist as e:
            # do not tell user that email is not found
            print(e)
        return Response(status=status.HTTP_200_OK)


class VerifyAccountView(GenericAPIView):
    authentication_classes = []
    def get(self, request, *args, **kwargs):
        if "uidb64" not in kwargs or "token" not in kwargs:
            raise ImproperlyConfigured(
                "The URL path must contain 'uidb64' and 'token' parameters."
            )

        self.validlink = False
        user = get_user(kwargs["uidb64"])

        if user is not None:
            # for when user is already verified
            if user.is_verified:
                return Response(status=status.HTTP_200_OK)
            
            token = kwargs['token']
            if default_token_generator.check_token(user, token, 'EMAIL'):
                user.is_verified = True
                user.save()

                self.create_cash_source(user)
                return Response(status=status.HTTP_200_OK)
            else:
                # expired or invalid
                return Response({"message": gettext_lazy("Expired token")}, status=status.HTTP_410_GONE)

    """
    TODO: maybe we can place it in the User class, 
    but we'll have to handle the circular imports.
    """
    def create_cash_source(self, user):
        try:
            PaymentSource.objects.create(name="Cash", source_type="CA", user=user)
        except Exception as e:
            print(e)
    

class RUDUserView(RetrieveUpdateAPIView):
    serializer_class = UserAccountSerializer
    # queryset = User.objects.filter(email=request.user.email)

    def get_queryset(self):
        return User.objects.filter(email=self.request.user.email)

    def get_object(self):
        queryset = self.get_queryset()
        return queryset[0]
    

class RequestResetPasswordView(GenericAPIView):
    pass

