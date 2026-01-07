from django.db.models import Count, Avg
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from account.permissions import HasERPermission

from .models import ERVisit, CommunicationEvent, SatisfactionSignal, ContextData, ExperienceFailureIndicator
from .serializers import (
    ERVisitSerializer, CommunicationEventSerializer,
    SatisfactionSignalSerializer, ExperienceFailureIndicatorSerializer, ContextDataSerializer
)


class ERVisitViewSet(viewsets.ModelViewSet):
    queryset = ERVisit.objects.all().order_by('-arrival_ts')
    serializer_class = ERVisitSerializer
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [HasERPermission]

    # def get_permissions(self):
    #     if self.action == 'create':
    #         self.required_permission = 'add_input'
    #     else:
    #         # Viewers and Admins can see the list
    #         self.required_permission = 'view'
    #     return super().get_permissions()
    def create(self, request):
        print(request.data)
        super().create(request)


class CommunicationEventViewSet(viewsets.ModelViewSet):
    queryset = CommunicationEvent.objects.all()
    serializer_class = CommunicationEventSerializer
    authentication_classes = [TokenAuthentication]
    # permission_classes = [HasERPermission]

    # def get_permissions(self):
    #     if self.action == 'create':
    #         self.required_permission = 'add_input'
    #     else:
    #         # Viewers and Admins can see the list
    #         self.required_permission = 'view'
    #     return super().get_permissions()


class SatisfactionSignalViewSet(viewsets.ModelViewSet):
    queryset = SatisfactionSignal.objects.all()
    serializer_class = SatisfactionSignalSerializer
    authentication_classes = [TokenAuthentication]
    # permission_classes = [HasERPermission]

    # def get_permissions(self):
    #     if self.action == 'create':
    #         self.required_permission = 'add_input'
    #     else:
    #         # Viewers and Admins can see the list
    #         self.required_permission = 'view'
    #     return super().get_permissions()


class ContextDataViewSet(viewsets.ModelViewSet):
    queryset = ContextData.objects.all()
    serializer_class = ContextDataSerializer
    authentication_classes = [TokenAuthentication]
    # permission_classes = [HasERPermission]

    # def get_permissions(self):
    #     if self.action == 'create':
    #         self.required_permission = 'add_input'
    #     else:
    #         # Viewers and Admins can see the list
    #         self.required_permission = 'view'
    #     return super().get_permissions()


class ExperienceFailureIndicatorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ExperienceFailureIndicator.objects.all()
    serializer_class = ExperienceFailureIndicatorSerializer
    authentication_classes = [TokenAuthentication]
    # permission_classes = [HasERPermission]

    # def get_permissions(self):
    #     if self.action == 'create':
    #         self.required_permission = 'add_input'
    #     else:
    #         # Viewers and Admins can see the list
    #         self.required_permission = 'view'
    #     return super().get_permissions()
