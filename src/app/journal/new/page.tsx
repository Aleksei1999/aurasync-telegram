'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegram } from '@/components/TelegramProvider';
import { ArrowLeft, Sparkles } from 'lucide-react';

const moods = [
  { id: 'great', emoji: '😊', label: 'Отлично' },
  { id: 'good', emoji: '🙂', label: 'Хорошо' },
  { id: 'okay', emoji: '😐', label: 'Норм' },
  { id: 'low', emoji: '😔', label: 'Грустно' },
  { id: 'stressed', emoji: '😰', label: 'Стресс' },
];

const prompts = [
  'За что ты благодарна сегодня?',
  'Как ты хочешь себя чувствовать?',
  'Что у тебя на уме?',
  'Опиши свой уровень энергии',
];

export default function NewJournalPage() {
  const router = useRouter();
  const { hapticFeedback, showBackButton, hideBackButton } = useTelegram();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [text, setText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  // Setup back button
  useState(() => {
    showBackButton(() => {
      router.back();
    });
    return () => hideBackButton();
  });

  const handleMoodSelect = (moodId: string) => {
    hapticFeedback('light');
    setSelectedMood(moodId);
  };

  const handlePromptSelect = (prompt: string) => {
    hapticFeedback('light');
    setSelectedPrompt(prompt);
    setText(prompt + '\n\n');
  };

  const handleSave = () => {
    hapticFeedback('medium');
    // TODO: Save to database
    console.log('Saving entry:', { mood: selectedMood, text });
    router.push('/journal');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-aura-slate" />
        </button>
        <h1 className="text-xl font-semibold text-foreground">Новая запись</h1>
      </header>

      <main className="px-5 py-4 space-y-6">
        {/* Mood Selection */}
        <div>
          <h2 className="font-medium text-foreground mb-3">Как ты себя чувствуешь?</h2>
          <div className="flex justify-between gap-2">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all ${
                  selectedMood === mood.id
                    ? 'bg-aura-mint-light border-aura-mint scale-105'
                    : 'bg-white border-transparent'
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-[10px] font-medium text-aura-slate/70">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Prompts */}
        <div>
          <h2 className="font-medium text-foreground mb-3">Быстрые подсказки</h2>
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptSelect(prompt)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedPrompt === prompt
                    ? 'bg-aura-mint text-white'
                    : 'bg-white text-aura-slate/70 border border-aura-slate/10'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div>
          <h2 className="font-medium text-foreground mb-3">Твои мысли</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Напиши, что у тебя на душе..."
            className="w-full h-48 p-4 rounded-xl bg-white border border-aura-slate/10 text-foreground placeholder:text-aura-slate/40 focus:outline-none focus:border-aura-mint resize-none"
          />
        </div>

        {/* AI Analysis Preview */}
        {text.length > 20 && (
          <div className="card-soft p-4 bg-gradient-to-br from-aura-lavender-light to-aura-mint-light">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-aura-slate" />
              <span className="text-sm font-medium text-foreground">AI-анализ</span>
            </div>
            <p className="text-sm text-aura-slate/70">
              На основе твоей записи рекомендуем успокаивающее дыхательное упражнение...
            </p>
          </div>
        )}
      </main>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background to-transparent safe-area-bottom">
        <button
          onClick={handleSave}
          disabled={!selectedMood || text.length < 5}
          className={`w-full btn-primary ${
            !selectedMood || text.length < 5 ? 'opacity-50' : ''
          }`}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
