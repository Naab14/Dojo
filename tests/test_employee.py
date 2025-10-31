"""
Tests for the Employee class.
"""

from datetime import date
from shift_scheduler.employee import Employee


def test_employee_creation():
    """Test basic employee creation."""
    emp = Employee("John Doe", "john@example.com")
    assert emp.name == "John Doe"
    assert emp.email == "john@example.com"
    assert emp.max_shifts_per_week == 5
    assert emp.max_consecutive_days == 6
    assert len(emp.unavailable_dates) == 0


def test_employee_with_custom_limits():
    """Test employee with custom shift limits."""
    emp = Employee("Jane Smith", "jane@example.com",
                   max_shifts_per_week=4, max_consecutive_days=5)
    assert emp.max_shifts_per_week == 4
    assert emp.max_consecutive_days == 5


def test_employee_unavailable_dates():
    """Test managing unavailable dates."""
    emp = Employee("Bob", "bob@example.com")

    unavailable = date(2025, 11, 15)
    emp.add_unavailable_date(unavailable)

    assert not emp.is_available(unavailable)
    assert emp.is_available(date(2025, 11, 16))

    emp.remove_unavailable_date(unavailable)
    assert emp.is_available(unavailable)


def test_employee_preferred_shifts():
    """Test preferred shift management."""
    emp = Employee("Alice", "alice@example.com")

    emp.add_preferred_shift("Morning")
    emp.add_preferred_shift("Day")

    assert "Morning" in emp.preferred_shifts
    assert "Day" in emp.preferred_shifts
    assert len(emp.preferred_shifts) == 2


def test_employee_to_dict():
    """Test serialization to dictionary."""
    emp = Employee("Charlie", "charlie@example.com")
    emp.add_unavailable_date(date(2025, 11, 20))
    emp.add_preferred_shift("Evening")

    data = emp.to_dict()

    assert data['name'] == "Charlie"
    assert data['email'] == "charlie@example.com"
    assert len(data['unavailable_dates']) == 1
    assert len(data['preferred_shifts']) == 1


def test_employee_from_dict():
    """Test deserialization from dictionary."""
    data = {
        "name": "Diana",
        "email": "diana@example.com",
        "employee_id": "test123",
        "max_shifts_per_week": 4,
        "max_consecutive_days": 5,
        "unavailable_dates": ["2025-11-20"],
        "preferred_shifts": ["Night"]
    }

    emp = Employee.from_dict(data)

    assert emp.name == "Diana"
    assert emp.email == "diana@example.com"
    assert emp.employee_id == "test123"
    assert emp.max_shifts_per_week == 4
    assert len(emp.unavailable_dates) == 1
    assert len(emp.preferred_shifts) == 1


if __name__ == "__main__":
    # Run tests manually
    test_employee_creation()
    test_employee_with_custom_limits()
    test_employee_unavailable_dates()
    test_employee_preferred_shifts()
    test_employee_to_dict()
    test_employee_from_dict()
    print("All employee tests passed!")
