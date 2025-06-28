from django.urls import path

from .views import ExpenseCategoryListView, ExpenseListCreateView, ExpenseRetrieveUpdateDeleteView, StoreListCreateView

app_name = 'expenses'

urlpatterns = [
    path("stores/", StoreListCreateView.as_view(), name="store-listcreate"),
    path("categories/", ExpenseCategoryListView.as_view(), name="categories-list"),
    path("", ExpenseListCreateView.as_view(), name="expenses-listcreate"),
    path("<int:id>", ExpenseRetrieveUpdateDeleteView.as_view(), name="expenses-retrieveupdatedelete")
]