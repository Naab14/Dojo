# Implementation Checklist

Complete the Skiftschema Analysator by building the remaining components. Follow this step-by-step guide.

---

## ✅ Already Implemented

- [x] Project configuration (Vite, TypeScript, Tailwind)
- [x] State management (3 Zustand stores)
- [x] Business logic (calculations.ts)
- [x] UI primitives (Button, Card, Input, Select, Modal, Toast)
- [x] localStorage persistence hook
- [x] Type definitions and constants
- [x] Main App structure

---

## 📋 Components to Build

### **Priority 1: Core Features (2-3 hours)**

#### 1. KPICard.tsx ⏱️ 20 min
**File:** `src/components/cards/KPICard.tsx`

Shows FTE, Utilization %, and Cost.

```tsx
import { Card } from '@/components/ui/Card';
import { useShiftStore } from '@/stores/useShiftStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { calculateTotalFTE, calculateUtilization, formatCurrency } from '@/lib/calculations';

export function KPICard() {
  const { shifts } = useShiftStore();
  const { totalFTE, fteCost } = useSettingsStore();

  const totalFTEUsed = calculateTotalFTE(shifts);
  const utilization = calculateUtilization(totalFTEUsed, totalFTE);
  const totalCost = totalFTEUsed * fteCost;

  return (
    <Card title="Översikt" collapsible defaultOpen>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">FTE:</span>
          <span className="text-gray-900 font-bold">
            {totalFTEUsed.toFixed(1)}/{totalFTE}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Utnyttjande:</span>
          <span className="font-bold text-gray-900">{utilization.toFixed(0)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Kostnad:</span>
          <span className="font-bold text-gray-900">{formatCurrency(totalCost)}</span>
        </div>
      </div>
    </Card>
  );
}
```

---

#### 2. SettingsCard.tsx ⏱️ 30 min
**File:** `src/components/cards/SettingsCard.tsx`

Form inputs for FTE budget, cost, and hours per day.

```tsx
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function SettingsCard() {
  const settings = useSettingsStore();

  return (
    <Card title="Inställningar" collapsible defaultOpen>
      <div className="space-y-3">
        <Input
          label="FTE Budget"
          type="number"
          value={settings.totalFTE}
          onChange={(e) =>
            settings.updateSettings({ totalFTE: Number(e.target.value) })
          }
          min={1}
          max={200}
        />

        <Input
          label="Kostnad/år (SEK)"
          type="number"
          value={settings.fteCost}
          onChange={(e) =>
            settings.updateSettings({ fteCost: Number(e.target.value) })
          }
          min={300000}
          max={2000000}
          step={10000}
          helpText="Snitt: 650k SEK"
        />

        <Input
          label="Timmar per arbetsdag"
          type="number"
          value={settings.hoursPerDay}
          onChange={(e) =>
            settings.updateSettings({ hoursPerDay: Number(e.target.value) })
          }
          min={1}
          max={24}
          step={0.5}
          helpText="Standard: 8h/dag"
        />
      </div>
    </Card>
  );
}
```

---

#### 3. CoverageCard.tsx ⏱️ 15 min
**File:** `src/components/cards/CoverageCard.tsx`

Required hours per day type.

```tsx
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function CoverageCard() {
  const settings = useSettingsStore();

  return (
    <Card title="Täckning (h/dag)" collapsible defaultOpen>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-medium">Mån-Fre</span>
          <Input
            type="number"
            value={settings.coverageMF}
            onChange={(e) =>
              settings.updateSettings({ coverageMF: Number(e.target.value) })
            }
            min={0}
            max={24}
            className="w-20 text-center"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-medium">Lördag</span>
          <Input
            type="number"
            value={settings.coverageSat}
            onChange={(e) =>
              settings.updateSettings({ coverageSat: Number(e.target.value) })
            }
            min={0}
            max={24}
            className="w-20 text-center"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-medium">Söndag</span>
          <Input
            type="number"
            value={settings.coverageSun}
            onChange={(e) =>
              settings.updateSettings({ coverageSun: Number(e.target.value) })
            }
            min={0}
            max={24}
            className="w-20 text-center"
          />
        </div>
      </div>
    </Card>
  );
}
```

---

#### 4. Calendar.tsx + CalendarDay.tsx ⏱️ 60 min
**Files:**
- `src/components/calendar/Calendar.tsx`
- `src/components/calendar/CalendarDay.tsx`

See README.md for full implementation.

**Test with:** Add a test shift to see it render.

---

### **Priority 2: Shift Management (1-2 hours)**

#### 5. ShiftsCard.tsx ⏱️ 30 min
**File:** `src/components/cards/ShiftsCard.tsx`

List all shifts with filter and delete button.

```tsx
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useShiftStore } from '@/stores/useShiftStore';
import { useUIStore } from '@/stores/useUIStore';
import { getShiftDuration } from '@/lib/calculations';
import { Trash2 } from 'lucide-react';

export function ShiftsCard() {
  const { shifts, deleteShift, shiftHoursOverride } = useShiftStore();
  const { openWizard, shiftFilter, setShiftFilter, addToast } = useUIStore();

  const filteredShifts = shifts.filter((shift) => {
    if (shiftFilter === 'all') return true;
    const startHour = parseInt(shift.startTime.split(':')[0]);
    if (shiftFilter === 'dag') return startHour >= 6 && startHour < 14;
    if (shiftFilter === 'kvall') return startHour >= 14 && startHour < 22;
    if (shiftFilter === 'natt') return startHour >= 22 || startHour < 6;
    return true;
  });

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Ta bort "${name}"?`)) {
      deleteShift(id);
      addToast('Skift borttaget', 'success');
    }
  };

  return (
    <Card title="Aktiva Skift" collapsible defaultOpen>
      <div className="space-y-3">
        <Select
          options={[
            { value: 'all', label: 'Alla skift' },
            { value: 'dag', label: 'Dag (06:00-18:00)' },
            { value: 'kvall', label: 'Kväll (14:00-23:00)' },
            { value: 'natt', label: 'Natt (22:00-08:00)' },
          ]}
          value={shiftFilter}
          onChange={(e) => setShiftFilter(e.target.value as any)}
        />

        <div className="space-y-2">
          {filteredShifts.map((shift) => {
            const hours = getShiftDuration(
              shift.startTime,
              shift.endTime,
              shift.id,
              shiftHoursOverride
            );

            return (
              <motion.div
                key={shift.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => openWizard(shift.id)}
                className="p-2 bg-gray-50 rounded border border-gray-300 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded shift-color-${shift.color}`}
                    />
                    <span className="text-gray-900 font-medium">
                      {shift.name}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(shift.id, shift.name);
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-gray-600 text-sm mt-1">
                  {shift.startTime}-{shift.endTime}{' '}
                  <span className="font-semibold">({hours.toFixed(1)}h)</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <Button
          onClick={() => openWizard()}
          className="w-full"
        >
          Lägg till skift
        </Button>
      </div>
    </Card>
  );
}
```

---

#### 6. ShiftWizard.tsx ⏱️ 90 min
**Files:**
- `src/components/wizard/ShiftWizard.tsx`
- `src/components/wizard/WizardStep1.tsx`
- `src/components/wizard/WizardStep2.tsx`
- `src/components/wizard/WizardStep3.tsx`

Multi-step wizard for creating/editing shifts. See original HTML version for business logic.

---

### **Priority 3: Analytics (1-2 hours)**

#### 7. WorkingHoursCard.tsx ⏱️ 30 min

Calculate weekly, monthly, yearly totals.

```tsx
import { Card } from '@/components/ui/Card';
import { useShiftStore } from '@/stores/useShiftStore';
import { useUIStore } from '@/stores/useUIStore';
import { calculatePeriodHours, getStartOfWeek, getEndOfWeek } from '@/lib/calculations';

export function WorkingHoursCard() {
  const { shifts, shiftHoursOverride } = useShiftStore();
  const { currentYear, currentMonth } = useUIStore();

  // Weekly hours
  const now = new Date(currentYear, currentMonth, 1);
  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = getEndOfWeek(now);
  const weekHours = calculatePeriodHours(shifts, startOfWeek, endOfWeek, shiftHoursOverride);

  // Monthly hours
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const monthHours = calculatePeriodHours(shifts, startOfMonth, endOfMonth, shiftHoursOverride);

  // Yearly hours
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);
  const yearHours = calculatePeriodHours(shifts, startOfYear, endOfYear, shiftHoursOverride);

  return (
    <Card title="Arbetstid Sammanfattning" collapsible defaultOpen>
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-600">Denna Vecka:</span>
          <span className="text-lg font-bold text-gray-900">{weekHours.toFixed(0)}h</span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-600">Denna Månad:</span>
          <span className="text-lg font-bold text-gray-900">{monthHours.toFixed(0)}h</span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-600">År {currentYear}:</span>
          <span className="text-lg font-bold text-gray-900">{yearHours.toFixed(0)}h</span>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Timmar räknas per skift × FTE
        </p>
      </div>
    </Card>
  );
}
```

---

#### 8. StatisticsCard.tsx ⏱️ 60 min

Chart.js integration with dropdown filters.

**Import Chart.js:**

```tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);
```

See README.md for full implementation.

---

#### 9. YearlyOverviewCard.tsx ⏱️ 30 min

12-month summary table with totals.

---

### **Priority 4: Layout & Polish (30 min)**

#### 10. Header Component ⏱️ 15 min

Extract header into reusable component with year selector and buttons.

#### 11. Sidebar Component ⏱️ 15 min

Group all cards into collapsible sidebar for mobile.

---

## 🔍 Testing Checklist

- [ ] **KPI Card** shows correct FTE, utilization, cost
- [ ] **Settings** updates persist to localStorage
- [ ] **Coverage** inputs validate min/max
- [ ] **Shifts** list filters work (All/Dag/Kväll/Natt)
- [ ] **Shifts** delete confirmation works
- [ ] **Calendar** renders 42 days correctly
- [ ] **Calendar** highlights today's date
- [ ] **Calendar** shows shift bars with correct colors
- [ ] **Calendar** coverage indicators (●/◐/○) work
- [ ] **Wizard** step navigation works
- [ ] **Wizard** calculates midnight-crossing shifts (22:00-06:00 = 8h)
- [ ] **Wizard** manual hours override saves
- [ ] **Statistics** chart updates when metric/period changes
- [ ] **Yearly Overview** table shows correct totals
- [ ] **Toast** notifications auto-dismiss after 4 seconds
- [ ] **Mobile** layout stacks vertically
- [ ] **Keyboard navigation** works (Tab, Enter, Escape)
- [ ] **Hover animations** are smooth (not janky)

---

## 🚀 Deployment Steps

1. **Test locally:**
   ```bash
   npm run dev
   ```

2. **Build production:**
   ```bash
   npm run build
   ```

3. **Preview build:**
   ```bash
   npm run preview
   ```

4. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

---

## 📊 Estimated Timeline

| Task | Time | Priority |
|------|------|----------|
| KPI, Settings, Coverage Cards | 1h | HIGH |
| Calendar + CalendarDay | 1h | HIGH |
| ShiftsCard | 30min | HIGH |
| WorkingHoursCard | 30min | MEDIUM |
| ShiftWizard (3 steps) | 2h | HIGH |
| StatisticsCard (Chart.js) | 1h | MEDIUM |
| YearlyOverviewCard | 30min | LOW |
| Header + Sidebar layout | 30min | LOW |
| Testing + Bug fixes | 1h | HIGH |
| **TOTAL** | **7-8 hours** | |

---

## 💡 Pro Tips

1. **Start with KPI + Settings + Coverage** - These are quick wins that show immediate value.

2. **Build Calendar next** - The visual impact motivates further development.

3. **Wizard can wait** - Use placeholder test shifts initially.

4. **Test on mobile early** - Resize browser to 375px width frequently.

5. **Use React DevTools** - Install browser extension to debug state.

6. **Hot reload is your friend** - Vite HMR makes iteration fast.

7. **Copy-paste from original HTML** - Business logic is already proven.

---

## 🆘 Getting Help

- **TypeScript errors:** Check `@/` import alias is working
- **Styles not applying:** Restart dev server after Tailwind changes
- **State not updating:** Check you're using Zustand's `set()` correctly
- **Animations laggy:** Use `React.memo()` on expensive components
- **Chart not rendering:** Ensure Chart.js components are registered

---

**Ready to build? Start with Priority 1 components! 🚀**
