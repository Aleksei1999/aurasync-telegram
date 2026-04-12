'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Heart, Share2, BookOpen, Lock } from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import { Card, Button, Tag, BottomSheet } from './ui';
import { Emotion } from '@/lib/types';
import { getEmotionById, getRelatedEmotions } from '@/lib/emotions';

interface EmotionCardScreenProps {
  emotionId: string;
}

export function EmotionCardScreen({ emotionId }: EmotionCardScreenProps) {
  const router = useRouter();
  const { hapticFeedback, shareUrl } = useTelegram();
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    const found = getEmotionById(emotionId);
    setEmotion(found || null);

    // Check favorites
    const favorites = JSON.parse(localStorage.getItem('aura_favorite_emotions') || '[]');
    setIsFavorite(favorites.includes(emotionId));

    // Check premium status
    const subscription = localStorage.getItem('aura_subscription');
    setIsPremiumUser(subscription === 'premium');
  }, [emotionId]);

  if (!emotion) {
    return (
      <div className="min-h-screen bg-aura-bg flex items-center justify-center">
        <p className="text-aura-text-secondary">Эмоция не найдена</p>
      </div>
    );
  }

  // Check if locked
  const isLocked = emotion.isPremium && !isPremiumUser;

  const handleClose = () => {
    hapticFeedback('light');
    router.back();
  };

  const toggleFavorite = () => {
    hapticFeedback('medium');
    const favorites = JSON.parse(localStorage.getItem('aura_favorite_emotions') || '[]');

    if (isFavorite) {
      const updated = favorites.filter((id: string) => id !== emotionId);
      localStorage.setItem('aura_favorite_emotions', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push(emotionId);
      localStorage.setItem('aura_favorite_emotions', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleShare = () => {
    hapticFeedback('light');
    // Share emotion card
    const text = `${emotion.name}\n\n${emotion.definition}\n\nУзнай больше об эмоциях в AuraSync`;
    if (shareUrl) {
      shareUrl(`https://t.me/aurasync_bot?start=emotion_${emotion.id}`, text);
    }
  };

  const handleFeelThis = () => {
    hapticFeedback('medium');
    // Create diary entry with this emotion
    const entry = {
      id: `entry_${Date.now()}`,
      timestamp: new Date().toISOString(),
      text: `Я чувствую: ${emotion.name}`,
      detectedEmotion: emotion.name,
      type: 'quick',
    };
    const entries = JSON.parse(localStorage.getItem('aura_diary_entries') || '[]');
    entries.unshift(entry);
    localStorage.setItem('aura_diary_entries', JSON.stringify(entries));

    // Navigate to journal
    router.push('/journal');
  };

  const handlePractice = (practiceId: string) => {
    hapticFeedback('medium');
    router.push(`/practice/${practiceId}`);
  };

  const relatedEmotions = getRelatedEmotions(emotion.id);

  // Get emotion color based on base emotion
  const getEmotionColor = () => {
    const colors: Record<string, string> = {
      joy: '#FFD93D',
      sadness: '#7EB5D6',
      fear: '#9B7EBD',
      anger: '#E57373',
      disgust: '#81C784',
      surprise: '#FFB74D',
      shame: '#F48FB1',
      guilt: '#A1887F',
    };
    return colors[emotion.baseEmotion] || '#9CAF88';
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-aura-bg">
        {/* Header */}
        <header className="flex items-center justify-between px-5 pt-4 pb-2 safe-area-top">
          <button
            onClick={handleClose}
            className="h-10 w-10 rounded-full bg-aura-sand flex items-center justify-center"
          >
            <X size={20} className="text-aura-text" />
          </button>
          <div className="w-10" />
        </header>

        <main className="px-5 py-8 flex flex-col items-center justify-center text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: `${getEmotionColor()}30` }}
          >
            <Lock size={40} className="text-aura-text-muted" />
          </div>

          <h1 className="text-headline text-aura-text mb-2">{emotion.name}</h1>

          <p className="text-body text-aura-text-secondary mb-8">
            Эта эмоция доступна в Premium-версии
          </p>

          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push('/subscription')}
          >
            Открыть Premium
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aura-bg pb-32">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2 safe-area-top">
        <button
          onClick={handleClose}
          className="h-10 w-10 rounded-full bg-aura-sand flex items-center justify-center"
        >
          <X size={20} className="text-aura-text" />
        </button>

        <button
          onClick={handleShare}
          className="h-10 w-10 rounded-full bg-aura-sand flex items-center justify-center"
        >
          <Share2 size={20} className="text-aura-text" />
        </button>
      </header>

      <main className="px-5 py-4 space-y-6">
        {/* Illustration / Color Block */}
        <div
          className="h-32 rounded-3xl flex items-center justify-center"
          style={{ backgroundColor: `${getEmotionColor()}30` }}
        >
          <div
            className="w-20 h-20 rounded-full"
            style={{ backgroundColor: getEmotionColor() }}
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-headline text-aura-text mb-2">{emotion.name}</h1>
          <Tag variant="default">{emotion.baseEmotion}</Tag>
        </div>

        {/* What is it */}
        <Section title="Что это">
          <p className="text-body text-aura-text-secondary">
            {emotion.definition}
          </p>
        </Section>

        {/* Where it lives in body */}
        {emotion.bodyLocation && (
          <Section title="Где живёт в теле">
            <Card variant="soft" className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-24 bg-aura-sand rounded-xl flex items-center justify-center">
                  <BodyDiagram highlight={emotion.bodyLocation} />
                </div>
                <p className="text-body text-aura-text-secondary flex-1">
                  {emotion.bodyLocation}
                </p>
              </div>
            </Card>
          </Section>
        )}

        {/* What it tells us */}
        {emotion.meaning && (
          <Section title="О чём говорит">
            <p className="text-body text-aura-text-secondary">
              {emotion.meaning}
            </p>
          </Section>
        )}

        {/* Triggers */}
        {emotion.triggers && emotion.triggers.length > 0 && (
          <Section title="Что её вызывает">
            <ul className="space-y-2">
              {emotion.triggers.map((trigger, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-aura-accent">•</span>
                  <span className="text-body text-aura-text-secondary">{trigger}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Don't confuse with */}
        {relatedEmotions.length > 0 && (
          <Section title="Не путай с">
            <div className="space-y-3">
              {relatedEmotions.slice(0, 3).map(related => (
                <button
                  key={related.id}
                  onClick={() => router.push(`/emotions/${related.id}`)}
                  className="w-full p-4 bg-white rounded-2xl text-left active:scale-[0.98] transition-transform"
                >
                  <h4 className="text-body-medium text-aura-text mb-1">
                    {related.name}
                  </h4>
                  <p className="text-caption text-aura-text-secondary">
                    {related.definition}
                  </p>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* What helps */}
        {emotion.whatHelps && emotion.whatHelps.length > 0 && (
          <Section title="Что помогает">
            <div className="space-y-3">
              {emotion.whatHelps.map((help, i) => (
                <button
                  key={i}
                  onClick={() => help.practiceId && handlePractice(help.practiceId)}
                  className="w-full p-4 bg-white rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform"
                >
                  <div className="h-10 w-10 rounded-xl bg-aura-accent/10 flex items-center justify-center">
                    <BookOpen size={20} className="text-aura-accent" />
                  </div>
                  <span className="text-body text-aura-text">{help.description}</span>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* What doesn't help */}
        {emotion.whatDoesntHelp && emotion.whatDoesntHelp.length > 0 && (
          <Section title="Что НЕ помогает">
            <ul className="space-y-2">
              {emotion.whatDoesntHelp.map((behavior, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400">✕</span>
                  <span className="text-body text-aura-text-secondary">{behavior}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Supportive thought */}
        {emotion.supportingThought && (
          <Card variant="accent" className="p-5 text-center">
            <p className="text-body text-aura-text italic">
              "{emotion.supportingThought}"
            </p>
          </Card>
        )}
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-aura-bg border-t border-aura-sand px-5 py-4 safe-area-bottom">
        <div className="flex gap-3">
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleFeelThis}
          >
            Я чувствую это
          </Button>

          <button
            onClick={toggleFavorite}
            className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${
              isFavorite
                ? 'bg-red-100 text-red-500'
                : 'bg-aura-sand text-aura-text-secondary'
            }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// Section Component
// ============================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-caption text-aura-text-muted mb-3 uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ============================================
// Body Diagram (Simplified)
// ============================================

function BodyDiagram({ highlight }: { highlight: string }) {
  // Simple body outline with highlight zones
  const highlightZones: Record<string, string> = {
    'грудь': 'top-8',
    'живот': 'top-12',
    'горло': 'top-4',
    'голова': 'top-1',
    'плечи': 'top-6',
    'спина': 'top-10',
  };

  const zone = Object.keys(highlightZones).find(key =>
    highlight.toLowerCase().includes(key)
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Simple body silhouette */}
      <div className="w-8 h-20 bg-aura-text-muted/20 rounded-full relative">
        {/* Head */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-aura-text-muted/20 rounded-full" />

        {/* Highlight zone */}
        {zone && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-6 h-4 bg-aura-accent/40 rounded-full ${highlightZones[zone]}`}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// Export
// ============================================

export default EmotionCardScreen;
