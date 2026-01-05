# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Alert, UserAlert
from .serializers import AlertSerializer, UserAlertSerializer

# -----------------------------
# SuperAdmin can create alerts
# -----------------------------
class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all().order_by('-triggered_at')
    serializer_class = AlertSerializer
    # permission_classes = [IsAdminUser]

    def create(self, request, *args, **kwargs):
        """
        Custom create: allow sending to all users or specific users
        """
        users_ids = request.data.get("user_ids")  # list of user ids
        print(users_ids)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        alert = serializer.save(triggered_by=request.user.username)

        # Link users
        if users_ids:
            users = User.objects.filter(id__in=users_ids)
        else:
            users = User.objects.all()

        user_alerts = [UserAlert(user=user, alert=alert) for user in users]
        UserAlert.objects.bulk_create(user_alerts, ignore_conflicts=True)

        return Response(self.get_serializer(alert).data, status=status.HTTP_201_CREATED)


# -----------------------------
# Users can view and toggle notifications
# -----------------------------
class UserAlertViewSet(viewsets.ModelViewSet):
    serializer_class = UserAlertSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserAlert.objects.filter(user=self.request.user).select_related('alert').order_by('-alert__triggered_at')

    @action(detail=True, methods=['post'])
    def toggle_read(self, request, pk=None):
        user_alert = self.get_object()
        user_alert.is_read = not user_alert.is_read
        from django.utils import timezone
        user_alert.read_at = timezone.now() if user_alert.is_read else None
        user_alert.save(update_fields=['is_read', 'read_at'])
        return Response(self.get_serializer(user_alert).data)
