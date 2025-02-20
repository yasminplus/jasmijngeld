from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import RegistrationView, VerifyAccountView, RequestResetPasswordView

app_name = 'users'

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', RegistrationView.as_view(), name='register'),
    path('verify/<str:uidb64>/<str:token>/', VerifyAccountView.as_view(), name='verify_email'),
    # TODO
    # path('request-verify/', VerifyAccountView.as_view(), name='verify_email'),
]