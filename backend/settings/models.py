from django.db import models
from users.models import User

# Create your models here.
class Settings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="settings")
    key = models.CharField(max_length=50)
    value = models.CharField()
