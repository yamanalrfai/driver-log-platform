from django.shortcuts import render

from rest_framework import viewsets
from .models import DailyLog, DutyStatusEvent
from .serializers import DailyLogSerializer, DutyStatusEventSerializer

# ViewSets automatically generate the standard CRUD operations
class DailyLogViewSet(viewsets.ModelViewSet):
    queryset = DailyLog.objects.all()
    serializer_class = DailyLogSerializer

class DutyStatusEventViewSet(viewsets.ModelViewSet):
    queryset = DutyStatusEvent.objects.all()
    serializer_class = DutyStatusEventSerializer