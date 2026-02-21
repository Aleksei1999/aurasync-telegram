'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Sunrise, CloudSun } from 'lucide-react';

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

interface TimeConfig {
  greeting: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
  suggestion: string;
  practice: string;
  duration: string;
}

const timeConfigs: Record<TimeOfDay, TimeConfig> = {
  morning: {
    greeting: 'Good morning',
    icon: Sunrise,
    gradient: 'bg-morning',
    suggestion: 'Start your day with intention',
    practice: 'Morning Energy Boost',
    duration: '5 min',
  },
  day: {
    greeting: 'Good afternoon',
    icon: Sun,
    gradient: 'bg-day',
    suggestion: 'Stay focused and balanced',
    practice: 'Midday Reset',
    duration: '3 min',
  },
  evening: {
    greeting: 'Good evening',
    icon: CloudSun,
    gradient: 'bg-evening',
    suggestion: 'Wind down and reflect',
    practice: 'Evening Calm',
    duration: '7 min',
  },
  night: {
    greeting: 'Good night',
    icon: Moon,
    gradient: 'bg-evening',
    suggestion: 'Prepare for restful sleep',
    practice: 'Sleep Preparation',
    duration: '10 min',
  },
};

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

interface BioClockProps {
  userName?: string;
  onStartPractice?: () => void;
}

export function BioClock({ userName, onStartPractice }: BioClockProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTimeOfDay(getTimeOfDay());
      setCurrentTime(new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const config = timeConfigs[timeOfDay];
  const Icon = config.icon;

  return (
    <div className={`${config.gradient} rounded-3xl p-6 animated-gradient`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-aura-slate/70 font-medium">{currentTime}</p>
          <h2 className="text-2xl font-semibold text-foreground">
            {config.greeting}{userName ? `, ${userName}` : ''}
          </h2>
        </div>
        <div className="h-12 w-12 rounded-full bg-white/50 flex items-center justify-center">
          <Icon size={24} className="text-aura-slate" />
        </div>
      </div>

      {/* Suggestion */}
      <p className="text-aura-slate/80 mb-6">{config.suggestion}</p>

      {/* Recommended Practice Card */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-aura-slate/60 uppercase tracking-wide mb-1">
              Recommended for you
            </p>
            <h3 className="font-semibold text-foreground">{config.practice}</h3>
            <p className="text-sm text-aura-slate/70">{config.duration}</p>
          </div>
          <button
            onClick={onStartPractice}
            className="h-12 w-12 rounded-full bg-gradient-to-br from-aura-mint to-aura-mint-dark flex items-center justify-center shadow-lg transition-transform active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 4L16 10L6 16V4Z" fill="white" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
