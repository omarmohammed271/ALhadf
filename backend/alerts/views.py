from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db import transaction
from .models import Alert, UserAlert
from .serializers import AlertSerializer, UserAlertSerializer
from account.permissions import HasERPermission


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all().order_by('-triggered_at')
    serializer_class = AlertSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [HasERPermission]

    def get_permissions(self):
        if self.action == 'create':
            self.required_permission = 'send_alerts'
        else:
            # Viewers and Admins can see the list
            self.required_permission = 'view'
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        """
        Create alert and assign to specified users or all users.
        """
        
        data = request.data.copy()
        user_id = data.get('user_ids[]') or data.get('user_ids') 
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            # Save alert
            alert = serializer.save(triggered_by=request.user.username)
            
            print("WOW")
            # Get users
            if user_id:
                user = User.objects.get(id=user_id)
                UserAlert.objects.create(user=user, alert=alert)
            else:
                users = User.objects.all()
                user_alerts = [
                    UserAlert(user=user, alert=alert)
                    for user in users if users.count() > 1
                ]
                UserAlert.objects.bulk_create(user_alerts, ignore_conflicts=True)

        return Response(
            self.get_serializer(alert).data,
            status=status.HTTP_201_CREATED
        )

    def list(self, request, *args, **kwargs):
        """Admin can list all alerts."""
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """Admin can retrieve specific alert."""
        return super().retrieve(request, *args, **kwargs)


class UserAlertViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserAlertSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Users see only their own alerts, ordered by newest first.
        """
        return UserAlert.objects.all().select_related('alert').order_by('-alert__triggered_at')

    @action(detail=True, methods=['post'], url_path="mark-read")
    def mark_read(self, request, pk=None):
        """
        Update to read status of user's own alert.
        """
        user_alert = self.get_object()
        
        # Ensure user owns this alert
        if user_alert.user != request.user:
            return Response(
                {'error': 'Unauthorized'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user_alert.is_read = True
        user_alert.read_at = timezone.now()
        user_alert.save(update_fields=['is_read', 'read_at'])
        
        return Response(self.get_serializer(user_alert).data)

    @action(detail=False, methods=['get'], url_path="unread-count")
    def unread_count(self, request):
        """
        Get count of unread alerts for current user.
        """
        count = UserAlert.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        print(count)
        
        return Response({'unread_count': count})

    @action(detail=False, methods=['get'], url_path="my-alerts")
    def my_alerts(self, request):
        """
        Get count of unread alerts for current user.
        """
        alerts = UserAlert.objects.filter(
            user=request.user
        )
        serializer = UserAlertSerializer(alerts, many=True)
        return Response({'data': serializer.data})
