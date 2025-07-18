from django.db.models.functions import TruncMonth
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from rest_framework import filters
from rest_framework.generics import GenericAPIView, ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from users.permissions import IsEmailVerified

from .models import ExpenseCategory, Expense, Store
from .serializers import ExpenseCategorySerializer, ExpenseSerializer, ExpenseSummaryYearlySerializer, StoreSerializer

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
    queryset = ExpenseCategory.objects.all()
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


class ExpenseSummaryYearly(ListAPIView):
    serializer_class = ExpenseSummaryYearlySerializer
    pagination_class = None
    
    def get_queryset(self):
        currency = self.request.query_params.get('currency')
        first_day_of_this_month = timezone.now().replace(day=1)
        first_day_of_next_month = (
            first_day_of_this_month + timedelta(days=32)
        ).replace(day=1)
        one_year_ago = first_day_of_next_month - timedelta(days=365)

        qs = Expense.objects\
                        .filter(user=self.request.user)\
                        .filter(currency=currency)\
                        .filter(date__gte=one_year_ago)\
                        .annotate(month=TruncMonth('date'))\
                        .values('month')\
                        .annotate(total=Sum('amount'))\
                        .values('month', 'total')
        return qs