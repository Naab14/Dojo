"""
Shift definition module for the scheduling system.
"""

from datetime import time, datetime, timedelta
from typing import Optional


class Shift:
    """Represents a work shift with start and end times."""

    def __init__(
        self,
        name: str,
        start_time: str,
        end_time: str,
        required_employees: int = 1,
        description: Optional[str] = None
    ):
        """
        Initialize a shift.

        Args:
            name: Shift name (e.g., "Morning", "Evening", "Night")
            start_time: Start time in HH:MM format (24-hour)
            end_time: End time in HH:MM format (24-hour)
            required_employees: Number of employees needed for this shift
            description: Optional shift description
        """
        self.name = name
        self.start_time = self._parse_time(start_time)
        self.end_time = self._parse_time(end_time)
        self.required_employees = required_employees
        self.description = description or f"{name} shift"

    def _parse_time(self, time_str: str) -> time:
        """Parse time string in HH:MM format."""
        try:
            return datetime.strptime(time_str, "%H:%M").time()
        except ValueError:
            raise ValueError(
                f"Invalid time format: {time_str}. Expected HH:MM (24-hour format)"
            )

    def get_duration_hours(self) -> float:
        """Calculate shift duration in hours."""
        start_dt = datetime.combine(datetime.today(), self.start_time)
        end_dt = datetime.combine(datetime.today(), self.end_time)

        # Handle shifts that cross midnight
        if end_dt <= start_dt:
            end_dt += timedelta(days=1)

        duration = end_dt - start_dt
        return duration.total_seconds() / 3600

    def overlaps_with(self, other: "Shift") -> bool:
        """
        Check if this shift overlaps with another shift.

        Args:
            other: Another Shift instance

        Returns:
            True if shifts overlap, False otherwise
        """
        # Convert times to minutes since midnight for easier comparison
        def time_to_minutes(t: time) -> int:
            return t.hour * 60 + t.minute

        start1 = time_to_minutes(self.start_time)
        end1 = time_to_minutes(self.end_time)
        start2 = time_to_minutes(other.start_time)
        end2 = time_to_minutes(other.end_time)

        # Handle shifts crossing midnight
        if end1 < start1:
            end1 += 1440  # Add 24 hours in minutes

        if end2 < start2:
            end2 += 1440

        # Check for overlap
        return not (end1 <= start2 or end2 <= start1)

    def __repr__(self) -> str:
        return (
            f"Shift(name='{self.name}', "
            f"start='{self.start_time}', "
            f"end='{self.end_time}')"
        )

    def __str__(self) -> str:
        return f"{self.name} ({self.start_time.strftime('%H:%M')}-{self.end_time.strftime('%H:%M')})"

    def to_dict(self) -> dict:
        """Convert shift to dictionary representation."""
        return {
            "name": self.name,
            "start_time": self.start_time.strftime("%H:%M"),
            "end_time": self.end_time.strftime("%H:%M"),
            "required_employees": self.required_employees,
            "description": self.description,
            "duration_hours": self.get_duration_hours()
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Shift":
        """Create a shift from dictionary representation."""
        return cls(
            name=data["name"],
            start_time=data["start_time"],
            end_time=data["end_time"],
            required_employees=data.get("required_employees", 1),
            description=data.get("description")
        )
