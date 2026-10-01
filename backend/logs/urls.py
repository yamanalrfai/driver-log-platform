from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyLogViewSet, DutyStatusEventViewSet

router = DefaultRouter()
router.register(r'logs', DailyLogViewSet)
router.register(r'events', DutyStatusEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]