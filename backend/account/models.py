from django.db import models

# Create your models here.
import uuid
from django.db import models
from django.apps import apps
from django.contrib.auth.models import User


# Create your models here.


class Permission(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.name


class UserExtension(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_extension')
    metadata = models.JSONField(default=dict, blank=True)

    def get_custom_permissions(self):
        # query using the related_name paths we built in your models
        return set(Permission.objects.filter(
            roles__role_assignment__user=self.user
        ).values_list('name', flat=True))


class UserProfile(models.Model):
    Departments = [
        ('er', 'Emergency Room'),
        ('admin', 'Administration'),
        ('it', 'IT Support'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    department = models.CharField(max_length=20, choices=Departments, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} ({self.position})"


class Role(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)

    permissions = models.ManyToManyField(Permission, related_name='roles', through='RolePermission')

    def __str__(self):
        return self.name


class RolePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('role', 'permission')


class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='role_assignment')

    class Meta:
        unique_together = ('user', 'role')
