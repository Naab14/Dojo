import { Shift } from '@/lib/types';
import { WIZARD_TEMPLATES } from '@/lib/constants';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface WizardStep1Props {
  template: string;
  setTemplate: (template: string) => void;
  formData: Partial<Shift>;
  setFormData: (data: Partial<Shift>) => void;
}

export function WizardStep1({
  template,
  setTemplate,
  formData,
  setFormData,
}: WizardStep1Props) {
  const handleTemplateSelect = (key: string) => {
    setTemplate(key);
    const t = WIZARD_TEMPLATES[key as keyof typeof WIZARD_TEMPLATES];
    setFormData({
      ...formData,
      name: t.name,
      startTime: t.start,
      endTime: t.end,
    });
  };

  const templates = [
    { key: 'custom', name: 'Anpassat skift', desc: 'Definiera egna tider' },
    { key: 'morning', name: 'Morgonpass', desc: '06:00-14:00' },
    { key: 'day', name: 'Dagpass', desc: '08:00-17:00' },
    { key: 'evening', name: 'Kvällspass', desc: '14:00-22:00' },
    { key: 'night', name: 'Nattpass', desc: '22:00-06:00' },
    { key: '12h_day', name: '12h Dag', desc: '06:00-18:00' },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-base text-gray-900">
        Välj skifttyp eller mall
      </h4>

      <div className="grid grid-cols-2 gap-3">
        {templates.map((t) => (
          <motion.button
            key={t.key}
            onClick={() => handleTemplateSelect(t.key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              'p-4 text-left rounded border-2 transition-all',
              template === t.key
                ? 'border-gray-900 bg-gray-200 shadow-sm'
                : 'border-gray-300 bg-gray-50 hover:border-gray-600 hover:bg-gray-100'
            )}
          >
            <div className="font-bold text-sm text-gray-900">{t.name}</div>
            <div className="text-xs text-gray-600 mt-1">{t.desc}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
