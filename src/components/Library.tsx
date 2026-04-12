'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Star, Lock, Clock, ChevronRight } from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import { Card, Button, Input, Tag } from './ui';
import { Meditation, BreathingPractice, Course } from '@/lib/types';
import { allMeditations, getMeditationsByCategory } from '@/lib/meditations';
import { allBreathingPractices } from '@/lib/breathing';
import { allCourses, getFreeCourses } from '@/lib/courses';

// Library categories
const categories = [
  { id: 'emotions', name: 'Работа с эмоциями', icon: '💚', color: '#9CAF88' },
  { id: 'transitions', name: 'Жизненные переходы', icon: '🦋', color: '#9B7EBD' },
  { id: 'body', name: 'Тело и здоровье', icon: '🧘‍♀️', color: '#FFB74D' },
  { id: 'sleep', name: 'Сон и вечер', icon: '🌙', color: '#7EB5D6' },
  { id: 'morning', name: 'Утро и энергия', icon: '☀️', color: '#FFD93D' },
  { id: 'women', name: 'Женское', icon: '🌸', color: '#F48FB1' },
  { id: 'breathing', name: 'Дыхательные практики', icon: '🫁', color: '#81C784' },
  { id: 'courses', name: 'Курсы', icon: '📚', color: '#A1887F' },
];

// ============================================
// Library Main Screen
// ============================================

export function LibraryScreen() {
  const router = useRouter();
  const { hapticFeedback } = useTelegram();
  const [searchQuery, setSearchQuery] = useState('');

  // Personalized recommendations
  const recommendations = useMemo(() => {
    // In real app, this would be based on user's history and preferences
    return allMeditations.slice(0, 5);
  }, []);

  // Popular items
  const popularItems = useMemo(() => {
    return allMeditations.filter(m => !m.isPremium).slice(0, 5);
  }, []);

  // Search results
  const searchResults = useMemo((): { meditations: Meditation[]; breathing: BreathingPractice[]; courses: Course[] } => {
    if (!searchQuery.trim()) return { meditations: [], breathing: [], courses: [] };
    const query = searchQuery.toLowerCase();

    const meditations = allMeditations.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.theme?.toLowerCase().includes(query)
    );

    const breathing = allBreathingPractices.filter(b =>
      b.name.toLowerCase().includes(query) ||
      b.howToDo?.toLowerCase().includes(query)
    );

    const courses = allCourses.filter(c =>
      c.title.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query)
    );

    return { meditations, breathing, courses };
  }, [searchQuery]);

  const handleCategoryTap = (categoryId: string) => {
    hapticFeedback('medium');
    router.push(`/library/${categoryId}`);
  };

  const handleItemTap = (type: string, id: string) => {
    hapticFeedback('medium');
    router.push(`/library/item/${type}/${id}`);
  };

  const hasSearchResults = searchQuery.trim() && (
    searchResults.meditations?.length > 0 ||
    searchResults.breathing?.length > 0 ||
    searchResults.courses?.length > 0
  );

  return (
    <div className="min-h-screen bg-aura-bg pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <h1 className="text-headline text-aura-text mb-4">Библиотека</h1>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-aura-text-muted" />
          <Input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </header>

      <main className="px-5 py-4 space-y-6">
        {/* Search Results */}
        {hasSearchResults && (
          <SearchResults
            results={searchResults}
            onItemTap={handleItemTap}
          />
        )}

        {/* Regular Content (hidden when searching) */}
        {!searchQuery.trim() && (
          <>
            {/* Personalized */}
            <div>
              <h2 className="text-title text-aura-text mb-3">Подобрано для тебя</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                {recommendations.map(item => (
                  <MiniCard
                    key={item.id}
                    title={item.name}
                    duration={item.durationMinutes}
                    isPremium={item.isPremium}
                    onClick={() => handleItemTap('meditation', item.id)}
                  />
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-title text-aura-text mb-3">Категории</h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryTap(category.id)}
                    className="p-4 bg-white rounded-2xl text-left shadow-sm active:scale-[0.98] transition-transform"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <span className="text-body text-aura-text">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular */}
            <div>
              <h2 className="text-title text-aura-text mb-3">Часто ищут</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                {popularItems.map(item => (
                  <MiniCard
                    key={item.id}
                    title={item.name}
                    duration={item.durationMinutes}
                    isPremium={item.isPremium}
                    onClick={() => handleItemTap('meditation', item.id)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ============================================
// Mini Card Component
// ============================================

interface MiniCardProps {
  title: string;
  duration: number;
  isPremium?: boolean;
  onClick: () => void;
}

function MiniCard({ title, duration, isPremium, onClick }: MiniCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-40 p-4 bg-white rounded-2xl text-left shadow-sm active:scale-95 transition-transform"
    >
      <div className="h-20 bg-aura-sand rounded-xl mb-3" />
      <h4 className="text-body-medium text-aura-text mb-1 line-clamp-2">{title}</h4>
      <div className="flex items-center gap-2 text-caption text-aura-text-muted">
        <Clock size={12} />
        <span>{duration} мин</span>
        {isPremium && <Lock size={12} />}
      </div>
    </button>
  );
}

// ============================================
// Search Results Component
// ============================================

interface SearchResultsProps {
  results: {
    meditations: Meditation[];
    breathing: BreathingPractice[];
    courses: Course[];
  };
  onItemTap: (type: string, id: string) => void;
}

function SearchResults({ results, onItemTap }: SearchResultsProps) {
  return (
    <div className="space-y-6">
      {/* Meditations */}
      {results.meditations.length > 0 && (
        <div>
          <h3 className="text-caption text-aura-text-muted mb-3 uppercase tracking-wide">
            Медитации ({results.meditations.length})
          </h3>
          <div className="space-y-2">
            {results.meditations.slice(0, 5).map(item => (
              <button
                key={item.id}
                onClick={() => onItemTap('meditation', item.id)}
                className="w-full p-3 bg-white rounded-xl text-left flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-aura-sand rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-body text-aura-text truncate">{item.name}</h4>
                  <span className="text-caption text-aura-text-muted">{item.durationMinutes} мин</span>
                </div>
                {item.isPremium && <Lock size={14} className="text-aura-text-muted" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Breathing */}
      {results.breathing.length > 0 && (
        <div>
          <h3 className="text-caption text-aura-text-muted mb-3 uppercase tracking-wide">
            Дыхательные техники ({results.breathing.length})
          </h3>
          <div className="space-y-2">
            {results.breathing.slice(0, 5).map(item => (
              <button
                key={item.id}
                onClick={() => onItemTap('breathing', item.id)}
                className="w-full p-3 bg-white rounded-xl text-left flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-aura-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  🫁
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-body text-aura-text truncate">{item.name}</h4>
                  <span className="text-caption text-aura-text-muted">{item.durationMinutes.min}-{item.durationMinutes.max} мин</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Courses */}
      {results.courses.length > 0 && (
        <div>
          <h3 className="text-caption text-aura-text-muted mb-3 uppercase tracking-wide">
            Курсы ({results.courses.length})
          </h3>
          <div className="space-y-2">
            {results.courses.slice(0, 5).map(item => (
              <button
                key={item.id}
                onClick={() => onItemTap('course', item.id)}
                className="w-full p-3 bg-white rounded-xl text-left flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-aura-lavender/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  📚
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-body text-aura-text truncate">{item.title}</h4>
                  <span className="text-caption text-aura-text-muted">{item.durationDays} дней</span>
                </div>
                {item.isPremium && <Lock size={14} className="text-aura-text-muted" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Library Category Screen
// ============================================

interface LibraryCategoryScreenProps {
  categoryId: string;
}

export function LibraryCategoryScreen({ categoryId }: LibraryCategoryScreenProps) {
  const router = useRouter();
  const { hapticFeedback } = useTelegram();
  const category = categories.find(c => c.id === categoryId);

  // Get items for category
  const items = useMemo(() => {
    if (categoryId === 'breathing') {
      return allBreathingPractices.map(b => ({
        id: b.id,
        type: 'breathing' as const,
        title: b.name,
        description: b.howToDo,
        duration: b.durationMinutes.min,
        isPremium: b.isPremium,
      }));
    }

    if (categoryId === 'courses') {
      return allCourses.map(c => ({
        id: c.id,
        type: 'course' as const,
        title: c.title,
        description: c.description,
        duration: c.durationDays,
        isPremium: c.isPremium,
      }));
    }

    // Get meditations by category
    const categoryMeditations = getMeditationsByCategory(categoryId);
    return categoryMeditations.map(m => ({
      id: m.id,
      type: 'meditation' as const,
      title: m.name,
      description: m.theme,
      duration: m.durationMinutes,
      isPremium: m.isPremium,
    }));
  }, [categoryId]);

  const handleBack = () => {
    hapticFeedback('light');
    router.back();
  };

  const handleItemTap = (type: string, id: string) => {
    hapticFeedback('medium');
    router.push(`/library/item/${type}/${id}`);
  };

  return (
    <div className="min-h-screen bg-aura-bg pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-4 safe-area-top border-b border-aura-sand">
        <button onClick={handleBack} className="text-aura-accent text-body mb-2">
          ← Назад
        </button>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${category?.color}20` }}
          >
            {category?.icon}
          </div>
          <h1 className="text-headline text-aura-text">{category?.name}</h1>
        </div>
      </header>

      <main className="px-5 py-4">
        {items.length === 0 ? (
          <Card variant="soft" className="p-8 text-center">
            <p className="text-body text-aura-text-secondary">
              В этой категории пока нет материалов
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemTap(item.type, item.id)}
                className="w-full p-4 bg-white rounded-2xl text-left shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-aura-sand rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-body-medium text-aura-text">{item.title}</h3>
                      {item.isPremium && <Lock size={14} className="text-aura-text-muted flex-shrink-0" />}
                    </div>
                    {item.description && (
                      <p className="text-caption text-aura-text-secondary line-clamp-2 mb-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-caption text-aura-text-muted">
                      <Clock size={12} />
                      <span>
                        {item.type === 'course' ? `${item.duration} дней` : `${item.duration} мин`}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ============================================
// Export
// ============================================

export default LibraryScreen;
