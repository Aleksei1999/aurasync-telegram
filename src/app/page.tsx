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
import { MoodTracker } from '@/components/MoodTracker';
import { Sparkles } from 'lucide-react';

type AppState = 'splash' | 'onboarding' | 'main';

export default function HomePage() {
  const router = useRouter();
  const { user } = useTelegram();
  const { profile, isLoading } = useAuth();
  const [appState, setAppState] = useState<AppState>('splash');

  useEffect(() => {
    // Show splash for 2 seconds
    const timer = setTimeout(() => {
      const onboardingCompleted = localStorage.getItem('aura_onboarding_completed');
      if (onboardingCompleted) {
        setAppState('main');
      } else {
        setAppState('onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = (feelings: string[]) => {
    localStorage.setItem('aura_onboarding_completed', 'true');
    localStorage.setItem('aura_user_feelings', JSON.stringify(feelings));
    setAppState('main');
  };

  const handleStartPractice = () => {
    router.push('/practice');
  };

  const handleQuickAction = (actionId: string) => {
    router.push(`/practice/${actionId}`);
  };

  const handleMoodSelect = (moodId: string) => {
    console.log('Mood selected:', moodId);
    // TODO: Save mood to database
  };

  if (appState === 'splash') {
    return <SplashScreen />;
  }

  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const userName = profile?.first_name || user?.first_name;

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
          {profile?.photo_url || user?.photo_url ? (
            <img
              src={profile?.photo_url || user?.photo_url}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-aura-sage flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {userName?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="px-5 py-4 space-y-6">
        {/* Bio Clock - Smart time-based card */}
        <BioClock
          userName={userName}
          onStartPractice={handleStartPractice}
        />

        {/* Mood Tracker */}
        <MoodTracker onMoodSelect={handleMoodSelect} />

        {/* Quick Actions */}
        <QuickActions onActionClick={handleQuickAction} />

        {/* Today's Stats Preview */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Today&apos;s Progress</h3>
            <button className="text-sm text-aura-mint-dark font-medium">
              See all
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-aura-slate/60">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-aura-slate/60">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-aura-slate/60">Streak</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-aura-slate/60 mb-1">
              <span>Daily goal</span>
              <span>0/10 min</span>
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
