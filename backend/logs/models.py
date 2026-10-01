from django.db import models

class DailyLog(models.Model):
    driver_name = models.CharField(max_length=120)
    date = models.DateField()
    vehicle_number = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.driver_name} - {self.date}"

class DutyStatusEvent(models.Model):
    # The 4 legal DOT statuses
    STATUS_CHOICES = [
        ('OFF', 'Off Duty'),
        ('SB', 'Sleeper Berth'),
        ('D', 'Driving'),
        ('ON', 'On Duty (Not Driving)'),
    ]

    # This links the event to a specific daily log
    daily_log = models.ForeignKey(DailyLog, related_name='events', on_delete=models.CASCADE)
    status = models.CharField(max_length=4, choices=STATUS_CHOICES)
    
    # We store time as minutes from midnight (0 to 1440) for easy math
    start_minute = models.PositiveSmallIntegerField()
    end_minute = models.PositiveSmallIntegerField()

    def __str__(self):
        return f"{self.status} from {self.start_minute} to {self.end_minute}"