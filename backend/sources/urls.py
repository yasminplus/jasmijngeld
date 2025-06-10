from django.urls import path

from .views import PaymentSourceListCreateView, PaymentSourceRetrieveUpdateDestroyView

app_name = 'sources'

urlpatterns = [
    path("", PaymentSourceListCreateView.as_view(), name="source-listcreate"),
    path("<int:id>", PaymentSourceRetrieveUpdateDestroyView.as_view(), name="source-retrieveupdatedelete")
]