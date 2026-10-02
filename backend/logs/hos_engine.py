def analyze_daily_log(events):
    violations = []
    
    shift_start_minute = None
    accumulated_drive_minutes = 0
    driving_since_last_break = 0

    for event in events:
        duration = event.end_minute - event.start_minute

        if event.status in ['OFF', 'SB'] and duration >= 600:
            shift_start_minute = None
            accumulated_drive_minutes = 0
            driving_since_last_break = 0
            continue

        if event.status in ['ON', 'D'] and shift_start_minute is None:
            shift_start_minute = event.start_minute

        if event.status in ['OFF', 'SB', 'ON'] and duration >= 30:
            driving_since_last_break = 0

        if event.status == 'D':
            # 1. Check 14-Hour Window (840 minutes)
            if shift_start_minute is not None:
                shift_end_minute = shift_start_minute + 840
                if event.end_minute > shift_end_minute:
                    # Violation happens exactly at the 14th hour
                    violation_min = max(shift_end_minute, event.start_minute)
                    violations.append({
                        'type': '14_HOUR_WINDOW',
                        'minute': violation_min,
                        'message': f"Driving past the 14-hour window (at Hour {violation_min/60:.1f})."
                    })

            # 2. Check 11-Hour Drive Limit (660 minutes)
            if accumulated_drive_minutes + duration > 660:
                minutes_until_violation = 660 - accumulated_drive_minutes
                violation_min = event.start_minute + minutes_until_violation
                violations.append({
                    'type': '11_HOUR_DRIVE',
                    'minute': violation_min,
                    'message': f"Exceeded 11 hours of driving (at Hour {violation_min/60:.1f})."
                })
            accumulated_drive_minutes += duration

            # 3. Check 30-Minute Break Rule (480 minutes / 8 hours)
            if driving_since_last_break + duration > 480:
                minutes_until_violation = 480 - driving_since_last_break
                violation_min = event.start_minute + minutes_until_violation
                violations.append({
                    'type': '30_MIN_BREAK',
                    'minute': violation_min,
                    'message': f"8 consecutive hours of driving reached (at Hour {violation_min/60:.1f}). Break required."
                })
            driving_since_last_break += duration

    return violations