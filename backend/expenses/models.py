from django.db import models
from users.models import User
from sources.models import PaymentSource
from django.conf import settings

# Create your models here.
class ExpenseCategory(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name

class Store(models.Model):
    name = models.CharField(max_length=30)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # maybe consider to couple store with currency, 
    # e.g. shopee with IDR or amazon.de with EUR

    def __str__(self):
        return f'{self.name}'

class Expense(models.Model):
    category = models.ForeignKey(ExpenseCategory, on_delete=models.PROTECT)
    currency = models.CharField(max_length=3, choices=settings.CURRENCIES)
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    amount = models.FloatField()
    date = models.DateField()
    description = models.TextField(blank=True, max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    source = models.ForeignKey(PaymentSource, on_delete=models.PROTECT) # protect or cascade?

    def __str__(self):
        return f'{self.amount} spent on {self.date}'
