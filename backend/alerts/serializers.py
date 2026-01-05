# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Alert, UserAlert

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = [
            'id', 'title', 'description', 'level',
            'status', 'triggered_by', 'triggered_at', 'metadata'
        ]
        read_only_fields = ['id', 'triggered_at', 'triggered_by', 'status']


class UserAlertSerializer(serializers.ModelSerializer):
    alert = AlertSerializer(read_only=True)
    alert_id = serializers.PrimaryKeyRelatedField(
        queryset=Alert.objects.all(),
        source='alert',
        write_only=True
    )

    class Meta:
        model = UserAlert
        fields = [
            'id', 'user', 'alert', 'alert_id',
            'is_read', 'read_at'
        ]
        read_only_fields = ['id', 'alert', 'read_at', 'user']
