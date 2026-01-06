from rest_framework import serializers
from .models import ERVisit, CommunicationEvent, SatisfactionSignal, ExperienceFailureIndicator, ContextData
from account.serializers import UserListSerializer


class ERVisitSerializer(serializers.ModelSerializer):
    length_of_stay = serializers.DurationField(read_only=True)
    patient = UserListSerializer()

    class Meta:
        model = ERVisit
        fields = '__all__'


class CommunicationEventSerializer(serializers.ModelSerializer):
    visit = ERVisitSerializer()
    class Meta:
        model = CommunicationEvent
        fields = '__all__'


class SatisfactionSignalSerializer(serializers.ModelSerializer):
    visit = ERVisitSerializer()
    class Meta:
        model = SatisfactionSignal
        fields = '__all__'


class ContextDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContextData
        fields = '__all__'


class ExperienceFailureIndicatorSerializer(serializers.ModelSerializer):
    time_to_first_contact = serializers.DurationField(read_only=True)
    time_without_communication = serializers.DurationField(read_only=True)
    visit = ERVisitSerializer()
    comm_event = CommunicationEventSerializer()

    class Meta:
        model = ExperienceFailureIndicator
        fields = '__all__'
