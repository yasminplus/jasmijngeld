from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import *

app_name = 'users'

urlpatterns = [
    path('', RUDUserView.as_view(), name='profile'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', RegistrationView.as_view(), name='register'),
    path('verify/<str:uidb64>/<str:token>/', VerifyAccountView.as_view(), name='verify_email'),
    path('resend/', ResendVerifTokenView.as_view(), name='resend_verif_token'),

    path('chgpw/', ChangePasswordView.as_view(), name='change_pw'),
    path('request-reset/', RequestResetTokenView.as_view(), name='request_reset_token'),
    path('verify-reset/<str:uidb64>/<str:token>/', VerifyResetPasswordTokenView.as_view(), name='verify_password'),
    path('resetpw/<str:uidb64>/<str:token>/', ResetPasswordView.as_view(), name='reset_pw'),

    path('google/', GoogleLoginView.as_view(), name='google_login'),
]