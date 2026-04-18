import type { ReactNode } from 'react';

interface RadioOption {
  value: string;
  label: ReactNode;
  icon?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function RadioGroup({
  options,
  value,
  onChange,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={`inline-flex bg-black/40 backdrop-blur-xl border border-purple-400/30 rounded-xl p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`
            px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
            ${
              value === option.value
                ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                : 'text-purple-200 hover:bg-purple-700/30 hover:text-white'
            }
          `}
          onClick={() => onChange(option.value)}
        >
          {option.icon && <span className="mr-2">{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
}
