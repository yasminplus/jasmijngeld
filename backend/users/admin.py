from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django.urls import reverse_lazy

from .models import User


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""

    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Password confirmation", widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ["email"]

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user. Use read only field for the password with a link
    to change the password.
    """

    password = ReadOnlyPasswordHashField()
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password'].help_text = (
            "Raw passwords are not stored, so there is no way to see "
            "this user's password, but you can  "
            "change the password using <a href=\"%s\">this form</a>."
        ) % reverse_lazy('admin:auth_user_password_change', args=[self.instance.id])

    class Meta:
        model = User
        fields = ["email"]


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    add_form = UserCreationForm
    form = UserChangeForm
    model = User

    # The fields to be used in displaying the User model table
    # Override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'first_name', 'last_name', "is_verified", 'is_superuser')
    list_filter = ('is_superuser',)

    # fieldsets is used for editing the user
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name")}),
        ('Permissions', {'fields': ('is_verified', 'is_superuser',)}),
    )
    
    # add_fieldsets is used when creating a user
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide"),
                "fields": ("email", "password1", "password2", 
                           "first_name", "last_name", 
                           "is_verified", "is_superuser"),
            },
        ),
    )
    search_fields = ("email", "first_name", "last_name")
    ordering = ('email', 'first_name', 'last_name')
    filter_horizontal = ()

# Register your models here.
admin.site.register(User, UserAdmin)