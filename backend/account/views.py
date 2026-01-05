from django.contrib.auth.models import User
from rest_framework import status, generics
from .serializers import RegistrationSerializer, UserProfileSerializer, RolePermissionSerializer, UserListSerializer
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token


class RegisterView(generics.CreateAPIView):
    # Workflow #1: Required fields username/password
    # Anyone can access this endpoint to sign up
    permission_classes = [AllowAny]
    serializer_class = RegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": serializer.data["username"],
                "message": "User created successfully. Please log in."
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomLoginView(ObtainAuthToken):
    """
    Standard DRF login that returns a token.
    Matches Workflow #5.
    """

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Validation Rule #1: Block if inactive
        if not user.is_active:
            return Response({"error": "Account is inactive"}, status=status.HTTP_403_FORBIDDEN)

        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'user_id': user.pk,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })

from rest_framework import viewsets
from .models import Role, UserRole, Permission, RolePermission, UserProfile
from .serializers import RoleSerializer, UserRoleSerializer, PermissionSerializer
from rest_framework.permissions import IsAdminUser




class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Workflow #2: Fixed view for individual profile management.
    Inheriting from generics avoids the 'actions' argument error.
    """
    serializer_class = UserProfileSerializer

    def get_object(self):
        # This tells Django: "Don't look for an ID in the URL,
        # just give me the profile belonging to the person logged in."
        return self.request.user.profile

class RoleViewSet(viewsets.ModelViewSet):
    """
    Allows Admins to manage roles and their associated permissions.
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class PermissionViewSet(viewsets.ModelViewSet):
    """
    CRUD for Permissions.
    """
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer


class UserRoleViewSet(viewsets.ModelViewSet):
    """
    Workflow #3: Admin assigns roles to users via UserRole.
    """
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer


class RolePermissionViewSet(viewsets.ModelViewSet):
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer


class UserManagementViewSet(viewsets.ModelViewSet):
    """
    Allows Admins to view and manage all users in the system.
    """
    queryset = User.objects.all().select_related('profile') # optimized query
    serializer_class = UserListSerializer