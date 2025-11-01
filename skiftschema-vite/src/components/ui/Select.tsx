import { clsx } from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
  error?: string;
}

export function Select({ label, options, error, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'w-full px-3 py-2 bg-white border rounded text-base',
          'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent',
          error
            ? 'border-gray-900 bg-gray-100'
            : 'border-gray-400 hover:border-gray-600',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-gray-900 font-semibold">{error}</p>
      )}
    </div>
  );
}
