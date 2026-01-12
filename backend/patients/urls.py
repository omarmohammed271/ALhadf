from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ERVisitViewSet, CommunicationEventViewSet, er_dashboard_api,
    SatisfactionSignalViewSet, ExperienceFailureIndicatorViewSet, ContextDataViewSet
)
from .chatbot_queries import *

router = DefaultRouter()
router.register(r'visits', ERVisitViewSet)
router.register(r'communication-events', CommunicationEventViewSet)
router.register(r'feedback', SatisfactionSignalViewSet)
router.register(r'context', ContextDataViewSet)
router.register(r'failure-indicators', ExperienceFailureIndicatorViewSet)

urlpatterns = [
    path("dashboard/", er_dashboard_api, name="er-dashboard"),
    path('', include(router.urls)),
    
    # chatbot queries
    path('chatbot/busiest-er-section', busiest_er_section, name='busiest_er_section'),
    path('chatbot/most-common-triage', most_common_triage, name='most_common_triage'),
    path('chatbot/avg-communications-per-visit', avg_communications_per_visit, name='avg_communications_per_visit'),
    path('chatbot/worst-satisfaction-section', worst_satisfaction_section, name='worst_satisfaction_section'),
    path('chatbot/visits-without-communication', visits_without_communication, name='visits_without_communication'),
    path('chatbot/busiest-shift', busiest_shift, name='busiest_shift'),
    path('chatbot/avg-time-to-first-contact-lwbs', avg_time_to_first_contact_lwbs, name='avg_time_to_first_contact_lwbs'),
    path('chatbot/most-common-failure-reason', most_common_failure_reason, name='most_common_failure_reason'),
    
]