from rest_framework import serializers
from .models import DailyLog, DutyStatusEvent

class DutyStatusEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = DutyStatusEvent
        fields = ['id', 'status', 'start_minute', 'end_minute']

class DailyLogSerializer(serializers.ModelSerializer):
    # This nests all the events inside the log automatically!
    events = DutyStatusEventSerializer(many=True, read_only=True)

    class Meta:
        model = DailyLog
        fields = ['id', 'driver_name', 'date', 'vehicle_number', 'events']