from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    ordering = ('email', 'first_name', 'last_name')
    list_display = ('email', 'first_name', 'last_name', 'is_superuser')
    list_filter = ('is_superuser',)

# Register your models here.
admin.site.register(User, UserAdmin)