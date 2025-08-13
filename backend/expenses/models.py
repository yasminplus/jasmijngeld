from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

from sources.models import PaymentSource
from users.models import User

# Create your models here.
class ExpenseCategory(models.Model):
    name = models.CharField(max_length=30)
    icon = models.CharField(blank=True)     # icon name on the frontend
    hue = models.FloatField(null=True)     # hue value to use on the frontend

    def __str__(self):
        return self.name


class Store(models.Model):
    name = models.CharField(max_length=30, unique=True)
    # decided not to couple Store to a user, as store name can be shareable among different users
    # maybe consider to couple store with currency, 
    # e.g. shopee with IDR or amazon.de with EUR

    def __str__(self):
        return f'{self.name}'


class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.FloatField()
    currency = models.CharField(max_length=3, choices=settings.CURRENCIES)
    description = models.TextField(blank=True, max_length=100)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.PROTECT)
    store = models.ForeignKey(Store, null=True, blank=True, on_delete=models.PROTECT)
    source = models.ForeignKey(PaymentSource, null=True, blank=True, on_delete=models.PROTECT) # protect or cascade?

    def __str__(self):
        return f'{self.amount} spent on {self.date}'
