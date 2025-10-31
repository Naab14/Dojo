"""
Advanced usage example demonstrating constraint handling and customization.
"""

from datetime import date, timedelta
from shift_scheduler import ShiftScheduler, Employee, Shift

def main():
    # Initialize scheduler with custom constraints
    scheduler = ShiftScheduler(min_hours_between_shifts=14)

    # Add employees with custom settings
    print("Adding employees with custom constraints...")

    # Employee who prefers morning shifts
    john = Employee("John Doe", "john@example.com", max_shifts_per_week=5)
    john.add_preferred_shift("Morning")
    scheduler.add_employee(john)

    # Employee with limited availability
    jane = Employee("Jane Smith", "jane@example.com", max_shifts_per_week=4)
    jane.add_unavailable_date(date(2025, 11, 3))  # Nov 3 unavailable
    jane.add_unavailable_date(date(2025, 11, 4))  # Nov 4 unavailable
    jane.add_preferred_shift("Evening")
    scheduler.add_employee(jane)

    # Part-time employee
    bob = Employee("Bob Johnson", "bob@example.com", max_shifts_per_week=3)
    bob.add_preferred_shift("Night")
    scheduler.add_employee(bob)

    # Full-time employees
    scheduler.add_employee(Employee("Alice Williams", "alice@example.com"))
    scheduler.add_employee(Employee("Charlie Brown", "charlie@example.com"))
    scheduler.add_employee(Employee("Diana Prince", "diana@example.com"))
    scheduler.add_employee(Employee("Eve Anderson", "eve@example.com"))

    print(f"Added {len(scheduler.employees)} employees")
    print()

    # Define multiple shift types
    print("Defining shift types...")
    shifts = [
        Shift("Early Morning", "06:00", "14:00", required_employees=2,
              description="Early bird shift for morning people"),
        Shift("Day Shift", "09:00", "17:00", required_employees=3,
              description="Standard day shift"),
        Shift("Evening", "14:00", "22:00", required_employees=2,
              description="Evening shift"),
        Shift("Night", "22:00", "06:00", required_employees=1,
              description="Overnight shift with premium pay"),
    ]

    for shift in shifts:
        print(f"  - {shift.name}: {shift.start_time.strftime('%H:%M')} to "
              f"{shift.end_time.strftime('%H:%M')} ({shift.get_duration_hours():.1f} hours)")
    print()

    # Generate schedule for two weeks
    print("Generating schedule for two weeks...")
    schedule = scheduler.generate_schedule(
        start_date="2025-11-01",
        end_date="2025-11-14",
        shifts=shifts,
        algorithm="fair_distribution"
    )

    print(f"Generated {len(schedule.assignments)} assignments")
    print()

    # Analyze employee workload
    print("Employee Workload Analysis:")
    print("-" * 70)
    print(f"{'Employee':<25} {'Shifts':<10} {'Avg/Week':<15}")
    print("-" * 70)

    for employee in scheduler.employees:
        assignments = schedule.get_assignments_by_employee(employee)
        total_shifts = len(assignments)
        avg_per_week = total_shifts / 2  # 2 weeks

        # Check for violations
        violations = []
        for assignment in assignments:
            v = scheduler.constraint_checker.check_all_constraints(
                employee, assignment.shift, assignment.date, schedule
            )
            violations.extend([x for x in v if x.severity == "error"])

        status = "⚠️" if violations else "✓"
        print(f"{employee.name:<25} {total_shifts:<10} {avg_per_week:<15.1f} {status}")

    print()

    # Check shift coverage
    print("Shift Coverage Analysis:")
    print("-" * 70)

    current_date = schedule.start_date
    uncovered_days = []

    while current_date <= schedule.end_date:
        day_name = current_date.strftime("%a %Y-%m-%d")
        day_assignments = schedule.get_assignments_by_date(current_date)

        coverage_ok = True
        for shift in shifts:
            coverage = schedule.get_shift_coverage(shift, current_date)
            if coverage < shift.required_employees:
                coverage_ok = False
                print(f"{day_name} - {shift.name}: {coverage}/{shift.required_employees} employees ⚠️")

        if not coverage_ok:
            uncovered_days.append(current_date)

        current_date += timedelta(days=1)

    if not uncovered_days:
        print("All shifts are adequately covered! ✓")
    print()

    # Validate entire schedule
    print("Running comprehensive validation...")
    violations = scheduler.validate_schedule(schedule, shifts)

    if violations:
        print(f"\nFound {len(violations)} potential issues:")
        for v in violations[:10]:  # Show first 10
            print(f"  [{v.severity.upper()}] {v.message}")
        if len(violations) > 10:
            print(f"  ... and {len(violations) - 10} more")
    else:
        print("Schedule passes all validation checks! ✓")
    print()

    # Display schedule statistics
    print("Schedule Statistics:")
    print("-" * 70)
    stats = scheduler.get_schedule_summary(schedule)

    print(f"Period: {stats['date_range']}")
    print(f"Total days: {stats['total_days']}")
    print(f"Total assignments: {stats['total_assignments']}")
    print(f"Unique employees: {stats['unique_employees']}")
    print(f"Average assignments per employee: {stats['total_assignments'] / stats['unique_employees']:.1f}")
    print()

    # Export in multiple formats
    print("Exporting schedule in multiple formats...")
    scheduler.export_schedule(schedule, format="csv", filename="advanced_schedule")
    scheduler.export_schedule(schedule, format="json", filename="advanced_schedule")
    scheduler.export_schedule(schedule, format="html", filename="advanced_schedule", shifts=shifts)

    print("Exported to:")
    print("  - advanced_schedule.csv")
    print("  - advanced_schedule.json")
    print("  - advanced_schedule.html")
    print()

    # Demonstrate manual schedule manipulation
    print("Demonstrating manual schedule adjustment...")
    print("Attempting to add a manual assignment...")

    # Try to manually add an assignment
    test_employee = scheduler.employees[0]
    test_shift = shifts[0]
    test_date = date(2025, 11, 15)

    # Check if it would violate constraints
    violations = scheduler.constraint_checker.check_all_constraints(
        test_employee, test_shift, test_date, schedule
    )

    if any(v.severity == "error" for v in violations):
        print(f"Cannot add assignment due to constraints:")
        for v in violations:
            if v.severity == "error":
                print(f"  - {v.message}")
    else:
        print(f"Assignment would be valid (no constraint violations)")

    print("\nDone!")


if __name__ == "__main__":
    main()
