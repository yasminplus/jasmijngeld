from django.urls import path

from .views import ExpenseCategoryListView, ExpenseListCreateView, ExpenseRetrieveUpdateDeleteView, ExpenseSummaryLast12MonthsView, ExpenseSummaryMonthlyByCategoryView, ExpenseSummaryMonthlyBySourceView, StoreListCreateView

app_name = 'expenses'

urlpatterns = [
    path("stores/", StoreListCreateView.as_view(), name="store-listcreate"),
    path("categories/", ExpenseCategoryListView.as_view(), name="categories-list"),
    path("last12months/", ExpenseSummaryLast12MonthsView.as_view(), name="summary-yearly"),
    path("monthly-cat/", ExpenseSummaryMonthlyByCategoryView.as_view(), name="summary-monthly-category"),
    path("monthly-src/", ExpenseSummaryMonthlyBySourceView.as_view(), name="summary-monthly-source"),
    path("", ExpenseListCreateView.as_view(), name="expenses-listcreate"),
    path("<int:id>", ExpenseRetrieveUpdateDeleteView.as_view(), name="expenses-retrieveupdatedelete"),
]