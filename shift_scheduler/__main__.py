"""
Command-line interface for the shift scheduler.
"""

import sys
import json
from datetime import date

def main():
    """Main CLI entry point."""
    print("Shift Scheduler CLI")
    print("=" * 50)
    print()

    if len(sys.argv) < 2:
        print_usage()
        return

    command = sys.argv[1]

    if command == "version":
        from . import __version__
        print(f"Version: {__version__}")
    elif command == "help":
        print_usage()
    elif command == "example":
        run_example()
    else:
        print(f"Unknown command: {command}")
        print_usage()

def print_usage():
    """Print usage information."""
    print("Usage:")
    print("  python -m shift_scheduler <command>")
    print()
    print("Commands:")
    print("  version   - Show version information")
    print("  help      - Show this help message")
    print("  example   - Run a quick example")
    print()
    print("For more advanced usage, see the examples/ directory")
    print("or use the Python API directly.")

def run_example():
    """Run a quick example."""
    from .scheduler import ShiftScheduler
    from .employee import Employee
    from .shift import Shift

    print("Running quick example...")
    print()

    # Create scheduler
    scheduler = ShiftScheduler()

    # Add employees
    scheduler.add_employee(Employee("Alice", "alice@example.com"))
    scheduler.add_employee(Employee("Bob", "bob@example.com"))
    scheduler.add_employee(Employee("Charlie", "charlie@example.com"))

    # Define shifts
    morning = Shift("Morning", "08:00", "16:00", required_employees=1)
    evening = Shift("Evening", "16:00", "00:00", required_employees=1)
    shifts = [morning, evening]

    # Generate schedule
    schedule = scheduler.generate_schedule(
        start_date="2025-11-01",
        end_date="2025-11-03",
        shifts=shifts
    )

    # Display
    print(f"Generated schedule with {len(schedule.assignments)} assignments:")
    print()

    for assignment in sorted(schedule.assignments, key=lambda a: (a.date, a.shift.start_time)):
        print(f"  {assignment.date} | {assignment.shift.name:10} | {assignment.employee.name}")

    print()
    print("Done! See examples/ directory for more advanced usage.")

if __name__ == "__main__":
    main()
