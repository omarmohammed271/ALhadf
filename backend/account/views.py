from django.contrib.auth.models import User
from rest_framework import status, generics
from rest_framework.authentication import TokenAuthentication

from .serializers import RegistrationSerializer, UserProfileSerializer, RolePermissionSerializer, UserListSerializer
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .permissions import HasERPermission


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
        profile = UserProfile.objects.get(user=user)

        # Get all roles assigned to this user
        roles = list(user.user_roles.all().values_list('role__name', flat=True))

        return Response({
            'token': token.key,
            'email': user.email,
            'username': user.username,
            'user_id': user.pk,
            'position': profile.position,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': roles,
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
    authentication_classes = [TokenAuthentication]
    permission_classes = [HasERPermission]

    def get_permissions(self):
        if self.action == 'create':
            self.required_permission = 'add_input'
        else:
            # Viewers and Admins can see the list
            self.required_permission = 'view'
        return super().get_permissions()


class PermissionViewSet(viewsets.ModelViewSet):
    """
    CRUD for Permissions.
    """
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [HasERPermission]

    def get_permissions(self):
        if self.action == 'create':
            self.required_permission = 'add_input'
        else:
            # Viewers and Admins can see the list
            self.required_permission = 'view'
        return super().get_permissions()


class UserRoleViewSet(viewsets.ModelViewSet):
    """
    Workflow #3: Admin assigns roles to users via UserRole.
    """
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [HasERPermission]

    def get_permissions(self):
        if self.action == 'create':
            self.required_permission = 'add_input'
        else:
            # Viewers and Admins can see the list
            self.required_permission = 'view'
        return super().get_permissions()


class RolePermissionViewSet(viewsets.ModelViewSet):
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [HasERPermission]

    def get_permissions(self):
        if self.action == 'create':
            self.required_permission = 'add_input'
        else:
            # Viewers and Admins can see the list
            self.required_permission = 'view'
        return super().get_permissions()


class UserManagementViewSet(viewsets.ModelViewSet):
    """
    Allows Admins to view and manage all users in the system.
    """
    queryset = User.objects.all().select_related('profile') # optimized query
    serializer_class = UserListSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [HasERPermission]

    def get_permissions(self):
        if self.action == 'create':
            self.required_permission = 'add_input'
        else:
            # Viewers and Admins can see the list
            self.required_permission = 'view'
        return super().get_permissions()