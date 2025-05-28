from django.db import models
from users.models import User

# Create your models here.
class PaymentSource(models.Model):
    SOURCE_TYPE_CHOICES = [
        ("BA", "Bank account"),
        ("CC", "Credit card"),
        ("DW", "Digital wallet"),
        ("PC", "Prepaid card"),
        ("CA", "Cash"),
    ]
    source_type = models.CharField(
        max_length=2,
        choices=SOURCE_TYPE_CHOICES,
        default="BA",
    )
    name = models.CharField(max_length=30)  
    """TODO: name should be unique among one user"""
    acc_identifier = models.TextField(max_length=20, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    """
    each user has to have ONE payment source of type cash. 
    We'll create it automatically when creating a new user/during registration.
    For existing users, add this source using migrations or via shell.
    
    TODO: restrict the creation payment source to only have
    ONE Cash type for each user
    """

    def __str__(self):
        return f'{self.name} ({self.acc_identifier}) belongs to {self.user}'