import secrets
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

EMAIL = 'is@mail.com'

class RegistrationViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.url = reverse('users:register')
        cls.data = {
            'email': EMAIL,
            'password': secrets.token_hex(16),
            'first_name': 'Dewi',
            'last_name': 'Pertiwi',
        }

    def test_create_user_complete(self):
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_user_minimum(self):
        data = self.data.copy()
        del data['first_name']
        del data['last_name']
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_no_email(self):
        data = self.data.copy()
        del data['email']
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_password(self):
        data = self.data.copy()
        del data['password']
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_email_exists(self):
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
