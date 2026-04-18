import type { InputHTMLAttributes } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

export default function Slider({
  label,
  showValue = true,
  valueFormatter = (v) => v.toString(),
  className = '',
  ...props
}: SliderProps) {
  const currentValue = props.value ? Number(props.value) : 0;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="block text-[10px] text-white/70 font-medium uppercase tracking-wider font-space">
          {label}
        </label>
      )}
      <input
        type="range"
        className="w-full h-1 bg-white/20 rounded-sm outline-none appearance-none
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
          [&::-webkit-slider-thumb]:bg-accent-1 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(102,126,234,0.5)]
          [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:bg-accent-1
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
        {...props}
      />
      {showValue && (
        <span className="text-[9px] text-accent-5 font-medium font-space">
          {valueFormatter(currentValue)}
        </span>
      )}
    </div>
  );
}
