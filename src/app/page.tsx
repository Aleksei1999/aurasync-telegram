'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegram } from '@/components/TelegramProvider';
import { useAuth } from '@/components/AuthProvider';
import { SplashScreen } from '@/components/SplashScreen';
import { Onboarding } from '@/components/Onboarding';
import { Navigation } from '@/components/Navigation';
import { BioClock } from '@/components/BioClock';
import { DailyCheckin } from '@/components/DailyCheckin';
import { Calendar } from '@/components/Calendar';
import { DailyForecast } from '@/components/DailyForecast';
import { User } from 'lucide-react';

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
    router.push('/program');
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

  const userPhoto = profile?.photo_url || user?.photo_url;

  return (
    <div className="min-h-screen bg-background pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center text-white font-semibold">
              {userName ? userName.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="font-semibold text-lg text-foreground">AuraSync</span>
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="h-10 w-10 rounded-full bg-aura-slate/5 flex items-center justify-center overflow-hidden"
          >
            {userPhoto ? (
              <img src={userPhoto} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User size={20} className="text-aura-slate" />
            )}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="px-5 py-4 space-y-6">
        {/* Calendar (collapsible) */}
        <Calendar />

        {/* Bio Clock */}
        <BioClock
          userName={userName}
          onStartPractice={handleStartPractice}
        />

        {/* Daily Forecast */}
        <DailyForecast
          birthDate={onboardingAnswers.birth_date as string}
          birthTime={onboardingAnswers.birth_time as string}
        />

        {/* Personalized Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-semibold text-foreground">Рекомендации</h3>
              <span className="text-sm text-aura-slate/60">На основе чекина</span>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <button
                  key={index}
                  onClick={() => router.push('/program')}
                  className="w-full card-soft p-4 flex items-center gap-4 transition-transform active:scale-[0.99]"
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-aura-mint to-aura-mint-dark flex items-center justify-center">
                    <span className="text-white text-lg">✨</span>
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
        )}
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
