import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/layout/Header';
import { KPICard } from './components/cards/KPICard';
import { WorkingHoursCard } from './components/cards/WorkingHoursCard';
import { SettingsCard } from './components/cards/SettingsCard';
import { CoverageCard } from './components/cards/CoverageCard';
import { ShiftsCard } from './components/cards/ShiftsCard';
import { WeeklyAnalysisCard } from './components/cards/WeeklyAnalysisCard';
import { CostAnalysisCard } from './components/cards/CostAnalysisCard';
import { YearlyOverviewCard } from './components/cards/YearlyOverviewCard';
import { Calendar } from './components/calendar/Calendar';
import { ShiftWizard } from './components/wizard/ShiftWizard';
import { ToastContainer } from './components/ui/Toast';
import { Button } from './components/ui/Button';
import { useUIStore } from './stores/useUIStore';
import { useShiftStore } from './stores/useShiftStore';
import { ROTATION_PRESETS } from './lib/constants';
import { useState } from 'react';
import './App.css';

/**
 * Main Application Component
 * Skiftschema Analysator - Modern shift planning for pharmaceutical manufacturing
 */
function App() {
  // Initialize localStorage persistence
  useLocalStorage();

  const { addToast } = useUIStore();
  const { setShifts } = useShiftStore();
  const [showQuickStart, setShowQuickStart] = useState(() => {
    return localStorage.getItem('quickStartDismissed') !== 'true';
  });

  const handleDismissQuickStart = () => {
    setShowQuickStart(false);
    localStorage.setItem('quickStartDismissed', 'true');
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = ROTATION_PRESETS[presetKey];
    if (!preset) return;

    const newShifts = preset.shifts.map((s, idx) => ({
      id: Date.now() + idx,
      name: s.name,
      startTime: s.start,
      endTime: s.end,
      rotationWeeks: s.weeks,
      numTeams: s.teams,
      weekPatterns: s.pattern,
      fte: s.fte,
      color: (idx % 8) + 1,
    }));

    setShifts(newShifts);
    addToast(`${preset.name} tillämpat`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-200 p-3">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <Header />

        {/* Quick Start Banner */}
        {showQuickStart && (
          <div className="bg-gray-100 rounded shadow-sm p-4 mb-3 border-2 border-gray-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-3 text-gray-900">
                  Kom igång på 3 steg
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <strong className="text-gray-900">Konfigurera</strong>
                      <br />
                      <span className="text-gray-700">
                        Välj mallar eller skapa egna skift
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <strong className="text-gray-900">Jämför</strong>
                      <br />
                      <span className="text-gray-700">
                        Se täckning och kostnader i kalendern
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <strong className="text-gray-900">Besluta</strong>
                      <br />
                      <span className="text-gray-700">
                        Exportera och implementera
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleDismissQuickStart}
                className="text-gray-600 hover:text-gray-900 ml-4 text-xl font-bold"
                aria-label="Stäng guide"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Quick Action Presets */}
        <div className="bg-gray-50 rounded shadow-sm p-4 mb-3 border border-gray-300">
          <h3 className="font-bold text-base mb-3 text-gray-900">
            Snabbmallar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={() => handleApplyPreset('continental')}
              variant="secondary"
              className="text-left h-auto py-3"
            >
              <div>
                <div className="font-bold text-base text-gray-900">
                  Pharma/Tillverkning
                </div>
                <div className="text-sm text-gray-600">
                  24/7 • 3 skift • Balanserad
                </div>
              </div>
            </Button>
            <Button
              onClick={() => handleApplyPreset('24_7_8h')}
              variant="secondary"
              className="text-left h-auto py-3"
            >
              <div>
                <div className="font-bold text-base text-gray-900">
                  Kontinuerlig Process
                </div>
                <div className="text-sm text-gray-600">
                  168h/vecka • Max täckning
                </div>
              </div>
            </Button>
            <Button
              onClick={() => handleApplyPreset('5_8')}
              variant="secondary"
              className="text-left h-auto py-3"
            >
              <div>
                <div className="font-bold text-base text-gray-900">
                  Kostnadsoptimerad
                </div>
                <div className="text-sm text-gray-600">
                  5x8 • Minimal bemanning
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-3">
          {/* Sidebar with all cards */}
          <aside className="xl:col-span-1 space-y-3">
            <KPICard />
            <WorkingHoursCard />
            <SettingsCard />
            <CoverageCard />
            <ShiftsCard />
          </aside>

          {/* Main Content - Calendar and Analysis */}
          <main className="xl:col-span-5">
            {/* Calendar */}
            <div className="bg-gray-50 rounded shadow-sm p-4 mb-3 border border-gray-300">
              <Calendar />
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <WeeklyAnalysisCard />
              <CostAnalysisCard />
            </div>

            {/* Yearly Overview */}
            <div className="mb-3">
              <YearlyOverviewCard />
            </div>
          </main>
        </div>
      </div>

      {/* Modals and Notifications */}
      <ShiftWizard />
      <ToastContainer />
    </div>
  );
}

export default App;
