import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Tag({
  children,
  color = '#667eea',
  size = 'md',
  className = '',
}: TagProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`${sizeClasses[size]} rounded-full flex-shrink-0`}
        style={{ backgroundColor: color }}
      />
      {children}
    </span>
  );
}
