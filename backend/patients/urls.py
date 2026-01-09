from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ERVisitViewSet, CommunicationEventViewSet, er_dashboard_api,
    SatisfactionSignalViewSet, ExperienceFailureIndicatorViewSet, ContextDataViewSet
)

router = DefaultRouter()
router.register(r'visits', ERVisitViewSet)
router.register(r'communication-events', CommunicationEventViewSet)
router.register(r'feedback', SatisfactionSignalViewSet)
router.register(r'context', ContextDataViewSet)
router.register(r'failure-indicators', ExperienceFailureIndicatorViewSet)

urlpatterns = [
    path("dashboard/", er_dashboard_api, name="er-dashboard"),
    path('', include(router.urls)),
    
]