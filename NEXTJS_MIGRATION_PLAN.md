# Skiftschema Analysator - Next.js Migration Plan

## 🎯 **Project Goals**

Transform the single-file HTML application into a modern, modular Next.js + React application with:
- Enhanced visual quality and usability
- Component-based architecture for maintainability
- Smooth animations for better UX
- Full mobile responsiveness
- Accessibility improvements
- Future-ready for multi-user collaboration and real-time analytics

---

## 🏗️ **Architecture Overview**

### **Technology Stack**
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Chart.js + react-chartjs-2
- **State Management**: React Context API
- **Data Persistence**: localStorage (client-side)
- **TypeScript**: For type safety and better DX

### **Project Structure**
```
skiftschema-app/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Main dashboard page
│   └── globals.css             # Global Tailwind styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # App header with year selector
│   │   ├── Sidebar.tsx         # Collapsible sidebar (mobile-friendly)
│   │   └── MainContent.tsx     # Content wrapper
│   ├── cards/
│   │   ├── KPICard.tsx         # FTE, Utilization, Cost overview
│   │   ├── WorkingHoursCard.tsx # Week/Month/Year totals
│   │   ├── SettingsCard.tsx    # Budget, cost, hours config
│   │   ├── CoverageCard.tsx    # Required hours per day type
│   │   ├── ShiftsCard.tsx      # Active shifts list with filter
│   │   ├── WeeklyAnalysisCard.tsx
│   │   ├── CostAnalysisCard.tsx
│   │   ├── YearlyOverviewCard.tsx
│   │   └── StatisticsCard.tsx  # Chart.js integration
│   ├── calendar/
│   │   ├── Calendar.tsx        # Main calendar grid
│   │   ├── CalendarDay.tsx     # Individual day cell
│   │   └── MonthSelector.tsx   # Month navigation
│   ├── wizard/
│   │   ├── ShiftWizard.tsx     # Modal wrapper
│   │   ├── WizardStep1.tsx     # Template selection
│   │   ├── WizardStep2.tsx     # Time configuration
│   │   └── WizardStep3.tsx     # Staffing details
│   ├── ui/
│   │   ├── Button.tsx          # Reusable button component
│   │   ├── Input.tsx           # Styled input field
│   │   ├── Select.tsx          # Dropdown component
│   │   ├── Card.tsx            # Collapsible card wrapper
│   │   ├── Modal.tsx           # Modal backdrop
│   │   └── Toast.tsx           # Notification system
│   └── presets/
│       └── PresetButtons.tsx   # Quick action templates
├── contexts/
│   ├── ShiftContext.tsx        # Shift data & operations
│   ├── SettingsContext.tsx     # App settings
│   └── UIContext.tsx           # UI state (modals, toasts)
├── hooks/
│   ├── useShifts.ts           # Shift management hook
│   ├── useCalculations.ts     # FTE/cost calculations
│   ├── useWorkingHours.ts     # Hours summary calculations
│   └── useLocalStorage.ts     # Persistent storage
├── lib/
│   ├── constants.ts           # MONTHS, HOLIDAYS, PRESETS
│   ├── calculations.ts        # Business logic
│   └── types.ts               # TypeScript definitions
├── public/                     # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

---

## 🎨 **Component Hierarchy & Responsibilities**

### **1. Layout Components**

#### **Header.tsx**
- **Purpose**: Top navigation with branding and year selector
- **Features**:
  - Logo/title
  - Year dropdown (2024-2027)
  - Save/Load/Export buttons
  - Mobile hamburger menu
- **Animations**: Buttons scale on hover (Framer Motion)

#### **Sidebar.tsx** (Desktop) / **MobileNav.tsx** (Mobile)
- **Purpose**: Collapsible panel for settings and controls
- **Features**:
  - All control cards (KPI, Settings, Coverage, etc.)
  - Smooth expand/collapse animation
  - Sticky positioning on desktop
- **Usability**: Shift managers can keep settings visible while editing calendar

#### **MainContent.tsx**
- **Purpose**: Calendar and analysis panels
- **Layout**:
  - Desktop: Sidebar (25%) + Main (75%)
  - Mobile: Stacked vertically

---

### **2. Card Components**

All cards follow a consistent pattern:
- Collapsible header with toggle icon
- Smooth height animation (Framer Motion)
- Gray/black theme with subtle borders
- Hover effects on interactive elements

#### **KPICard.tsx**
- **Data**: Total FTE, Utilization %, Cost
- **Visual**: Bold 18px numbers, smaller labels
- **Update Trigger**: On shift changes

#### **WorkingHoursCard.tsx**
- **Data**: Weekly, Monthly, Yearly totals
- **Visual**: Large bold numbers (20px), auto-updating
- **Calculation**: Sum of (shift hours × FTE) across periods

#### **SettingsCard.tsx**
- **Inputs**:
  - FTE Budget (number input)
  - Cost per FTE/year (number input)
  - Hours per workday (number input)
- **Validation**: Real-time with error states
- **Persistence**: Auto-save to localStorage

#### **ShiftsCard.tsx**
- **Features**:
  - Dropdown filter (All/Dag/Kväll/Natt)
  - Shift list with hours display
  - Click to edit (opens wizard)
  - Delete button with confirmation
- **Animation**: List items fade in/out

#### **StatisticsCard.tsx**
- **Dropdowns**:
  - Metric: Arbetstid, FTE, Kostnad, Täckning
  - Period: Vecka, Månad, Kvartal, År
- **Chart**: Chart.js bar chart with gray theme
- **Responsive**: Adjusts height on mobile

---

### **3. Calendar Component**

#### **Calendar.tsx**
- **Layout**: 7-column grid (Mon-Sun)
- **Features**:
  - Month/year selector in header
  - 42-day grid (6 weeks)
  - Color-coded coverage indicators
- **Performance**: Memoized day rendering

#### **CalendarDay.tsx**
- **Visual Elements**:
  - Day number
  - Coverage indicator (●/◐/○)
  - Shift bars (truncated with ellipsis)
  - FTE + hours summary
- **Animations**:
  - Hover: Background lightens, shadow appears
  - Click: Ripple effect
- **Accessibility**: Keyboard navigation, ARIA labels

---

### **4. Wizard Component**

#### **ShiftWizard.tsx**
- **Type**: Modal dialog (backdrop + centered content)
- **Animation**: Fade in backdrop, slide in content
- **Steps**: Progress indicator (1→2→3)
- **Navigation**: Back/Next/Finish buttons

#### **WizardStep2.tsx** (Enhanced)
- **Calculated Hours Display**: Live update as times change
- **Manual Override**: Checkbox + number input
- **Midnight Handling**: 22:00-06:00 = 8h (visual indicator)

---

### **5. UI Primitives**

#### **Button.tsx**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
}
```
- **Primary**: Black background, white text
- **Secondary**: Outlined gray border
- **Ghost**: Transparent, hover background
- **Animation**: Scale 1.02 on hover, 0.98 on active

#### **Card.tsx**
```typescript
interface CardProps {
  title: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}
```
- **Animation**: Smooth height transition (300ms)
- **Icon**: ▼/▶ rotates on toggle

#### **Toast.tsx**
- **Position**: Bottom-right (mobile: bottom-center)
- **Animation**: Slide in from right, auto-dismiss after 4s
- **Types**: Success (gray-700), Error (gray-900)

---

## 🎭 **Animation Strategy (Framer Motion)**

### **Hover Animations**
```tsx
// Button hover
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
/>

// Calendar day hover
<motion.div
  whileHover={{
    backgroundColor: "#f5f5f5",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  }}
/>

// Card collapse
<motion.div
  initial={false}
  animate={{ height: isOpen ? 'auto' : 0 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
/>
```

### **List Animations**
```tsx
// Shift list items
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 10 }}
  layout
/>
```

### **Modal Animations**
```tsx
// Wizard backdrop
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
/>

// Wizard content
<motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
/>
```

---

## 📊 **State Management Architecture**

### **ShiftContext.tsx**
```typescript
interface ShiftContextType {
  shifts: Shift[];
  addShift: (shift: Shift) => void;
  updateShift: (id: number, shift: Partial<Shift>) => void;
  deleteShift: (id: number) => void;
  shiftHoursOverride: Record<number, number>;
  setShiftHoursOverride: (id: number, hours: number) => void;
}
```

### **SettingsContext.tsx**
```typescript
interface SettingsContextType {
  totalFTE: number;
  fteCost: number;
  hoursPerDay: number;
  coverage: {
    mondayFriday: number;
    saturday: number;
    sunday: number;
  };
  updateSettings: (settings: Partial<Settings>) => void;
}
```

### **UIContext.tsx**
```typescript
interface UIContextType {
  currentYear: number;
  currentMonth: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  showWizard: boolean;
  editingShiftId: number | null;
  openWizard: (shiftId?: number) => void;
  closeWizard: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}
```

---

## 🎨 **Design System (Tailwind Config)**

### **Color Palette**
```js
colors: {
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
}
```

### **Typography**
```js
fontSize: {
  'xs': '12px',
  'sm': '14px',
  'base': '16px',
  'lg': '18px',
  'xl': '20px',
  '2xl': '24px',
}
```

### **Spacing**
- Consistent 4px grid (0.5, 1, 2, 3, 4, 6, 8, 12, 16)
- Card padding: 16px (p-4)
- Section gaps: 12px (gap-3)

---

## 🔐 **Data Flow & Calculations**

### **FTE Calculation**
```typescript
const totalFTE = shifts.reduce((sum, shift) =>
  sum + (shift.fte * shift.numTeams), 0
);
const utilization = (totalFTE / settings.totalFTE) * 100;
```

### **Working Hours Calculation**
```typescript
const weeklyHours = calculatePeriodHours(
  shifts,
  startOfWeek,
  endOfWeek
);
// Sum: (shiftDuration × shift.fte) for all shifts in period
```

### **Midnight-Crossing Shifts**
```typescript
function getShiftDuration(start: string, end: string): number {
  const startHour = timeToHours(start);
  const endHour = timeToHours(end);
  return endHour > startHour
    ? (endHour - startHour)
    : (24 - startHour + endHour);
}
```

---

## 📱 **Responsive Design Strategy**

### **Breakpoints**
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: > 1024px (xl)

### **Layout Changes**
- **Desktop**: Sidebar (fixed) + Main content (scroll)
- **Tablet**: Collapsible sidebar + Main
- **Mobile**: Vertical stack, fullscreen modals

### **Calendar Responsiveness**
- **Desktop**: 7-column grid, 110px min height
- **Tablet**: 7-column grid, 90px min height
- **Mobile**: 7-column grid, 80px min height, smaller font

---

## ♿ **Accessibility Features**

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Enter/Space to activate buttons
   - Arrow keys in calendar
   - Escape to close modals

2. **ARIA Labels**
   - `aria-label` on icon buttons
   - `aria-expanded` on collapsible cards
   - `aria-pressed` on toggle buttons
   - `role="button"` on clickable divs

3. **High Contrast**
   - Minimum 4.5:1 text contrast ratio
   - Bold text for emphasis
   - Clear focus indicators (2px outline)

4. **Screen Reader Support**
   - Semantic HTML (`<nav>`, `<main>`, `<aside>`)
   - Hidden labels for context
   - Live regions for toast notifications

---

## 🚀 **Performance Optimizations**

1. **React Memoization**
   ```typescript
   const CalendarDay = React.memo(({ date, shifts }) => {
     // Prevents re-render if props unchanged
   });
   ```

2. **Lazy Loading**
   ```typescript
   const ShiftWizard = dynamic(() => import('./ShiftWizard'), {
     ssr: false,
   });
   ```

3. **Virtual Scrolling** (for large shift lists)
   - Use `react-window` if >50 shifts

4. **Chart.js Optimization**
   - Limit data points (max 365 for year view)
   - Debounce chart updates (300ms)

---

## 📦 **Static Export vs. Server**

### **Static Export (Recommended for MVP)**
```bash
npm run build
npm run export
```

**Preserves**:
✅ All UI functionality
✅ Client-side state management
✅ localStorage persistence
✅ Chart.js rendering
✅ Animations

**Limitations**:
❌ No API routes (not needed currently)
❌ No server-side data fetching
❌ No real-time collaboration

**Deployment**:
- GitHub Pages
- Netlify
- Vercel (with static adapter)

### **Future: Add Server Features**

When scaling to multi-user:
1. **Database**: PostgreSQL for shift schedules
2. **API Routes**: Next.js API for CRUD operations
3. **Auth**: NextAuth.js for user management
4. **Real-time**: WebSockets (Socket.io) for live updates
5. **Backend**:
   - Keep Python shift_scheduler/ for algorithmic scheduling
   - Expose via API endpoints
   - Next.js calls Python microservice

---

## 🎯 **Benefits for Shop Floor & Office Staff**

### **For Shift Managers (Shop Floor)**
1. **Mobile-First**: Check schedules on tablet/phone
2. **Quick Actions**: Preset buttons for common patterns
3. **Visual Clarity**: Large touch targets, high contrast
4. **Offline Support**: Works without internet (localStorage)

### **For Planning Managers (Office)**
1. **Yearly View**: Plan 2026+ with confidence
2. **Statistics**: Data-driven decisions (cost vs. coverage)
3. **Flexible**: Easy to adjust FTE budgets mid-year
4. **Export**: CSV for reporting to leadership

### **For IT/Maintenance**
1. **Modular**: Easy to add new features (e.g., employee names)
2. **Type-Safe**: TypeScript catches errors before production
3. **Testable**: Component isolation enables unit testing
4. **Documented**: Clear component hierarchy

---

## 🔮 **Future Enhancements Unlocked**

1. **Multi-User Collaboration**
   - Real-time shift updates across browsers
   - Conflict resolution (two managers editing same shift)
   - User roles (viewer, editor, admin)

2. **Advanced Analytics**
   - Trend analysis (FTE utilization over quarters)
   - Predictive modeling (forecast 2027 needs)
   - Compliance reporting (Arbetstidslagen violations)

3. **Integration Potential**
   - HR system sync (employee availability)
   - Payroll export (actual vs. planned hours)
   - Calendar apps (iCal export for employees)

4. **AI-Powered Features**
   - Auto-suggest optimal shift patterns
   - Anomaly detection (understaffing alerts)
   - Natural language queries ("Show me all night shifts in Q2")

---

## ✅ **Implementation Checklist**

- [ ] Initialize Next.js 14 project
- [ ] Install dependencies (Tailwind, Framer Motion, Chart.js)
- [ ] Set up folder structure
- [ ] Create context providers
- [ ] Build UI primitive components (Button, Input, Card)
- [ ] Implement layout components (Header, Sidebar)
- [ ] Build all card components
- [ ] Create calendar with animations
- [ ] Implement shift wizard
- [ ] Add toast notification system
- [ ] Integrate Chart.js for statistics
- [ ] Implement all calculations (FTE, hours, costs)
- [ ] Add localStorage persistence
- [ ] Test mobile responsiveness
- [ ] Accessibility audit (keyboard nav, ARIA)
- [ ] Performance optimization (memoization, lazy loading)
- [ ] Documentation (README, component docs)
- [ ] Static export configuration

---

## 📝 **Migration Steps**

1. **Phase 1: Setup** (Day 1)
   - Initialize project
   - Configure Tailwind + Framer Motion
   - Create base layout

2. **Phase 2: Core Components** (Day 2-3)
   - Build all cards
   - Implement calendar
   - Add wizard modal

3. **Phase 3: Business Logic** (Day 4)
   - Port calculations
   - Add state management
   - Implement localStorage

4. **Phase 4: Polish** (Day 5)
   - Add animations
   - Mobile optimization
   - Accessibility fixes

5. **Phase 5: Testing & Deploy** (Day 6)
   - Cross-browser testing
   - Static export
   - Deploy to GitHub Pages

---

This architecture ensures a maintainable, scalable, and delightful user experience while preserving all existing functionality and unlocking future possibilities.
