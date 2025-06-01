from django.test import TestCase
from .models import PaymentSource
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

# Create your tests here.
class PaymentSourceModelTest(TestCase):
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
