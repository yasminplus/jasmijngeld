from rest_framework.generics import GenericAPIView, ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from users.permissions import IsEmailVerified

from .models import ExpenseCategory, Expense, Store
from .serializers import ExpenseCategorySerializer, ExpenseSerializer, StoreSerializer


class StoreView(GenericAPIView):
    permission_classes = (IsAuthenticated, IsEmailVerified)
    serializer_class = StoreSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Store.objects.order_by('id')


class StoreListCreateView(StoreView, ListCreateAPIView):
    ordering = ['id']
    
    # do we need this?
    def perform_create(self, serializer):
        serializer.save()


class ExpenseCategoryListView(ListAPIView):
    permission_classes = (IsAuthenticated, IsEmailVerified)
    serializer_class = ExpenseCategorySerializer
    lookup_field = "id"
    queryset = ExpenseCategory.objects.all()

class ExpenseView(GenericAPIView):
    permission_classes = (IsAuthenticated, IsEmailVerified)
    serializer_class = ExpenseSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('id')


class ExpenseListCreateView(ExpenseView, ListCreateAPIView):
    ordering = ['date']
    pagination_class = PageNumberPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExpenseRetrieveUpdateDeleteView(ExpenseView, RetrieveUpdateDestroyAPIView):
    pass