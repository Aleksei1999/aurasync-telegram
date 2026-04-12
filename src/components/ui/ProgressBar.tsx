'use client';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  variant?: 'default' | 'accent' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses = {
  default: 'bg-aura-accent',
  accent: 'bg-gradient-to-r from-aura-accent to-aura-accent-dark',
  gradient: 'bg-gradient-to-r from-aura-peach via-aura-mint to-aura-lavender',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-caption text-aura-text-secondary">
            {value} / {max}
          </span>
          <span className="text-caption text-aura-text-secondary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={`progress-bar ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`progress-bar-fill ${variantClasses[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Streak progress with fire emoji
interface StreakProgressProps {
  currentStreak: number;
  targetStreak?: number;
}

export function StreakProgress({
  currentStreak,
  targetStreak = 7,
}: StreakProgressProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="streak-badge">
        <span>🔥</span>
        <span>{currentStreak}</span>
      </div>
      <ProgressBar
        value={currentStreak}
        max={targetStreak}
        variant="gradient"
        size="sm"
        className="flex-1"
      />
      <span className="text-caption text-aura-text-secondary">
        {targetStreak} дней
      </span>
    </div>
  );
}
