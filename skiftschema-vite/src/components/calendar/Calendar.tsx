import { CalendarDay } from './CalendarDay';
import { useUIStore } from '@/stores/useUIStore';
import { MONTHS, WEEKDAYS } from '@/lib/constants';

export function Calendar() {
  const { currentYear, currentMonth } = useUIStore();

  // Calculate calendar grid (42 days, 6 weeks)
  const firstDay = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = firstDay.getDay();
  const daysToMonday = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - daysToMonday);

  const days = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-center mb-4 text-gray-900">
        {MONTHS[currentMonth]} {currentYear}
      </h2>

      {/* Weekday headers */}
      <div className="calendar-grid mb-0">
        {WEEKDAYS.map((day) => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((date, index) => (
          <CalendarDay
            key={`${date.toISOString()}-${index}`}
            date={date}
            isCurrentMonth={date.getMonth() === currentMonth}
          />
        ))}
      </div>
    </div>
  );
}
