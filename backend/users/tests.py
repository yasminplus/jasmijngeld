from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

import json
import jwt
import secrets

EMAIL = 'is@mail.com'

class ForceVerifyEmailAPIClient(APIClient):
    def force_authenticate(self, user=None, token=None):
        super().force_authenticate(user, token)
        if user:
            user.is_verified = True
            token.save()

class JGTokenObtainPairSerializer(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.url = reverse('users:token_obtain_pair')
        cls.data = {
            'email': EMAIL,
            'password': secrets.token_hex(16),
            'first_name': 'Dewi',
            'last_name': 'Pertiwi',
        }

    def test_correct_login_data_should_return_200(self):
        user = get_user_model().objects.create_user(
            email=self.data['email'], password=self.data['password'])
        user.save()
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_correct_login_data_should_return_token(self):
        user = get_user_model().objects.create_user(
            email=self.data['email'], password=self.data['password'])
        user.save()
        response = self.client.post(self.url, self.data, format='json')
        token = json.loads(response.content) if 'access' in json.loads(
            response.content) else None
        self.assertTrue(token is not None)
    
    def test_user_first_name_should_be_in_token_claims(self):
        user = get_user_model().objects.create_user(
            email=self.data['email'], 
            password=self.data['password'],
            first_name=self.data['first_name'])
        user.save()
        response = self.client.post(self.url, self.data, format='json')
        payload = jwt.decode(jwt=json.loads(response.content)[
                             'access'], key=settings.SECRET_KEY, algorithms=['HS256'])
        self.assertEqual(payload['first_name'], self.data['first_name'])
    
    def test_incorrect_login_data_should_not_return_token(self):
        user = get_user_model().objects.create_user(
            email=self.data['email'], password=self.data['password'])
        user.save()
        login_data = {'email': self.data['email'], 'password': secrets.token_hex(16)}
        response = self.client.post(self.url, login_data, format='json')
        token = json.loads(response.content) if 'access' in json.loads(
            response.content) else None
        self.assertEqual(token, None)

    def test_incorrect_login_data_should_return_401(self):
        user = get_user_model().objects.create_user(
            email=self.data['email'], password=self.data['password'])
        user.save()
        login_data = {'email': 'test@mail.com', 'password': secrets.token_hex(16)}
        response = self.client.post(self.url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


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
