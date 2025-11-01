# Skiftschema Analysator - Vite + React Version

Modern shift planning and analysis dashboard for pharmaceutical manufacturing, built with **Vite**, **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

The app will open at `http://localhost:3000`

## 🌐 Deployment

Deploy to GitHub Pages with one command:

```bash
npm run deploy
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

**Live Demo:** Coming soon at `https://naab14.github.io/Dojo/`

---

## 📁 Project Structure

```
skiftschema-vite/
├── src/
│   ├── components/
│   │   ├── ui/                 # ✅ UI primitives (Button, Card, Input, Select, Modal, Toast)
│   │   ├── layout/             # ⏳ Header, Sidebar components
│   │   ├── cards/              # ⏳ Feature cards (KPI, Settings, Shifts, etc.)
│   │   ├── calendar/           # ⏳ Calendar components
│   │   └── wizard/             # ⏳ Shift wizard modal
│   ├── stores/                 # ✅ Zustand state management
│   │   ├── useShiftStore.ts    # ✅ Shift data & operations
│   │   ├── useSettingsStore.ts # ✅ App settings
│   │   └── useUIStore.ts       # ✅ UI state (modals, toasts)
│   ├── hooks/                  # ✅ Custom React hooks
│   │   └── useLocalStorage.ts  # ✅ Persistent storage
│   ├── lib/                    # ✅ Business logic & utilities
│   │   ├── types.ts            # ✅ TypeScript definitions
│   │   ├── constants.ts        # ✅ MONTHS, HOLIDAYS, PRESETS
│   │   └── calculations.ts     # ✅ FTE, hours, cost calculations
│   ├── App.tsx                 # ✅ Main application
│   ├── App.css                 # ✅ Global styles
│   └── main.tsx                # ✅ Entry point
├── package.json                # ✅ Dependencies
├── vite.config.ts              # ✅ Vite configuration
├── tailwind.config.js          # ✅ Tailwind design system
└── tsconfig.json               # ✅ TypeScript config
```

**Legend:**
- ✅ Implemented
- ⏳ To be implemented (see guide below)

---

## 🏗️ Architecture Overview

### **State Management (Zustand)**

Three separate stores for clean separation of concerns:

1. **`useShiftStore`** - Manages all shift data
   - `shifts`: Array of shift objects
   - `shiftHoursOverride`: Manual hour overrides
   - `addShift`, `updateShift`, `deleteShift`

2. **`useSettingsStore`** - App-wide settings
   - `totalFTE`, `fteCost`, `hoursPerDay`
   - `coverageMF`, `coverageSat`, `coverageSun`
   - `updateSettings`, `resetSettings`

3. **`useUIStore`** - UI state (modals, navigation, toasts)
   - `currentYear`, `currentMonth`
   - `showWizard`, `editingShiftId`, `wizardStep`
   - `toasts`, `shiftFilter`
   - Methods: `openWizard`, `addToast`, `setYear`, etc.

**Why Zustand over Context?**
- Simpler API, less boilerplate
- Better performance (no unnecessary re-renders)
- DevTools support
- Easier testing

### **Component Architecture**

**UI Primitives** (`components/ui/`)
- Reusable, styled components with Framer Motion animations
- `Button`: 3 variants (primary, secondary, ghost) with hover effects
- `Card`: Collapsible card with smooth height transitions
- `Input/Select`: Form inputs with validation states
- `Modal`: Animated backdrop and content
- `Toast`: Slide-in notifications

**Layouts** (`components/layout/`)
- `Header`: Top navigation, year selector, action buttons
- `Sidebar`: Collapsible panel with all control cards (desktop/mobile responsive)

**Feature Cards** (`components/cards/`)
- Each card is a self-contained feature module
- All cards use the `Card` UI primitive for consistency
- Example: `KPICard`, `SettingsCard`, `ShiftsCard`, etc.

**Calendar** (`components/calendar/`)
- `Calendar`: Main grid component
- `CalendarDay`: Individual day cell with hover animations
- `MonthSelector`: Navigation controls

**Wizard** (`components/wizard/`)
- `ShiftWizard`: Modal wrapper with stepper
- `WizardStep1/2/3`: Template selection, time config, staffing

---

## 🎨 Design System (Tailwind CSS)

### **Grayscale Palette**

```js
gray: {
  50: '#fafafa',  // Lightest backgrounds
  100: '#f5f5f5', // Card backgrounds
  200: '#e5e7eb', // Page background
  300: '#d1d5db', // Borders
  400: '#9ca3af', // Input borders
  500: '#6b7280', // Secondary text
  600: '#4b5563', // Button borders
  700: '#374151', // Dark gray
  800: '#1f2937', // Primary buttons
  900: '#111827', // Black text
}
```

### **Typography**

- Base size: **14px** (shop floor readability)
- Bold numbers: **18-20px** for KPIs
- Line height: **1.5** for accessibility
- Font stack: System fonts (fast loading)

### **Spacing**

- Consistent **4px grid** (Tailwind defaults)
- Card padding: `p-4` (16px)
- Section gaps: `gap-3` (12px)
- Mobile touch targets: **min 44px**

---

## 🎭 Animation Strategy (Framer Motion)

### **Hover Effects**

```tsx
// Button scale on hover
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
/>

// Calendar day hover
<motion.div
  whileHover={{
    backgroundColor: "#f5f5f5",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  }}
/>
```

### **Card Collapse/Expand**

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    />
  )}
</AnimatePresence>
```

### **Modal/Toast**

```tsx
// Backdrop fade
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}

// Content slide/scale
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}

// Toast slide from right
initial={{ x: 400, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
```

---

## 🛠️ Implementation Guide

### **1. Create Card Components** (Priority: HIGH)

Start with `src/components/cards/KPICard.tsx`:

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

**Similar pattern for:**
- `WorkingHoursCard` - Use `calculatePeriodHours()` from lib
- `SettingsCard` - Use `Input` components with `useSettingsStore`
- `ShiftsCard` - List shifts with filter dropdown
- `WeeklyAnalysisCard` - Loop through weekdays, show coverage
- `CostAnalysisCard` - Per-shift cost breakdown
- `YearlyOverviewCard` - 12-month table
- `StatisticsCard` - Chart.js integration (see below)

### **2. Calendar Component** (Priority: HIGH)

```tsx
// src/components/calendar/Calendar.tsx
import { motion } from 'framer-motion';
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
      <h2 className="text-lg font-bold text-center mb-4">
        {MONTHS[currentMonth]} {currentYear}
      </h2>

      {/* Weekday headers */}
      <div className="calendar-grid">
        {WEEKDAYS.map((day) => (
          <div key={day} className="weekday-header">{day}</div>
        ))}

        {/* Calendar days */}
        {days.map((date) => (
          <CalendarDay
            key={date.toISOString()}
            date={date}
            isCurrentMonth={date.getMonth() === currentMonth}
          />
        ))}
      </div>
    </div>
  );
}
```

### **3. CalendarDay Component** (Priority: HIGH)

```tsx
// src/components/calendar/CalendarDay.tsx
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

  return (
    <motion.div
      whileHover={{
        backgroundColor: '#f5f5f5',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
      className={clsx(
        'calendar-day',
        !isCurrentMonth && 'other-month',
        isToday(date) && 'today'
      )}
    >
      {/* Day number + coverage indicator */}
      <div className="day-header">
        <span>{date.getDate()}</span>
        <span className={clsx('coverage-indicator', `coverage-${status}`)} />
      </div>

      {/* Shift bars */}
      {shiftsForDay.map((shift) => (
        <div
          key={shift.id}
          className={clsx('shift-bar', `shift-color-${shift.color}`)}
          title={`${shift.name} ${shift.startTime}-${shift.endTime}`}
        >
          {shift.name} {shift.startTime}-{shift.endTime}
        </div>
      ))}

      {/* Day summary */}
      {shiftsForDay.length > 0 && (
        <div className="day-summary">
          {shiftsForDay.reduce((sum, s) => sum + s.fte, 0).toFixed(1)} FTE •{' '}
          {coverage.toFixed(1)}h
        </div>
      )}
    </motion.div>
  );
}
```

### **4. Shift Wizard** (Priority: MEDIUM)

Create 3-step wizard modal:

```tsx
// src/components/wizard/ShiftWizard.tsx
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/stores/useUIStore';
import { WizardStep1 } from './WizardStep1';
import { WizardStep2 } from './WizardStep2';
import { WizardStep3 } from './WizardStep3';

export function ShiftWizard() {
  const { showWizard, closeWizard, wizardStep } = useUIStore();

  return (
    <Modal isOpen={showWizard} onClose={closeWizard} title="Skapa nytt skift">
      {/* Progress indicator */}
      <div className="flex justify-between mb-6">
        <StepIndicator step={1} active={wizardStep === 1} complete={wizardStep > 1} label="Typ" />
        <StepIndicator step={2} active={wizardStep === 2} complete={wizardStep > 2} label="Tider" />
        <StepIndicator step={3} active={wizardStep === 3} label="Bemanning" />
      </div>

      {/* Step content */}
      {wizardStep === 1 && <WizardStep1 />}
      {wizardStep === 2 && <WizardStep2 />}
      {wizardStep === 3 && <WizardStep3 />}
    </Modal>
  );
}
```

### **5. Statistics with Chart.js** (Priority: MEDIUM)

```tsx
// src/components/cards/StatisticsCard.tsx
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export function StatisticsCard() {
  const [metric, setMetric] = useState('arbetstid');
  const [period, setPeriod] = useState('manad');

  // Calculate data based on metric and period
  const data = {
    labels: ['Jan', 'Feb', 'Mar', /* ... */],
    datasets: [{
      label: 'Arbetstid (timmar)',
      data: [/* calculated values */],
      backgroundColor: '#4b5563',
      borderColor: '#1f2937',
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Arbetstid (timmar)',
        color: '#1f2937',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#4b5563' },
        grid: { color: '#d1d5db' },
      },
      x: {
        ticks: { color: '#4b5563' },
        grid: { color: '#d1d5db' },
      },
    },
  };

  return (
    <Card title="Statistik & Analys" collapsible defaultOpen>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Select
          label="Välj mått"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          options={[
            { value: 'arbetstid', label: 'Arbetstid (timmar)' },
            { value: 'fte', label: 'FTE' },
            { value: 'kostnad', label: 'Kostnad (MSEK)' },
            { value: 'tackning', label: 'Täckning (%)' },
          ]}
        />
        <Select
          label="Tidsperiod"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          options={[
            { value: 'vecka', label: 'Vecka (7 dagar)' },
            { value: 'manad', label: 'Månad (12 månader)' },
            { value: 'kvartal', label: 'Kvartal (4 kvartal)' },
            { value: 'ar', label: 'År (jämförelse)' },
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded border border-gray-300">
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
}
```

---

## ♿ Accessibility Checklist

- [ ] All interactive elements have min **44px** touch targets
- [ ] Focus indicators visible (2px outline)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] ARIA labels on icon-only buttons
- [ ] Semantic HTML (`<header>`, `<main>`, `<aside>`)
- [ ] Color contrast ratio ≥ 4.5:1 (use WebAIM checker)
- [ ] Screen reader friendly (test with NVDA/JAWS)

---

## 📱 Responsive Design

### **Breakpoints**

- **Mobile**: < 640px (`sm:`)
- **Tablet**: 640px - 1024px (`md:`)
- **Desktop**: > 1024px (`xl:`)

### **Layout Changes**

```tsx
// Desktop: Sidebar + Main
<div className="grid grid-cols-1 xl:grid-cols-6 gap-3">
  <aside className="xl:col-span-1">...</aside>
  <main className="xl:col-span-5">...</main>
</div>

// Mobile: Stack vertically (default)
```

---

## 🚀 Deployment (Static Export)

```bash
# Build production bundle
npm run build

# Output: dist/ folder
```

### **Deploy to GitHub Pages**

1. Add to `vite.config.ts`:
   ```ts
   base: '/skiftschema/',  // Your repo name
   ```

2. Install gh-pages:
   ```bash
   npm install -D gh-pages
   ```

3. Add to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### **Deploy to Netlify/Vercel**

- Drag and drop `dist/` folder
- Or connect GitHub repo (auto-deploy on push)

---

## 🎯 Next Steps

1. **Implement all card components** (KPI, Settings, Shifts, etc.)
2. **Build Calendar + CalendarDay** with full functionality
3. **Create Shift Wizard** (3 steps)
4. **Add Statistics** with Chart.js
5. **Test on mobile devices** (Chrome DevTools, real devices)
6. **Accessibility audit** (Lighthouse, axe DevTools)
7. **Performance optimization** (React.memo, lazy loading)
8. **Deploy to production**

---

## 📚 Resources

- **Framer Motion**: https://www.framer.com/motion/
- **Zustand**: https://github.com/pmndrs/zustand
- **Chart.js React**: https://react-chartjs-2.js.org/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vite**: https://vitejs.dev/guide/

---

## 🐛 Troubleshooting

### **Import errors**

Make sure `tsconfig.json` has:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

And `vite.config.ts` has:
```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### **Tailwind not working**

1. Check `App.css` has `@tailwind` directives
2. Check `tailwind.config.js` content paths
3. Restart dev server

### **Chart.js errors**

Register Chart.js components:
```tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);
```

---

**Built with ❤️ for pharmaceutical manufacturing teams**
