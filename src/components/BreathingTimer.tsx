'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Pause, Play } from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import { BreathingExercise, BreathingPhase } from '@/lib/types';
import { Button } from './ui';

interface BreathingTimerProps {
  exercise: BreathingExercise;
  onClose: () => void;
  onComplete?: () => void;
}

type Phase = 'inhale' | 'hold_in' | 'exhale' | 'hold_out' | 'preparing';

const phaseLabels: Record<Phase, string> = {
  preparing: 'Готовься...',
  inhale: 'Вдох',
  hold_in: 'Задержка',
  exhale: 'Выдох',
  hold_out: 'Задержка',
};

export function BreathingTimer({ exercise, onClose, onComplete }: BreathingTimerProps) {
  const { hapticFeedback } = useTelegram();

  const [isRunning, setIsRunning] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [prepareCountdown, setPrepareCountdown] = useState(3);
  const [currentPhase, setCurrentPhase] = useState<Phase>('preparing');
  const [phaseTime, setPhaseTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  // Parse breathing pattern
  const pattern = useMemo(() => {
    // Pattern like "5-5" for coherent, "4-7-8" for relaxing, "4-4-4-4" for box
    const parts = exercise.pattern.split('-').map(Number);

    if (parts.length === 2) {
      // Simple pattern: inhale-exhale
      return {
        inhale: parts[0],
        hold_in: 0,
        exhale: parts[1],
        hold_out: 0,
      };
    } else if (parts.length === 3) {
      // Pattern: inhale-hold-exhale
      return {
        inhale: parts[0],
        hold_in: parts[1],
        exhale: parts[2],
        hold_out: 0,
      };
    } else if (parts.length === 4) {
      // Box breathing: inhale-hold-exhale-hold
      return {
        inhale: parts[0],
        hold_in: parts[1],
        exhale: parts[2],
        hold_out: parts[3],
      };
    }

    // Default fallback
    return { inhale: 4, hold_in: 0, exhale: 4, hold_out: 0 };
  }, [exercise.pattern]);

  // Total exercise duration in seconds
  const totalDuration = exercise.duration * 60;

  // Single cycle duration
  const cycleDuration = pattern.inhale + pattern.hold_in + pattern.exhale + pattern.hold_out;

  // Phase sequence
  const getNextPhase = useCallback((current: Phase): Phase => {
    const sequence: Phase[] = [];

    sequence.push('inhale');
    if (pattern.hold_in > 0) sequence.push('hold_in');
    sequence.push('exhale');
    if (pattern.hold_out > 0) sequence.push('hold_out');

    const currentIndex = sequence.indexOf(current);
    const nextIndex = (currentIndex + 1) % sequence.length;

    // If we're at the end of cycle
    if (nextIndex === 0) {
      setCycleCount(prev => prev + 1);
    }

    return sequence[nextIndex];
  }, [pattern]);

  // Get phase duration
  const getPhaseDuration = useCallback((phase: Phase): number => {
    switch (phase) {
      case 'inhale': return pattern.inhale;
      case 'hold_in': return pattern.hold_in;
      case 'exhale': return pattern.exhale;
      case 'hold_out': return pattern.hold_out;
      default: return 0;
    }
  }, [pattern]);

  // Preparation countdown
  useEffect(() => {
    if (!isRunning || !isPreparing) return;

    if (prepareCountdown <= 0) {
      setIsPreparing(false);
      setCurrentPhase('inhale');
      setPhaseTime(pattern.inhale);
      hapticFeedback('medium');
      return;
    }

    const timer = setTimeout(() => {
      setPrepareCountdown(prev => prev - 1);
      hapticFeedback('light');
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, isPreparing, prepareCountdown, pattern.inhale, hapticFeedback]);

  // Main timer
  useEffect(() => {
    if (!isRunning || isPreparing) return;

    if (totalTime >= totalDuration) {
      setIsRunning(false);
      onComplete?.();
      hapticFeedback('heavy');
      return;
    }

    const timer = setInterval(() => {
      setTotalTime(prev => prev + 1);

      setPhaseTime(prev => {
        if (prev <= 1) {
          // Move to next phase
          const nextPhase = getNextPhase(currentPhase);
          setCurrentPhase(nextPhase);
          hapticFeedback('light');
          return getPhaseDuration(nextPhase);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isPreparing, totalTime, totalDuration, currentPhase, getNextPhase, getPhaseDuration, onComplete, hapticFeedback]);

  // Format remaining time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = totalDuration - totalTime;

  // Calculate circle scale based on phase
  const getCircleScale = (): number => {
    if (isPreparing) return 1;

    const phaseDuration = getPhaseDuration(currentPhase);
    const phaseProgress = 1 - (phaseTime / phaseDuration);

    switch (currentPhase) {
      case 'inhale':
        return 0.6 + (phaseProgress * 0.4); // 0.6 -> 1.0
      case 'exhale':
        return 1 - (phaseProgress * 0.4); // 1.0 -> 0.6
      case 'hold_in':
      case 'hold_out':
        return currentPhase === 'hold_in' ? 1 : 0.6;
      default:
        return 1;
    }
  };

  // Get shape style (circle or square for box breathing)
  const isBoxBreathing = pattern.hold_in > 0 && pattern.hold_out > 0;
  const borderRadius = isBoxBreathing && (currentPhase === 'hold_in' || currentPhase === 'hold_out')
    ? '24px'
    : '50%';

  const togglePlay = () => {
    hapticFeedback('medium');
    setIsRunning(!isRunning);
  };

  const handleClose = () => {
    hapticFeedback('light');
    onClose();
  };

  const handleFinishEarly = () => {
    hapticFeedback('medium');
    setIsRunning(false);
    onComplete?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2 safe-area-top">
        <button
          onClick={handleClose}
          className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X size={20} className="text-white" />
        </button>

        <span className="text-caption text-white/60">
          {formatTime(remainingTime)}
        </span>

        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Technique Name */}
      <div className="px-5 py-2 text-center">
        <p className="text-caption text-white/40">{exercise.name}</p>
        <p className="text-caption text-white/30">{exercise.pattern}</p>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5">
        {/* Animated Circle */}
        <div className="relative w-72 h-72 flex items-center justify-center mb-8">
          {/* Outer glow */}
          <div
            className="absolute w-64 h-64 bg-aura-accent/20 blur-3xl transition-all duration-1000 ease-in-out"
            style={{
              transform: `scale(${getCircleScale()})`,
              borderRadius,
            }}
          />

          {/* Main shape */}
          <div
            className="absolute w-56 h-56 bg-gradient-to-br from-aura-accent/60 to-aura-lavender/40 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-1000 ease-in-out"
            style={{
              transform: `scale(${getCircleScale()})`,
              borderRadius,
            }}
          >
            {/* Phase label or countdown */}
            <div className="text-center">
              {isPreparing ? (
                <span className="text-6xl font-light text-white">
                  {prepareCountdown}
                </span>
              ) : (
                <>
                  <span className="text-2xl font-light text-white">
                    {phaseLabels[currentPhase]}
                  </span>
                  <p className="text-5xl font-light text-white/80 mt-2">
                    {phaseTime}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Inner ring */}
          <div
            className="absolute w-32 h-32 border border-white/10 transition-all duration-1000 ease-in-out"
            style={{
              transform: `scale(${getCircleScale() * 0.8})`,
              borderRadius,
            }}
          />
        </div>

        {/* Cycles counter */}
        <p className="text-caption text-white/40 mb-8">
          Цикл {cycleCount + 1}
        </p>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="h-16 w-16 rounded-full bg-aura-accent flex items-center justify-center shadow-lg shadow-aura-accent/30"
        >
          {isRunning ? (
            <Pause size={28} className="text-white" />
          ) : (
            <Play size={28} className="text-white ml-1" />
          )}
        </button>
      </main>

      {/* Footer */}
      <footer className="px-5 pb-8 safe-area-bottom">
        <Button
          variant="ghost"
          fullWidth
          onClick={handleFinishEarly}
          className="text-white/50"
        >
          Закончить раньше
        </Button>
      </footer>
    </div>
  );
}

// ============================================
// Breathing Exercise Selector Component
// ============================================

interface BreathingExerciseSelectorProps {
  exercises: BreathingExercise[];
  onSelect: (exercise: BreathingExercise) => void;
  onClose: () => void;
}

export function BreathingExerciseSelector({
  exercises,
  onSelect,
  onClose,
}: BreathingExerciseSelectorProps) {
  const { hapticFeedback } = useTelegram();

  const handleSelect = (exercise: BreathingExercise) => {
    hapticFeedback('medium');
    onSelect(exercise);
  };

  const getLevelColor = (level: BreathingExercise['level']) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getLevelLabel = (level: BreathingExercise['level']) => {
    switch (level) {
      case 'beginner': return 'Начальный';
      case 'intermediate': return 'Средний';
      case 'advanced': return 'Продвинутый';
      default: return level;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-aura-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2 safe-area-top border-b border-aura-sand">
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full bg-aura-sand flex items-center justify-center"
        >
          <X size={20} className="text-aura-text" />
        </button>

        <h1 className="text-title text-aura-text">Дыхательные техники</h1>

        <div className="w-10" />
      </header>

      {/* List */}
      <main className="flex-1 overflow-auto px-5 py-4 space-y-3">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => handleSelect(exercise)}
            className="w-full p-4 bg-white rounded-2xl text-left shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-body-medium text-aura-text">{exercise.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs ${getLevelColor(exercise.level)}`}>
                {getLevelLabel(exercise.level)}
              </span>
            </div>

            <p className="text-caption text-aura-text-secondary mb-3">
              {exercise.description}
            </p>

            <div className="flex items-center gap-4 text-caption text-aura-text-muted">
              <span>{exercise.pattern}</span>
              <span>{exercise.duration} мин</span>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
}
