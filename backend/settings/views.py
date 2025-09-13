from babel.numbers import list_currencies
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import IsEmailVerified
from .serializers import CurrencySerializer

class CurrencyListView(APIView):
    serializer_class = CurrencySerializer
    permission_classes = (IsAuthenticated, IsEmailVerified)
    pagination_class = None

    def get(self, request, *args, **kwargs):
        currencies = list(list_currencies())
        serializer = CurrencySerializer({'currencies': currencies})
        return Response(serializer.data)

    # without using dict
    # def get(self, request, *args, **kwargs):
    #     currencies = list(list_currencies())
    #     return Response(currencies)
