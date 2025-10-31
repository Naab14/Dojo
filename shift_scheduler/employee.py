"""
Employee management module for shift scheduling.
"""

from typing import List, Optional
from datetime import datetime, date


class Employee:
    """Represents an employee in the scheduling system."""

    def __init__(
        self,
        name: str,
        email: str,
        employee_id: Optional[str] = None,
        max_shifts_per_week: int = 5,
        max_consecutive_days: int = 6
    ):
        """
        Initialize an employee.

        Args:
            name: Employee's full name
            email: Employee's email address
            employee_id: Unique identifier (auto-generated if not provided)
            max_shifts_per_week: Maximum number of shifts per week
            max_consecutive_days: Maximum consecutive working days
        """
        self.name = name
        self.email = email
        self.employee_id = employee_id or self._generate_id()
        self.max_shifts_per_week = max_shifts_per_week
        self.max_consecutive_days = max_consecutive_days
        self.unavailable_dates: List[date] = []
        self.preferred_shifts: List[str] = []

    def _generate_id(self) -> str:
        """Generate a unique employee ID based on name and timestamp."""
        import hashlib
        from datetime import datetime

        timestamp = datetime.now().isoformat()
        raw = f"{self.name}{self.email}{timestamp}"
        return hashlib.md5(raw.encode()).hexdigest()[:8]

    def add_unavailable_date(self, unavailable_date: date) -> None:
        """Mark a date as unavailable for this employee."""
        if unavailable_date not in self.unavailable_dates:
            self.unavailable_dates.append(unavailable_date)

    def remove_unavailable_date(self, unavailable_date: date) -> None:
        """Remove an unavailable date."""
        if unavailable_date in self.unavailable_dates:
            self.unavailable_dates.remove(unavailable_date)

    def is_available(self, check_date: date) -> bool:
        """Check if employee is available on a given date."""
        return check_date not in self.unavailable_dates

    def add_preferred_shift(self, shift_name: str) -> None:
        """Add a preferred shift type for this employee."""
        if shift_name not in self.preferred_shifts:
            self.preferred_shifts.append(shift_name)

    def __repr__(self) -> str:
        return f"Employee(name='{self.name}', id='{self.employee_id}')"

    def __str__(self) -> str:
        return f"{self.name} ({self.employee_id})"

    def to_dict(self) -> dict:
        """Convert employee to dictionary representation."""
        return {
            "name": self.name,
            "email": self.email,
            "employee_id": self.employee_id,
            "max_shifts_per_week": self.max_shifts_per_week,
            "max_consecutive_days": self.max_consecutive_days,
            "unavailable_dates": [d.isoformat() for d in self.unavailable_dates],
            "preferred_shifts": self.preferred_shifts
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Employee":
        """Create an employee from dictionary representation."""
        employee = cls(
            name=data["name"],
            email=data["email"],
            employee_id=data.get("employee_id"),
            max_shifts_per_week=data.get("max_shifts_per_week", 5),
            max_consecutive_days=data.get("max_consecutive_days", 6)
        )

        if "unavailable_dates" in data:
            employee.unavailable_dates = [
                date.fromisoformat(d) for d in data["unavailable_dates"]
            ]

        if "preferred_shifts" in data:
            employee.preferred_shifts = data["preferred_shifts"]

        return employee
