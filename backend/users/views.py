from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework.generics import CreateAPIView, GenericAPIView
from serializers import UserSerializer

# Create your views here.
class RegistrationView(CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_verification_email(user)


# create token
def send_verification_email(user):
    email_template = 'verify_email.html'

def send_email(user, type, template):
    if type == 'EMAIL':
        expiration = settings.VERIFY_EMAIL_TIMEOUT
        plain_template = 'verify_email.txt'
        html_template = 'verify_email.html'
    else:
        expiration = settings.PASSWORD_RESET_TIMEOUT
        plain_template = 'reset_password.txt'
        html_template = 'reset_password.html'

    data = {
        "expiration": expiration,
        "email": user.email
    }
    plain_content = render_to_string(plain_template, data)
    html_content = render_to_string(html_template, data)

    sender = settings.EMAIL_FROM_ADDRESS
    subject = settings.EMAIL_VERIFY_EMAIL_SUBJECT if type == 'EMAIL' else settings.EMAIL_RESET_PASSWORD_SUBJECT
    debug = settings.DEBUG

    send_mail(subject, 
              plain_content,
              sender,
              [user.email],
              fail_silently=not debug,
              html_message=html_content
    )

class VerifyAccountView(GenericAPIView):
    pass

class RequestResetPasswordView(GenericAPIView):
    email_template = 'request_reset_password.html'
    pass

