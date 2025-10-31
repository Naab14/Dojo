"""
Basic usage example for the shift scheduler.
"""

from datetime import date
from shift_scheduler import ShiftScheduler, Employee, Shift

def main():
    # Initialize the scheduler
    scheduler = ShiftScheduler()

    # Add employees
    print("Adding employees...")
    scheduler.add_employee(Employee("John Doe", "john@example.com"))
    scheduler.add_employee(Employee("Jane Smith", "jane@example.com"))
    scheduler.add_employee(Employee("Bob Johnson", "bob@example.com"))
    scheduler.add_employee(Employee("Alice Williams", "alice@example.com"))
    scheduler.add_employee(Employee("Charlie Brown", "charlie@example.com"))

    print(f"Added {len(scheduler.employees)} employees\n")

    # Define shifts
    print("Defining shifts...")
    morning_shift = Shift("Morning", "08:00", "16:00", required_employees=2)
    evening_shift = Shift("Evening", "16:00", "00:00", required_employees=2)
    night_shift = Shift("Night", "00:00", "08:00", required_employees=1)

    shifts = [morning_shift, evening_shift, night_shift]
    print(f"Defined {len(shifts)} shift types\n")

    # Generate schedule for one week
    print("Generating schedule for one week...")
    schedule = scheduler.generate_schedule(
        start_date="2025-11-01",
        end_date="2025-11-07",
        shifts=shifts,
        algorithm="fair_distribution"
    )

    print(f"Schedule generated with {len(schedule.assignments)} assignments\n")

    # Display schedule summary
    print("Schedule Statistics:")
    print("-" * 50)
    stats = scheduler.get_schedule_summary(schedule)
    print(f"Date range: {stats['date_range']}")
    print(f"Total days: {stats['total_days']}")
    print(f"Total assignments: {stats['total_assignments']}")
    print(f"Unique employees: {stats['unique_employees']}")
    print()

    print("Assignments per employee:")
    for emp_id, count in stats['assignments_per_employee'].items():
        employee = scheduler.get_employee(emp_id)
        if employee:
            print(f"  {employee.name}: {count} shifts")
    print()

    print("Assignments per shift type:")
    for shift_name, count in stats['assignments_per_shift'].items():
        print(f"  {shift_name}: {count} assignments")
    print()

    # Validate schedule
    print("Validating schedule...")
    violations = scheduler.validate_schedule(schedule, shifts)
    if violations:
        print(f"Found {len(violations)} violations:")
        for v in violations:
            print(f"  {v}")
    else:
        print("No violations found!")
    print()

    # Export schedule
    print("Exporting schedule...")
    scheduler.export_schedule(schedule, format="csv", filename="schedule")
    scheduler.export_schedule(schedule, format="json", filename="schedule")
    scheduler.export_schedule(schedule, format="text", filename="schedule")
    scheduler.export_schedule(schedule, format="html", filename="schedule", shifts=shifts)

    print("Schedule exported to:")
    print("  - schedule.csv")
    print("  - schedule.json")
    print("  - schedule.text")
    print("  - schedule.html")
    print("\nDone!")


if __name__ == "__main__":
    main()
