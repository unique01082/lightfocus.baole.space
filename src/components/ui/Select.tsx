import { forwardRef, ReactNode, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-[11px] font-semibold text-accent-1 uppercase tracking-wide font-space">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            bg-black/30
            border
            border-glass
            rounded-md
            px-3
            py-2
            text-white
            font-space
            text-sm
            outline-none
            transition-colors
            cursor-pointer
            focus:border-accent-1
            ${error ? 'border-accent-4' : ''}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {error && (
          <span className="text-xs text-accent-4">{error}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
