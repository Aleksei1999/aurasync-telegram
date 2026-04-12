'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, HelpCircle, Lock } from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import { Card, Button, Input, Tag } from './ui';
import { Emotion, BaseEmotion } from '@/lib/types';
import { allEmotions, getEmotionsByBase, getEmotionById } from '@/lib/emotions';

// Base emotions with their colors
const baseEmotions: { id: BaseEmotion; name: string; color: string; emoji: string }[] = [
  { id: 'joy', name: 'Радость', color: '#FFD93D', emoji: '😊' },
  { id: 'sadness', name: 'Грусть', color: '#7EB5D6', emoji: '😢' },
  { id: 'fear', name: 'Страх', color: '#9B7EBD', emoji: '😰' },
  { id: 'anger', name: 'Гнев', color: '#E57373', emoji: '😡' },
  { id: 'disgust', name: 'Отвращение', color: '#81C784', emoji: '🤢' },
  { id: 'surprise', name: 'Удивление', color: '#FFB74D', emoji: '😮' },
  { id: 'shame', name: 'Стыд', color: '#F48FB1', emoji: '😳' },
  { id: 'guilt', name: 'Вина', color: '#A1887F', emoji: '😔' },
];

// ============================================
// Emotion Map Main Screen
// ============================================

export function EmotionMapScreen() {
  const router = useRouter();
  const { hapticFeedback } = useTelegram();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBase, setSelectedBase] = useState<BaseEmotion | null>(null);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allEmotions.filter(e =>
      e.name.toLowerCase().includes(query) ||
      e.definition?.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [searchQuery]);

  // Emotion of the week (random for now)
  const emotionOfWeek = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * allEmotions.length);
    return allEmotions[randomIndex];
  }, []);

  const handleBaseEmotionTap = (baseId: BaseEmotion) => {
    hapticFeedback('medium');
    setSelectedBase(baseId);
  };

  const handleEmotionTap = (emotion: Emotion) => {
    hapticFeedback('medium');
    router.push(`/emotions/${emotion.id}`);
  };

  const handleCompass = () => {
    hapticFeedback('medium');
    router.push('/emotions/compass');
  };

  // If a base emotion is selected, show expansion view
  if (selectedBase) {
    return (
      <EmotionExpansion
        baseEmotion={baseEmotions.find(e => e.id === selectedBase)!}
        onBack={() => setSelectedBase(null)}
        onSelect={handleEmotionTap}
      />
    );
  }

  return (
    <div className="min-h-screen bg-aura-bg pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <h1 className="text-headline text-aura-text mb-1">Карта эмоций</h1>
        <p className="text-body text-aura-text-secondary">
          Найди слово для того, что ты чувствуешь
        </p>
      </header>

      <main className="px-5 py-4 space-y-6">
        {/* Help Button */}
        <Button
          variant="secondary"
          fullWidth
          onClick={handleCompass}
          className="flex items-center justify-center gap-2"
        >
          <HelpCircle size={18} />
          Помоги мне понять
        </Button>

        {/* Search */}
        <Input
          type="text"
          placeholder="Поиск эмоции..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card variant="default" className="p-3">
            <div className="space-y-2">
              {searchResults.map(emotion => (
                <button
                  key={emotion.id}
                  onClick={() => handleEmotionTap(emotion)}
                  className="w-full p-3 rounded-xl hover:bg-aura-sand text-left transition-colors"
                >
                  <span className="text-body text-aura-text">{emotion.name}</span>
                  {emotion.isPremium && (
                    <Lock size={14} className="inline ml-2 text-aura-text-muted" />
                  )}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Emotion Wheel */}
        {!searchQuery && (
          <div className="relative py-8">
            <div className="grid grid-cols-4 gap-4">
              {baseEmotions.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => handleBaseEmotionTap(emotion.id)}
                  className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-md"
                    style={{ backgroundColor: emotion.color }}
                  >
                    {emotion.emoji}
                  </div>
                  <span className="text-caption text-aura-text text-center">
                    {emotion.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {!searchQuery && (
          <FavoritesSection onSelect={handleEmotionTap} />
        )}

        {/* Emotion of the Week */}
        {!searchQuery && emotionOfWeek && (
          <Card variant="accent" className="p-4">
            <Tag variant="accent" className="mb-3">Эмоция недели</Tag>
            <h3 className="text-title text-aura-text mb-2">{emotionOfWeek.name}</h3>
            <p className="text-body text-aura-text-secondary mb-3">
              {emotionOfWeek.definition}
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEmotionTap(emotionOfWeek)}
            >
              Узнать больше
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}

// ============================================
// Favorites Section
// ============================================

interface FavoritesSectionProps {
  onSelect: (emotion: Emotion) => void;
}

function FavoritesSection({ onSelect }: FavoritesSectionProps) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('aura_favorite_emotions') || '[]');
    }
    return [];
  });

  const favoriteEmotions = useMemo(() => {
    return favorites.map(id => getEmotionById(id)).filter(Boolean) as Emotion[];
  }, [favorites]);

  if (favoriteEmotions.length === 0) return null;

  return (
    <div>
      <h3 className="text-caption text-aura-text-muted mb-3 uppercase tracking-wide">
        Моё
      </h3>
      <div className="flex flex-wrap gap-2">
        {favoriteEmotions.map(emotion => (
          <button
            key={emotion.id}
            onClick={() => onSelect(emotion)}
            className="px-4 py-2 bg-white rounded-full text-body text-aura-text shadow-sm active:scale-95 transition-transform"
          >
            {emotion.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Emotion Expansion View
// ============================================

interface EmotionExpansionProps {
  baseEmotion: { id: BaseEmotion; name: string; color: string; emoji: string };
  onBack: () => void;
  onSelect: (emotion: Emotion) => void;
}

function EmotionExpansion({ baseEmotion, onBack, onSelect }: EmotionExpansionProps) {
  const { hapticFeedback } = useTelegram();
  const relatedEmotions = getEmotionsByBase(baseEmotion.id);

  return (
    <div className="min-h-screen bg-aura-bg pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <button
          onClick={() => {
            hapticFeedback('light');
            onBack();
          }}
          className="text-aura-accent text-body mb-4"
        >
          ← Назад
        </button>
      </header>

      <main className="px-5 py-4">
        {/* Central Emotion */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg mb-4"
            style={{ backgroundColor: baseEmotion.color }}
          >
            {baseEmotion.emoji}
          </div>
          <h2 className="text-headline text-aura-text">{baseEmotion.name}</h2>
        </div>

        {/* Related Emotions */}
        <div className="space-y-3">
          <p className="text-caption text-aura-text-muted text-center mb-4">
            Выбери оттенок эмоции
          </p>

          <div className="grid grid-cols-3 gap-3">
            {relatedEmotions.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => onSelect(emotion)}
                className="p-4 bg-white rounded-2xl text-center shadow-sm active:scale-95 transition-transform"
                style={{ borderLeft: `4px solid ${baseEmotion.color}` }}
              >
                <span className="text-body text-aura-text">{emotion.name}</span>
                {emotion.isPremium && (
                  <Lock size={12} className="inline ml-1 text-aura-text-muted" />
                )}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================
// Export
// ============================================

export default EmotionMapScreen;
