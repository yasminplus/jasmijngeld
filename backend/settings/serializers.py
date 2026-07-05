from rest_framework import serializers
from .models import Settings

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ['id', 'key', 'value']


class CurrencySerializer(serializers.Serializer):
    currencies = serializers.ListField(child=serializers.CharField())
