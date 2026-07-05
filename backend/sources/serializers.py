from rest_framework import serializers
from .models import PaymentSource

class MyChoiceField(serializers.ChoiceField):

    def to_representation(self, obj):
        if obj == '' and self.allow_blank:
            return obj
        return self._choices[obj]

    def to_internal_value(self, data):
        # To support inserts with the value
        if data == '' and self.allow_blank:
            return ''

        for key, val in self._choices.items():
            if val == data:
                return key
        self.fail('invalid_choice', input=data)


class PaymentSourceSerializer(serializers.ModelSerializer):
    source_type = MyChoiceField(choices=PaymentSource.SOURCE_TYPE_CHOICES)
    
    class Meta:
        model = PaymentSource
        fields = ['id', 'name', 'source_type', 'acc_identifier']
        # does not include 'user' since the user itself must be logged in, 
        # so i don't think it's necessary
