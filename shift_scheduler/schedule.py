"""
Schedule management module for organizing shift assignments.
"""

from datetime import date, datetime
from typing import List, Dict, Optional, Tuple
from .employee import Employee
from .shift import Shift


class ShiftAssignment:
    """Represents an assignment of an employee to a shift on a specific date."""

    def __init__(self, employee: Employee, shift: Shift, date: date):
        """
        Initialize a shift assignment.

        Args:
            employee: The employee assigned to the shift
            shift: The shift being assigned
            date: The date of the assignment
        """
        self.employee = employee
        self.shift = shift
        self.date = date

    def __repr__(self) -> str:
        return (
            f"ShiftAssignment(employee='{self.employee.name}', "
            f"shift='{self.shift.name}', date='{self.date}')"
        )

    def __str__(self) -> str:
        return f"{self.employee.name} -> {self.shift.name} on {self.date}"

    def to_dict(self) -> dict:
        """Convert assignment to dictionary representation."""
        return {
            "employee_id": self.employee.employee_id,
            "employee_name": self.employee.name,
            "shift_name": self.shift.name,
            "shift_start": self.shift.start_time.strftime("%H:%M"),
            "shift_end": self.shift.end_time.strftime("%H:%M"),
            "date": self.date.isoformat()
        }


class Schedule:
    """Represents a complete schedule with multiple shift assignments."""

    def __init__(self, start_date: date, end_date: date):
        """
        Initialize a schedule.

        Args:
            start_date: Start date of the schedule period
            end_date: End date of the schedule period
        """
        self.start_date = start_date
        self.end_date = end_date
        self.assignments: List[ShiftAssignment] = []

    def add_assignment(self, employee: Employee, shift: Shift, assignment_date: date) -> bool:
        """
        Add a shift assignment to the schedule.

        Args:
            employee: Employee to assign
            shift: Shift to assign
            assignment_date: Date of the assignment

        Returns:
            True if assignment was added, False if it conflicts with existing assignments
        """
        # Check if date is within schedule period
        if not (self.start_date <= assignment_date <= self.end_date):
            return False

        # Check for conflicts (employee already assigned on this date)
        if self.get_employee_assignment(employee, assignment_date):
            return False

        assignment = ShiftAssignment(employee, shift, assignment_date)
        self.assignments.append(assignment)
        return True

    def remove_assignment(self, employee: Employee, assignment_date: date) -> bool:
        """Remove an employee's assignment for a specific date."""
        for i, assignment in enumerate(self.assignments):
            if (assignment.employee.employee_id == employee.employee_id and
                    assignment.date == assignment_date):
                self.assignments.pop(i)
                return True
        return False

    def get_employee_assignment(
        self,
        employee: Employee,
        assignment_date: date
    ) -> Optional[ShiftAssignment]:
        """Get an employee's assignment for a specific date."""
        for assignment in self.assignments:
            if (assignment.employee.employee_id == employee.employee_id and
                    assignment.date == assignment_date):
                return assignment
        return None

    def get_assignments_by_date(self, assignment_date: date) -> List[ShiftAssignment]:
        """Get all assignments for a specific date."""
        return [a for a in self.assignments if a.date == assignment_date]

    def get_assignments_by_employee(self, employee: Employee) -> List[ShiftAssignment]:
        """Get all assignments for a specific employee."""
        return [
            a for a in self.assignments
            if a.employee.employee_id == employee.employee_id
        ]

    def get_employee_shift_count(self, employee: Employee) -> int:
        """Count total shifts assigned to an employee."""
        return len(self.get_assignments_by_employee(employee))

    def get_shift_coverage(self, shift: Shift, assignment_date: date) -> int:
        """Count how many employees are assigned to a specific shift on a date."""
        assignments = self.get_assignments_by_date(assignment_date)
        return sum(1 for a in assignments if a.shift.name == shift.name)

    def is_fully_covered(self, shifts: List[Shift]) -> bool:
        """Check if all required shifts are fully covered for all dates."""
        from datetime import timedelta

        current_date = self.start_date
        while current_date <= self.end_date:
            for shift in shifts:
                coverage = self.get_shift_coverage(shift, current_date)
                if coverage < shift.required_employees:
                    return False
            current_date += timedelta(days=1)
        return True

    def get_statistics(self) -> Dict[str, any]:
        """Get schedule statistics."""
        from collections import Counter

        employee_counts = Counter(a.employee.employee_id for a in self.assignments)
        shift_counts = Counter(a.shift.name for a in self.assignments)

        return {
            "total_assignments": len(self.assignments),
            "unique_employees": len(employee_counts),
            "assignments_per_employee": dict(employee_counts),
            "assignments_per_shift": dict(shift_counts),
            "date_range": f"{self.start_date} to {self.end_date}",
            "total_days": (self.end_date - self.start_date).days + 1
        }

    def to_dict(self) -> dict:
        """Convert schedule to dictionary representation."""
        return {
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "assignments": [a.to_dict() for a in self.assignments],
            "statistics": self.get_statistics()
        }

    def __repr__(self) -> str:
        return (
            f"Schedule(start_date='{self.start_date}', "
            f"end_date='{self.end_date}', "
            f"assignments={len(self.assignments)})"
        )

    def __str__(self) -> str:
        return (
            f"Schedule from {self.start_date} to {self.end_date} "
            f"with {len(self.assignments)} assignments"
        )
