import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export function Input({ label, error, helpText, className, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-3 py-2 bg-white border rounded text-base',
          'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent',
          error
            ? 'border-gray-900 bg-gray-100'
            : 'border-gray-400 hover:border-gray-600',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-gray-900 font-semibold">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray-600">{helpText}</p>
      )}
    </div>
  );
}
