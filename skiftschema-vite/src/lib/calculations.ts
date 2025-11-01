import { Shift } from './types';

/**
 * Convert time string (HH:MM) to decimal hours
 */
export function timeToHours(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + minutes / 60;
}

/**
 * Calculate shift duration handling midnight crossing
 * Example: 22:00-06:00 = 8 hours
 */
export function getShiftDuration(
  startTime: string,
  endTime: string,
  shiftId?: number,
  overrides?: Record<number, number>
): number {
  // Check for manual override
  if (shiftId && overrides && overrides[shiftId]) {
    return overrides[shiftId];
  }

  const start = timeToHours(startTime);
  const end = timeToHours(endTime);

  return end > start ? end - start : 24 - start + end;
}

/**
 * Get shifts working on a specific day
 */
export function getShiftsForDay(
  shifts: Shift[],
  _date: Date,
  dayOfWeek: number
): Shift[] {
  const result: Shift[] = [];

  shifts.forEach((shift) => {
    for (let team = 0; team < shift.numTeams; team++) {
      const weekIdx = team % shift.rotationWeeks;
      const pattern = shift.weekPatterns[weekIdx] || [];

      if (pattern.includes(dayOfWeek)) {
        result.push(shift);
        break; // Only add shift once even if multiple teams work
      }
    }
  });

  return result;
}

/**
 * Calculate total coverage hours for a day
 */
export function calculateDayCoverage(
  shiftsForDay: Shift[],
  shiftHoursOverride?: Record<number, number>
): number {
  let totalHours = 0;

  shiftsForDay.forEach((shift) => {
    const hours = getShiftDuration(shift.startTime, shift.endTime, shift.id, shiftHoursOverride);
    totalHours += hours;
  });

  return totalHours;
}

/**
 * Get required coverage based on day of week
 */
export function getRequiredCoverage(
  dayOfWeek: number,
  settings: { coverageMF: number; coverageSat: number; coverageSun: number }
): number {
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return settings.coverageMF;
  } else if (dayOfWeek === 6) {
    return settings.coverageSat;
  } else {
    return settings.coverageSun;
  }
}

/**
 * Calculate total FTE used across all shifts
 */
export function calculateTotalFTE(shifts: Shift[]): number {
  return shifts.reduce((sum, shift) => sum + shift.fte * shift.numTeams, 0);
}

/**
 * Calculate FTE utilization percentage
 */
export function calculateUtilization(totalFTEUsed: number, totalFTEBudget: number): number {
  return totalFTEBudget > 0 ? (totalFTEUsed / totalFTEBudget) * 100 : 0;
}

/**
 * Calculate total annual cost
 */
export function calculateAnnualCost(totalFTEUsed: number, fteCost: number): number {
  return totalFTEUsed * fteCost;
}

/**
 * Calculate working hours for a period
 */
export function calculatePeriodHours(
  shifts: Shift[],
  startDate: Date,
  endDate: Date,
  shiftHoursOverride?: Record<number, number>
): number {
  let totalHours = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const shiftsForDay = getShiftsForDay(shifts, currentDate, dayOfWeek);

    shiftsForDay.forEach((shift) => {
      const hours = getShiftDuration(shift.startTime, shift.endTime, shift.id, shiftHoursOverride);
      totalHours += hours * shift.fte;
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return totalHours;
}

/**
 * Get coverage status (good/partial/poor)
 */
export function getCoverageStatus(
  coverage: number,
  required: number
): 'good' | 'partial' | 'poor' {
  if (coverage >= required) return 'good';
  if (coverage >= required * 0.8) return 'partial';
  return 'poor';
}

/**
 * Format number with locale
 */
export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals);
}

/**
 * Format currency (SEK)
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}k`;
  }
  return amount.toFixed(0);
}

/**
 * Get start of week (Monday)
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get end of week (Sunday)
 */
export function getEndOfWeek(date: Date): Date {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return endOfWeek;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
