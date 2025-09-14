from django.urls import path

from .views import *

app_name = 'settings'

urlpatterns = [
    path("", CurrentSettingsView.as_view(), name="settings"),
    path("currencies/", CurrencyListView.as_view(), name="currency-list"),
]