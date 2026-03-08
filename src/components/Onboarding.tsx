'use client';

import { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Camera, Upload, X } from 'lucide-react';
import { useTelegram } from './TelegramProvider';

interface OnboardingQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'scale' | 'date' | 'time' | 'photo';
  options?: { id: string; label: string; emoji?: string }[];
  scaleLabels?: { min: string; max: string };
  placeholder?: string;
  optional?: boolean;
}

const questions: OnboardingQuestion[] = [
  {
    id: 'before_photo',
    question: 'Загрузи своё фото «До»',
    type: 'photo',
    placeholder: 'Это фото останется приватным и поможет отслеживать твой прогресс',
    optional: true,
  },
  {
    id: 'birth_date',
    question: 'Когда ты родилась?',
    type: 'date',
    placeholder: 'Выбери дату рождения',
  },
  {
    id: 'birth_time',
    question: 'Во сколько ты родилась?',
    type: 'time',
    placeholder: 'Если не знаешь точно — примерно',
  },
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
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { hapticFeedback } = useTelegram();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    hapticFeedback('light');

    // Проверяем размер (макс 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Файл слишком большой. Максимум 10MB');
      return;
    }

    // Создаём превью
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPhotoPreview(dataUrl);
      setAnswers(prev => ({ ...prev, [question.id]: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    hapticFeedback('light');
    setPhotoPreview(null);
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[question.id];
      return newAnswers;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;

  const currentAnswer = answers[question.id];
  const hasAnswer = question.optional
    ? true
    : question.type === 'multiple'
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : question.type === 'photo'
    ? !!currentAnswer || question.optional
    : question.type === 'date' || question.type === 'time'
    ? !!currentAnswer
    : !!currentAnswer;

  const handleSingleSelect = (optionId: string) => {
    hapticFeedback('light');
    setAnswers(prev => ({ ...prev, [question.id]: optionId }));
  };

  const handleDateTimeChange = (value: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
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
          {question.type === 'photo' && (
            <div className="space-y-4">
              <p className="text-sm text-aura-slate/60">{question.placeholder}</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {photoPreview || currentAnswer ? (
                <div className="relative">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-aura-slate/10">
                    <img
                      src={photoPreview || (currentAnswer as string)}
                      alt="Фото до"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute top-3 right-3 h-10 w-10 rounded-full bg-black/50 flex items-center justify-center"
                  >
                    <X size={20} className="text-white" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-white/90 text-foreground text-sm font-medium flex items-center gap-2"
                  >
                    <Camera size={16} />
                    Изменить
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[3/4] rounded-3xl border-2 border-dashed border-aura-slate/20 bg-white flex flex-col items-center justify-center gap-4 transition-colors hover:border-aura-mint hover:bg-aura-mint/5"
                  >
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center">
                      <Camera size={32} className="text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground mb-1">Загрузить фото</div>
                      <div className="text-sm text-aura-slate/60">или сделать селфи</div>
                    </div>
                  </button>
                </div>
              )}

              {question.optional && (
                <p className="text-center text-sm text-aura-slate/50">
                  Этот шаг можно пропустить
                </p>
              )}
            </div>
          )}

          {question.type === 'date' && (
            <div className="space-y-4">
              <p className="text-sm text-aura-slate/60">{question.placeholder}</p>
              <input
                type="date"
                value={(currentAnswer as string) || ''}
                onChange={(e) => handleDateTimeChange(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white text-foreground shadow-sm border-0 text-lg focus:outline-none focus:ring-2 focus:ring-aura-mint"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}

          {question.type === 'time' && (
            <div className="space-y-4">
              <p className="text-sm text-aura-slate/60">{question.placeholder}</p>
              <input
                type="time"
                value={(currentAnswer as string) || ''}
                onChange={(e) => handleDateTimeChange(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white text-foreground shadow-sm border-0 text-lg focus:outline-none focus:ring-2 focus:ring-aura-mint"
              />
              <button
                onClick={() => handleDateTimeChange('unknown')}
                className={`w-full p-4 rounded-2xl text-left font-medium transition-all ${
                  currentAnswer === 'unknown'
                    ? 'bg-aura-mint text-foreground shadow-md'
                    : 'bg-white text-aura-slate/80 shadow-sm'
                }`}
              >
                Не знаю точное время
              </button>
            </div>
          )}

          {(question.type === 'single' || question.type === 'multiple') && question.options?.map((option) => (
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
          {isLastQuestion ? 'Начать' : question.optional && !currentAnswer ? 'Пропустить' : 'Далее'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
