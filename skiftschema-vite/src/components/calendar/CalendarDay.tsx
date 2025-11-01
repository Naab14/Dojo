import { motion } from 'framer-motion';
import { useShiftStore } from '@/stores/useShiftStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import {
  getShiftsForDay,
  calculateDayCoverage,
  getRequiredCoverage,
  getCoverageStatus,
  isToday,
} from '@/lib/calculations';
import { clsx } from 'clsx';

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
}

export function CalendarDay({ date, isCurrentMonth }: CalendarDayProps) {
  const { shifts, shiftHoursOverride } = useShiftStore();
  const settings = useSettingsStore();

  const dayOfWeek = date.getDay();
  const shiftsForDay = getShiftsForDay(shifts, date, dayOfWeek);
  const coverage = calculateDayCoverage(shiftsForDay, shiftHoursOverride);
  const required = getRequiredCoverage(dayOfWeek, settings);
  const status = getCoverageStatus(coverage, required);

  const totalFTE = shiftsForDay.reduce((sum, s) => sum + s.fte, 0);

  return (
    <motion.div
      whileHover={{
        backgroundColor: '#f5f5f5',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
      transition={{ duration: 0.15 }}
      className={clsx(
        'calendar-day',
        !isCurrentMonth && 'other-month',
        isToday(date) && 'today'
      )}
    >
      {/* Day number + coverage indicator */}
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-sm">{date.getDate()}</span>
        <span
          className={clsx('coverage-indicator', `coverage-${status}`)}
          title={`Täckning: ${coverage.toFixed(1)}/${required}h`}
        />
      </div>

      {/* Shift bars */}
      <div className="space-y-1">
        {shiftsForDay.slice(0, 3).map((shift) => (
          <div
            key={`${shift.id}-${date.toISOString()}`}
            className={clsx(
              'text-xs px-1 py-0.5 rounded border font-medium truncate',
              `shift-color-${shift.color}`
            )}
            title={`${shift.name} ${shift.startTime}-${shift.endTime}`}
          >
            {shift.name}
          </div>
        ))}
        {shiftsForDay.length > 3 && (
          <div className="text-xs text-gray-500 px-1">
            +{shiftsForDay.length - 3} fler
          </div>
        )}
      </div>

      {/* Day summary */}
      {totalFTE > 0 && (
        <div className="day-summary mt-auto">
          {totalFTE.toFixed(1)} FTE • {coverage.toFixed(1)}h
        </div>
      )}
    </motion.div>
  );
}
