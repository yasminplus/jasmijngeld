from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission
from users.models import User


class IsEmailVerified(BasePermission):
    message = "E-mail is not yet verified"

    def has_permission(self, request, view):
        return bool(
            request.user and get_user_model().objects.filter(email=request.user.email, is_verified=True)
        ) or request.user.is_superuser
