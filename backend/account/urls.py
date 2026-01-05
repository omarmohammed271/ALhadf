from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, CustomLoginView, UserProfileView, RoleViewSet, UserRoleViewSet, UserManagementViewSet, PermissionViewSet

router = DefaultRouter()
router.register(r'permissions', PermissionViewSet, basename='permissions')
router.register(r'roles', RoleViewSet)
router.register(r'assignments', UserRoleViewSet)
router.register(r'users', UserManagementViewSet, basename='user-management')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='acc_register'),
    path('login/', CustomLoginView.as_view(), name='acc_login'),
    path('profile/', UserProfileView.as_view(), name='acc_profile'),
    path('', include(router.urls)),
]