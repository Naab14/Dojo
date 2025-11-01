import { useEffect } from 'react';
import { ToastContainer } from './components/ui/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

/**
 * Main Application Component
 *
 * This is a minimal starter showing the architecture.
 * Complete implementation requires building all card components,
 * calendar, wizard, etc. See README.md for full implementation guide.
 */
function App() {
  // Initialize localStorage persistence
  useLocalStorage();

  return (
    <div className="min-h-screen bg-gray-200 p-3">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="bg-gray-50 rounded shadow-sm p-4 mb-3 border border-gray-300">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Skiftschema Analysator
              </h1>
              <select className="px-3 py-2 border rounded bg-white text-gray-900 font-medium">
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026" selected>2026</option>
                <option value="2027">2027</option>
              </select>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800">
                Spara
              </button>
              <button className="px-4 py-2 border-2 border-gray-600 rounded hover:bg-gray-100">
                Ladda
              </button>
              <button className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800">
                Exportera CSV
              </button>
            </div>
          </div>
        </header>

        {/* Quick Start Banner */}
        <div className="bg-gray-100 rounded shadow-sm p-4 mb-3 border-2 border-gray-300">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-3">
          {/* Sidebar - To be implemented with all card components */}
          <aside className="xl:col-span-1 space-y-3">
            <div className="bg-gray-50 rounded shadow-sm p-4 border border-gray-300">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Översikt (KPI)
              </h3>
              <p className="text-sm text-gray-600">
                Implementation needed: KPICard component
              </p>
            </div>

            <div className="bg-gray-50 rounded shadow-sm p-4 border border-gray-300">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Arbetstid Sammanfattning
              </h3>
              <p className="text-sm text-gray-600">
                Implementation needed: WorkingHoursCard component
              </p>
            </div>

            <div className="bg-gray-50 rounded shadow-sm p-4 border border-gray-300">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Inställningar
              </h3>
              <p className="text-sm text-gray-600">
                Implementation needed: SettingsCard component
              </p>
            </div>
          </aside>

          {/* Main Content - Calendar and Analysis */}
          <main className="xl:col-span-5">
            <div className="bg-gray-50 rounded shadow-sm p-4 mb-3 border border-gray-300">
              <h2 className="text-lg font-bold text-center text-gray-900 mb-4">
                Januari 2026
              </h2>
              <div className="bg-white p-4 rounded border border-gray-300">
                <p className="text-center text-gray-600">
                  Implementation needed: Calendar component with animations
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded shadow-sm p-4 border border-gray-300">
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  Statistik & Analys
                </h3>
                <p className="text-sm text-gray-600">
                  Implementation needed: StatisticsCard with Chart.js
                </p>
              </div>

              <div className="bg-gray-50 rounded shadow-sm p-4 border border-gray-300">
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  Årlig Översikt
                </h3>
                <p className="text-sm text-gray-600">
                  Implementation needed: YearlyOverviewCard component
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Wizard Modal - To be implemented */}
      {/* <ShiftWizard /> */}
    </div>
  );
}

export default App;
