from babel.numbers import list_currencies
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView

from users.permissions import IsEmailVerified
from .models import Settings
from .serializers import CurrencySerializer, SettingsSerializer

class CurrencyListView(APIView):
    serializer_class = CurrencySerializer
    permission_classes = (IsAuthenticated, IsEmailVerified)
    pagination_class = None

    def get(self, request, *args, **kwargs):
        currencies = sorted(list(list_currencies()))
        serializer = CurrencySerializer({'currencies': currencies})
        return Response(serializer.data)

    # without using dict
    # def get(self, request, *args, **kwargs):
    #     currencies = list(list_currencies())
    #     return Response(currencies)

class CurrentSettingsView(ListAPIView):
    serializer_class = SettingsSerializer
    permission_classes = (IsAuthenticated, IsEmailVerified)

    def get_queryset(self):
        # return super().get_queryset()
        user_settings = Settings.objects.filter(user=self.request.user)
        if not user_settings:
            s1 = Settings.objects.create(user=self.request.user, key='currency_enabled', value='IDR')
            s2 = Settings.objects.create(user=self.request.user, key='currency_default', value='IDR')
            s1.save()
            s2.save()
        
        user_settings = Settings.objects.filter(user=self.request.user)
        return user_settings