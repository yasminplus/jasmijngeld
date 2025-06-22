from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

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
        cls.user2 = get_user_model().objects.create_user(
            first_name="Mubee",
            last_name="Kim",
            email="kimmubee@test.com",
            password="kim-mubee123"
        )

class StoreModelTest:

    def test_add_new_store(self):
        Store.objects.create(
            name=self.data['name'],
            user=self.user
        )
        self.assertEqual(Store.objects.count(), 1)
        st = Store.objects.filter(user=self.user).first()
        self.assertEqual(st.name, self.data['name'])
    
    def test_add_new_store_same_name_fail(self):
        Store.objects.create(
            name=self.data['name'],
            user=self.user
        )
        self.assertEqual(Store.objects.count(), 1)

        try:
            Store.objects.create(
                name=self.data['name'],
                user=self.user
            )
        except ValidationError as e:
            self.assertEqual(e.messages[0], 'Store name for this user already exists.')

    def test_diff_user_same_name(self):
        Store.objects.create(
            name=self.data['name'],
            user=self.user
        )
        self.assertEqual(Store.objects.count(), 1)

        Store.objects.create(
            name=self.data['name'],
            user=self.user2
        )
        self.assertEqual(Store.objects.count(), 2)