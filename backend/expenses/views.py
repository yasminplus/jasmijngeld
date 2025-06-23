from rest_framework.generics import GenericAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from users.permissions import IsEmailVerified

from .models import Store
from .serializers import StoreSerializer


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
