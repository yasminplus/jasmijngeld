from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    def _create_user(self, email, password, is_superuser, **extra_fields):
        if not email:
            raise ValueError('Supply an email address')
        if not password:
            raise ValueError('Supply a password')

        email = self.normalize_email(email)
        hashed_pw = make_password(password)
        user = self.model(
            email=email,
            password=hashed_pw,
            is_superuser=is_superuser, 
            **extra_fields)
        user.save(using=self._db)
        return user
    
    def create_user(self, email, password, **extra_fields):
        return self._create_user(email, password, is_superuser=False, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, is_superuser=True, **extra_fields)

    def create_social_user(self, email, google_sub, **extra_fields):
        if not email:
            raise ValueError('Supply an email address')
        if not google_sub:
            raise ValueError('Supply a Google account ID')

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            google_sub=google_sub,
            is_superuser=False,
            **extra_fields)
        user.set_unusable_password()
        user.save(using=self._db)
        return user


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
        unique=True
    )
    creation_date = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    google_sub = models.CharField(
                    _("Google account ID"), 
                    max_length=255, 
                    unique=True, 
                    null=True, 
                    blank=True)

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = "email"

    objects = UserManager()

    @property
    def full_name(self):
        "Returns the person's full name."
        return f"{self.first_name} {self.last_name}"
    
    # For Django Admin
    @property
    def is_staff(self):
        return self.is_superuser

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def __str__(self):
        rep = self.email + (" (" + self.full_name + ")" if self.full_name else "")
        return rep
