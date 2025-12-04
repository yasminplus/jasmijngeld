from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', ]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class JGTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_verified'] = user.is_verified

        return token


class UserAccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', ]
        read_only_fields = ['email',]


class ChangePasswordSerializer(serializers.Serializer):
    old = serializers.CharField()
    new = serializers.CharField()
