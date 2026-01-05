from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Permission)
admin.site.register(Role)
admin.site.register(UserExtension)