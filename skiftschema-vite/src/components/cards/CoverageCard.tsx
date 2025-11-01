import { Card } from '@/components/ui/Card';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function CoverageCard() {
  const settings = useSettingsStore();

  return (
    <Card title="Täckning (h/dag)" collapsible defaultOpen>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-medium">Mån-Fre</span>
          <input
            type="number"
            value={settings.coverageMF}
            onChange={(e) =>
              settings.updateSettings({ coverageMF: Number(e.target.value) })
            }
            min={0}
            max={168}
            className="w-20 px-2 py-2 border rounded text-center bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-medium">Lördag</span>
          <input
            type="number"
            value={settings.coverageSat}
            onChange={(e) =>
              settings.updateSettings({ coverageSat: Number(e.target.value) })
            }
            min={0}
            max={24}
            className="w-20 px-2 py-2 border rounded text-center bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-medium">Söndag</span>
          <input
            type="number"
            value={settings.coverageSun}
            onChange={(e) =>
              settings.updateSettings({ coverageSun: Number(e.target.value) })
            }
            min={0}
            max={24}
            className="w-20 px-2 py-2 border rounded text-center bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>
    </Card>
  );
}
