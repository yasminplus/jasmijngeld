from django.db.models.functions import TruncMonth
from django.db.models import Sum, F
from django.utils import timezone
from datetime import timedelta
from dateutil.parser import parse
from dateutil.relativedelta import relativedelta
from rest_framework import filters
from rest_framework.generics import GenericAPIView, ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from users.permissions import IsEmailVerified

from .models import ExpenseCategory, Expense, Store
from .serializers import ExpenseCategorySerializer, ExpenseSerializer, ExpenseSummaryLast12MonthsSerializer, ExpenseSummaryMonthlyByCategorySerializer, ExpenseSummaryMonthlyBySourceSerializer, StoreSerializer

class CategoryResultsSetPagination(PageNumberPagination):
    page_size = 25
    max_page_size = 25


# when we have > 1000 records for a user, 
# we'll have to think again about the pagination
# as now we use client-side pagination.
class ExpenseResultsSetPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 10000


class StoreView(GenericAPIView):
    permission_classes = (IsAuthenticated, IsEmailVerified)
    serializer_class = StoreSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Store.objects.order_by('id')


class StoreListCreateView(StoreView, ListCreateAPIView):
    filter_backends = [filters.OrderingFilter]
    ordering_fields = '__all__'
    ordering = ['name']
    
    # do we need this?
    def perform_create(self, serializer):
        serializer.save()


class ExpenseCategoryListView(ListAPIView):
    permission_classes = (IsAuthenticated, IsEmailVerified)
    serializer_class = ExpenseCategorySerializer
    lookup_field = "id"
    queryset = ExpenseCategory.objects.all().order_by('name')
    pagination_class = CategoryResultsSetPagination


class ExpenseView(GenericAPIView):
    permission_classes = (IsAuthenticated, IsEmailVerified)
    serializer_class = ExpenseSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('id')


class ExpenseListCreateView(ExpenseView, ListCreateAPIView):
    filter_backends = [filters.OrderingFilter]
    ordering = ['-date']
    pagination_class = ExpenseResultsSetPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExpenseRetrieveUpdateDeleteView(ExpenseView, RetrieveUpdateDestroyAPIView):
    pass


class ExpenseSummaryLast12MonthsView(ListAPIView):
    serializer_class = ExpenseSummaryLast12MonthsSerializer
    pagination_class = None

    def get_queryset(self):
        first_day_of_this_month = timezone.now().replace(day=1)
        first_day_of_next_month = (
            first_day_of_this_month + timedelta(days=32)
        ).replace(day=1)
        one_year_ago = first_day_of_next_month - timedelta(days=365)

        qs = Expense.objects\
                    .filter(user=self.request.user)\
                    .filter(date__gte=one_year_ago)\
                    .annotate(month=TruncMonth('date'))\
                    .values('month', 'currency')\
                    .annotate(total=Sum('amount'))\
                    .values('month', 'currency', 'total')
        return qs


class ExpenseSummaryMonthlyByCategoryView(ListAPIView):
    serializer_class = ExpenseSummaryMonthlyByCategorySerializer
    pagination_class = None

    def get_queryset(self):
        date_str = self.request.query_params.get('date')
        date = parse(date_str)
        first_day_of_the_month = date.replace(day=1)
        last_day_of_the_month = first_day_of_the_month + relativedelta(day=31)

        qs = Expense.objects\
                    .filter(user=self.request.user)\
                    .filter(date__gte=first_day_of_the_month)\
                    .filter(date__lte=last_day_of_the_month)\
                    .values('currency', category_name=F('category__name'))\
                    .annotate(amount=Sum('amount'))\
                    .order_by('category_name', 'currency')
        return qs


class ExpenseSummaryMonthlyBySourceView(ListAPIView):
    serializer_class = ExpenseSummaryMonthlyBySourceSerializer
    pagination_class = None

    def get_queryset(self):
        date_str = self.request.query_params.get('date')
        date = parse(date_str)
        first_day_of_the_month = date.replace(day=1)
        last_day_of_the_month = first_day_of_the_month + relativedelta(day=31)

        qs = Expense.objects\
                    .filter(user=self.request.user)\
                    .filter(date__gte=first_day_of_the_month)\
                    .filter(date__lte=last_day_of_the_month)\
                    .values('currency', source_name=F('source__name'))\
                    .annotate(amount=Sum('amount'))\
                    .order_by('source_name', 'currency')
        return qs
