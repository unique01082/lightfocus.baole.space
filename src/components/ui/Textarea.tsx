import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-[11px] font-semibold text-accent-1 uppercase tracking-wide font-space">
            {label}
          </label>
        )}
        <textarea
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
            resize-vertical
            min-h-[48px]
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

Textarea.displayName = 'Textarea';

export default Textarea;
