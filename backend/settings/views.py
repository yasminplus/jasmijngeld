from babel.numbers import list_currencies
from django.utils.translation import gettext_lazy
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView, ListCreateAPIView, ListAPIView, CreateAPIView

from users.permissions import IsEmailVerified
from .models import Settings
from .serializers import CurrencySerializer, SettingsSerializer

class CurrencyListView(APIView):
    serializer_class = CurrencySerializer
    permission_classes = (IsAuthenticated, IsEmailVerified)
    pagination_class = None

    def get(self, request, *args, **kwargs):
        currencies = sorted(list(list_currencies()))
        top_list = ['AUD', 'EUR', 'IDR', 'MYR', 'SGD', 'USD']
        for c in top_list:
            currencies.remove(c)
        # TODO remove & add on top: AUD, EUR, MYR, SGD, USD
        top_list.extend(currencies)
        serializer = CurrencySerializer({'currencies': top_list})
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


class UpdateSettingsView(APIView):
    permission_classes = (IsAuthenticated, IsEmailVerified)

    def post(self, request, *args, **kwargs):
        for key in request.data:
            item = request.data[key]
            try:
                s = Settings.objects.get(id=item['id'])
                if s.value != item['value']:
                    s.value = item['value']
                s.save()
                return Response(status=status.HTTP_200_OK)
            except Exception as e:
                return Response({
                    "message": gettext_lazy("Cannot save changes")
                }, status=status.HTTP_400_BAD_REQUEST)