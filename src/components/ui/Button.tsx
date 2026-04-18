import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'accent'
  | 'control'
  | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  active = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'font-space',
    'font-medium',
    'uppercase',
    'tracking-wide',
    'rounded-lg',
    'cursor-pointer',
    'transition-all',
    'duration-300',
    'ease-out',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:transform-none',
  ];

  if (fullWidth) {
    baseClasses.push('w-full');
  }

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-br from-accent-1 to-accent-2 text-white border-none hover:shadow-glow-lg hover:-translate-y-0.5',
    secondary:
      'bg-gradient-to-br from-[#2a2a4a] to-[#1e1e3a] text-white border border-white/10 hover:from-accent-1 hover:to-[#5a6dee] hover:shadow-glow hover:-translate-y-0.5',
    ghost:
      'bg-transparent border border-glass text-white/70 hover:text-white hover:border-white/30 hover:-translate-y-0.5',
    accent:
      'bg-gradient-to-br from-accent-3 to-accent-4 text-white border-none hover:shadow-glow-accent hover:-translate-y-0.5',
    control:
      'bg-gradient-to-br from-[#2a2a4a] to-[#1e1e3a] text-white border border-white/10 hover:bg-gradient-to-br hover:from-accent-1 hover:to-[#5a6dee] hover:shadow-glow hover:-translate-y-px',
    danger:
      'bg-transparent border border-glass text-white/50 hover:text-accent-4 hover:border-accent-4',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    xs: 'px-2 py-1 text-[9px] rounded',
    sm: 'px-3 py-1.5 text-[10px] rounded',
    md: 'px-4 py-2 text-xs rounded-lg',
    lg: 'px-6 py-3 text-sm rounded-lg',
  };

  const activeClass =
    active && variant === 'control'
      ? 'bg-gradient-to-br from-accent-3 to-accent-4 shadow-glow-accent'
      : '';

  return (
    <button
      className={`${baseClasses.join(' ')} ${variantClasses[variant]} ${sizeClasses[size]} ${activeClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
