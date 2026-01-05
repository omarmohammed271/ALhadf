from django.contrib import admin
from .models import Alert, UserAlert

# ---------------------------
# Alert Admin
# ---------------------------
@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "level",
        "status",
        "triggered_by",
        "triggered_at",
    )
    list_filter = ("level", "status", "triggered_at")
    search_fields = ("title", "description", "triggered_by")
    ordering = ("-triggered_at",)


# ---------------------------
# UserAlert Admin
# ---------------------------
@admin.register(UserAlert)
class UserAlertAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "alert",
        "is_read",
        "read_at",
    )
    list_filter = ("is_read", "read_at")
    search_fields = ("user__username", "user__email", "alert__title")
    ordering = ("-alert__triggered_at",)
