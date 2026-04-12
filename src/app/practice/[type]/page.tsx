'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Play, Pause, RotateCcw, RotateCw, X, Check } from 'lucide-react';
import { useTelegram } from '@/components/TelegramProvider';
import { WeeklyProgram, Practice } from '@/lib/protocols';

type PracticeType = 'morning' | 'day' | 'evening' | 'night';

interface PracticePageProps {
  params: Promise<{ type: string }>;
}

export default function PracticePage({ params }: PracticePageProps) {
  const resolvedParams = use(params);
  const practiceType = resolvedParams.type as PracticeType;
  const router = useRouter();
  const { hapticFeedback } = useTelegram();

  const [program, setProgram] = useState<WeeklyProgram | null>(null);
  const [practice, setPractice] = useState<Practice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load program and get today's practice
  useEffect(() => {
    const savedProgram = localStorage.getItem('aura_weekly_program');
    if (savedProgram) {
      const parsed = JSON.parse(savedProgram) as WeeklyProgram;
      setProgram(parsed);

      const dayOfWeek = new Date().getDay();
      let todayPractice: Practice | undefined;

      switch (practiceType) {
        case 'morning':
          todayPractice = parsed.morningPractices[dayOfWeek];
          break;
        case 'day':
          todayPractice = parsed.dayPractices[dayOfWeek];
          break;
        case 'evening':
          todayPractice = parsed.eveningPractices[dayOfWeek];
          break;
        case 'night':
          // Special night practice
          todayPractice = {
            id: 'night_1',
            title: 'Ночное погружение',
            subtitle: 'Медитация для сна',
            duration: 5,
            type: 'meditation',
            tags: ['sleep', 'relaxation'],
            description: 'Мягкая медитация для быстрого засыпания.',
          };
          break;
      }

      if (todayPractice) {
        setPractice(todayPractice);
      }
    }
  }, [practiceType]);

  // Timer logic
  useEffect(() => {
    if (isPlaying && practice) {
      const totalSeconds = practice.duration * 60;
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          setProgress((next / totalSeconds) * 100);

          if (next >= totalSeconds) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            setShowCompletion(true);
            hapticFeedback('medium');
          }

          return next;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, practice, hapticFeedback]);

  const togglePlay = () => {
    hapticFeedback('light');
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    hapticFeedback('light');
    if (practice) {
      const totalSeconds = practice.duration * 60;
      setCurrentTime((prev) => Math.min(prev + 15, totalSeconds));
    }
  };

  const skipBackward = () => {
    hapticFeedback('light');
    setCurrentTime((prev) => Math.max(prev - 15, 0));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    hapticFeedback('medium');
    // Save completion
    const savedProgress = localStorage.getItem('aura_day_progress');
    const progress = savedProgress ? JSON.parse(savedProgress) : {};

    switch (practiceType) {
      case 'morning':
        progress.morningDone = true;
        break;
      case 'day':
        progress.dayDone = true;
        break;
      case 'evening':
        progress.eveningDone = true;
        break;
    }

    localStorage.setItem('aura_day_progress', JSON.stringify(progress));
    router.back();
  };

  const handleClose = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    router.back();
  };

  if (!practice) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white/60">Загрузка...</p>
      </div>
    );
  }

  // Completion screen
  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-6">✨</div>
        <h1 className="text-2xl font-bold text-white mb-2">Практика завершена</h1>
        <p className="text-white/60 text-center mb-8">
          {practiceType === 'evening' || practiceType === 'night'
            ? 'Спокойной ночи'
            : 'Как ты себя чувствуешь?'}
        </p>

        {practiceType !== 'evening' && practiceType !== 'night' && (
          <div className="flex gap-4 mb-8">
            {['😊', '😌', '😐', '😔'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  // Quick mood entry after practice
                  const entry = {
                    emoji,
                    timestamp: new Date().toISOString(),
                    type: 'post_practice',
                    practice: practice.title,
                  };
                  const entries = JSON.parse(localStorage.getItem('aura_diary_entries') || '[]');
                  entries.unshift(entry);
                  localStorage.setItem('aura_diary_entries', JSON.stringify(entries));
                  handleComplete();
                }}
                className="text-4xl hover:scale-110 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <button onClick={handleComplete} className="btn-primary px-8">
          Готово
        </button>
      </div>
    );
  }

  // Get background color based on practice type
  const getBgGradient = () => {
    switch (practiceType) {
      case 'morning':
        return 'from-amber-900/90 to-orange-900/90';
      case 'day':
        return 'from-blue-900/90 to-cyan-900/90';
      case 'evening':
        return 'from-indigo-900/90 to-purple-900/90';
      case 'night':
        return 'from-slate-900 to-slate-800';
      default:
        return 'from-slate-900 to-slate-800';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getBgGradient()} flex flex-col`}>
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top flex items-center justify-between">
        <button
          onClick={handleClose}
          className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X size={20} className="text-white" />
        </button>
        <div className="text-white/60 text-sm">
          {formatTime(currentTime)} / {practice.duration}:00
        </div>
        <div className="w-10" />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Breathing animation circle */}
        <div className="relative mb-8">
          <div
            className={`w-48 h-48 rounded-full border-4 border-white/20 flex items-center justify-center transition-all duration-1000 ${
              isPlaying ? 'scale-110 border-white/40' : 'scale-100'
            }`}
            style={{
              animation: isPlaying ? 'breathe 8s ease-in-out infinite' : 'none',
            }}
          >
            <div className="text-center">
              <div className="text-5xl mb-2">
                {practiceType === 'morning' && '🌅'}
                {practiceType === 'day' && '☀️'}
                {practiceType === 'evening' && '🌙'}
                {practiceType === 'night' && '🌟'}
              </div>
              <p className="text-white/80 text-sm">
                {isPlaying ? 'Дыши...' : 'Пауза'}
              </p>
            </div>
          </div>

          {/* Progress ring */}
          <svg className="absolute inset-0 w-48 h-48 -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="92"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <circle
              cx="96"
              cy="96"
              r="92"
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="4"
              strokeDasharray={578}
              strokeDashoffset={578 - (578 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
        </div>

        {/* Practice info */}
        <h1 className="text-2xl font-bold text-white mb-2 text-center">{practice.title}</h1>
        <p className="text-white/60 text-center mb-8">{practice.description}</p>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={skipBackward}
            className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center"
          >
            <RotateCcw size={20} className="text-white" />
          </button>

          <button
            onClick={togglePlay}
            className="h-16 w-16 rounded-full bg-white flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause size={28} className="text-slate-900" />
            ) : (
              <Play size={28} className="text-slate-900 ml-1" />
            )}
          </button>

          <button
            onClick={skipForward}
            className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center"
          >
            <RotateCw size={20} className="text-white" />
          </button>
        </div>
      </main>

      {/* Progress bar at bottom */}
      <div className="px-5 pb-8 safe-area-bottom">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
      `}</style>
    </div>
  );
}
