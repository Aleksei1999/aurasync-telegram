'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegram } from '@/components/TelegramProvider';
import { useAuth } from '@/components/AuthProvider';
import { SplashScreen } from '@/components/SplashScreen';
import { Onboarding } from '@/components/Onboarding';
import { Navigation } from '@/components/Navigation';
import { BioClock } from '@/components/BioClock';
import { QuickActions } from '@/components/QuickActions';
import { DailyCheckin } from '@/components/DailyCheckin';
import { Sparkles } from 'lucide-react';

type AppState = 'splash' | 'onboarding' | 'checkin' | 'main';

interface TodayCheckin {
  mood: string;
  energy: number;
  sleep: string;
  date: string;
}

interface OnboardingAnswers {
  main_goal?: string;
  stress_level?: string;
  sleep_quality?: string;
  energy_pattern?: string;
  physical_symptoms?: string[];
  emotional_challenges?: string[];
  desired_feeling?: string[];
  [key: string]: string | string[] | undefined;
}

// Функция для получения персонализированных рекомендаций
function getPersonalizedRecommendations(
  onboardingAnswers: OnboardingAnswers,
  todayCheckin: TodayCheckin | null
) {
  const recommendations: { title: string; description: string; duration: string; type: string }[] = [];

  // На основе сегодняшнего настроения
  if (todayCheckin) {
    if (todayCheckin.mood === 'stressed' || todayCheckin.mood === 'anxious') {
      recommendations.push({
        title: 'SOS Дыхание',
        description: 'Быстрая техника для снятия тревоги',
        duration: '2 мин',
        type: 'sos',
      });
    }

    if (todayCheckin.mood === 'tired' || todayCheckin.energy <= 2) {
      recommendations.push({
        title: 'Энергетический буст',
        description: 'Восстанови силы за 5 минут',
        duration: '5 мин',
        type: 'energy',
      });
    }

    if (todayCheckin.sleep === 'terrible' || todayCheckin.sleep === 'poor') {
      recommendations.push({
        title: 'Восстановление после плохого сна',
        description: 'Компенсируй недосып правильно',
        duration: '7 мин',
        type: 'recovery',
      });
    }

    if (todayCheckin.mood === 'sad') {
      recommendations.push({
        title: 'Поднятие настроения',
        description: 'Мягкая практика для позитива',
        duration: '5 мин',
        type: 'mood',
      });
    }
  }

  // На основе онбординга
  if (onboardingAnswers.main_goal === 'stress') {
    recommendations.push({
      title: 'Антистресс медитация',
      description: 'Снижаем уровень кортизола',
      duration: '10 мин',
      type: 'stress',
    });
  }

  if (onboardingAnswers.main_goal === 'sleep') {
    recommendations.push({
      title: 'Вечерняя релаксация',
      description: 'Подготовка к качественному сну',
      duration: '15 мин',
      type: 'sleep',
    });
  }

  if (onboardingAnswers.main_goal === 'beauty') {
    recommendations.push({
      title: 'Антикортизоловая практика',
      description: 'Убираем отёки и улучшаем цвет лица',
      duration: '8 мин',
      type: 'beauty',
    });
  }

  if (onboardingAnswers.physical_symptoms?.includes('tension')) {
    recommendations.push({
      title: 'Расслабление тела',
      description: 'Снимаем мышечные зажимы',
      duration: '10 мин',
      type: 'body',
    });
  }

  // Если рекомендаций мало, добавляем базовые
  if (recommendations.length < 3) {
    recommendations.push({
      title: 'Утренняя практика',
      description: 'Настройся на продуктивный день',
      duration: '5 мин',
      type: 'morning',
    });
  }

  return recommendations.slice(0, 3);
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useTelegram();
  const { profile } = useAuth();
  const [appState, setAppState] = useState<AppState>('splash');
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers>({});
  const [todayCheckin, setTodayCheckin] = useState<TodayCheckin | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedOnboarding = localStorage.getItem('aura_onboarding_answers');
      const savedCheckin = localStorage.getItem('aura_today_checkin');

      if (savedOnboarding) {
        setOnboardingAnswers(JSON.parse(savedOnboarding));
      }

      if (savedCheckin) {
        const checkin = JSON.parse(savedCheckin);
        const today = new Date().toDateString();

        // Проверяем, был ли чекин сегодня
        if (checkin.date === today) {
          setTodayCheckin(checkin);
          setAppState('main');
        } else {
          // Чекин устарел, показываем новый
          if (savedOnboarding) {
            setAppState('checkin');
          } else {
            setAppState('onboarding');
          }
        }
      } else {
        // Нет чекина
        if (savedOnboarding) {
          setAppState('checkin');
        } else {
          setAppState('onboarding');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = (answers: Record<string, string | string[]>) => {
    localStorage.setItem('aura_onboarding_completed', 'true');
    localStorage.setItem('aura_onboarding_answers', JSON.stringify(answers));
    setOnboardingAnswers(answers);
    setAppState('checkin');
  };

  const handleCheckinComplete = (data: { mood: string; energy: number; sleep: string }) => {
    const checkinData: TodayCheckin = {
      ...data,
      date: new Date().toDateString(),
    };
    localStorage.setItem('aura_today_checkin', JSON.stringify(checkinData));
    setTodayCheckin(checkinData);
    setAppState('main');
  };

  const handleCheckinSkip = () => {
    setAppState('main');
  };

  const handleStartPractice = () => {
    router.push('/practice');
  };

  const handleQuickAction = (actionId: string) => {
    router.push(`/practice/${actionId}`);
  };

  if (appState === 'splash') {
    return <SplashScreen />;
  }

  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (appState === 'checkin') {
    return (
      <div className="min-h-screen bg-background">
        <DailyCheckin onComplete={handleCheckinComplete} onSkip={handleCheckinSkip} />
      </div>
    );
  }

  const userName = profile?.first_name || user?.first_name;
  const recommendations = getPersonalizedRecommendations(onboardingAnswers, todayCheckin);

  // Определяем статус на основе чекина
  const getMoodEmoji = () => {
    if (!todayCheckin) return '🌟';
    const moodEmojis: Record<string, string> = {
      great: '😊',
      good: '🙂',
      okay: '😐',
      tired: '😴',
      stressed: '😰',
      anxious: '😟',
      sad: '😢',
      irritated: '😤',
    };
    return moodEmojis[todayCheckin.mood] || '🌟';
  };

  return (
    <div className="min-h-screen bg-background pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="font-semibold text-lg text-foreground">AuraSync</span>
          </div>
          <button
            onClick={() => setAppState('checkin')}
            className="h-10 px-4 rounded-full bg-aura-mint-light flex items-center gap-2"
          >
            <span className="text-lg">{getMoodEmoji()}</span>
            <span className="text-sm font-medium text-aura-mint-dark">
              {todayCheckin ? 'Обновить' : 'Чекин'}
            </span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="px-5 py-4 space-y-6">
        {/* Bio Clock */}
        <BioClock
          userName={userName}
          onStartPractice={handleStartPractice}
        />

        {/* Personalized Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-semibold text-foreground">Рекомендации для тебя</h3>
            <span className="text-sm text-aura-slate/60">На основе чекина</span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(rec.type)}
                className="w-full card-soft p-4 flex items-center gap-4 transition-transform active:scale-[0.99]"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-aura-mint to-aura-mint-dark flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-foreground">{rec.title}</h4>
                  <p className="text-xs text-aura-slate/60">{rec.description}</p>
                </div>
                <span className="text-sm text-aura-mint-dark font-medium">
                  {rec.duration}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions onActionClick={handleQuickAction} />

        {/* Today's Stats Preview */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Прогресс за сегодня</h3>
            <button className="text-sm text-aura-mint-dark font-medium">
              Все
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-aura-slate/60">Минут</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-aura-slate/60">Сессий</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-aura-slate/60">Дней</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-aura-slate/60 mb-1">
              <span>Дневная цель</span>
              <span>0/10 мин</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill bg-gradient-to-r from-aura-mint to-aura-mint-dark"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
