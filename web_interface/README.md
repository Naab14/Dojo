# Web Interface - Skiftschema Analysator Pro

This is a visual, calendar-based shift scheduling tool with drag-and-drop editing capabilities.

## Features

- **Visual Calendar View**: 24-hour calendar grid showing all shifts across the week
- **Shift Builder**: Create and customize shift templates with rotation patterns
- **FTE Budget Tracking**: Monitor full-time equivalent usage and costs
- **Coverage Analysis**: Track shift coverage requirements and gaps
- **Compliance Checking**: Validate schedules against EU/Swedish work regulations
- **Multiple Export Options**: Save to localStorage or export to CSV
- **Real-time Calculations**: Instant feedback on FTE utilization and costs

## Usage

Simply open `index.html` in a modern web browser. No server or installation required!

### Quick Start

1. Open `index.html` in your browser
2. Use the default example shifts or click "Lägg till nytt skift" to create new ones
3. Configure your process settings (FTE budget, costs, coverage requirements)
4. View analytics and compliance checks
5. Save your work locally or export to CSV

### Key Sections

**Processinställningar (Process Settings)**
- Set process name, total FTE budget, and currency

**Kostnad & Frånvaro (Cost & Absence)**
- Configure annual FTE cost
- Account for vacation, holidays, and sick days

**Skiftmallar (Shift Templates)**
- Create shifts with specific times and rotation patterns
- Support for multi-team rotations
- Assign FTE requirements per shift

**Täckningskrav (Coverage Requirements)**
- Set required coverage hours for weekdays, Saturday, and Sunday

### Advanced Features

**Rotation Patterns**
- Create rotating shift schedules with multiple weeks
- Assign different patterns to different teams
- Support for DuPont, Pitman, and other patterns

**Analytics**
- Real-time KPI tracking (FTE usage, utilization, coverage)
- Coverage analysis by day of week
- Compliance checking against Swedish/EU norms
- Cost calculations and comparisons

## Browser Compatibility

Works best in modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Data Storage

All data is stored locally in your browser's localStorage. No server-side storage or accounts needed.

## Integration with Python Backend

This web interface can work standalone or alongside the Python backend (`shift_scheduler` package). The Python backend provides:

- API for generating schedules programmatically
- Advanced constraint checking
- Multiple export formats (CSV, JSON, HTML, text)
- Automated schedule optimization algorithms

For Python integration, see the main repository README.
