'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Download, Share2, X, Play } from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import { Card, Button, ProgressBar, Tag } from './ui';

interface WeekStats {
  morningPractices: number;
  eveningPractices: number;
  diaryEntries: number;
  emotionsExplored: number;
  moodData: number[];
  stressChange: number;
  topEmotions: { name: string; percent: number; color: string }[];
}

// ============================================
// Weekly Checkup Start Screen
// ============================================

export function WeeklyCheckupStart() {
  const router = useRouter();
  const { hapticFeedback } = useTelegram();

  const handleStart = () => {
    hapticFeedback('medium');
    router.push('/checkup/report');
  };

  const handleSkip = () => {
    hapticFeedback('light');
    localStorage.setItem('aura_last_checkup', new Date().toISOString());
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-aura-bg flex flex-col">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-aura-sand flex items-center justify-center"
        >
          <X size={20} className="text-aura-text" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 text-center">
        {/* Illustration placeholder */}
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-aura-lavender/30 to-aura-mint/30 flex items-center justify-center mb-8">
          <span className="text-6xl">🌅</span>
        </div>

        <h1 className="text-headline text-aura-text mb-4">
          Привет. Воскресенье.
        </h1>

        <p className="text-body text-aura-text-secondary mb-2 max-w-xs">
          Давай вместе посмотрим на эту неделю — без оценок, просто чтобы увидеть.
        </p>

        <p className="text-caption text-aura-text-muted mb-8">
          Займёт около 3 минут
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={handleStart}
          className="w-full max-w-xs"
        >
          Начать
          <ChevronRight size={18} />
        </Button>
      </main>

      {/* Footer */}
      <footer className="px-5 pb-8 safe-area-bottom text-center">
        <button
          onClick={handleSkip}
          className="text-caption text-aura-text-muted"
        >
          Пропустить эту неделю
        </button>
      </footer>
    </div>
  );
}

// ============================================
// Weekly Report Screen
// ============================================

export function WeeklyReport() {
  const router = useRouter();
  const { hapticFeedback, shareUrl } = useTelegram();

  // Calculate week dates
  const weekDates = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return {
      start: start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
      end: now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
    };
  }, []);

  // Load stats from localStorage
  const [stats, setStats] = useState<WeekStats>({
    morningPractices: 0,
    eveningPractices: 0,
    diaryEntries: 0,
    emotionsExplored: 3,
    moodData: [6, 5, 7, 4, 6, 7, 8],
    stressChange: -1.5,
    topEmotions: [
      { name: 'Спокойствие', percent: 35, color: '#9CAF88' },
      { name: 'Усталость', percent: 25, color: '#7EB5D6' },
      { name: 'Радость', percent: 20, color: '#FFD93D' },
      { name: 'Тревога', percent: 12, color: '#9B7EBD' },
      { name: 'Грусть', percent: 8, color: '#A1887F' },
    ],
  });

  useEffect(() => {
    const streak = parseInt(localStorage.getItem('aura_streak') || '0');
    const entries = JSON.parse(localStorage.getItem('aura_diary_entries') || '[]');
    setStats(prev => ({
      ...prev,
      morningPractices: Math.min(streak, 7),
      eveningPractices: Math.max(0, Math.min(streak, 7) - 1),
      diaryEntries: entries.length,
    }));
  }, []);

  // Word of the week
  const wordOfWeek = useMemo(() => {
    const words = ['Восстановление', 'Принятие', 'Рост', 'Баланс', 'Осознанность'];
    return words[Math.floor(Math.random() * words.length)];
  }, []);

  const handleSavePdf = () => {
    hapticFeedback('medium');
    alert('PDF-экспорт будет доступен в Premium');
  };

  const handleShare = () => {
    hapticFeedback('light');
    if (shareUrl) {
      shareUrl(
        'https://t.me/aurasync_bot',
        `Моя неделя в AuraSync: ${stats.morningPractices}/7 практик, ${stats.diaryEntries} записей в дневнике`
      );
    }
  };

  const handleClose = () => {
    hapticFeedback('light');
    localStorage.setItem('aura_last_checkup', new Date().toISOString());
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-aura-bg pb-32">
      {/* Header */}
      <header className="px-5 pt-4 pb-4 safe-area-top">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-aura-sand flex items-center justify-center"
        >
          <X size={20} className="text-aura-text" />
        </button>
      </header>

      <main className="px-5 space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-headline text-aura-text mb-1">Твоя неделя</h1>
          <p className="text-body text-aura-text-secondary">
            {weekDates.start} — {weekDates.end}
          </p>
        </div>

        {/* Word of the week */}
        <Card variant="accent" className="p-6 text-center">
          <Tag variant="accent" className="mb-3">Слово недели</Tag>
          <h2 className="text-2xl font-serif text-aura-text">{wordOfWeek}</h2>
        </Card>

        {/* Main metric */}
        <Card variant="default" className="p-6 text-center">
          <p className="text-caption text-aura-text-muted mb-2">Уровень стресса</p>
          <div className="flex items-center justify-center gap-2">
            <span className={`text-4xl font-bold ${stats.stressChange < 0 ? 'text-aura-accent' : 'text-red-400'}`}>
              {stats.stressChange > 0 ? '+' : ''}{stats.stressChange}
            </span>
          </div>
          <p className="text-body text-aura-text-secondary mt-2">
            {stats.stressChange < 0 ? 'Снизился за неделю' : 'Повысился за неделю'}
          </p>
        </Card>

        {/* Mood chart */}
        <Card variant="soft" className="p-5">
          <h3 className="text-body-medium text-aura-text mb-4">Настроение за неделю</h3>
          <div className="flex items-end justify-between h-24 gap-2">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-aura-accent rounded-t-lg transition-all"
                  style={{ height: `${(stats.moodData[i] / 10) * 100}%` }}
                />
                <span className="text-xs text-aura-text-muted">{day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top emotions */}
        <Card variant="default" className="p-5">
          <h3 className="text-body-medium text-aura-text mb-4">Топ-5 эмоций</h3>
          <div className="space-y-3">
            {stats.topEmotions.map((emotion, i) => (
              <div key={emotion.name} className="flex items-center gap-3">
                <span className="text-caption text-aura-text-muted w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-body text-aura-text">{emotion.name}</span>
                    <span className="text-caption text-aura-text-muted">{emotion.percent}%</span>
                  </div>
                  <div className="h-2 bg-aura-sand rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${emotion.percent}%`, backgroundColor: emotion.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Practice stats */}
        <Card variant="soft" className="p-5">
          <h3 className="text-body-medium text-aura-text mb-4">Статистика практик</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-aura-text">{stats.morningPractices}/7</p>
              <p className="text-caption text-aura-text-muted">Утренних</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-aura-text">{stats.eveningPractices}/7</p>
              <p className="text-caption text-aura-text-muted">Вечерних</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-aura-text">{stats.diaryEntries}</p>
              <p className="text-caption text-aura-text-muted">Записей</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-aura-text">{stats.emotionsExplored}</p>
              <p className="text-caption text-aura-text-muted">Эмоций открыто</p>
            </div>
          </div>
        </Card>

        {/* Gift */}
        <Card variant="accent" className="p-5">
          <Tag variant="accent" className="mb-3">Подарок</Tag>
          <h3 className="text-body-medium text-aura-text mb-2">
            Голосовое сообщение для тебя
          </h3>
          <p className="text-body text-aura-text-secondary mb-4">
            Короткая поддержка на следующую неделю
          </p>
          <Button variant="primary" size="sm">
            <Play size={16} />
            Послушать
          </Button>
        </Card>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-aura-bg border-t border-aura-sand px-5 py-4 safe-area-bottom">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleSavePdf}
          >
            <Download size={16} />
            PDF
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleShare}
          >
            <Share2 size={16} />
            Поделиться
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleClose}
          >
            Закрыть
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default WeeklyCheckupStart;
