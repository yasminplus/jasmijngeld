from rest_framework import serializers

from sources.models import PaymentSource
from .models import Expense, ExpenseCategory, Store


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = '__all__'


class SourceExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentSource
        fields = ['id', 'name', ]


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = '__all__'


class ExpenseSerializer(serializers.ModelSerializer):
    store = serializers.SlugRelatedField(queryset=Store.objects.all(),slug_field='name', allow_null=True) 
    category = serializers.SlugRelatedField(queryset=ExpenseCategory.objects.all(),slug_field='name')
   
    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if request: # and request.method.lower() == "get":
            fields['source'] = serializers.SlugRelatedField(
                queryset=PaymentSource.objects.filter(user=request.user),
                slug_field='name'
            )
        return fields

    class Meta:
      model = Expense
      fields = ['id', 'amount', 'date', 'description', 'category', 'currency', 'store', 'source']

class ExpenseSummaryLast12MonthsSerializer(serializers.Serializer):
    total = serializers.DecimalField(max_digits=None, decimal_places=2)
    month = serializers.DateField()
    currency = serializers.CharField()