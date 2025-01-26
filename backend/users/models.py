from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _

class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_("first name"), max_length=150, blank=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True)
    email = models.EmailField(
        _("email address"), 
        help_text=_(
            'Required. 254 characters or fewer. Letters, digits and @/./+/-/_ only.'), 
        error_messages={
            'unique': _("A user with that email already exists."),
        },
        blank=True, 
        unique=True
    )
    creation_date = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = "email"

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def __str__(self):
        rep = self.email + (" (" + self.fullname + ")" if self.fullname else "")
        return rep
