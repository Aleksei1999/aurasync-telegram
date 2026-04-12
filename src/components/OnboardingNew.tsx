'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Camera, X, Check } from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import {
  OnboardingAnswers,
  lifeStageOptions,
  cycleOptions,
  emotionalStateOptions,
  painProtocolOptions,
  goalOptions,
  experienceOptions,
  morningTimeOptions,
  sleepTimeOptions,
  sleepHoursOptions,
  sleepQualityOptions,
  activityLevelOptions,
  anxietyOptions,
  insomniaOptions,
  LifeStage,
  EmotionalState,
  Goal,
  PainProtocol,
} from '@/lib/onboardingData';
import { generateWeeklyProgram } from '@/lib/protocols';

// Screen types
type ScreenType =
  | 'welcome'
  | 'name'
  | 'intro'
  | 'age'
  | 'life_stage'
  | 'cycle'
  | 'lifestyle'
  | 'stress'
  | 'anxiety'
  | 'insomnia'
  | 'emotional_state'
  | 'pain_protocol'
  | 'goals'
  | 'experience'
  | 'schedule'
  | 'push_permission'
  | 'camera_permission'
  | 'photo'
  | 'analyzing'
  | 'result';

const screenOrder: ScreenType[] = [
  'welcome',
  'name',
  'intro',
  'age',
  'life_stage',
  'cycle',
  'lifestyle',
  'stress',
  'anxiety',
  'insomnia',
  'emotional_state',
  'pain_protocol',
  'goals',
  'experience',
  'schedule',
  'push_permission',
  'camera_permission',
  'photo',
  'analyzing',
  'result',
];

interface OnboardingNewProps {
  onComplete: (answers: OnboardingAnswers) => void;
}

export function OnboardingNew({ onComplete }: OnboardingNewProps) {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { hapticFeedback } = useTelegram();

  const currentIndex = screenOrder.indexOf(currentScreen);
  const totalScreens = screenOrder.length - 2; // Exclude analyzing and result
  const progress = Math.min(((currentIndex + 1) / totalScreens) * 100, 100);

  // Analysis animation
  useEffect(() => {
    if (currentScreen === 'analyzing') {
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setCurrentScreen('result'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentScreen]);

  const goNext = () => {
    hapticFeedback('light');
    const nextIndex = currentIndex + 1;
    if (nextIndex < screenOrder.length) {
      // Skip cycle screen if age > 55 or not applicable
      if (screenOrder[nextIndex] === 'cycle' && answers.age && answers.age > 55) {
        setCurrentScreen(screenOrder[nextIndex + 1]);
      } else {
        setCurrentScreen(screenOrder[nextIndex]);
      }
    }
  };

  const goBack = () => {
    hapticFeedback('light');
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentScreen(screenOrder[prevIndex]);
    }
  };

  const updateAnswers = <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    hapticFeedback('medium');
    // Generate program based on answers
    const program = generateWeeklyProgram(answers);
    localStorage.setItem('aura_weekly_program', JSON.stringify(program));
    localStorage.setItem('aura_onboarding_answers', JSON.stringify(answers));
    localStorage.setItem('aura_onboarding_completed', 'true');
    if (beforePhoto) {
      localStorage.setItem('aura_before_photo', JSON.stringify({
        photo: beforePhoto,
        date: new Date().toISOString(),
      }));
    }
    onComplete(answers);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setBeforePhoto(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Render screens
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <ScreenContainer showProgress={false}>
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center mb-8">
                <Sparkles size={48} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground text-center mb-4">Здравствуй</h1>
              <p className="text-aura-slate/70 text-center leading-relaxed max-w-sm">
                Это приложение, которое научит тебя слышать себя. Не учить медитациям. Не убирать эмоции.
                А понимать, что с тобой происходит — каждый день.
              </p>
            </div>
            <BottomButton onClick={goNext}>Начнём знакомство</BottomButton>
          </ScreenContainer>
        );

      case 'name':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6">
              <h1 className="text-xl font-bold text-foreground mb-2">Как нам к тебе обращаться?</h1>
              <p className="text-aura-slate/60 text-sm mb-6">Это можно изменить в любой момент.</p>

              <input
                type="text"
                placeholder="Имя или ник"
                value={answers.name || ''}
                onChange={(e) => updateAnswers('name', e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-white text-foreground placeholder:text-aura-slate/40 mb-6"
              />

              <div className="space-y-3">
                <button
                  onClick={() => updateAnswers('addressForm', 'informal')}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    answers.addressForm === 'informal'
                      ? 'bg-aura-mint text-white'
                      : 'bg-white text-foreground'
                  }`}
                >
                  <span className="font-medium">На «ты»</span>
                  <span className="text-sm opacity-70 block">как с близкой подругой</span>
                </button>
                <button
                  onClick={() => updateAnswers('addressForm', 'formal')}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    answers.addressForm === 'formal'
                      ? 'bg-aura-mint text-white'
                      : 'bg-white text-foreground'
                  }`}
                >
                  <span className="font-medium">На «вы»</span>
                  <span className="text-sm opacity-70 block">немного дистанции</span>
                </button>
              </div>
            </div>
            <BottomButton onClick={goNext} disabled={!answers.name}>
              Дальше
            </BottomButton>
          </ScreenContainer>
        );

      case 'intro':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6">
              <h1 className="text-xl font-bold text-foreground mb-2">Несколько вопросов</h1>
              <p className="text-aura-slate/70 leading-relaxed mb-8">
                Они займут 5 минут. На основе твоих ответов мы соберём программу именно под тебя —
                медитации, дыхание, советы. Не общие, а твои.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-aura-slate/70">
                  <span className="text-lg">⏱</span>
                  <span>5 минут</span>
                </div>
                <div className="flex items-center gap-3 text-aura-slate/70">
                  <span className="text-lg">🔒</span>
                  <span>Всё остаётся только у тебя</span>
                </div>
                <div className="flex items-center gap-3 text-aura-slate/70">
                  <span className="text-lg">🎯</span>
                  <span>Можно изменить ответы потом</span>
                </div>
              </div>
            </div>
            <BottomButton onClick={goNext}>Поехали</BottomButton>
          </ScreenContainer>
        );

      case 'age':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6">
              <h1 className="text-xl font-bold text-foreground mb-2">Сколько тебе лет?</h1>
              <p className="text-aura-slate/60 text-sm mb-8">
                Это поможет учесть твой гормональный контекст и подобрать практики под жизненный этап.
              </p>

              <div className="bg-white rounded-3xl p-6">
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={answers.age || 30}
                  onChange={(e) => updateAnswers('age', parseInt(e.target.value))}
                  className="w-full h-2 bg-aura-slate/10 rounded-full appearance-none cursor-pointer accent-aura-mint"
                />
                <div className="flex justify-between mt-2 text-sm text-aura-slate/60">
                  <span>18</span>
                  <span className="text-lg font-bold text-foreground">{answers.age || 30}</span>
                  <span>65+</span>
                </div>
              </div>

              <button
                onClick={() => {
                  updateAnswers('age', undefined);
                  goNext();
                }}
                className="w-full mt-4 py-3 text-sm text-aura-slate/60"
              >
                Не хочу указывать
              </button>
            </div>
            <BottomButton onClick={goNext}>Дальше</BottomButton>
          </ScreenContainer>
        );

      case 'life_stage':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6 overflow-auto">
              <h1 className="text-xl font-bold text-foreground mb-2">Какой период жизни у тебя сейчас?</h1>
              <p className="text-aura-slate/60 text-sm mb-4">Можно выбрать несколько</p>

              <div className="space-y-2">
                {lifeStageOptions.map((option) => {
                  const isSelected = answers.lifeStages?.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        const current = answers.lifeStages || [];
                        if (isSelected) {
                          updateAnswers('lifeStages', current.filter((s) => s !== option.id));
                        } else {
                          updateAnswers('lifeStages', [...current, option.id] as LifeStage[]);
                        }
                        hapticFeedback('light');
                      }}
                      className={`w-full p-3 rounded-xl text-left text-sm transition-all flex items-center justify-between ${
                        isSelected ? 'bg-aura-mint text-white' : 'bg-white text-foreground'
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>
            <BottomButton onClick={goNext} disabled={!answers.lifeStages?.length}>
              Дальше
            </BottomButton>
          </ScreenContainer>
        );

      case 'cycle':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6">
              <h1 className="text-xl font-bold text-foreground mb-2">Расскажи про свой цикл</h1>
              <p className="text-aura-slate/60 text-sm mb-6">
                Состояние женщины часто связано с фазой цикла. Мы можем учитывать это в программе.
              </p>

              <div className="space-y-3">
                {cycleOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      updateAnswers('cycleType', option.id);
                      hapticFeedback('light');
                    }}
                    className={`w-full p-4 rounded-2xl text-left text-sm transition-all ${
                      answers.cycleType === option.id
                        ? 'bg-aura-mint text-white'
                        : 'bg-white text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <BottomButton onClick={goNext}>Дальше</BottomButton>
          </ScreenContainer>
        );

      case 'lifestyle':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6 overflow-auto">
              <h1 className="text-xl font-bold text-foreground mb-2">Как обычно проходит твой день?</h1>
              <p className="text-aura-slate/60 text-sm mb-6">Несколько коротких вопросов о твоих привычках.</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Когда обычно ложишься спать?</h3>
                  <div className="flex flex-wrap gap-2">
                    {sleepTimeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          updateAnswers('sleepTime', option.id);
                          hapticFeedback('light');
                        }}
                        className={`px-3 py-2 rounded-xl text-xs transition-all ${
                          answers.sleepTime === option.id
                            ? 'bg-aura-mint text-white'
                            : 'bg-white text-foreground'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Сколько часов спишь?</h3>
                  <div className="flex flex-wrap gap-2">
                    {sleepHoursOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          updateAnswers('sleepHours', option.id);
                          hapticFeedback('light');
                        }}
                        className={`px-3 py-2 rounded-xl text-xs transition-all ${
                          answers.sleepHours === option.id
                            ? 'bg-aura-mint text-white'
                            : 'bg-white text-foreground'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Просыпаешься отдохнувшей?</h3>
                  <div className="flex flex-wrap gap-2">
                    {sleepQualityOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          updateAnswers('sleepQuality', option.id);
                          hapticFeedback('light');
                        }}
                        className={`px-3 py-2 rounded-xl text-xs transition-all ${
                          answers.sleepQuality === option.id
                            ? 'bg-aura-mint text-white'
                            : 'bg-white text-foreground'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Есть ли регулярная физическая активность?</h3>
                  <div className="flex flex-wrap gap-2">
                    {activityLevelOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          updateAnswers('activityLevel', option.id);
                          hapticFeedback('light');
                        }}
                        className={`px-3 py-2 rounded-xl text-xs transition-all ${
                          answers.activityLevel === option.id
                            ? 'bg-aura-mint text-white'
                            : 'bg-white text-foreground'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <BottomButton onClick={goNext}>Дальше</BottomButton>
          </ScreenContainer>
        );

      case 'stress':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6">
              <h1 className="text-xl font-bold text-foreground mb-2">Как сильно ты сейчас в стрессе?</h1>
              <p className="text-aura-slate/60 text-sm mb-8">По шкале от 1 до 10. Отвечай как чувствуешь.</p>

              <div className="bg-white rounded-3xl p-6">
                <div className="flex justify-between mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        updateAnswers('stressLevel', num);
                        hapticFeedback('light');
                      }}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                        answers.stressLevel === num
                          ? 'bg-aura-mint text-white scale-110'
                          : 'bg-aura-slate/10 text-foreground'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-aura-slate/60">
                  <span>Спокойно</span>
                  <span>На пределе</span>
                </div>
              </div>
            </div>
            <BottomButton onClick={goNext} disabled={!answers.stressLevel}>
              Дальше
            </BottomButton>
          </ScreenContainer>
        );

      case 'anxiety':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6">
              <h1 className="text-xl font-bold text-foreground mb-6">
                Как часто ты тревожишься без видимой причины?
              </h1>

              <div className="space-y-3">
                {anxietyOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      updateAnswers('anxietyFrequency', option.id);
                      hapticFeedback('light');
                    }}
                    className={`w-full p-4 rounded-2xl text-left text-sm transition-all ${
                      answers.anxietyFrequency === option.id
                        ? 'bg-aura-mint text-white'
                        : 'bg-white text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <BottomButton onClick={goNext} disabled={!answers.anxietyFrequency}>
              Дальше
            </BottomButton>
          </ScreenContainer>
        );

      case 'insomnia':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6">
              <h1 className="text-xl font-bold text-foreground mb-6">
                Бывает, что не можешь заснуть из-за мыслей?
              </h1>

              <div className="space-y-3">
                {insomniaOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      updateAnswers('insomniaFrequency', option.id);
                      hapticFeedback('light');
                    }}
                    className={`w-full p-4 rounded-2xl text-left text-sm transition-all ${
                      answers.insomniaFrequency === option.id
                        ? 'bg-aura-mint text-white'
                        : 'bg-white text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <BottomButton onClick={goNext} disabled={!answers.insomniaFrequency}>
              Дальше
            </BottomButton>
          </ScreenContainer>
        );

      case 'emotional_state':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6 overflow-auto">
              <h1 className="text-xl font-bold text-foreground mb-2">
                Какие эмоции у тебя чаще всего в последнее время?
              </h1>
              <p className="text-aura-slate/60 text-sm mb-4">Можно выбрать несколько</p>

              <div className="space-y-2">
                {emotionalStateOptions.map((option) => {
                  const isSelected = answers.emotionalState?.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        const current = answers.emotionalState || [];
                        if (isSelected) {
                          updateAnswers('emotionalState', current.filter((s) => s !== option.id));
                        } else {
                          updateAnswers('emotionalState', [...current, option.id] as EmotionalState[]);
                        }
                        hapticFeedback('light');
                      }}
                      className={`w-full p-3 rounded-xl text-left text-sm transition-all flex items-center justify-between ${
                        isSelected ? 'bg-aura-mint text-white' : 'bg-white text-foreground'
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>
            <BottomButton onClick={goNext} disabled={!answers.emotionalState?.length}>
              Дальше
            </BottomButton>
          </ScreenContainer>
        );

      case 'pain_protocol':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6 overflow-auto">
              <h1 className="text-xl font-bold text-foreground mb-2">
                Что в твоей жизни сейчас самое сложное?
              </h1>
              <p className="text-aura-slate/60 text-sm mb-4">
                Это самый важный вопрос. На основе ответа мы поймём, с чего начать.
              </p>

              <div className="space-y-2">
                {painProtocolOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      updateAnswers('painProtocol', option.id as PainProtocol);
                      hapticFeedback('light');
                    }}
                    className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                      answers.painProtocol === option.id
                        ? 'bg-aura-mint text-white'
                        : 'bg-white text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <BottomButton onClick={goNext} disabled={!answers.painProtocol}>
              Дальше
            </BottomButton>
          </ScreenContainer>
        );

      case 'goals':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6 overflow-auto">
              <h1 className="text-xl font-bold text-foreground mb-2">Что для тебя главное?</h1>
              <p className="text-aura-slate/60 text-sm mb-4">Выбери до 3 целей</p>

              <div className="space-y-2">
                {goalOptions.map((option) => {
                  const isSelected = answers.goals?.includes(option.id);
                  const canSelect = (answers.goals?.length || 0) < 3 || isSelected;
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        if (!canSelect) return;
                        const current = answers.goals || [];
                        if (isSelected) {
                          updateAnswers('goals', current.filter((g) => g !== option.id));
                        } else {
                          updateAnswers('goals', [...current, option.id] as Goal[]);
                        }
                        hapticFeedback('light');
                      }}
                      className={`w-full p-3 rounded-xl text-left text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-aura-mint text-white'
                          : canSelect
                          ? 'bg-white text-foreground'
                          : 'bg-white/50 text-aura-slate/40'
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>
            <BottomButton onClick={goNext} disabled={!answers.goals?.length}>
              Дальше
            </BottomButton>
          </ScreenContainer>
        );

      case 'experience':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6">
              <h1 className="text-xl font-bold text-foreground mb-6">
                Делала ли ты раньше медитации или дыхательные практики?
              </h1>

              <div className="space-y-3">
                {experienceOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      updateAnswers('experienceLevel', option.id);
                      hapticFeedback('light');
                    }}
                    className={`w-full p-4 rounded-2xl text-left text-sm transition-all ${
                      answers.experienceLevel === option.id
                        ? 'bg-aura-mint text-white'
                        : 'bg-white text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <BottomButton onClick={goNext} disabled={!answers.experienceLevel}>
              Дальше
            </BottomButton>
          </ScreenContainer>
        );

      case 'schedule':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6 overflow-auto">
              <h1 className="text-xl font-bold text-foreground mb-2">
                В какое время тебе удобно начинать день с практики?
              </h1>
              <p className="text-aura-slate/60 text-sm mb-6">Мы будем напоминать в это время.</p>

              <div className="space-y-3 mb-8">
                {morningTimeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      updateAnswers('morningTime', option.id);
                      hapticFeedback('light');
                    }}
                    className={`w-full p-4 rounded-2xl text-left text-sm transition-all ${
                      answers.morningTime === option.id
                        ? 'bg-aura-mint text-white'
                        : 'bg-white text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <h2 className="text-lg font-bold text-foreground mb-4">Во сколько обычно ложишься?</h2>
              <div className="flex flex-wrap gap-2">
                {sleepTimeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      updateAnswers('eveningTime', option.id);
                      hapticFeedback('light');
                    }}
                    className={`px-4 py-2 rounded-xl text-sm transition-all ${
                      answers.eveningTime === option.id
                        ? 'bg-aura-mint text-white'
                        : 'bg-white text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <BottomButton onClick={goNext}>Дальше</BottomButton>
          </ScreenContainer>
        );

      case 'push_permission':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6">
              <h1 className="text-xl font-bold text-foreground mb-2">Можно тебе напоминать?</h1>
              <p className="text-aura-slate/60 text-sm mb-8">
                Утром — про практику. Днём — короткий совет. Вечером — мягкое напоминание.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🌅</span>
                  <div>
                    <div className="text-sm font-medium text-foreground">Утром</div>
                    <div className="text-xs text-aura-slate/60">твоя практика на день</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">☀️</span>
                  <div>
                    <div className="text-sm font-medium text-foreground">Днём</div>
                    <div className="text-xs text-aura-slate/60">один совет (его легко выключить)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">🌙</span>
                  <div>
                    <div className="text-sm font-medium text-foreground">Вечером</div>
                    <div className="text-xs text-aura-slate/60">мягкое напоминание о вечерней практике</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    updateAnswers('pushEnabled', true);
                    goNext();
                  }}
                  className="w-full btn-primary"
                >
                  Да, напоминай
                </button>
                <button
                  onClick={() => {
                    updateAnswers('pushEnabled', false);
                    goNext();
                  }}
                  className="w-full py-3 text-sm text-aura-slate/60"
                >
                  Не сейчас
                </button>
              </div>
            </div>
          </ScreenContainer>
        );

      case 'camera_permission':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6">
              <h1 className="text-xl font-bold text-foreground mb-2">Хочешь видеть, как ты меняешься?</h1>
              <p className="text-aura-slate/70 leading-relaxed mb-8">
                Раз в неделю мы можем делать твоё фото. Через месяц ты увидишь разницу — в лице, во взгляде,
                в осанке. Фото видишь только ты.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    updateAnswers('cameraEnabled', true);
                    goNext();
                  }}
                  className="w-full btn-primary"
                >
                  Да, давайте
                </button>
                <button
                  onClick={() => {
                    updateAnswers('cameraEnabled', false);
                    goNext();
                  }}
                  className="w-full py-3 text-sm text-aura-slate/60"
                >
                  Может позже
                </button>
              </div>
            </div>
          </ScreenContainer>
        );

      case 'photo':
        return (
          <ScreenContainer progress={progress} onBack={goBack}>
            <div className="flex-1 px-5 py-6 flex flex-col">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aura-lavender/20 text-aura-lavender-dark mb-4">
                  <Camera size={18} />
                  <span className="text-sm font-medium">Фото «До»</span>
                </div>
                <h1 className="text-xl font-bold text-foreground mb-2">Зафиксируй точку старта</h1>
                <p className="text-sm text-aura-slate/70">
                  Через 4 недели ты сравнишь результат. Это фото видишь только ты.
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center">
                {beforePhoto ? (
                  <div className="relative">
                    <img
                      src={beforePhoto}
                      alt="Before photo"
                      className="w-64 h-80 object-cover rounded-3xl shadow-lg"
                    />
                    <button
                      onClick={() => setBeforePhoto(null)}
                      className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-64 h-80 rounded-3xl border-2 border-dashed border-aura-slate/20 flex flex-col items-center justify-center gap-4 bg-white/50"
                  >
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center">
                      <Camera size={36} className="text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground mb-1">Сделать фото</p>
                      <p className="text-xs text-aura-slate/60">или выбрать из галереи</p>
                    </div>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="bg-aura-mint/10 rounded-2xl p-4 mt-4">
                <p className="text-xs text-aura-slate/70 text-center">
                  <span className="font-medium text-foreground">Совет:</span> Сфотографируйся при естественном
                  освещении, без макияжа, с нейтральным выражением.
                </p>
              </div>
            </div>
            <BottomButton onClick={goNext}>
              {beforePhoto ? 'Дальше' : 'Пропустить'}
            </BottomButton>
          </ScreenContainer>
        );

      case 'analyzing':
        return (
          <div className="min-h-screen bg-gradient-to-b from-aura-cream to-white flex flex-col items-center justify-center px-6">
            <div className="relative mb-8">
              <div className="h-32 w-32 rounded-full border-4 border-aura-slate/10 flex items-center justify-center">
                <Sparkles size={48} className="text-aura-mint animate-pulse" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-foreground mb-2">Анализируем твои ответы</h2>
            <p className="text-aura-slate/60 mb-6">Подбираем персональную программу...</p>

            <div className="w-48 h-2 bg-aura-slate/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-aura-mint to-aura-lavender transition-all duration-100"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <span className="text-sm text-aura-slate/50 mt-2">{analysisProgress}%</span>
          </div>
        );

      case 'result':
        const program = generateWeeklyProgram(answers);
        const firstPractice = program.morningPractices[0];

        return (
          <ScreenContainer showProgress={false}>
            <div className="flex-1 px-5 py-6 overflow-auto">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aura-mint/20 text-aura-mint mb-4">
                  <Sparkles size={18} />
                  <span className="text-sm font-medium">Готово</span>
                </div>
                <h1 className="text-xl font-bold text-foreground">Вот что мы для тебя подобрали</h1>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🌅</span>
                  <span className="text-xs text-aura-slate/60">Утренняя практика на завтра</span>
                </div>
                <h3 className="font-bold text-foreground mb-1">{firstPractice?.title || 'Мягкая перезагрузка'}</h3>
                <p className="text-sm text-aura-slate/60 mb-3">{firstPractice?.duration || 10} минут</p>
                <p className="text-sm text-aura-slate/70">
                  {firstPractice?.description || 'Практика подобрана на основе твоих ответов.'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-aura-mint/10 to-aura-lavender/10 rounded-3xl p-5 mb-4">
                <h3 className="font-semibold text-foreground mb-2">Тема недели</h3>
                <p className="text-lg font-bold text-foreground mb-2">«{program.weekTheme}»</p>
                <p className="text-sm text-aura-slate/70">{program.weekDescription}</p>
              </div>

              <div className="bg-aura-slate/5 rounded-2xl p-4 text-center">
                <p className="text-sm text-aura-slate/70">
                  {answers.name}, добро пожаловать. Завтра я напомню тебе о практике.
                  А сейчас — закрой приложение и сделай один глубокий вдох. Это уже первый шаг.
                </p>
              </div>
            </div>
            <BottomButton onClick={handleComplete}>Открыть приложение</BottomButton>
          </ScreenContainer>
        );

      default:
        return null;
    }
  };

  return renderScreen();
}

// Helper components
interface ScreenContainerProps {
  children: React.ReactNode;
  progress?: number;
  showProgress?: boolean;
  onBack?: () => void;
}

function ScreenContainer({ children, progress, showProgress = true, onBack }: ScreenContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-aura-cream to-white flex flex-col">
      {showProgress && (
        <header className="px-5 pt-4 pb-2 safe-area-top">
          <div className="flex items-center justify-between mb-4">
            {onBack ? (
              <button onClick={onBack} className="h-10 w-10 rounded-xl bg-white/50 flex items-center justify-center">
                <ChevronLeft size={20} className="text-aura-slate" />
              </button>
            ) : (
              <div className="w-10" />
            )}
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-aura-mint" />
              <span className="font-semibold text-foreground">AuraSync</span>
            </div>
            <div className="w-10" />
          </div>
          {progress !== undefined && (
            <div className="h-1.5 bg-aura-slate/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-aura-mint to-aura-lavender transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </header>
      )}
      {children}
    </div>
  );
}

interface BottomButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

function BottomButton({ children, onClick, disabled }: BottomButtonProps) {
  return (
    <div className="px-5 pb-8 safe-area-bottom">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full btn-primary flex items-center justify-center gap-2 ${disabled ? 'opacity-50' : ''}`}
      >
        {children}
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
