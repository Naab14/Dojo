"""
Export module for generating schedule reports in various formats.
"""

import csv
import json
from datetime import date
from typing import List
from .schedule import Schedule
from .shift import Shift


class ScheduleExporter:
    """Export schedules to various formats."""

    @staticmethod
    def to_csv(schedule: Schedule, filename: str) -> None:
        """
        Export schedule to CSV format.

        Args:
            schedule: The schedule to export
            filename: Output filename
        """
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)

            # Header
            writer.writerow([
                'Date',
                'Day of Week',
                'Employee ID',
                'Employee Name',
                'Shift Name',
                'Start Time',
                'End Time',
                'Duration (hours)'
            ])

            # Sort assignments by date
            sorted_assignments = sorted(schedule.assignments, key=lambda a: a.date)

            for assignment in sorted_assignments:
                writer.writerow([
                    assignment.date.isoformat(),
                    assignment.date.strftime('%A'),
                    assignment.employee.employee_id,
                    assignment.employee.name,
                    assignment.shift.name,
                    assignment.shift.start_time.strftime('%H:%M'),
                    assignment.shift.end_time.strftime('%H:%M'),
                    assignment.shift.get_duration_hours()
                ])

    @staticmethod
    def to_json(schedule: Schedule, filename: str) -> None:
        """
        Export schedule to JSON format.

        Args:
            schedule: The schedule to export
            filename: Output filename
        """
        with open(filename, 'w', encoding='utf-8') as jsonfile:
            json.dump(schedule.to_dict(), jsonfile, indent=2, ensure_ascii=False)

    @staticmethod
    def to_text(schedule: Schedule, filename: str) -> None:
        """
        Export schedule to human-readable text format.

        Args:
            schedule: The schedule to export
            filename: Output filename
        """
        from datetime import timedelta
        from collections import defaultdict

        with open(filename, 'w', encoding='utf-8') as textfile:
            textfile.write(f"SHIFT SCHEDULE\n")
            textfile.write(f"{'=' * 60}\n")
            textfile.write(f"Period: {schedule.start_date} to {schedule.end_date}\n")
            textfile.write(f"Total Assignments: {len(schedule.assignments)}\n")
            textfile.write(f"\n")

            # Group by date
            assignments_by_date = defaultdict(list)
            for assignment in schedule.assignments:
                assignments_by_date[assignment.date].append(assignment)

            # Print schedule day by day
            current_date = schedule.start_date
            while current_date <= schedule.end_date:
                day_name = current_date.strftime('%A')
                textfile.write(f"\n{current_date} ({day_name})\n")
                textfile.write(f"{'-' * 60}\n")

                if current_date in assignments_by_date:
                    for assignment in sorted(
                        assignments_by_date[current_date],
                        key=lambda a: a.shift.start_time
                    ):
                        textfile.write(
                            f"  {assignment.shift.start_time.strftime('%H:%M')} - "
                            f"{assignment.shift.end_time.strftime('%H:%M')} "
                            f"{assignment.shift.name:20} → {assignment.employee.name}\n"
                        )
                else:
                    textfile.write("  (No shifts scheduled)\n")

                current_date += timedelta(days=1)

            # Summary statistics
            textfile.write(f"\n{'=' * 60}\n")
            textfile.write("SUMMARY STATISTICS\n")
            textfile.write(f"{'=' * 60}\n")

            stats = schedule.get_statistics()
            textfile.write(f"Total days: {stats['total_days']}\n")
            textfile.write(f"Total assignments: {stats['total_assignments']}\n")
            textfile.write(f"Unique employees: {stats['unique_employees']}\n")
            textfile.write(f"\nAssignments per employee:\n")
            for emp_id, count in stats['assignments_per_employee'].items():
                textfile.write(f"  {emp_id}: {count} shifts\n")

    @staticmethod
    def to_html(schedule: Schedule, filename: str, shifts: List[Shift]) -> None:
        """
        Export schedule to HTML format with visual calendar.

        Args:
            schedule: The schedule to export
            filename: Output filename
            shifts: List of all shift types for reference
        """
        from datetime import timedelta
        from collections import defaultdict

        # Group assignments by date
        assignments_by_date = defaultdict(list)
        for assignment in schedule.assignments:
            assignments_by_date[assignment.date].append(assignment)

        html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shift Schedule</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .day-card {
            background-color: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .day-header {
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        .shift {
            background-color: #ecf0f1;
            padding: 10px;
            margin: 5px 0;
            border-radius: 4px;
            border-left: 4px solid #3498db;
        }
        .shift-time {
            font-weight: bold;
            color: #2980b9;
        }
        .employee-name {
            color: #27ae60;
            font-weight: 500;
        }
        .stats {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .stat-item {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Shift Schedule</h1>
        <p>Period: """ + f"{schedule.start_date} to {schedule.end_date}" + """</p>
    </div>
"""

        # Generate day cards
        current_date = schedule.start_date
        while current_date <= schedule.end_date:
            day_name = current_date.strftime('%A, %B %d, %Y')
            html += f'    <div class="day-card">\n'
            html += f'        <div class="day-header">{day_name}</div>\n'

            if current_date in assignments_by_date:
                for assignment in sorted(
                    assignments_by_date[current_date],
                    key=lambda a: a.shift.start_time
                ):
                    html += '        <div class="shift">\n'
                    html += f'            <span class="shift-time">'
                    html += f'{assignment.shift.start_time.strftime("%H:%M")} - '
                    html += f'{assignment.shift.end_time.strftime("%H:%M")}</span> '
                    html += f'{assignment.shift.name} → '
                    html += f'<span class="employee-name">{assignment.employee.name}</span>\n'
                    html += '        </div>\n'
            else:
                html += '        <p>No shifts scheduled</p>\n'

            html += '    </div>\n'
            current_date += timedelta(days=1)

        # Add statistics
        stats = schedule.get_statistics()
        html += '    <div class="stats">\n'
        html += '        <h2>Statistics</h2>\n'
        html += f'        <div class="stat-item"><strong>Total days:</strong> {stats["total_days"]}</div>\n'
        html += f'        <div class="stat-item"><strong>Total assignments:</strong> {stats["total_assignments"]}</div>\n'
        html += f'        <div class="stat-item"><strong>Unique employees:</strong> {stats["unique_employees"]}</div>\n'
        html += '    </div>\n'

        html += """
</body>
</html>
"""

        with open(filename, 'w', encoding='utf-8') as htmlfile:
            htmlfile.write(html)
