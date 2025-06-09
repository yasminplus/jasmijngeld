from django.urls import path

from .views import PaymentSourceListCreateView, PaymentSourceListView, PaymentSourceRetrieveUpdateDestroyView

app_name = 'sources'

urlpatterns = [
    path("", PaymentSourceListCreateView.as_view(), name="source-create"),
    path("all", PaymentSourceListView.as_view(), name="source-list"),
    path("<int:id>", PaymentSourceRetrieveUpdateDestroyView.as_view(), name="source-retrieveupdatedelete")
]