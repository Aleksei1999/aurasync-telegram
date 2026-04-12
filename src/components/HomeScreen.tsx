'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { User, Play, Check, ChevronRight, BookOpen, Moon, Sun, Sunrise, Sunset, Wind } from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import { WeeklyProgram, Practice, DailyTip, dailyTips } from '@/lib/protocols';
import { OnboardingAnswers } from '@/lib/types';
import { getMeditationsByTimeOfDay } from '@/lib/meditations';
import { getBreathingByLevel } from '@/lib/breathing';
import { Card, Button, Tag, ProgressBar, QuickMoodRow } from './ui';

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

interface DayProgress {
  morningDone: boolean;
  dayDone: boolean;
  eveningDone: boolean;
  tipDone: boolean;
}

interface HomeScreenProps {
  userName?: string;
  userPhoto?: string;
}

export function HomeScreen({ userName, userPhoto }: HomeScreenProps) {
  const router = useRouter();
  const { hapticFeedback } = useTelegram();
  const [program, setProgram] = useState<WeeklyProgram | null>(null);
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(null);
  const [dayProgress, setDayProgress] = useState<DayProgress>({
    morningDone: false,
    dayDone: false,
    eveningDone: false,
    tipDone: false,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Load program and progress
  useEffect(() => {
    const savedProgram = localStorage.getItem('aura_weekly_program');
    const savedAnswers = localStorage.getItem('aura_onboarding_answers');
    const savedProgress = localStorage.getItem('aura_day_progress');
    const savedProgressDate = localStorage.getItem('aura_day_progress_date');

    if (savedProgram) setProgram(JSON.parse(savedProgram));
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));

    // Reset progress if it's a new day
    const today = new Date().toDateString();
    if (savedProgressDate !== today) {
      localStorage.setItem('aura_day_progress_date', today);
      localStorage.setItem('aura_day_progress', JSON.stringify({
        morningDone: false,
        dayDone: false,
        eveningDone: false,
        tipDone: false,
      }));
    } else if (savedProgress) {
      setDayProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Calculate time of day
  const timeOfDay = useMemo((): TimeOfDay => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'day';
    if (hour >= 18 && hour < 23) return 'evening';
    return 'night';
  }, [currentTime]);

  // Get greeting based on time
  const greeting = useMemo(() => {
    switch (timeOfDay) {
      case 'morning':
        return 'Доброе утро';
      case 'day':
        return 'Добрый день';
      case 'evening':
        return 'Добрый вечер';
      case 'night':
        return 'Поздно. Как ты?';
    }
  }, [timeOfDay]);

  // Get contextual phrase
  const contextPhrase = useMemo(() => {
    const streak = parseInt(localStorage.getItem('aura_streak') || '0');

    if (streak >= 7) return `Ты с нами уже ${streak} дней. Это впечатляет.`;
    if (streak >= 3) return `${streak} дней подряд. Ритм формируется.`;

    if (answers?.painProtocol === 'burnout') {
      return 'Сегодня работаем мягко. Без надрыва.';
    }
    if (answers?.painProtocol === 'sleep_issues') {
      return 'Фокус на восстановление сна.';
    }
    if (answers?.painProtocol === 'constant_anxiety') {
      return 'Дышим. Заземляемся. Находим опору.';
    }

    return 'Сегодня — день, чтобы вернуться к себе.';
  }, [answers]);

  // Get current day of week (0-6)
  const dayOfWeek = currentTime.getDay();

  // Get today's practices
  const todayMorning = program?.morningPractices[dayOfWeek];
  const todayDay = program?.dayPractices[dayOfWeek];
  const todayEvening = program?.eveningPractices[dayOfWeek];
  const todayTip = program?.dailyTips[dayOfWeek];

  // Mark practice as done
  const markDone = (type: keyof DayProgress) => {
    hapticFeedback('medium');
    const newProgress = { ...dayProgress, [type]: true };
    setDayProgress(newProgress);
    localStorage.setItem('aura_day_progress', JSON.stringify(newProgress));

    // Update streak
    const allDone = newProgress.morningDone && newProgress.eveningDone;
    if (allDone) {
      const currentStreak = parseInt(localStorage.getItem('aura_streak') || '0');
      localStorage.setItem('aura_streak', String(currentStreak + 1));
    }
  };

  // Format date
  const formattedDate = currentTime.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Get time icon
  const TimeIcon = useMemo(() => {
    switch (timeOfDay) {
      case 'morning':
        return Sunrise;
      case 'day':
        return Sun;
      case 'evening':
        return Sunset;
      case 'night':
        return Moon;
    }
  }, [timeOfDay]);

  // Calculate week progress
  const weekProgress = useMemo(() => {
    const total = 7;
    let done = 0;
    // For simplicity, count today's completed practices
    if (dayProgress.morningDone) done += 0.5;
    if (dayProgress.eveningDone) done += 0.5;
    return { done: Math.round(done), total };
  }, [dayProgress]);

  const isSunday = dayOfWeek === 0;

  return (
    <div className="min-h-screen bg-aura-bg pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-aura-text-muted text-caption mb-1">
              <TimeIcon size={14} />
              <span className="capitalize">{formattedDate}</span>
            </div>
            <h1 className="text-headline text-aura-text">
              {greeting}, {userName || 'красавица'}
            </h1>
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="h-11 w-11 rounded-full bg-aura-sand flex items-center justify-center overflow-hidden"
          >
            {userPhoto ? (
              <img src={userPhoto} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User size={20} className="text-aura-text-secondary" />
            )}
          </button>
        </div>
      </header>

      {/* Context phrase */}
      <div className="px-5 py-2">
        <p className="text-body text-aura-text-secondary">{contextPhrase}</p>
      </div>

      {/* Main content */}
      <main className="px-5 py-4 space-y-4">
        {/* Sunday: Weekly Check-up */}
        {isSunday && (
          <Card variant="accent" className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📋</span>
              <Tag variant="accent">Воскресный чек-ап</Tag>
            </div>
            <h3 className="text-title text-aura-text mb-2">Закрываем неделю</h3>
            <p className="text-body text-aura-text-secondary mb-4">
              Посмотрим на прогресс и соберём новую программу
            </p>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => router.push('/checkup')}
            >
              Начать чек-ап
              <ChevronRight size={18} />
            </Button>
          </Card>
        )}

        {/* Morning Practice */}
        {(timeOfDay === 'morning' || !dayProgress.morningDone) && todayMorning && (
          <PracticeCard
            practice={todayMorning}
            type="morning"
            isDone={dayProgress.morningDone}
            isHighlighted={timeOfDay === 'morning' && !dayProgress.morningDone}
            onStart={() => router.push(`/practice/morning`)}
            onDone={() => markDone('morningDone')}
          />
        )}

        {/* Day Practice (breathing pause) */}
        {timeOfDay === 'day' && todayDay && !dayProgress.dayDone && (
          <PracticeCard
            practice={todayDay}
            type="day"
            isDone={dayProgress.dayDone}
            isHighlighted={true}
            onStart={() => router.push(`/practice/day`)}
            onDone={() => markDone('dayDone')}
          />
        )}

        {/* Daily Tip */}
        {todayTip && !dayProgress.tipDone && (
          <TipCard
            tip={todayTip}
            onDone={() => markDone('tipDone')}
          />
        )}

        {/* Evening Practice */}
        {(timeOfDay === 'evening' || timeOfDay === 'night') && todayEvening && (
          <PracticeCard
            practice={todayEvening}
            type="evening"
            isDone={dayProgress.eveningDone}
            isHighlighted={timeOfDay === 'evening' && !dayProgress.eveningDone}
            onStart={() => router.push(`/practice/evening`)}
            onDone={() => markDone('eveningDone')}
          />
        )}

        {/* Quick Diary Access */}
        <Card variant="default" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-aura-text mb-3">Записать, что чувствуешь</h3>
              <QuickMoodRow
                onSelect={(emoji) => {
                  hapticFeedback('light');
                  // Quick mood entry
                  const entry = {
                    emoji,
                    timestamp: new Date().toISOString(),
                    type: 'quick',
                  };
                  const entries = JSON.parse(localStorage.getItem('aura_diary_entries') || '[]');
                  entries.unshift(entry);
                  localStorage.setItem('aura_diary_entries', JSON.stringify(entries));
                }}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/journal/new')}
              className="ml-3"
            >
              <BookOpen size={18} className="text-aura-accent" />
            </Button>
          </div>
        </Card>

        {/* All Done State */}
        {dayProgress.morningDone && dayProgress.eveningDone && (
          <Card variant="glass" className="p-5 text-center">
            <div className="text-3xl mb-2">✨</div>
            <h3 className="text-title text-aura-text mb-1">Ты сделала всё на сегодня</h3>
            <p className="text-body text-aura-text-secondary">Завтра я предложу новую практику</p>
          </Card>
        )}

        {/* Week Progress */}
        <Card variant="soft" className="p-4">
          <ProgressBar
            value={weekProgress.done}
            max={weekProgress.total}
            variant="gradient"
            size="md"
            showLabel
          />
          <p className="text-caption text-aura-text-secondary mt-2 text-center">
            Прогресс недели
          </p>
        </Card>

        {/* Night mode */}
        {timeOfDay === 'night' && (
          <Card variant="soft" className="p-5 text-center bg-aura-lavender/20">
            <div className="text-3xl mb-2">🌙</div>
            <h3 className="text-title text-aura-text mb-1">Время лечь</h3>
            <p className="text-body text-aura-text-secondary mb-4">
              Хочешь короткую ночную медитацию перед сном?
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push('/practice/night')}
            >
              5 минут для сна
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}

// Practice Card Component
interface PracticeCardProps {
  practice: Practice;
  type: 'morning' | 'day' | 'evening';
  isDone: boolean;
  isHighlighted: boolean;
  onStart: () => void;
  onDone: () => void;
}

function PracticeCard({ practice, type, isDone, isHighlighted, onStart, onDone }: PracticeCardProps) {
  const getTypeInfo = () => {
    switch (type) {
      case 'morning':
        return { emoji: '🌅', label: 'Утренняя практика', tagVariant: 'morning' as const };
      case 'day':
        return { emoji: '☀️', label: 'Дыхательная пауза', tagVariant: 'default' as const };
      case 'evening':
        return { emoji: '🌙', label: 'Вечерняя практика', tagVariant: 'evening' as const };
    }
  };

  const info = getTypeInfo();

  if (isDone) {
    return (
      <Card variant="soft" className="p-4 flex items-center gap-3 bg-aura-accent/10">
        <div className="h-10 w-10 rounded-full bg-aura-accent flex items-center justify-center">
          <Check size={20} className="text-white" />
        </div>
        <div>
          <p className="text-body-medium text-aura-text">{info.label} выполнена</p>
          <p className="text-caption text-aura-text-secondary">{practice.title}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant={isHighlighted ? 'accent' : 'default'}
      className={`p-5 ${isHighlighted ? 'shadow-lg' : ''}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{info.emoji}</span>
        <Tag variant={info.tagVariant}>{info.label}</Tag>
      </div>

      <h3 className="text-title text-aura-text mb-1">{practice.title}</h3>
      <p className="text-body text-aura-text-secondary mb-1">{practice.subtitle}</p>
      <p className="text-caption text-aura-text-muted mb-4">{practice.duration} минут</p>

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="md"
          onClick={onStart}
          className="flex-1"
        >
          <Play size={16} />
          Начать
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={onDone}
        >
          Уже сделала
        </Button>
      </div>
    </Card>
  );
}

// Tip Card Component
interface TipCardProps {
  tip: DailyTip;
  onDone: () => void;
}

function TipCard({ tip, onDone }: TipCardProps) {
  return (
    <Card variant="default" className="p-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-aura-accent/10 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">{tip.icon}</span>
        </div>
        <div className="flex-1">
          <h4 className="text-body-medium text-aura-text mb-1">{tip.title}</h4>
          <p className="text-body text-aura-text-secondary">{tip.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDone}
          className="h-8 w-8 rounded-full"
        >
          <Check size={16} className="text-aura-text-muted" />
        </Button>
      </div>
    </Card>
  );
}
