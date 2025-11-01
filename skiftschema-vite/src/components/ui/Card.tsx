import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface CardProps {
  title: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Card({
  title,
  collapsible = false,
  defaultOpen = true,
  children,
  className,
}: CardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={clsx('bg-gray-50 rounded shadow-card border border-gray-300', className)}>
      <button
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className={clsx(
          'w-full px-4 py-3 flex items-center justify-between text-left',
          collapsible && 'cursor-pointer hover:bg-gray-100'
        )}
        disabled={!collapsible}
      >
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {collapsible && (
          <motion.div
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </motion.div>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
