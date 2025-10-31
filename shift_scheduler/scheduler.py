"""
Main scheduler module for generating and managing shift schedules.
"""

from datetime import date, timedelta
from typing import List, Optional
import random

from .employee import Employee
from .shift import Shift
from .schedule import Schedule
from .constraints import ConstraintChecker, ConstraintViolation
from .exporters import ScheduleExporter


class ShiftScheduler:
    """Main scheduler class for managing employees, shifts, and schedules."""

    def __init__(self, min_hours_between_shifts: int = 12):
        """
        Initialize the shift scheduler.

        Args:
            min_hours_between_shifts: Minimum hours required between shifts for an employee
        """
        self.employees: List[Employee] = []
        self.constraint_checker = ConstraintChecker(min_hours_between_shifts)
        self.exporter = ScheduleExporter()

    def add_employee(self, employee: Employee) -> None:
        """Add an employee to the scheduler."""
        if not any(e.employee_id == employee.employee_id for e in self.employees):
            self.employees.append(employee)

    def remove_employee(self, employee_id: str) -> bool:
        """Remove an employee from the scheduler."""
        for i, emp in enumerate(self.employees):
            if emp.employee_id == employee_id:
                self.employees.pop(i)
                return True
        return False

    def get_employee(self, employee_id: str) -> Optional[Employee]:
        """Get an employee by ID."""
        for emp in self.employees:
            if emp.employee_id == employee_id:
                return emp
        return None

    def generate_schedule(
        self,
        start_date: str,
        end_date: str,
        shifts: List[Shift],
        algorithm: str = "round_robin"
    ) -> Schedule:
        """
        Generate a schedule for the given period.

        Args:
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            shifts: List of shift types to assign
            algorithm: Scheduling algorithm ("round_robin", "fair_distribution", "random")

        Returns:
            Generated Schedule object
        """
        start = date.fromisoformat(start_date)
        end = date.fromisoformat(end_date)
        schedule = Schedule(start, end)

        if algorithm == "round_robin":
            self._schedule_round_robin(schedule, shifts)
        elif algorithm == "fair_distribution":
            self._schedule_fair_distribution(schedule, shifts)
        elif algorithm == "random":
            self._schedule_random(schedule, shifts)
        else:
            raise ValueError(f"Unknown algorithm: {algorithm}")

        return schedule

    def _schedule_round_robin(self, schedule: Schedule, shifts: List[Shift]) -> None:
        """Simple round-robin scheduling algorithm."""
        if not self.employees:
            return

        current_date = schedule.start_date
        employee_index = 0

        while current_date <= schedule.end_date:
            for shift in shifts:
                # Assign required number of employees to this shift
                for _ in range(shift.required_employees):
                    attempts = 0
                    assigned = False

                    # Try to find an available employee
                    while attempts < len(self.employees) and not assigned:
                        employee = self.employees[employee_index % len(self.employees)]
                        employee_index += 1
                        attempts += 1

                        # Check constraints
                        violations = self.constraint_checker.check_all_constraints(
                            employee, shift, current_date, schedule
                        )

                        # Only assign if no error-level violations
                        if not any(v.severity == "error" for v in violations):
                            schedule.add_assignment(employee, shift, current_date)
                            assigned = True

            current_date += timedelta(days=1)

    def _schedule_fair_distribution(self, schedule: Schedule, shifts: List[Shift]) -> None:
        """Fair distribution algorithm - tries to balance shifts across employees."""
        if not self.employees:
            return

        current_date = schedule.start_date

        while current_date <= schedule.end_date:
            for shift in shifts:
                # Get employees sorted by current shift count
                available_employees = sorted(
                    self.employees,
                    key=lambda e: schedule.get_employee_shift_count(e)
                )

                assigned_count = 0
                for employee in available_employees:
                    if assigned_count >= shift.required_employees:
                        break

                    # Check constraints
                    violations = self.constraint_checker.check_all_constraints(
                        employee, shift, current_date, schedule
                    )

                    if not any(v.severity == "error" for v in violations):
                        schedule.add_assignment(employee, shift, current_date)
                        assigned_count += 1

            current_date += timedelta(days=1)

    def _schedule_random(self, schedule: Schedule, shifts: List[Shift]) -> None:
        """Random scheduling algorithm - assigns shifts randomly."""
        if not self.employees:
            return

        current_date = schedule.start_date

        while current_date <= schedule.end_date:
            for shift in shifts:
                # Create a shuffled copy of employees
                shuffled_employees = self.employees.copy()
                random.shuffle(shuffled_employees)

                assigned_count = 0
                for employee in shuffled_employees:
                    if assigned_count >= shift.required_employees:
                        break

                    # Check constraints
                    violations = self.constraint_checker.check_all_constraints(
                        employee, shift, current_date, schedule
                    )

                    if not any(v.severity == "error" for v in violations):
                        schedule.add_assignment(employee, shift, current_date)
                        assigned_count += 1

            current_date += timedelta(days=1)

    def validate_schedule(self, schedule: Schedule, shifts: List[Shift]) -> List[ConstraintViolation]:
        """
        Validate a schedule against all constraints.

        Args:
            schedule: The schedule to validate
            shifts: List of shift types

        Returns:
            List of constraint violations found
        """
        return self.constraint_checker.validate_schedule(schedule, shifts)

    def export_schedule(
        self,
        schedule: Schedule,
        format: str = "csv",
        filename: str = "schedule",
        shifts: Optional[List[Shift]] = None
    ) -> None:
        """
        Export schedule to a file.

        Args:
            schedule: The schedule to export
            format: Output format ("csv", "json", "text", "html")
            filename: Base filename (extension will be added)
            shifts: List of shifts (required for HTML export)
        """
        if not filename.endswith(f".{format}"):
            filename = f"{filename}.{format}"

        if format == "csv":
            self.exporter.to_csv(schedule, filename)
        elif format == "json":
            self.exporter.to_json(schedule, filename)
        elif format == "text":
            self.exporter.to_text(schedule, filename)
        elif format == "html":
            if shifts is None:
                raise ValueError("shifts parameter is required for HTML export")
            self.exporter.to_html(schedule, filename, shifts)
        else:
            raise ValueError(f"Unknown format: {format}")

    def get_schedule_summary(self, schedule: Schedule) -> dict:
        """Get a summary of the schedule with statistics."""
        return schedule.get_statistics()

    def __repr__(self) -> str:
        return f"ShiftScheduler(employees={len(self.employees)})"
