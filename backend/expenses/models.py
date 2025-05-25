from django.db import models
from users.models import User
from sources.models import PaymentSource

# Create your models here.
class ExpenseCategory(models.Model):
    name = models.CharField(max_length=30)

class Currency(models.Model):
    name = models.CharField(max_length=30)
    code = models.CharField(max_length=3)

class Store(models.Model):
    name = models.CharField(max_length=30)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # maybe consider to couple store with currency, 
    # e.g. shopee with IDR or amazon.de with EUR

class Expense(models.Model):
    category = models.ForeignKey(ExpenseCategory, on_delete=models.PROTECT)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT)
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    amount = models.FloatField()
    date = models.DateField()
    description = models.TextField(blank=True, max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    source = models.ForeignKey(PaymentSource, on_delete=models.PROTECT) # protect or cascade?
