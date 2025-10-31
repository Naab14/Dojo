"""
Tests for the Shift class.
"""

from shift_scheduler.shift import Shift


def test_shift_creation():
    """Test basic shift creation."""
    shift = Shift("Morning", "08:00", "16:00")
    assert shift.name == "Morning"
    assert shift.required_employees == 1


def test_shift_duration():
    """Test shift duration calculation."""
    # 8-hour shift
    shift = Shift("Day", "09:00", "17:00")
    assert shift.get_duration_hours() == 8.0

    # 12-hour shift
    shift = Shift("Long", "06:00", "18:00")
    assert shift.get_duration_hours() == 12.0

    # Overnight shift (crosses midnight)
    shift = Shift("Night", "22:00", "06:00")
    assert shift.get_duration_hours() == 8.0


def test_shift_overlap():
    """Test shift overlap detection."""
    morning = Shift("Morning", "08:00", "16:00")
    evening = Shift("Evening", "16:00", "00:00")
    afternoon = Shift("Afternoon", "14:00", "22:00")

    # Morning and evening don't overlap (they touch at 16:00)
    assert not morning.overlaps_with(evening)

    # Morning and afternoon overlap
    assert morning.overlaps_with(afternoon)
    assert afternoon.overlaps_with(morning)


def test_shift_to_dict():
    """Test serialization to dictionary."""
    shift = Shift("Evening", "16:00", "22:00", required_employees=2,
                  description="Evening shift")

    data = shift.to_dict()

    assert data['name'] == "Evening"
    assert data['start_time'] == "16:00"
    assert data['end_time'] == "22:00"
    assert data['required_employees'] == 2
    assert data['duration_hours'] == 6.0


def test_shift_from_dict():
    """Test deserialization from dictionary."""
    data = {
        "name": "Night",
        "start_time": "00:00",
        "end_time": "08:00",
        "required_employees": 1,
        "description": "Night shift"
    }

    shift = Shift.from_dict(data)

    assert shift.name == "Night"
    assert shift.start_time.strftime("%H:%M") == "00:00"
    assert shift.end_time.strftime("%H:%M") == "08:00"
    assert shift.required_employees == 1


if __name__ == "__main__":
    # Run tests manually
    test_shift_creation()
    test_shift_duration()
    test_shift_overlap()
    test_shift_to_dict()
    test_shift_from_dict()
    print("All shift tests passed!")
