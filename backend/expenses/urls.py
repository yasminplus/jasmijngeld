from django.urls import path

from .views import ExpenseCategoryListView, ExpenseListCreateView, ExpenseRetrieveUpdateDeleteView, ExpenseSummaryLast12Months, StoreListCreateView

app_name = 'expenses'

urlpatterns = [
    path("stores/", StoreListCreateView.as_view(), name="store-listcreate"),
    path("categories/", ExpenseCategoryListView.as_view(), name="categories-list"),
    path("last12months/", ExpenseSummaryLast12Months.as_view(), name="summary-yearly"),
    path("", ExpenseListCreateView.as_view(), name="expenses-listcreate"),
    path("<int:id>", ExpenseRetrieveUpdateDeleteView.as_view(), name="expenses-retrieveupdatedelete"),
]