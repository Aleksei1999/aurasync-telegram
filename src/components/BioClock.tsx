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
    greeting: 'Доброе утро',
    icon: Sunrise,
    gradient: 'bg-morning',
    suggestion: 'Начни день с намерением',
    practice: 'Утренняя энергия',
    duration: '5 мин',
  },
  day: {
    greeting: 'Добрый день',
    icon: Sun,
    gradient: 'bg-day',
    suggestion: 'Сохраняй фокус и баланс',
    practice: 'Дневная перезагрузка',
    duration: '3 мин',
  },
  evening: {
    greeting: 'Добрый вечер',
    icon: CloudSun,
    gradient: 'bg-evening',
    suggestion: 'Время расслабиться и отпустить день',
    practice: 'Вечернее спокойствие',
    duration: '7 мин',
  },
  night: {
    greeting: 'Доброй ночи',
    icon: Moon,
    gradient: 'bg-evening',
    suggestion: 'Подготовься к глубокому сну',
    practice: 'Подготовка ко сну',
    duration: '10 мин',
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

  // 3 рекомендации на основе времени суток
  const getRecommendations = () => {
    const baseRecs = [
      { title: config.practice, duration: config.duration },
    ];

    if (timeOfDay === 'morning') {
      baseRecs.push(
        { title: 'Дыхание энергии', duration: '3 мин' },
        { title: 'Настрой на день', duration: '5 мин' }
      );
    } else if (timeOfDay === 'day') {
      baseRecs.push(
        { title: 'Быстрая перезагрузка', duration: '2 мин' },
        { title: 'Фокус и концентрация', duration: '5 мин' }
      );
    } else if (timeOfDay === 'evening') {
      baseRecs.push(
        { title: 'Снятие напряжения', duration: '5 мин' },
        { title: 'Благодарность дню', duration: '3 мин' }
      );
    } else {
      baseRecs.push(
        { title: 'Глубокое расслабление', duration: '10 мин' },
        { title: 'Дыхание для сна', duration: '5 мин' }
      );
    }

    return baseRecs;
  };

  const recommendations = getRecommendations();

  return (
    <div className={`${config.gradient} rounded-3xl p-6 animated-gradient`}>
      {/* Header */}
      <div className="mb-4">
        <p className="text-sm text-aura-slate/70 font-medium">{currentTime}</p>
        <h2 className="text-2xl font-semibold text-foreground">
          {config.greeting}{userName ? `, ${userName}` : ''}
        </h2>
      </div>

      {/* Suggestion */}
      <p className="text-aura-slate/80 mb-4">{config.suggestion}</p>

      {/* 3 Recommendations */}
      <div className="space-y-2">
        <p className="text-xs text-aura-slate/60 uppercase tracking-wide">
          Рекомендуем для тебя
        </p>
        {recommendations.map((rec, index) => (
          <button
            key={index}
            onClick={onStartPractice}
            className="w-full glass rounded-xl p-3 flex items-center justify-between transition-transform active:scale-[0.99]"
          >
            <div className="text-left">
              <h3 className="font-medium text-foreground text-sm">{rec.title}</h3>
              <p className="text-xs text-aura-slate/70">{rec.duration}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-aura-mint to-aura-mint-dark flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                <path d="M6 4L16 10L6 16V4Z" fill="white" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
