from rest_framework import filters
from rest_framework.generics import GenericAPIView, ListCreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from users.permissions import IsEmailVerified
from .models import PaymentSource
from .serializers import PaymentSourceSerializer


class PaymentSourceView(GenericAPIView):
    permission_classes = (IsAuthenticated, IsEmailVerified)
    serializer_class = PaymentSourceSerializer
    lookup_field = "id"

    def get_queryset(self):
        return PaymentSource.objects.filter(user=self.request.user).order_by('id')


class PaymentSourceListCreateView(PaymentSourceView, ListCreateAPIView):
    ordering = ['id']
    pagination_class = PageNumberPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['name, source_type']
    ordering = ['name']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PaymentSourceRetrieveUpdateDestroyView(PaymentSourceView, RetrieveUpdateDestroyAPIView):
    serializer_class = PaymentSourceSerializer
