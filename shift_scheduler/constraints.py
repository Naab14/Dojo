"""
Constraint checking module for validating schedule assignments.
"""

from datetime import date, timedelta
from typing import List
from .employee import Employee
from .shift import Shift
from .schedule import Schedule


class ConstraintViolation:
    """Represents a constraint violation."""

    def __init__(self, violation_type: str, message: str, severity: str = "error"):
        """
        Initialize a constraint violation.

        Args:
            violation_type: Type of violation (e.g., "max_shifts", "availability")
            message: Human-readable description of the violation
            severity: Severity level ("error", "warning", "info")
        """
        self.violation_type = violation_type
        self.message = message
        self.severity = severity

    def __repr__(self) -> str:
        return f"ConstraintViolation(type='{self.violation_type}', severity='{self.severity}')"

    def __str__(self) -> str:
        return f"[{self.severity.upper()}] {self.message}"


class ConstraintChecker:
    """Checks scheduling constraints and validates assignments."""

    def __init__(self, min_hours_between_shifts: int = 12):
        """
        Initialize the constraint checker.

        Args:
            min_hours_between_shifts: Minimum hours required between consecutive shifts
        """
        self.min_hours_between_shifts = min_hours_between_shifts

    def check_employee_availability(
        self,
        employee: Employee,
        assignment_date: date
    ) -> List[ConstraintViolation]:
        """Check if employee is available on a specific date."""
        violations = []

        if not employee.is_available(assignment_date):
            violations.append(
                ConstraintViolation(
                    "availability",
                    f"{employee.name} is not available on {assignment_date}",
                    "error"
                )
            )

        return violations

    def check_max_shifts_per_week(
        self,
        employee: Employee,
        schedule: Schedule,
        assignment_date: date
    ) -> List[ConstraintViolation]:
        """Check if adding this shift would exceed weekly shift limit."""
        violations = []

        # Get the week's start date (Monday)
        week_start = assignment_date - timedelta(days=assignment_date.weekday())
        week_end = week_start + timedelta(days=6)

        # Count shifts in this week
        weekly_shifts = 0
        for assignment in schedule.assignments:
            if (assignment.employee.employee_id == employee.employee_id and
                    week_start <= assignment.date <= week_end):
                weekly_shifts += 1

        if weekly_shifts >= employee.max_shifts_per_week:
            violations.append(
                ConstraintViolation(
                    "max_shifts_per_week",
                    f"{employee.name} would exceed max shifts per week ({employee.max_shifts_per_week}) "
                    f"in week starting {week_start}",
                    "error"
                )
            )

        return violations

    def check_consecutive_days(
        self,
        employee: Employee,
        schedule: Schedule,
        assignment_date: date
    ) -> List[ConstraintViolation]:
        """Check if adding this shift would exceed consecutive days limit."""
        violations = []

        # Get employee's assignments sorted by date
        employee_assignments = sorted(
            schedule.get_assignments_by_employee(employee),
            key=lambda x: x.date
        )

        if not employee_assignments:
            return violations

        # Count consecutive days before this date
        consecutive_before = 0
        check_date = assignment_date - timedelta(days=1)

        while True:
            has_assignment = any(a.date == check_date for a in employee_assignments)
            if has_assignment:
                consecutive_before += 1
                check_date -= timedelta(days=1)
            else:
                break

        # Count consecutive days after this date
        consecutive_after = 0
        check_date = assignment_date + timedelta(days=1)

        while True:
            has_assignment = any(a.date == check_date for a in employee_assignments)
            if has_assignment:
                consecutive_after += 1
                check_date += timedelta(days=1)
            else:
                break

        total_consecutive = consecutive_before + 1 + consecutive_after

        if total_consecutive > employee.max_consecutive_days:
            violations.append(
                ConstraintViolation(
                    "consecutive_days",
                    f"{employee.name} would work {total_consecutive} consecutive days, "
                    f"exceeding limit of {employee.max_consecutive_days}",
                    "error"
                )
            )

        return violations

    def check_shift_coverage(
        self,
        shift: Shift,
        schedule: Schedule,
        assignment_date: date
    ) -> List[ConstraintViolation]:
        """Check if a shift has adequate coverage."""
        violations = []

        coverage = schedule.get_shift_coverage(shift, assignment_date)

        if coverage < shift.required_employees:
            violations.append(
                ConstraintViolation(
                    "insufficient_coverage",
                    f"{shift.name} on {assignment_date} needs {shift.required_employees} "
                    f"employees but only has {coverage}",
                    "warning"
                )
            )

        return violations

    def check_all_constraints(
        self,
        employee: Employee,
        shift: Shift,
        assignment_date: date,
        schedule: Schedule
    ) -> List[ConstraintViolation]:
        """Run all constraint checks for a potential assignment."""
        violations = []

        violations.extend(self.check_employee_availability(employee, assignment_date))
        violations.extend(self.check_max_shifts_per_week(employee, schedule, assignment_date))
        violations.extend(self.check_consecutive_days(employee, schedule, assignment_date))

        return violations

    def validate_schedule(
        self,
        schedule: Schedule,
        shifts: List[Shift]
    ) -> List[ConstraintViolation]:
        """Validate an entire schedule."""
        violations = []
        from datetime import timedelta

        # Check coverage for all dates and shifts
        current_date = schedule.start_date
        while current_date <= schedule.end_date:
            for shift in shifts:
                violations.extend(
                    self.check_shift_coverage(shift, schedule, current_date)
                )
            current_date += timedelta(days=1)

        return violations
