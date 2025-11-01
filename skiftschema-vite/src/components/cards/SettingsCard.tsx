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
