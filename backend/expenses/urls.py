from django.urls import path

from .views import StoreListCreateView

app_name = 'expenses'

urlpatterns = [
    path("stores/", StoreListCreateView.as_view(), name="store-listcreate")
]