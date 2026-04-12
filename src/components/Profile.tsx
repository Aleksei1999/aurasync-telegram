'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings, ChevronRight, Trophy, Gift, Users,
  CreditCard, HelpCircle, MessageCircle, Shield, FileText
} from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import { Card, Button, ProgressBar, Tag } from './ui';
import { levels, allAchievements, getUnlockedAchievements } from '@/lib/achievements';

// ============================================
// Profile Stats Interface
// ============================================

interface ProfileStats {
  totalPractices: number;
  totalMeditations: number;
  totalBreathing: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  diaryEntries: number;
  emotionsExplored: number;
  coursesStarted: number;
  coursesCompleted: number;
  achievementsUnlocked: number;
  currentLevel: number;
  xp: number;
  bonusBalance: number;
  referrals: number;
  joinedAt: string;
  lastActiveAt: string;
}

// ============================================
// Profile Main Screen
// ============================================

interface ProfileScreenProps {
  userName?: string;
  userPhoto?: string;
}

export function ProfileScreen({ userName, userPhoto }: ProfileScreenProps) {
  const router = useRouter();
  const { hapticFeedback, shareUrl } = useTelegram();
  const [stats, setStats] = useState<ProfileStats>({
    totalPractices: 0,
    totalMeditations: 0,
    totalBreathing: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    diaryEntries: 0,
    emotionsExplored: 0,
    coursesStarted: 0,
    coursesCompleted: 0,
    achievementsUnlocked: 0,
    currentLevel: 1,
    xp: 0,
    bonusBalance: 0,
    referrals: 0,
    joinedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  });
  const [isPremium, setIsPremium] = useState(false);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('aura_user_stats');
    if (savedStats) {
      setStats(prev => ({ ...prev, ...JSON.parse(savedStats) }));
    }

    const streak = localStorage.getItem('aura_streak');
    if (streak) {
      setStats(prev => ({ ...prev, currentStreak: parseInt(streak) }));
    }

    const subscription = localStorage.getItem('aura_subscription');
    setIsPremium(subscription === 'premium');
  }, []);

  // Calculate level
  const currentLevel = useMemo(() => {
    return levels.find(l => l.level === stats.currentLevel) || levels[0];
  }, [stats.currentLevel]);

  const nextLevel = useMemo(() => {
    return levels.find(l => l.level === stats.currentLevel + 1);
  }, [stats.currentLevel]);

  // Calculate XP progress to next level
  const xpProgress = useMemo(() => {
    if (!nextLevel) return 100;
    const currentXp = stats.xp - (currentLevel.requiredXp || 0);
    const neededXp = (nextLevel.requiredXp || 0) - (currentLevel.requiredXp || 0);
    return Math.min(100, (currentXp / neededXp) * 100);
  }, [stats.xp, currentLevel, nextLevel]);

  // Get unlocked achievements
  const unlockedAchievements = useMemo(() => {
    // Convert ProfileStats to minimal UserStats for achievements check
    const userStats = {
      streakDays: stats.currentStreak,
      totalPractices: stats.totalPractices,
      totalMorningPractices: Math.floor(stats.totalPractices / 2),
      totalEveningPractices: Math.floor(stats.totalPractices / 2),
      totalDiaryEntries: stats.diaryEntries,
      totalWords: stats.diaryEntries * 50,
      emotionsExplored: stats.emotionsExplored,
      totalVoiceEntries: 0,
      totalCourseWeeks: Math.floor(stats.coursesCompleted * 4),
      coursesCompleted: stats.coursesCompleted,
      referralsJoined: stats.referrals,
      daysInactive: 0,
      hasFirstInsight: stats.diaryEntries > 0,
      hasPatternSeen: stats.diaryEntries > 7,
      hasUsedCompass: false,
      hasWeeklyReport: stats.currentStreak >= 7,
      hasWeeklyCheckup: false,
      hasTendernessEntry: false,
      hasHardEmotionEntry: false,
      hasForgivenessEntry: false,
      hasVulnerabilityPractice: false,
      hasAngerPractice: false,
      has90DaysCourse: stats.coursesCompleted > 0,
    };
    return getUnlockedAchievements(userStats);
  }, [stats]);

  // Days with app
  const daysWithApp = useMemo(() => {
    const joinedDate = new Date(stats.joinedAt);
    const now = new Date();
    return Math.floor((now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));
  }, [stats.joinedAt]);

  const handleShare = () => {
    hapticFeedback('medium');
    if (shareUrl) {
      shareUrl(
        'https://t.me/aurasync_bot?start=ref_' + Date.now(),
        'Присоединяйся к AuraSync — приложению для заботы о ментальном здоровье'
      );
    }
  };

  return (
    <div className="min-h-screen bg-aura-bg pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-headline text-aura-text">Профиль</h1>
          <button
            onClick={() => router.push('/settings')}
            className="h-10 w-10 rounded-full bg-aura-sand flex items-center justify-center"
          >
            <Settings size={20} className="text-aura-text-secondary" />
          </button>
        </div>

        {/* Profile Card */}
        <Card variant="default" className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-aura-sand flex items-center justify-center overflow-hidden">
              {userPhoto ? (
                <img src={userPhoto} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div>
              <h2 className="text-title text-aura-text mb-1">
                {userName || 'Гостья'}
              </h2>
              <p className="text-caption text-aura-text-secondary mb-1">
                С тобой {daysWithApp} дней
              </p>
              <Tag variant="accent">{currentLevel.name}</Tag>
            </div>
          </div>
        </Card>
      </header>

      <main className="px-5 py-4 space-y-4">
        {/* Progress Stats */}
        <Card variant="soft" className="p-4">
          <h3 className="text-body-medium text-aura-text mb-4">Мой прогресс</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatItem
              icon="🔥"
              value={stats.currentStreak}
              label="Дней подряд"
            />
            <StatItem
              icon="🧘‍♀️"
              value={stats.totalPractices}
              label="Практик"
            />
            <StatItem
              icon="📝"
              value={stats.diaryEntries}
              label="Записей"
            />
            <StatItem
              icon="💚"
              value={stats.emotionsExplored}
              label="Эмоций открыто"
            />
          </div>
          <Button
            variant="ghost"
            fullWidth
            className="mt-4"
            onClick={() => router.push('/report')}
          >
            Полный отчёт
            <ChevronRight size={16} />
          </Button>
        </Card>

        {/* Level & Achievements */}
        <Card variant="default" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-body-medium text-aura-text">Уровень</h3>
            <span className="text-caption text-aura-text-secondary">
              {stats.xp} XP
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{currentLevel.icon}</span>
            <div className="flex-1">
              <p className="text-body text-aura-text mb-1">{currentLevel.name}</p>
              <ProgressBar
                value={xpProgress}
                max={100}
                variant="gradient"
                size="sm"
              />
            </div>
          </div>

          {nextLevel && (
            <p className="text-caption text-aura-text-muted text-center mb-4">
              До уровня «{nextLevel.name}»: {(nextLevel.requiredXp || 0) - stats.xp} XP
            </p>
          )}

          {/* Recent Achievements */}
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} className="text-aura-accent" />
            <span className="text-caption text-aura-text-muted">
              Достижений: {unlockedAchievements.length}/{allAchievements.length}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {unlockedAchievements.slice(0, 5).map(achievement => (
              <div
                key={achievement.id}
                className="flex-shrink-0 w-12 h-12 rounded-xl bg-aura-accent/10 flex items-center justify-center"
                title={achievement.name}
              >
                <span className="text-xl">{achievement.icon}</span>
              </div>
            ))}
            {unlockedAchievements.length > 5 && (
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-aura-sand flex items-center justify-center">
                <span className="text-caption text-aura-text-muted">
                  +{unlockedAchievements.length - 5}
                </span>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            fullWidth
            onClick={() => router.push('/achievements')}
          >
            Все достижения
            <ChevronRight size={16} />
          </Button>
        </Card>

        {/* Referral */}
        <Card variant="accent" className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Users size={24} className="text-aura-accent" />
            <h3 className="text-body-medium text-aura-text">Приведи подругу</h3>
          </div>
          <p className="text-body text-aura-text-secondary mb-4">
            Получи бонусы за каждую подругу, которая присоединится
          </p>
          <Button variant="primary" fullWidth onClick={handleShare}>
            Поделиться
          </Button>
          {stats.referrals > 0 && (
            <p className="text-caption text-aura-text-muted text-center mt-3">
              Ты пригласила: {stats.referrals}
            </p>
          )}
        </Card>

        {/* Bonuses */}
        {stats.bonusBalance > 0 && (
          <Card variant="soft" className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Gift size={24} className="text-aura-accent" />
              <h3 className="text-body-medium text-aura-text">Бонусы</h3>
            </div>
            <p className="text-headline text-aura-text mb-2">
              {stats.bonusBalance} бонусов
            </p>
            <Button variant="ghost" onClick={() => router.push('/bonuses')}>
              На что потратить
              <ChevronRight size={16} />
            </Button>
          </Card>
        )}

        {/* Subscription */}
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard size={24} className="text-aura-text-secondary" />
            <div className="flex-1">
              <h3 className="text-body-medium text-aura-text">Подписка</h3>
              <p className="text-caption text-aura-text-secondary">
                {isPremium ? 'Premium активна' : 'Бесплатный план'}
              </p>
            </div>
            <ChevronRight size={20} className="text-aura-text-muted" />
          </div>
          <Button
            variant={isPremium ? 'ghost' : 'primary'}
            fullWidth
            onClick={() => router.push('/subscription')}
          >
            {isPremium ? 'Управление' : 'Открыть Premium'}
          </Button>
        </Card>

        {/* Links */}
        <Card variant="soft" className="divide-y divide-aura-sand">
          <MenuItem
            icon={<HelpCircle size={20} />}
            label="FAQ"
            onClick={() => router.push('/faq')}
          />
          <MenuItem
            icon={<MessageCircle size={20} />}
            label="Связаться с командой"
            onClick={() => router.push('/support')}
          />
          <MenuItem
            icon={<Shield size={20} />}
            label="Политика конфиденциальности"
            onClick={() => router.push('/privacy')}
          />
          <MenuItem
            icon={<FileText size={20} />}
            label="Условия использования"
            onClick={() => router.push('/terms')}
          />
        </Card>

        {/* Version */}
        <p className="text-caption text-aura-text-muted text-center">
          AuraSync v1.0.0
        </p>
      </main>
    </div>
  );
}

// ============================================
// Stat Item Component
// ============================================

interface StatItemProps {
  icon: string;
  value: number;
  label: string;
}

function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <div className="text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-title text-aura-text">{value}</p>
      <p className="text-caption text-aura-text-muted">{label}</p>
    </div>
  );
}

// ============================================
// Menu Item Component
// ============================================

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function MenuItem({ icon, label, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 text-left active:bg-aura-sand/50 transition-colors"
    >
      <span className="text-aura-text-secondary">{icon}</span>
      <span className="flex-1 text-body text-aura-text">{label}</span>
      <ChevronRight size={16} className="text-aura-text-muted" />
    </button>
  );
}

// ============================================
// Export
// ============================================

export default ProfileScreen;
