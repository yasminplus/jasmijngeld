from django.contrib import admin
from .models import Currency, Expense, ExpenseCategory, Store

# Register your models here.
admin.site.register(Currency)
admin.site.register(Expense)
admin.site.register(ExpenseCategory)
admin.site.register(Store)