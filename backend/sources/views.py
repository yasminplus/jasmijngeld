from rest_framework.generics import CreateAPIView, GenericAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from users.permissions import IsEmailVerified
from .models import PaymentSource
from .serializers import PaymentSourceSerializer


# Create your views here.
class PaymentSourceView(GenericAPIView):
    permission_classes = (IsAuthenticated, IsEmailVerified)
    serializer_class = PaymentSourceSerializer
    lookup_field = "id"

    def get_queryset(self):
        return PaymentSource.objects.all().filter(user=self.request.user)

class PaymentSourceListCreateView(PaymentSourceView, CreateAPIView):

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

"""TODO: consider if we really need extra list view, since the listcreate works just fine"""
class PaymentSourceListView(PaymentSourceView, ListAPIView):
    pass

class PaymentSourceRetrieveUpdateDestroyView(PaymentSourceView, RetrieveUpdateDestroyAPIView):
    serializer_class = PaymentSourceSerializer
    pass