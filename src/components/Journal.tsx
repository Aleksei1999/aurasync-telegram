'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, PenLine, Mic, HelpCircle, Plus } from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import { Card, Button, Tag, MoodEmojiGrid } from './ui';
import { MoodEmoji } from '@/lib/types';

// Simplified diary entry for localStorage
interface SimpleDiaryEntry {
  id: string;
  timestamp: string;
  emoji?: MoodEmoji;
  text?: string;
  tags?: string[];
  type: 'quick' | 'full';
  detectedEmotion?: string;
}

// ============================================
// Journal Main Screen
// ============================================

export function JournalScreen() {
  const router = useRouter();
  const { hapticFeedback } = useTelegram();
  const [entries, setEntries] = useState<SimpleDiaryEntry[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<MoodEmoji | undefined>();

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('aura_diary_entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups: { [key: string]: SimpleDiaryEntry[] } = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    entries.forEach(entry => {
      const entryDate = new Date(entry.timestamp).toDateString();
      let groupKey: string;

      if (entryDate === today) {
        groupKey = 'Сегодня';
      } else if (entryDate === yesterday) {
        groupKey = 'Вчера';
      } else {
        // Check if within this week
        const daysDiff = Math.floor((Date.now() - new Date(entry.timestamp).getTime()) / 86400000);
        if (daysDiff < 7) {
          groupKey = 'На этой неделе';
        } else {
          groupKey = 'Раньше';
        }
      }

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(entry);
    });

    return groups;
  }, [entries]);

  const handleEmojiSelect = (emoji: MoodEmoji) => {
    hapticFeedback('light');
    setSelectedEmoji(emoji);
  };

  const handleQuickEntry = () => {
    if (selectedEmoji) {
      hapticFeedback('medium');
      router.push(`/journal/new?emoji=${selectedEmoji}`);
    }
  };

  const handleNewEntry = () => {
    hapticFeedback('medium');
    router.push('/journal/new');
  };

  const handleVoiceEntry = () => {
    hapticFeedback('medium');
    router.push('/journal/new?mode=voice');
  };

  const handleHelpStart = () => {
    hapticFeedback('medium');
    router.push('/journal/new?mode=help');
  };

  const handleInsights = () => {
    hapticFeedback('light');
    router.push('/journal/insights');
  };

  const isEmpty = entries.length === 0;

  return (
    <div className="min-h-screen bg-aura-bg pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-between">
          <h1 className="text-headline text-aura-text">Дневник</h1>
          <button
            onClick={handleInsights}
            className="h-10 w-10 rounded-full bg-aura-sand flex items-center justify-center"
          >
            <BarChart3 size={20} className="text-aura-text-secondary" />
          </button>
        </div>
      </header>

      <main className="px-5 py-4 space-y-4">
        {/* How are you now? */}
        <Card variant="accent" className="p-5">
          <h2 className="text-title text-aura-text mb-4">Как ты сейчас?</h2>
          <MoodEmojiGrid
            selectedEmoji={selectedEmoji}
            onSelect={handleEmojiSelect}
            layout="grid"
          />
          <Button
            variant="primary"
            fullWidth
            className="mt-4"
            onClick={handleQuickEntry}
            disabled={!selectedEmoji}
          >
            Записать
          </Button>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleNewEntry}
            className="p-4 bg-white rounded-2xl flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform"
          >
            <PenLine size={24} className="text-aura-accent" />
            <span className="text-caption text-aura-text">Написать</span>
          </button>

          <button
            onClick={handleVoiceEntry}
            className="p-4 bg-white rounded-2xl flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform"
          >
            <Mic size={24} className="text-aura-accent" />
            <span className="text-caption text-aura-text">Голосом</span>
          </button>

          <button
            onClick={handleHelpStart}
            className="p-4 bg-white rounded-2xl flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform"
          >
            <HelpCircle size={24} className="text-aura-accent" />
            <span className="text-caption text-aura-text">Помочь</span>
          </button>
        </div>

        {/* Entries List or Empty State */}
        {isEmpty ? (
          <EmptyState onNewEntry={handleNewEntry} />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEntries).map(([group, groupEntries]) => (
              <div key={group}>
                <h3 className="text-caption text-aura-text-muted mb-3 uppercase tracking-wide">
                  {group}
                </h3>
                <div className="space-y-3">
                  {groupEntries.map((entry) => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      onClick={() => router.push(`/journal/${entry.id}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FAB for new entry */}
      {!isEmpty && (
        <button
          onClick={handleNewEntry}
          className="fixed right-5 bottom-24 h-14 w-14 rounded-full bg-aura-accent shadow-lg shadow-aura-accent/30 flex items-center justify-center z-40"
        >
          <Plus size={24} className="text-white" />
        </button>
      )}
    </div>
  );
}

// ============================================
// Empty State Component
// ============================================

function EmptyState({ onNewEntry }: { onNewEntry: () => void }) {
  return (
    <Card variant="soft" className="p-8 text-center">
      <div className="text-6xl mb-4">📔</div>
      <h3 className="text-title text-aura-text mb-2">
        Тут будут твои записи
      </h3>
      <p className="text-body text-aura-text-secondary mb-6">
        Когда захочется — приходи. Здесь тебя всегда выслушают.
      </p>
      <Button variant="primary" onClick={onNewEntry}>
        Написать первую запись
      </Button>
    </Card>
  );
}

// ============================================
// Entry Card Component
// ============================================

interface EntryCardProps {
  entry: SimpleDiaryEntry;
  onClick: () => void;
}

function EntryCard({ entry, onClick }: EntryCardProps) {
  const time = new Date(entry.timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const preview = entry.text
    ? entry.text.slice(0, 100) + (entry.text.length > 100 ? '...' : '')
    : '';

  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-white rounded-2xl text-left shadow-sm active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start gap-3">
        {/* Emoji */}
        <span className="text-2xl">{entry.emoji}</span>

        <div className="flex-1 min-w-0">
          {/* Time and detected emotion */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption text-aura-text-muted">{time}</span>
            {entry.detectedEmotion && (
              <Tag variant="accent" className="text-xs">
                {entry.detectedEmotion}
              </Tag>
            )}
          </div>

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {entry.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-aura-sand rounded-full text-xs text-aura-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Preview */}
          {preview && (
            <p className="text-body text-aura-text-secondary line-clamp-2">
              {preview}
            </p>
          )}

          {/* Quick entry indicator */}
          {entry.type === 'quick' && !preview && (
            <p className="text-caption text-aura-text-muted italic">
              Быстрая отметка
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

// ============================================
// Export
// ============================================

export default JournalScreen;
