from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APITestCase

from .models import PaymentSource
from users.tests import ForceVerifyEmailAPIClient

rud_url = 'sources:source-retrieveupdatedelete'

class PaymentSourceSetupMixin:
    @classmethod
    def setUpTestData(cls):
        cls.data = {
            "source_type": "BA",
            "name": "BCA",
            "acc_identifier": "1234"
        }
        # set up a user
        cls.user = get_user_model().objects.create_user(
            first_name="Gyeom",
            last_name="Ko",
            email="kogyeom@test.com",
            password="ko-gyeom123"
        )


class PaymentSourceModelTest(PaymentSourceSetupMixin, TestCase):

    def test_add_new_source(self):
        PaymentSource.objects.create(
            source_type=self.data['source_type'],
            name=self.data['name'],
            acc_identifier=self.data['acc_identifier'],
            user=self.user
        )
        self.assertEqual(PaymentSource.objects.count(), 1)
        first_source = PaymentSource.objects.filter(user=self.user).first()
        self.assertEqual(first_source.name, self.data['name'])
        self.assertEqual(first_source.source_type, self.data['source_type'])
        self.assertEqual(first_source.acc_identifier, self.data['acc_identifier'])

    def test_add_extra_cash_source(self):
        PaymentSource.objects.create(
            source_type='CA',
            name='Cash',
            acc_identifier='',
            user=self.user
        )
        self.assertEqual(PaymentSource.objects.count(), 1)
        source = PaymentSource.objects.filter(user=self.user).first()
        self.assertEqual(source.source_type, 'CA')
        try:
            PaymentSource.objects.create(
                source_type='CA',
                name='Cash',
                acc_identifier='',
                user=self.user
            )
        except ValidationError as e:
            self.assertEqual(e.messages[0], 'This user already has a source of type Cash')

    def test_add_source_same_name(self):
        PaymentSource.objects.create(
            source_type=self.data['source_type'],
            name=self.data['name'],
            acc_identifier=self.data['acc_identifier'],
            user=self.user
        )
        self.assertEqual(PaymentSource.objects.count(), 1)
        first_source = PaymentSource.objects.filter(user=self.user).first()
        self.assertEqual(first_source.name, self.data['name'])
        try:
            PaymentSource.objects.create(
                source_type=self.data['source_type'],
                name=self.data['name'],
                acc_identifier=self.data['acc_identifier'],
                user=self.user
            )
        except ValidationError as e:
            self.assertEqual(e.messages[0], 'Payment source name for this user already exists.')

    def test_diff_user_add_cash(self):
        PaymentSource.objects.create(
            source_type='CA',
            name='Cash',
            acc_identifier='',
            user=self.user
        )
        self.assertEqual(PaymentSource.objects.count(), 1)
        source = PaymentSource.objects.filter(user=self.user).first()
        self.assertEqual(source.source_type, 'CA')

        user2 = get_user_model().objects.create_user(
            first_name="Mubee",
            last_name="Kim",
            email="kimmubee@test.com",
            password="kim-mubee123"
        )
        PaymentSource.objects.create(
            source_type='CA',
            name='Cash',
            acc_identifier='',
            user=user2
        )
        self.assertEqual(PaymentSource.objects.count(), 2)
        source = PaymentSource.objects.filter(user=self.user).first()
        self.assertEqual(source.source_type, 'CA')

    def test_diff_user_same_name(self):
        PaymentSource.objects.create(
            source_type=self.data['source_type'],
            name=self.data['name'],
            acc_identifier=self.data['acc_identifier'],
            user=self.user
        )
        self.assertEqual(PaymentSource.objects.count(), 1)
        source = PaymentSource.objects.filter(user=self.user).first()
        self.assertEqual(source.name, self.data['name'])

        user2 = get_user_model().objects.create_user(
            first_name="Mubee",
            last_name="Kim",
            email="kimmubee@test.com",
            password="kim-mubee123"
        )
        PaymentSource.objects.create(
            source_type=self.data['source_type'],
            name=self.data['name'],
            acc_identifier=self.data['acc_identifier'],
            user=user2
        )

        self.assertEqual(PaymentSource.objects.count(), 2)
        source = PaymentSource.objects.filter(user=self.user).first()
        self.assertEqual(source.name, self.data['name'])


class PaymentSourceViewTest(PaymentSourceSetupMixin, APITestCase):
    client_class = ForceVerifyEmailAPIClient

    def setUp(self):
        self.data = {
            "source_type": "Bank account",
            "name": "BCA",
            "acc_identifier": "1234"
        }
        self.client.force_authenticate(user=self.user)


class PaymentSourceCreateViewTest(PaymentSourceViewTest):
    url = reverse('sources:source-create')

    def test_create_source_success(self):
        count = PaymentSource.objects.all().count()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(count + 1, PaymentSource.objects.all().count())

    def test_create_source_no_source_type_fail(self):
        del self.data['source_type']
        count = PaymentSource.objects.all().count()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(count, PaymentSource.objects.all().count())

    def test_create_source_no_name_fail(self):
        del self.data['name']
        count = PaymentSource.objects.all().count()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(count, PaymentSource.objects.all().count())

    def test_create_source_no_acc_identifier_success(self):
        del self.data['acc_identifier']
        count = PaymentSource.objects.all().count()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(count + 1, PaymentSource.objects.all().count())

    def test_create_source_no_user_fail(self):
        self.client.force_authenticate(user=None)
        count = PaymentSource.objects.all().count()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(count, PaymentSource.objects.all().count())


class PaymentSourceUpdateViewTest(PaymentSourceViewTest):

    def setUp(self):
        self.source = PaymentSource.objects.create(
            source_type=self.data['source_type'],
            name=self.data['name'],
            acc_identifier=self.data['acc_identifier'],
            user=self.user
        )
        self.url = reverse(rud_url, args=[self.source.id])
        self.client.force_authenticate(user=self.user)

    def test_update_source_success(self):
        update_data = {
            'source_type': 'Credit card',
            'name': 'CC BCA',
            'acc_identifier': '5678'
        }
        response = self.client.put(self.url, data=update_data)
        updated = PaymentSource.objects.get(id=self.source.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(updated.source_type, 'CC')
        self.assertEqual(updated.name, update_data['name'])
        self.assertEqual(updated.acc_identifier, update_data['acc_identifier'])

    def test_update_source_no_source_type_fail(self):
        update_data = {
            'name': 'CC BCA',
            'acc_identifier': '5678'
        }
        response = self.client.put(self.url, data=update_data)
        self.assertEqual(response.status_code, 400)
    
    def test_update_source_no_name_fail(self):
        update_data = {
            'source_type': 'Credit card',
            'acc_identifier': '5678'
        }
        response = self.client.put(self.url, data=update_data)
        self.assertEqual(response.status_code, 400)

    def test_update_source_no_acc_identifier_success(self):
        update_data = {
            'source_type': 'Credit card',
            'name': 'CC BCA'
        }
        response = self.client.put(self.url, data=update_data)
        updated = PaymentSource.objects.get(id=self.source.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(updated.acc_identifier, self.data['acc_identifier'])

    def test_update_source_no_user_fail(self):
        self.client.force_authenticate(user=None)
        update_data = {
            'source_type': 'Credit card',
            'name': 'CC BCA',
            'acc_identifier': '5678'
        }
        response = self.client.put(self.url, data=update_data)
        self.assertEqual(response.status_code, 401)

    def test_update_source_fail_unknown_request(self):
        update_data = {
            'unknown': 'unknown'
        }
        response = self.client.put(self.url, data=update_data)
        self.assertEqual(response.status_code, 400)


class PaymentSourceDeleteViewTest(PaymentSourceViewTest):
    def setUp(self):
        self.source = PaymentSource.objects.create(
            source_type=self.data['source_type'],
            name=self.data['name'],
            acc_identifier=self.data['acc_identifier'],
            user=self.user
        )
        self.url = reverse(rud_url, args=[self.source.id])
        self.client.force_authenticate(user=self.user)
    
    def test_delete_success(self):
        response = self.client.delete(self.url)
        try:
            source = PaymentSource.objects.get(id=self.source.id)
        except ObjectDoesNotExist:
            source = None
        self.assertEqual(response.status_code, 204)
        self.assertIsNone(source)

    def test_delete_fail(self):
        response = self.client.delete(reverse(rud_url, args=[self.source.id + 1]))
        self.assertEqual(response.status_code, 404)

    """
    do we need to test for cases when a payment source is used and thus we cannot delete it?
    or is it testing the Django implementation and thus not useful?
    """

