import { CSSProperties, ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  collapsed?: boolean;
}

export default function Panel({
  children,
  className = '',
  style,
  position,
  collapsed = false,
}: PanelProps) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const baseClasses = [
    'absolute',
    'bg-panel',
    'text-white',
    'rounded-lg',
    'border',
    'border-panel',
    'backdrop-blur-glass',
    'shadow-panel',
    'transition-all',
    'duration-400',
    'ease-out',
    'font-space',
    'z-[100]',
  ];

  if (position) {
    baseClasses.push(positionClasses[position]);
  }

  if (collapsed) {
    baseClasses.push('opacity-0', 'pointer-events-none', '-translate-y-5');
  }

  return (
    <div className={`${baseClasses.join(' ')} ${className}`} style={style}>
      {children}
    </div>
  );
}
