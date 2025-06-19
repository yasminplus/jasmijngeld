from django.db import models
from users.models import User
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

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
    acc_identifier = models.TextField(max_length=20, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    """
    each user has to have ONE payment source of type cash. 
    We'll create it automatically when creating a new user/during registration.
    For existing users, add this source using migrations or via shell.
    """

    def __str__(self):
        return f'{self.name} ({self.acc_identifier}) belongs to {self.user}'
    
    """
    restrict the creation payment source to only have
    ONE Cash type for each user
    """
    def _validate_type(self):
        if self.source_type == 'CA':
            qs = PaymentSource.objects.filter(user=self.user).filter(source_type='CA').exclude(id=self.id)
            if len(qs) > 0:
                raise ValidationError({
                    "source_type": _("This user already has a source of type Cash")
                })
    
    """
    name should be unique among one user
    """
    def _validate_name(self):
        qs = PaymentSource.objects.filter(user=self.user).filter(name=self.name).exclude(id=self.id)
        if qs:
            raise ValidationError({
                    "name": _("Payment source name for this user already exists.")
                })

    def save(self, *args, **kwargs):
        self._validate_type()
        self._validate_name()
        return super().save(*args, **kwargs)
