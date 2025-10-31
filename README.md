# Shift Schedule Tool

A flexible and easy-to-use shift scheduling tool for managing employee work schedules.

## Features

- **Employee Management**: Add, remove, and manage employee information
- **Shift Creation**: Define various shift types (morning, evening, night, etc.)
- **Schedule Generation**: Create weekly or monthly schedules
- **Conflict Detection**: Automatically detect scheduling conflicts
- **Availability Management**: Track employee availability and time-off requests
- **Export Options**: Export schedules to CSV, JSON, or text formats
- **Fair Distribution**: Ensure equitable distribution of shifts among employees

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Setup

1. Clone this repository:
```bash
git clone <repository-url>
cd Dojo
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Example

```python
from shift_scheduler import ShiftScheduler, Employee, Shift

# Initialize the scheduler
scheduler = ShiftScheduler()

# Add employees
scheduler.add_employee(Employee("John Doe", "john@example.com"))
scheduler.add_employee(Employee("Jane Smith", "jane@example.com"))
scheduler.add_employee(Employee("Bob Johnson", "bob@example.com"))

# Define shifts
morning_shift = Shift("Morning", "08:00", "16:00")
evening_shift = Shift("Evening", "16:00", "00:00")
night_shift = Shift("Night", "00:00", "08:00")

# Generate schedule for a week
schedule = scheduler.generate_schedule(
    start_date="2025-11-01",
    end_date="2025-11-07",
    shifts=[morning_shift, evening_shift, night_shift]
)

# Export schedule
scheduler.export_schedule(schedule, format="csv", filename="schedule.csv")
```

### Command Line Interface

```bash
# Create a new schedule
python -m shift_scheduler create --start 2025-11-01 --end 2025-11-07

# Add an employee
python -m shift_scheduler add-employee --name "John Doe" --email "john@example.com"

# View current schedule
python -m shift_scheduler view

# Export schedule
python -m shift_scheduler export --format csv --output schedule.csv
```

## Configuration

Create a `config.json` file to customize scheduler behavior:

```json
{
  "min_hours_between_shifts": 12,
  "max_shifts_per_week": 5,
  "max_consecutive_days": 6,
  "prefer_consistent_shifts": true,
  "shift_types": [
    {"name": "Morning", "start": "08:00", "end": "16:00"},
    {"name": "Evening", "start": "16:00", "end": "00:00"},
    {"name": "Night", "start": "00:00", "end": "08:00"}
  ]
}
```

## Project Structure

```
Dojo/
├── README.md
├── requirements.txt
├── setup.py
├── config.json.example
├── shift_scheduler/
│   ├── __init__.py
│   ├── scheduler.py
│   ├── employee.py
│   ├── shift.py
│   ├── schedule.py
│   ├── constraints.py
│   └── exporters.py
├── tests/
│   ├── __init__.py
│   ├── test_scheduler.py
│   ├── test_employee.py
│   └── test_shift.py
└── examples/
    ├── basic_usage.py
    └── advanced_usage.py
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
