'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useTelegram } from './TelegramProvider';

interface OnboardingQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'scale';
  options?: { id: string; label: string; emoji?: string }[];
  scaleLabels?: { min: string; max: string };
}

const questions: OnboardingQuestion[] = [
  {
    id: 'age_group',
    question: 'К какой возрастной группе ты относишься?',
    type: 'single',
    options: [
      { id: '18-24', label: '18-24' },
      { id: '25-34', label: '25-34' },
      { id: '35-44', label: '35-44' },
      { id: '45+', label: '45+' },
    ],
  },
  {
    id: 'main_goal',
    question: 'Какая твоя главная цель?',
    type: 'single',
    options: [
      { id: 'stress', label: 'Снизить стресс', emoji: '😮‍💨' },
      { id: 'sleep', label: 'Улучшить сон', emoji: '😴' },
      { id: 'energy', label: 'Больше энергии', emoji: '⚡' },
      { id: 'beauty', label: 'Улучшить внешность', emoji: '✨' },
      { id: 'focus', label: 'Повысить концентрацию', emoji: '🎯' },
    ],
  },
  {
    id: 'stress_level',
    question: 'Как часто ты испытываешь стресс?',
    type: 'single',
    options: [
      { id: 'rarely', label: 'Редко' },
      { id: 'sometimes', label: 'Иногда' },
      { id: 'often', label: 'Часто' },
      { id: 'always', label: 'Постоянно' },
    ],
  },
  {
    id: 'sleep_quality',
    question: 'Как ты оцениваешь качество своего сна?',
    type: 'single',
    options: [
      { id: 'great', label: 'Отлично сплю', emoji: '😊' },
      { id: 'good', label: 'Нормально', emoji: '🙂' },
      { id: 'poor', label: 'Плохо засыпаю', emoji: '😕' },
      { id: 'terrible', label: 'Бессонница', emoji: '😫' },
    ],
  },
  {
    id: 'wake_up_time',
    question: 'Во сколько ты обычно просыпаешься?',
    type: 'single',
    options: [
      { id: 'early', label: 'До 6:00' },
      { id: 'morning', label: '6:00 - 8:00' },
      { id: 'late_morning', label: '8:00 - 10:00' },
      { id: 'late', label: 'После 10:00' },
    ],
  },
  {
    id: 'energy_pattern',
    question: 'Когда у тебя больше всего энергии?',
    type: 'single',
    options: [
      { id: 'morning', label: 'Утром', emoji: '🌅' },
      { id: 'afternoon', label: 'Днём', emoji: '☀️' },
      { id: 'evening', label: 'Вечером', emoji: '🌆' },
      { id: 'varies', label: 'По-разному', emoji: '🔄' },
    ],
  },
  {
    id: 'work_type',
    question: 'Какой у тебя тип работы?',
    type: 'single',
    options: [
      { id: 'office', label: 'Офис/удалёнка' },
      { id: 'active', label: 'Активная работа' },
      { id: 'creative', label: 'Творческая' },
      { id: 'caring', label: 'Забота о других' },
      { id: 'not_working', label: 'Не работаю' },
    ],
  },
  {
    id: 'physical_symptoms',
    question: 'Какие физические симптомы тебя беспокоят?',
    type: 'multiple',
    options: [
      { id: 'headaches', label: 'Головные боли' },
      { id: 'fatigue', label: 'Усталость' },
      { id: 'skin', label: 'Проблемы с кожей' },
      { id: 'weight', label: 'Лишний вес' },
      { id: 'tension', label: 'Напряжение в теле' },
      { id: 'none', label: 'Ничего из этого' },
    ],
  },
  {
    id: 'emotional_challenges',
    question: 'С какими эмоциональными сложностями ты сталкиваешься?',
    type: 'multiple',
    options: [
      { id: 'anxiety', label: 'Тревожность' },
      { id: 'irritability', label: 'Раздражительность' },
      { id: 'sadness', label: 'Грусть' },
      { id: 'overwhelm', label: 'Перегруженность' },
      { id: 'low_motivation', label: 'Низкая мотивация' },
      { id: 'none', label: 'Всё хорошо' },
    ],
  },
  {
    id: 'meditation_experience',
    question: 'У тебя есть опыт медитации?',
    type: 'single',
    options: [
      { id: 'none', label: 'Никогда не пробовала' },
      { id: 'beginner', label: 'Пробовала пару раз' },
      { id: 'intermediate', label: 'Практикую иногда' },
      { id: 'advanced', label: 'Практикую регулярно' },
    ],
  },
  {
    id: 'practice_time',
    question: 'Сколько времени ты готова уделять практикам?',
    type: 'single',
    options: [
      { id: '5min', label: '5 минут' },
      { id: '10min', label: '10 минут' },
      { id: '15min', label: '15 минут' },
      { id: '20min+', label: '20+ минут' },
    ],
  },
  {
    id: 'preferred_time',
    question: 'Когда тебе удобнее практиковать?',
    type: 'single',
    options: [
      { id: 'morning', label: 'Утром', emoji: '🌅' },
      { id: 'lunch', label: 'В обед', emoji: '🌤️' },
      { id: 'evening', label: 'Вечером', emoji: '🌙' },
      { id: 'flexible', label: 'Когда получится', emoji: '⏰' },
    ],
  },
  {
    id: 'motivation',
    question: 'Что тебя мотивирует больше всего?',
    type: 'single',
    options: [
      { id: 'health', label: 'Здоровье' },
      { id: 'appearance', label: 'Внешность' },
      { id: 'productivity', label: 'Продуктивность' },
      { id: 'relationships', label: 'Отношения' },
      { id: 'inner_peace', label: 'Внутренний покой' },
    ],
  },
  {
    id: 'challenges',
    question: 'Что мешает тебе заботиться о себе?',
    type: 'multiple',
    options: [
      { id: 'no_time', label: 'Нет времени' },
      { id: 'no_energy', label: 'Нет сил' },
      { id: 'forget', label: 'Забываю' },
      { id: 'dont_know_how', label: 'Не знаю как' },
      { id: 'guilt', label: 'Чувство вины' },
      { id: 'nothing', label: 'Ничего не мешает' },
    ],
  },
  {
    id: 'desired_feeling',
    question: 'Что ты хочешь чувствовать каждый день?',
    type: 'multiple',
    options: [
      { id: 'calm', label: 'Спокойствие', emoji: '🧘' },
      { id: 'energy', label: 'Энергию', emoji: '⚡' },
      { id: 'joy', label: 'Радость', emoji: '😊' },
      { id: 'confidence', label: 'Уверенность', emoji: '💪' },
      { id: 'clarity', label: 'Ясность ума', emoji: '🎯' },
      { id: 'beauty', label: 'Красоту', emoji: '✨' },
    ],
  },
];

interface OnboardingProps {
  onComplete: (answers: Record<string, string | string[]>) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const { hapticFeedback } = useTelegram();

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;

  const currentAnswer = answers[question.id];
  const hasAnswer = question.type === 'multiple'
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : !!currentAnswer;

  const handleSingleSelect = (optionId: string) => {
    hapticFeedback('light');
    setAnswers(prev => ({ ...prev, [question.id]: optionId }));
  };

  const handleMultipleSelect = (optionId: string) => {
    hapticFeedback('light');
    setAnswers(prev => {
      const current = (prev[question.id] as string[]) || [];

      // Если выбрали "ничего" или "всё хорошо", сбрасываем остальные
      if (optionId === 'none' || optionId === 'nothing') {
        return { ...prev, [question.id]: [optionId] };
      }

      // Если уже выбрано "ничего", убираем его
      const filtered = current.filter(id => id !== 'none' && id !== 'nothing');

      if (filtered.includes(optionId)) {
        return { ...prev, [question.id]: filtered.filter(id => id !== optionId) };
      }
      return { ...prev, [question.id]: [...filtered, optionId] };
    });
  };

  const handleNext = () => {
    hapticFeedback('light');
    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBack = () => {
    hapticFeedback('light');
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const isSelected = (optionId: string) => {
    if (question.type === 'multiple') {
      return Array.isArray(currentAnswer) && currentAnswer.includes(optionId);
    }
    return currentAnswer === optionId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-aura-cream to-white flex flex-col">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-between mb-4">
          {currentQuestion > 0 ? (
            <button
              onClick={handleBack}
              className="h-10 w-10 rounded-xl bg-white/50 flex items-center justify-center"
            >
              <ChevronLeft size={20} className="text-aura-slate" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-aura-mint" />
            <span className="font-semibold text-foreground">AuraSync</span>
          </div>
          <div className="w-10 text-right text-sm text-aura-slate/60">
            {currentQuestion + 1}/{questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-aura-slate/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-aura-mint to-aura-lavender transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 px-5 py-6 flex flex-col">
        <h1 className="text-xl font-bold text-foreground mb-2">
          {question.question}
        </h1>
        {question.type === 'multiple' && (
          <p className="text-sm text-aura-slate/60 mb-4">
            Можно выбрать несколько вариантов
          </p>
        )}

        {/* Options */}
        <div className="flex-1 space-y-3 mt-4">
          {question.options?.map((option) => (
            <button
              key={option.id}
              onClick={() =>
                question.type === 'multiple'
                  ? handleMultipleSelect(option.id)
                  : handleSingleSelect(option.id)
              }
              className={`w-full p-4 rounded-2xl text-left font-medium transition-all flex items-center gap-3 ${
                isSelected(option.id)
                  ? 'bg-aura-mint text-foreground shadow-md scale-[1.02]'
                  : 'bg-white text-aura-slate/80 shadow-sm'
              }`}
            >
              {option.emoji && <span className="text-xl">{option.emoji}</span>}
              <span className="flex-1">{option.label}</span>
              {question.type === 'multiple' && (
                <div
                  className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    isSelected(option.id)
                      ? 'bg-white border-white'
                      : 'border-aura-slate/20'
                  }`}
                >
                  {isSelected(option.id) && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1 5L4.5 8.5L11 1"
                        stroke="#8BCFC0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </main>

      {/* Bottom */}
      <div className="px-5 pb-8 safe-area-bottom">
        <button
          onClick={handleNext}
          disabled={!hasAnswer}
          className={`w-full btn-primary flex items-center justify-center gap-2 ${
            !hasAnswer ? 'opacity-50' : ''
          }`}
        >
          {isLastQuestion ? 'Начать' : 'Далее'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
