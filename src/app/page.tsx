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
  const userPhoto = profile?.photo_url || user?.photo_url;

  return (
    <div className="min-h-screen bg-background pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center">
              <span className="text-white text-lg">✨</span>
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
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
