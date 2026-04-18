import type { InputHTMLAttributes, ReactNode } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

export default function Checkbox({
  label,
  className = '',
  onChange,
  checked,
  ...props
}: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer text-sm text-white/90 ${className}`}>
      <input
        type="checkbox"
        className="w-4 h-4 rounded border border-glass bg-transparent cursor-pointer
          checked:bg-gradient-to-br checked:from-accent-5 checked:to-accent-6
          checked:border-transparent transition-all accent-accent-1"
        checked={checked}
        onChange={onChange}
        {...props}
      />
      {label && <span className="select-none">{label}</span>}
    </label>
  );
}
