from rest_framework import serializers
from .models import PaymentSource

class PaymentSourceSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    
    class Meta:
        model = PaymentSource
        fields = '__all__'