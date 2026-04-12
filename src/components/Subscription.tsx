'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Crown, X } from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import { Card, Button, Tag } from './ui';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  savings?: string;
  recommended?: boolean;
}

const plans: Plan[] = [
  {
    id: 'trial',
    name: '7 дней бесплатно',
    price: 0,
    period: 'пробный период',
  },
  {
    id: 'monthly',
    name: 'Месячная',
    price: 490,
    period: 'в месяц',
  },
  {
    id: 'yearly',
    name: 'Годовая',
    price: 3990,
    period: 'в год',
    savings: 'Экономия 34%',
    recommended: true,
  },
  {
    id: 'lifetime',
    name: 'Навсегда',
    price: 9990,
    period: 'единоразово',
  },
];

const premiumFeatures = [
  'Вся карта эмоций (56 эмоций)',
  'Все материалы библиотеки',
  '10 курсов личностного роста',
  'Расширенные недельные отчёты',
  'PDF-экспорт дневника',
  'Голосовые подарки и медитации',
  'Приоритетная поддержка',
];

const freeFeatures = [
  'Базовые медитации (10 шт)',
  'Дыхательные техники (5 шт)',
  'Дневник эмоций',
  '8 базовых эмоций в карте',
  '1 бесплатный курс',
];

export function SubscriptionScreen() {
  const router = useRouter();
  const { hapticFeedback } = useTelegram();
  const [isPremium, setIsPremium] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);

  useEffect(() => {
    const subscription = localStorage.getItem('aura_subscription');
    const until = localStorage.getItem('aura_subscription_until');
    setIsPremium(subscription === 'premium');
    setPremiumUntil(until);
  }, []);

  const handleBack = () => {
    hapticFeedback('light');
    router.back();
  };

  const handleSelectPlan = (planId: string) => {
    hapticFeedback('light');
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    hapticFeedback('medium');
    // In real app, this would open payment
    // For demo, just activate premium
    localStorage.setItem('aura_subscription', 'premium');
    const until = new Date();
    until.setFullYear(until.getFullYear() + 1);
    localStorage.setItem('aura_subscription_until', until.toISOString());
    setIsPremium(true);
    setPremiumUntil(until.toISOString());
  };

  const handleManageSubscription = () => {
    hapticFeedback('light');
    // Open system subscription management
    alert('Откроется управление подпиской в App Store / Google Play');
  };

  if (isPremium) {
    return (
      <div className="min-h-screen bg-aura-bg">
        {/* Header */}
        <header className="px-5 pt-4 pb-4 safe-area-top border-b border-aura-sand">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="h-10 w-10 rounded-full bg-aura-sand flex items-center justify-center"
            >
              <ChevronLeft size={20} className="text-aura-text" />
            </button>
            <h1 className="text-headline text-aura-text">Подписка</h1>
          </div>
        </header>

        <main className="px-5 py-6 space-y-6">
          {/* Status Card */}
          <Card variant="accent" className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-aura-accent/20 flex items-center justify-center mx-auto mb-4">
              <Crown size={32} className="text-aura-accent" />
            </div>
            <h2 className="text-headline text-aura-text mb-2">Premium активна</h2>
            {premiumUntil && (
              <p className="text-body text-aura-text-secondary">
                До {new Date(premiumUntil).toLocaleDateString('ru-RU')}
              </p>
            )}
          </Card>

          {/* What's included */}
          <Card variant="default" className="p-5">
            <h3 className="text-title text-aura-text mb-4">Что включено</h3>
            <ul className="space-y-3">
              {premiumFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-aura-accent flex-shrink-0 mt-0.5" />
                  <span className="text-body text-aura-text-secondary">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Manage */}
          <Button
            variant="secondary"
            fullWidth
            onClick={handleManageSubscription}
          >
            Управление подпиской
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aura-bg pb-32">
      {/* Header */}
      <header className="px-5 pt-4 pb-4 safe-area-top">
        <button
          onClick={handleBack}
          className="h-10 w-10 rounded-full bg-aura-sand flex items-center justify-center"
        >
          <X size={20} className="text-aura-text" />
        </button>
      </header>

      <main className="px-5 py-4 space-y-6">
        {/* Hero */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-aura-accent to-aura-lavender flex items-center justify-center mx-auto mb-4">
            <Crown size={40} className="text-white" />
          </div>
          <h1 className="text-headline text-aura-text mb-2">Открой Premium</h1>
          <p className="text-body text-aura-text-secondary">
            Получи безлимитный доступ ко всем функциям AuraSync
          </p>
        </div>

        {/* What's included */}
        <Card variant="soft" className="p-5">
          <h3 className="text-body-medium text-aura-text mb-4">Что ты получишь:</h3>
          <ul className="space-y-3">
            {premiumFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check size={18} className="text-aura-accent flex-shrink-0 mt-0.5" />
                <span className="text-body text-aura-text-secondary">{feature}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Plans */}
        <div className="space-y-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handleSelectPlan(plan.id)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                selectedPlan === plan.id
                  ? 'border-aura-accent bg-aura-accent/5'
                  : 'border-aura-sand bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-body-medium text-aura-text">{plan.name}</span>
                    {plan.recommended && (
                      <Tag variant="accent">Рекомендуем</Tag>
                    )}
                  </div>
                  {plan.savings && (
                    <span className="text-caption text-aura-accent">{plan.savings}</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-title text-aura-text">
                    {plan.price === 0 ? 'Бесплатно' : `${plan.price} ₽`}
                  </span>
                  <p className="text-caption text-aura-text-muted">{plan.period}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Free features */}
        <div className="pt-4">
          <p className="text-caption text-aura-text-muted text-center mb-3">
            На бесплатном плане доступно:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {freeFeatures.map((feature, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-aura-sand rounded-full text-caption text-aura-text-secondary"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-aura-bg border-t border-aura-sand px-5 py-4 safe-area-bottom">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={handleSubscribe}
        >
          {selectedPlan === 'trial' ? 'Начать бесплатно' : 'Оформить подписку'}
        </Button>
        <p className="text-caption text-aura-text-muted text-center mt-3">
          Отменить можно в любой момент. Деньги не спишутся, пока ты сама не подтвердишь.
        </p>
      </footer>
    </div>
  );
}

export default SubscriptionScreen;
