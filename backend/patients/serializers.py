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
        fields = '__all__'


class SatisfactionSignalSerializer(serializers.ModelSerializer):
    visit = serializers.PrimaryKeyRelatedField(queryset=ERVisit.objects.all(), write_only=True)
    visit_detail = ERVisitSerializer(source="visit", read_only=True)
    class Meta:
        model = SatisfactionSignal
        fields = '__all__'


class ContextDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContextData
        fields = '__all__'


class ExperienceFailureIndicatorSerializer(serializers.ModelSerializer):
    visit = serializers.PrimaryKeyRelatedField(
        queryset=ERVisit.objects.all(),
        write_only=True
    )
    visit_detail = ERVisitSerializer(
        source="visit",
        read_only=True
    )

    comm_event = serializers.PrimaryKeyRelatedField(
        queryset=CommunicationEvent.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    comm_event_detail = CommunicationEventSerializer(
        source="comm_event",
        read_only=True
    )

    class Meta:
        model = ExperienceFailureIndicator
        fields = [
            'id',
            'visit',
            'visit_detail',
            'comm_event',
            'comm_event_detail',
            'lwbs',
            'time_to_first_contact',
            'time_without_communication',
            'revisit_reason',
            'metadata',
        ]
        
    def create(self, validated_data):
        print(validated_data)
        return super().create(validated_data)

