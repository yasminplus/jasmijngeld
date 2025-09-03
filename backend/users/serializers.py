from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', ]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class JGTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['is_verified'] = user.is_verified

        return token


class UserAccountSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', ]
        read_only_fields = ['email',]
