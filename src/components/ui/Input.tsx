import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-[11px] font-semibold text-accent-1 uppercase tracking-wide font-space">
            {label}
          </label>
        )}
        <input
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
            focus:border-accent-1
            placeholder:text-white/30
            ${error ? 'border-accent-4' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-accent-4">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
