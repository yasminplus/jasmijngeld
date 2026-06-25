from django.urls import path

from .views import *

app_name = 'expenses'

urlpatterns = [
    path("stores/", StoreListCreateView.as_view(), name="store-listcreate"),
    path("categories/", ExpenseCategoryListView.as_view(), name="categories-list"),
    path("last12months/", ExpenseSummaryLast12MonthsView.as_view(), name="summary-yearly"),
    path("monthly-cat/", ExpenseSummaryMonthlyByCategoryView.as_view(), name="summary-monthly-category"),
    path("monthly-src/", ExpenseSummaryMonthlyBySourceView.as_view(), name="summary-monthly-source"),
    # TODO: check this
    path("monthly-total/", TotalExpenseMonthlyView.as_view(), name="total-monthly-expense"), 
    path("dist-mo/", ExpenseMonthYearView.as_view(), name="distinct-month"),
    path("", ExpenseListCreateView.as_view(), name="expenses-listcreate"),
    path("<int:id>", ExpenseRetrieveUpdateDeleteView.as_view(), name="expenses-retrieveupdatedelete"),
    path("ai-parse", ParseExpenseTextView.as_view(), name="expenses-aiparse"),

]