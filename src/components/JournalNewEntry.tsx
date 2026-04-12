'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Mic, MicOff, Sparkles } from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import { Card, Button, Textarea, BottomSheet, MoodEmojiGrid } from './ui';
import { MoodEmoji, Emotion } from '@/lib/types';
import { allEmotions } from '@/lib/emotions';

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

// Available tags for entries
const availableTags = [
  'работа', 'отношения', 'семья', 'здоровье', 'деньги',
  'творчество', 'отдых', 'сон', 'еда', 'спорт'
];

// Prompts to help start writing
const helpPrompts = [
  'Что сейчас занимает твои мысли больше всего?',
  'Если бы твоё тело могло говорить, что бы оно сказало?',
  'Что ты чувствуешь, когда представляешь завтрашний день?',
  'Что бы ты хотела сказать себе прямо сейчас?',
  'Какой момент сегодня был самым заметным?',
  'Что тебе нужно, чего ты сейчас не получаешь?',
];

interface JournalNewEntryProps {
  initialEmoji?: MoodEmoji;
  mode?: 'write' | 'voice' | 'help';
}

export function JournalNewEntry({ initialEmoji, mode = 'write' }: JournalNewEntryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hapticFeedback } = useTelegram();

  const [text, setText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<MoodEmoji | undefined>(initialEmoji);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showEmotionResult, setShowEmotionResult] = useState(false);
  const [detectedEmotions, setDetectedEmotions] = useState<Emotion[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    const emojiParam = searchParams.get('emoji');
    const modeParam = searchParams.get('mode');

    if (emojiParam) {
      setSelectedEmoji(emojiParam as MoodEmoji);
    }

    if (modeParam === 'help') {
      // Show random prompt
      const randomPrompt = helpPrompts[Math.floor(Math.random() * helpPrompts.length)];
      setCurrentPrompt(randomPrompt);
    }
  }, [searchParams]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    hapticFeedback('light');
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Simple emotion detection based on keywords
  const detectEmotions = useCallback((text: string): Emotion[] => {
    const detected: Emotion[] = [];
    const lowerText = text.toLowerCase();

    // Simple keyword matching (in real app, this would use NLP)
    const emotionKeywords: { [key: string]: string[] } = {
      'anxiety': ['тревога', 'волну', 'беспоко', 'страшно', 'боюсь', 'нервн'],
      'sadness': ['грустн', 'печаль', 'тоск', 'одинок', 'плачу', 'слёз'],
      'anger': ['злость', 'злюсь', 'бесит', 'раздраж', 'ярость', 'обид'],
      'joy': ['радость', 'счастл', 'рад', 'весел', 'хорош', 'отлично'],
      'fear': ['страх', 'боюсь', 'пугает', 'ужас', 'кошмар'],
      'fatigue': ['устал', 'изможд', 'нет сил', 'выгор', 'истощ'],
    };

    Object.entries(emotionKeywords).forEach(([emotionId, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        const emotion = allEmotions.find(e => e.id === emotionId);
        if (emotion && !detected.find(d => d.id === emotionId)) {
          detected.push(emotion);
        }
      }
    });

    return detected.slice(0, 3); // Return max 3 emotions
  }, []);

  // Handle save
  const handleSave = async () => {
    if (!text.trim() && !selectedEmoji) return;

    setIsSaving(true);
    hapticFeedback('medium');

    // Detect emotions if text is substantial
    let emotionsDetected: Emotion[] = [];
    if (text.length > 50) {
      emotionsDetected = detectEmotions(text);
    }

    // Create entry
    const entry: SimpleDiaryEntry = {
      id: `entry_${Date.now()}`,
      timestamp: new Date().toISOString(),
      emoji: selectedEmoji,
      text: text.trim(),
      tags: selectedTags,
      type: text.trim() ? 'full' : 'quick',
      detectedEmotion: emotionsDetected[0]?.name,
    };

    // Save to localStorage
    const existingEntries = JSON.parse(localStorage.getItem('aura_diary_entries') || '[]');
    existingEntries.unshift(entry);
    localStorage.setItem('aura_diary_entries', JSON.stringify(existingEntries));

    // Update stats
    const stats = JSON.parse(localStorage.getItem('aura_user_stats') || '{}');
    stats.diaryEntries = (stats.diaryEntries || 0) + 1;
    localStorage.setItem('aura_user_stats', JSON.stringify(stats));

    setIsSaving(false);

    // Show emotion detection result if emotions were found
    if (emotionsDetected.length > 0) {
      setDetectedEmotions(emotionsDetected);
      setShowEmotionResult(true);
    } else {
      router.back();
    }
  };

  // Handle close
  const handleClose = () => {
    hapticFeedback('light');
    router.back();
  };

  // Handle voice recording toggle
  const toggleRecording = () => {
    hapticFeedback('medium');
    setIsRecording(!isRecording);
    // In real app, implement actual voice recording
  };

  // Handle new prompt
  const getNewPrompt = () => {
    hapticFeedback('light');
    const randomPrompt = helpPrompts[Math.floor(Math.random() * helpPrompts.length)];
    setCurrentPrompt(randomPrompt);
  };

  // Handle emotion card tap
  const handleEmotionTap = (emotion: Emotion) => {
    hapticFeedback('medium');
    router.push(`/emotions/${emotion.id}`);
  };

  const canSave = text.trim().length > 0 || selectedEmoji;

  return (
    <div className="min-h-screen bg-aura-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2 safe-area-top border-b border-aura-sand">
        <button
          onClick={handleClose}
          className="h-10 w-10 rounded-full bg-aura-sand flex items-center justify-center"
        >
          <X size={20} className="text-aura-text" />
        </button>

        <h1 className="text-title text-aura-text">Новая запись</h1>

        <div className="w-10" />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-4 space-y-4 overflow-auto">
        {/* Help Prompt */}
        {currentPrompt && (
          <Card variant="accent" className="p-4">
            <p className="text-body text-aura-text mb-3">{currentPrompt}</p>
            <button
              onClick={getNewPrompt}
              className="text-caption text-aura-accent flex items-center gap-1"
            >
              <Sparkles size={14} />
              Другой вопрос
            </button>
          </Card>
        )}

        {/* Text Input */}
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="О чём ты сейчас?"
            className="min-h-[200px] text-lg"
          />

          {/* Voice Button */}
          <button
            onClick={toggleRecording}
            className={`absolute bottom-3 right-3 h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
              isRecording
                ? 'bg-red-500 text-white'
                : 'bg-aura-sand text-aura-text-secondary'
            }`}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        </div>

        {/* Emoji Selection */}
        <div>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex items-center gap-2 text-body text-aura-text-secondary mb-3"
          >
            {selectedEmoji ? (
              <span className="text-2xl">{selectedEmoji}</span>
            ) : (
              <span>Добавить эмоцию</span>
            )}
          </button>

          {showEmojiPicker && (
            <Card variant="soft" className="p-4">
              <MoodEmojiGrid
                selectedEmoji={selectedEmoji}
                onSelect={(emoji) => {
                  setSelectedEmoji(emoji);
                  setShowEmojiPicker(false);
                }}
                layout="grid"
              />
            </Card>
          )}
        </div>

        {/* Tags */}
        <div>
          <p className="text-caption text-aura-text-muted mb-2">Теги (опционально)</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-aura-accent text-white'
                    : 'bg-aura-sand text-aura-text-secondary'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Help Link */}
        {!currentPrompt && (
          <button
            onClick={() => {
              const randomPrompt = helpPrompts[Math.floor(Math.random() * helpPrompts.length)];
              setCurrentPrompt(randomPrompt);
            }}
            className="text-caption text-aura-accent"
          >
            Помочь начать?
          </button>
        )}
      </main>

      {/* Footer */}
      <footer className="px-5 py-4 safe-area-bottom border-t border-aura-sand">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={handleSave}
          disabled={!canSave || isSaving}
        >
          {isSaving ? 'Сохраняю...' : 'Сохранить'}
        </Button>
      </footer>

      {/* Emotion Detection Result */}
      <BottomSheet
        isOpen={showEmotionResult}
        onClose={() => {
          setShowEmotionResult(false);
          router.back();
        }}
        title="Я слышу здесь..."
      >
        <div className="space-y-3">
          {detectedEmotions.map(emotion => (
            <button
              key={emotion.id}
              onClick={() => handleEmotionTap(emotion)}
              className="w-full p-4 bg-aura-sand rounded-2xl text-left active:scale-[0.98] transition-transform"
            >
              <h4 className="text-body-medium text-aura-text mb-1">
                {emotion.name}
              </h4>
              <p className="text-caption text-aura-text-secondary">
                {emotion.definition}
              </p>
            </button>
          ))}

          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                if (detectedEmotions[0]) {
                  router.push(`/emotions/${detectedEmotions[0].id}`);
                }
              }}
            >
              Открыть карту
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowEmotionResult(false);
                router.back();
              }}
            >
              Закрыть
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

export default JournalNewEntry;
