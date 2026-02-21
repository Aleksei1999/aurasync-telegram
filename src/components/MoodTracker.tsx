'use client';

import { useState } from 'react';
import { useTelegram } from './TelegramProvider';

interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

const moods: Mood[] = [
  { id: 'great', emoji: '😊', label: 'Great', color: 'bg-green-100 border-green-300' },
  { id: 'good', emoji: '🙂', label: 'Good', color: 'bg-aura-mint-light border-aura-mint' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: 'bg-aura-cream border-aura-peach' },
  { id: 'low', emoji: '😔', label: 'Low', color: 'bg-aura-lavender-light border-aura-lavender' },
  { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'bg-aura-peach-light border-aura-peach-dark' },
];

interface MoodTrackerProps {
  onMoodSelect?: (moodId: string) => void;
  selectedMood?: string;
}

export function MoodTracker({ onMoodSelect, selectedMood }: MoodTrackerProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedMood);
  const { hapticFeedback } = useTelegram();

  const handleSelect = (moodId: string) => {
    hapticFeedback('light');
    setSelected(moodId);
    onMoodSelect?.(moodId);
  };

  return (
    <div className="space-y-3">
      <div className="px-1">
        <h3 className="font-semibold text-foreground">How are you feeling?</h3>
        <p className="text-sm text-aura-slate/60">Track your emotional state</p>
      </div>

      <div className="flex justify-between gap-2">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleSelect(mood.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all ${
              selected === mood.id
                ? `${mood.color} scale-105`
                : 'bg-white border-transparent'
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-[10px] font-medium text-aura-slate/70">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
