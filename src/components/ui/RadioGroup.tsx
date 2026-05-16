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
  activeClass?: string;
  inactiveClass?: string;
  containerClass?: string;
}

export default function RadioGroup({
  options,
  value,
  onChange,
  className = '',
  activeClass = 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30',
  inactiveClass = 'text-purple-200 hover:bg-purple-700/30 hover:text-white',
  containerClass = 'border-purple-400/30',
}: RadioGroupProps) {
  return (
    <div className={`inline-flex bg-black/40 backdrop-blur-xl border rounded-xl p-1 ${containerClass} ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`
            px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
            ${value === option.value ? activeClass : inactiveClass}
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
