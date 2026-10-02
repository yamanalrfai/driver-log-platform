from rest_framework import serializers
from .models import DailyLog, DutyStatusEvent
from .hos_engine import analyze_daily_log

class DutyStatusEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = DutyStatusEvent
        fields = ['id', 'status', 'start_minute', 'end_minute']

class DailyLogSerializer(serializers.ModelSerializer):
    events = DutyStatusEventSerializer(many=True, read_only=True)
    violations = serializers.SerializerMethodField()

    class Meta:
        model = DailyLog
        fields = ['id', 'driver_name', 'date', 'vehicle_number', 'events', 'violations']

    def get_violations(self, obj):
        events = obj.events.all().order_by('start_minute')
        return analyze_daily_log(events)