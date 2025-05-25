from django.db import models
from users.models import User

# Create your models here.
class SourceType(models.Model):
    name = models.CharField(max_length=30)
    # Consider if we really need this,
    # or just use an enum on the PaymentSource class
    """
    bank account, credit card, prepaid card, digital wallet, cash
    """

class PaymentSource(models.Model):
    source_type = models.ForeignKey(SourceType, on_delete=models.PROTECT)
    name = models.CharField(max_length=30)
    acc_identifier = models.TextField(max_length=20, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    """
    each user has to have ONE payment source of type cash. 
    We'll create it automatically when creating a new user/during registration.
    For existing users, add this source using migrations.
    """