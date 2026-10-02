from django.test import TestCase
from .models import DailyLog, DutyStatusEvent
from .hos_engine import analyze_daily_log

class HOSEngineTests(TestCase):
    def setUp(self):
        # Create a dummy daily log to attach our events to
        self.log = DailyLog.objects.create(
            driver_name="Test Driver", 
            date="2026-10-03", 
            vehicle_number="Unit Test 1"
        )

    def create_event(self, status, start, end):
        DutyStatusEvent.objects.create(
            daily_log=self.log, 
            status=status, 
            start_minute=start, 
            end_minute=end
        )

    def test_happy_path_no_violations(self):
        """A perfectly legal 11-hour driving day with a 30-minute break."""
        self.create_event('OFF', 0, 600)      # 10 hours off duty
        self.create_event('ON', 600, 630)     # 30 min pre-trip
        self.create_event('D', 630, 1110)     # 8 hours driving
        self.create_event('OFF', 1110, 1140)  # 30 min mandatory break
        self.create_event('D', 1140, 1320)    # 3 hours driving (11 total)
        self.create_event('OFF', 1320, 1440)  # Off duty

        events = self.log.events.all()
        violations = analyze_daily_log(events)
        self.assertEqual(len(violations), 0)

    def test_11_hour_driving_limit(self):
        """Driving for 11.5 hours should trigger the 11_HOUR_DRIVE violation."""
        self.create_event('OFF', 0, 600)      # 10 hours off duty
        self.create_event('D', 600, 1080)     # 8 hours driving
        self.create_event('OFF', 1080, 1110)  # 30 min break
        self.create_event('D', 1110, 1320)    # 3.5 hours driving (11.5 total)

        events = self.log.events.all()
        violations = analyze_daily_log(events)
        
        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0]['type'], '11_HOUR_DRIVE')
        # 600 start + 8 hrs (480m) = 1080. Plus 3 hrs (180m) = 1260 exact violation minute.
        self.assertEqual(violations[0]['minute'], 1290) 

    def test_14_hour_shift_window(self):
        """Driving after the 14-hour shift window closes is a violation."""
        self.create_event('OFF', 0, 600)      # 10 hours off duty
        self.create_event('ON', 600, 1200)    # 10 hours on duty (shift started at 600)
        self.create_event('OFF', 1200, 1400)  # 3.3 hours off duty
        
        # CHANGE THIS LINE: Drive until 1470 instead of 1440
        self.create_event('D', 1400, 1470)    

        events = self.log.events.all()
        violations = analyze_daily_log(events)

        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0]['type'], '14_HOUR_WINDOW')
        self.assertEqual(violations[0]['minute'], 1440)

    def test_30_minute_break_rule(self):
        """Driving 9 straight hours without a break triggers the 30_MIN_BREAK violation."""
        self.create_event('OFF', 0, 600)      # 10 hours off duty
        self.create_event('D', 600, 1140)     # 9 hours straight driving

        events = self.log.events.all()
        violations = analyze_daily_log(events)

        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0]['type'], '30_MIN_BREAK')
        # 600 + 480 (8 hours) = 1080 violation minute
        self.assertEqual(violations[0]['minute'], 1080)