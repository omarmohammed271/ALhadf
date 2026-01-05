# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlertViewSet, UserAlertViewSet

router = DefaultRouter()
router.register(r'alerts', AlertViewSet, basename='alert')
router.register(r'user-alerts', UserAlertViewSet, basename='user-alert')

urlpatterns = [
    path('', include(router.urls)),
]
