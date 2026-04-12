'use client';

import { useState, useEffect } from 'react';
import { useTelegram } from '@/components/TelegramProvider';
import { useAuth } from '@/components/AuthProvider';
import { SplashScreen } from '@/components/SplashScreen';
import { OnboardingNew } from '@/components/OnboardingNew';
import { HomeScreen } from '@/components/HomeScreen';
import { Navigation } from '@/components/Navigation';
type AppState = 'splash' | 'onboarding' | 'main';

export default function HomePage() {
  const { user } = useTelegram();
  const { profile } = useAuth();
  const [appState, setAppState] = useState<AppState>('splash');

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedOnboarding = localStorage.getItem('aura_onboarding_completed');

      if (savedOnboarding === 'true') {
        setAppState('main');
      } else {
        setAppState('onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = () => {
    // Answers are already saved in OnboardingNew component
    setAppState('main');
  };

  if (appState === 'splash') {
    return <SplashScreen />;
  }

  if (appState === 'onboarding') {
    return <OnboardingNew onComplete={handleOnboardingComplete} />;
  }

  const userName = profile?.first_name || user?.first_name;
  const userPhoto = profile?.photo_url || user?.photo_url;

  return (
    <div className="min-h-screen bg-background">
      <HomeScreen userName={userName} userPhoto={userPhoto} />
      <Navigation />
    </div>
  );
}
