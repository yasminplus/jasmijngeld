from django.test import TestCase
from .models import PaymentSource
from django.contrib.auth import get_user_model

# Create your tests here.
class SourceModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.data = {
            "source_type": "BA",
            "name": "BCA",
            "acc_identifier": "1234"
        }
        # set up a user
        cls.user = get_user_model().objects.create_user(
            first_name="Gyum",
            last_name="Ko",
            email="kogyum@test.com",
            password="ko-gyum123"
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

    