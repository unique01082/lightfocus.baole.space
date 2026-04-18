import type { ReactNode } from 'react';

type BadgeVariant = 'rank' | 'priority' | 'type' | 'status';
type BadgeColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'gradient'
  | 'custom';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  className?: string;
  style?: React.CSSProperties;
}

export default function Badge({
  children,
  variant = 'status',
  color = 'gradient',
  className = '',
  style,
}: BadgeProps) {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'px-2.5',
    'py-1',
    'rounded-xl',
    'text-[11px]',
    'font-semibold',
    'font-space',
    'whitespace-nowrap',
  ];

  const colorClasses: Record<BadgeColor, string> = {
    red: 'bg-[#e63946] text-white',
    orange: 'bg-[#f77f00] text-white',
    yellow: 'bg-[#ffd60a] text-black',
    green: 'bg-[#2a9d8f] text-white',
    blue: 'bg-[#4cc9f0] text-black',
    purple: 'bg-[#7209b7] text-white',
    gradient: 'bg-gradient-to-br from-accent-5 to-accent-6 text-deep',
    custom: '',
  };

  const variantClasses: Record<BadgeVariant, string> = {
    rank: 'uppercase tracking-wide',
    priority: 'capitalize',
    type: 'uppercase tracking-wider text-[10px]',
    status: '',
  };

  return (
    <span
      className={`${baseClasses.join(' ')} ${colorClasses[color]} ${variantClasses[variant]} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
