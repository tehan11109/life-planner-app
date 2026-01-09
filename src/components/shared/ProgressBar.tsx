import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  variant?: 'primary' | 'success' | 'warning';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, variant = 'primary', showLabel = true, size = 'md' }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  const fillClass = variant === 'success' 
    ? 'progress-fill-success' 
    : variant === 'warning' 
    ? 'progress-fill-warning' 
    : 'progress-fill';

  return (
    <div className="flex items-center gap-3">
      <div className={cn("progress-bar flex-1", size === 'sm' ? 'h-1.5' : 'h-2')}>
        <div 
          className={fillClass}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-muted-foreground font-medium min-w-[40px] text-right">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
