'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useTelegram } from '@/components/TelegramProvider';
import { Plus, Calendar, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  title: string;
  preview: string;
}

// Mock data
const mockEntries: JournalEntry[] = [
  {
    id: '1',
    date: 'Today',
    mood: 'good',
    title: 'Morning reflection',
    preview: 'Woke up feeling refreshed after trying the sleep meditation...',
  },
  {
    id: '2',
    date: 'Yesterday',
    mood: 'okay',
    title: 'Work stress',
    preview: 'Had a challenging day at work, used the SOS breathing...',
  },
];

const moodEmojis: Record<string, string> = {
  great: '😊',
  good: '🙂',
  okay: '😐',
  low: '😔',
  stressed: '😰',
};

export default function JournalPage() {
  const router = useRouter();
  const { hapticFeedback } = useTelegram();
  const [entries] = useState<JournalEntry[]>(mockEntries);

  const handleNewEntry = () => {
    hapticFeedback('medium');
    router.push('/journal/new');
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  const weekDates = weekDays.map((_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return date.getDate();
  });

  const currentDayIndex = (today.getDay() + 6) % 7;

  return (
    <div className="min-h-screen bg-background pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Journal</h1>
            <p className="text-aura-slate/60">Track your emotional journey</p>
          </div>
          <button className="h-10 w-10 rounded-xl bg-aura-mint flex items-center justify-center">
            <Calendar size={20} className="text-white" />
          </button>
        </div>
      </header>

      {/* Week Calendar */}
      <div className="px-5 py-4">
        <div className="card p-4">
          <div className="flex justify-between">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`flex flex-col items-center ${
                  index === currentDayIndex ? 'text-foreground' : 'text-aura-slate/40'
                }`}
              >
                <span className="text-xs font-medium mb-2">{day}</span>
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index === currentDayIndex
                      ? 'bg-aura-mint text-white'
                      : 'bg-transparent'
                  }`}
                >
                  {weekDates[index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="px-5 pb-4">
        <div className="card p-5 bg-gradient-to-br from-aura-lavender-light to-aura-mint-light">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={24} className="text-aura-slate" />
            <span className="font-semibold text-foreground">Weekly Insights</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {['Happy', 'Calm', 'Anxious', 'Sad'].map((emotion, i) => (
              <div key={emotion} className="text-center">
                <div
                  className={`h-16 rounded-lg mb-1 flex items-end justify-center ${
                    i === 0 ? 'bg-yellow-200' :
                    i === 1 ? 'bg-aura-mint' :
                    i === 2 ? 'bg-aura-peach' :
                    'bg-aura-lavender'
                  }`}
                  style={{ height: `${20 + Math.random() * 40}px` }}
                />
                <span className="text-[10px] text-aura-slate/60">{emotion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Recent Entries</h2>
          <button
            onClick={handleNewEntry}
            className="flex items-center gap-1 text-sm text-aura-mint-dark font-medium"
          >
            <Plus size={16} />
            New Entry
          </button>
        </div>

        <div className="space-y-3">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <button
                key={entry.id}
                className="card-soft p-4 w-full text-left transition-transform active:scale-[0.99]"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{moodEmojis[entry.mood] || '😐'}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{entry.title}</h4>
                      <span className="text-xs text-aura-slate/40">{entry.date}</span>
                    </div>
                    <p className="text-sm text-aura-slate/60 mt-1 line-clamp-2">
                      {entry.preview}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="card-soft p-8 text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-medium text-foreground mb-1">No entries yet</h3>
              <p className="text-sm text-aura-slate/60 mb-4">
                Start journaling to track your emotional journey
              </p>
              <button
                onClick={handleNewEntry}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Create First Entry
              </button>
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
