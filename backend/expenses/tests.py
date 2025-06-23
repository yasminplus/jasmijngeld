from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase

from users.tests import ForceVerifyEmailAPIClient

from .models import Store, Expense, ExpenseCategory


# Create your tests here.
class StoreSetupMixin:
    @classmethod
    def setUpTestData(cls):
        cls.data = {
            "name": "Syopee",
        }
        # set up a user
        cls.user = get_user_model().objects.create_user(
            first_name="Gyeom",
            last_name="Ko",
            email="kogyeom@test.com",
            password="ko-gyeom123"
        )


class StoreModelTest(StoreSetupMixin, TestCase):

    def test_add_new_store(self):
        Store.objects.create(
            name=self.data['name']
        )
        self.assertEqual(Store.objects.count(), 1)
        st = Store.objects.first()
        self.assertEqual(st.name, self.data['name'])


class StoreViewTest(StoreSetupMixin, APITestCase):
    client_class = ForceVerifyEmailAPIClient
    
    def setUp(self):
        self.data = {
            "name": "Syopee"
        }
        self.client.force_authenticate(user=self.user)


class StoreCreateViewTest(StoreViewTest):
    url = reverse('expenses:store-listcreate')

    def test_create_store_success(self):
        count = Store.objects.all().count()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(count + 1, Store.objects.all().count())
    
    def test_create_store_no_name_fail(self):
        count = Store.objects.all().count()
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(count, Store.objects.all().count())

    def test_create_store_not_auth_fail(self):
        self.client.force_authenticate(user=None)
        count = Store.objects.all().count()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(count, Store.objects.all().count())


class StoreListViewTest(StoreViewTest):
    url = reverse('expenses:store-listcreate')
    
    def setUp(self):
        self.data2 = {
            "name": "Tokopaedi"
        }
        self.store1 = Store.objects.create(
            name=self.data['name']
        )
        self.store2 = Store.objects.create(
            name=self.data2['name']
        )
        self.client.force_authenticate(user=self.user)
    
    def test_list_store_success(self):
        response = self.client.get(self.url)
        store_count = Store.objects.all().count()
        json_data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_data['count'], store_count)

    def test_list_store_fail_no_user(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)
