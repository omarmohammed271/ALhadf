import re

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile, UserExtension, Role, Permission, UserRole, RolePermission


class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'phone_number', 'department', 'position', 'metadata']


    def update(self, instance, validated_data):
        # Because we used 'source', we have to manually handle
        # saving the User fields if they are updated.
        user_data = validated_data.pop('user', {})
        user = instance.user

        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        return super().update(instance, validated_data)


class RegistrationSerializer(serializers.ModelSerializer):
    # Rule: Password strength validation and write-only security
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_email(self, value):
        # Rule: email must be unique
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        # Rule: Passwords must be hashed (handled by create_user)
        user = User.objects.create_user(**validated_data)
        return user


class UserListSerializer(serializers.ModelSerializer):
    # Nest the profile so the admin sees the department and phone too
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'description', 'metadata']

class RoleSerializer(serializers.ModelSerializer):
    # Nested permissions to see what a role can do
    permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'permissions', 'metadata']

class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ['user', 'role']

    def validate(self, data):
        # Rule: Users cannot have duplicate roles
        if UserRole.objects.filter(user=data['user'], role=data['role']).exists():
            raise serializers.ValidationError("This user already has this role assigned.")
        return data

class RolePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermission
        fields = ['role', 'permission']

    def validate(self, data):
        # Rule: Roles cannot have duplicate permissions
        if RolePermission.objects.filter(role=data['role'], permission=data['permission']).exists():
            raise serializers.ValidationError("This role already contains this permission.")
        return data