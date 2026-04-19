import type { CSSProperties, ReactNode } from 'react';

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
    // Tech corner decorations
    'before:absolute',
    'before:top-0',
    'before:left-0',
    'before:w-4',
    'before:h-4',
    'before:border-t-2',
    'before:border-l-2',
    'before:border-cyan-400/60',
    'after:absolute',
    'after:bottom-0',
    'after:right-0',
    'after:w-4',
    'after:h-4',
    'after:border-b-2',
    'after:border-r-2',
    'after:border-cyan-400/60',
  ];

  if (position) {
    baseClasses.push(positionClasses[position]);
  }

  if (collapsed) {
    baseClasses.push('opacity-0', 'pointer-events-none', '-translate-y-5');
  }

  return (
    <div className={`${baseClasses.join(' ')} ${className}`} style={style}>
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 rounded-lg" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
      }} />
      {/* Top-right corner decoration */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60" />
      {/* Bottom-left corner decoration */}
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60" />
      {children}
    </div>
  );
}
