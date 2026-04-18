import { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  style,
  hover = true,
  onClick,
}: CardProps) {
  const baseClasses = [
    'bg-glass',
    'backdrop-blur-glass',
    'border',
    'border-glass',
    'rounded-xl',
    'p-6',
    'transition-all',
    'duration-300',
  ];

  if (hover) {
    baseClasses.push(
      'hover:border-accent-1/20',
      'hover:shadow-glass',
    );
  }

  if (onClick) {
    baseClasses.push('cursor-pointer');
  }

  return (
    <div
      className={`${baseClasses.join(' ')} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
