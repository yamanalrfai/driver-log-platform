from django.contrib import admin
from .models import DailyLog, DutyStatusEvent

admin.site.register(DailyLog)
admin.site.register(DutyStatusEvent)