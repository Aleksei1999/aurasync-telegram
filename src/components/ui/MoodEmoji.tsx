'use client';

import { MoodEmoji as MoodEmojiType } from '@/lib/types';

interface MoodEmojiProps {
  emoji: MoodEmojiType;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-xl',
  md: 'w-12 h-12 text-2xl',
  lg: 'w-14 h-14 text-3xl',
};

export function MoodEmojiButton({
  emoji,
  selected = false,
  size = 'md',
  onClick,
}: MoodEmojiProps) {
  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        rounded-full flex items-center justify-center
        transition-all duration-200
        ${selected
          ? 'bg-aura-accent scale-110 shadow-lg'
          : 'bg-aura-sand hover:bg-aura-accent-light active:scale-95'
        }
      `}
    >
      {emoji}
    </button>
  );
}

// Mood emoji grid for diary
interface MoodEmojiGridProps {
  selectedEmoji?: MoodEmojiType;
  onSelect: (emoji: MoodEmojiType) => void;
  layout?: 'row' | 'grid';
}

const allMoodEmojis: MoodEmojiType[] = [
  '😊', '😌', '😐', '😔', '😢', '😰', '😡', '😴', '🥰'
];

export function MoodEmojiGrid({
  selectedEmoji,
  onSelect,
  layout = 'grid',
}: MoodEmojiGridProps) {
  return (
    <div
      className={
        layout === 'grid'
          ? 'grid grid-cols-3 gap-3'
          : 'flex items-center justify-between'
      }
    >
      {allMoodEmojis.map((emoji) => (
        <MoodEmojiButton
          key={emoji}
          emoji={emoji}
          selected={selectedEmoji === emoji}
          size={layout === 'row' ? 'sm' : 'md'}
          onClick={() => onSelect(emoji)}
        />
      ))}
    </div>
  );
}

// Quick mood row (6 main emojis for home screen)
interface QuickMoodRowProps {
  onSelect: (emoji: MoodEmojiType) => void;
}

const quickMoodEmojis: MoodEmojiType[] = ['😊', '😌', '😐', '😔', '😢', '😰'];

export function QuickMoodRow({ onSelect }: QuickMoodRowProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      {quickMoodEmojis.map((emoji) => (
        <MoodEmojiButton
          key={emoji}
          emoji={emoji}
          size="md"
          onClick={() => onSelect(emoji)}
        />
      ))}
    </div>
  );
}
