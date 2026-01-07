from rest_framework import serializers
from .models import ERVisit, CommunicationEvent, SatisfactionSignal, ExperienceFailureIndicator, ContextData
from account.serializers import UserListSerializer
from django.contrib.auth.models import User


class ERVisitSerializer(serializers.ModelSerializer):
    length_of_stay = serializers.DurationField(read_only=True)
    patient = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True
    )
    patient_detail = UserListSerializer(
        source="patient",
        read_only=True
    )

    class Meta:
        model = ERVisit
        fields = '__all__'


class CommunicationEventSerializer(serializers.ModelSerializer):
    visit = serializers.PrimaryKeyRelatedField(queryset=ERVisit.objects.all(), write_only=True)
    visit_detail = ERVisitSerializer(source="visit", read_only=True)

    class Meta:
        model = CommunicationEvent
        fields = '__all__' + 'visit_datail'


class SatisfactionSignalSerializer(serializers.ModelSerializer):
    visit = serializers.PrimaryKeyRelatedField(queryset=ERVisit.objects.all(), write_only=True)
    visit_detail = ERVisitSerializer(source="visit", read_only=True)
    class Meta:
        model = SatisfactionSignal
        fields = '__all__'


class ContextDataSerializer(serializers.ModelSerializer):
    visit = serializers.PrimaryKeyRelatedField(queryset=ERVisit.objects.all(), write_only=True)
    visit_detail = ERVisitSerializer(source="visit", read_only=True)
    class Meta:
        model = ContextData
        fields = '__all__' + 'visit_datail'


class ExperienceFailureIndicatorSerializer(serializers.ModelSerializer):
    time_to_first_contact = serializers.DurationField(read_only=True)
    time_without_communication = serializers.DurationField(read_only=True)
    visit = serializers.PrimaryKeyRelatedField(queryset=ERVisit.objects.all(), write_only=True)
    visit_detail = ERVisitSerializer(source="visit", read_only=True)
    comm_event = serializers.PrimaryKeyRelatedField(queryset=ContextData.objects.all())
    comm_event_detail = CommunicationEventSerializer()
    

    class Meta:
        model = ExperienceFailureIndicator
        fields = '__all__' + 'visit_datail' + 'comm_event_detail'
