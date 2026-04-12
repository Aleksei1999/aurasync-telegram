// AuraSync Onboarding Data
// Based on documentation: 01.1 — Сценарий онбординга (21 экран)

export type LifeStage =
  | 'studying'
  | 'working'
  | 'in_relationship'
  | 'single'
  | 'preparing_motherhood'
  | 'pregnant'
  | 'postpartum'
  | 'growing_kids'
  | 'teenagers'
  | 'adult_kids'
  | 'perimenopause'
  | 'career_change'
  | 'breakup'
  | 'loss'
  | 'relocation'
  | 'just_myself';

export type CycleType =
  | 'regular_tracking'
  | 'regular_no_tracking'
  | 'irregular'
  | 'no_cycle'
  | 'prefer_not_say';

export type SleepTime = 'before_22' | '22_23' | '23_00' | 'after_00' | 'varies';
export type SleepHours = 'less_6' | '6_7' | '7_8' | 'more_8';
export type SleepQuality = 'always' | 'sometimes' | 'rarely' | 'never';
export type ActivityLevel = 'daily' | '2_3_times' | 'rarely' | 'almost_none';
export type AnxietyFrequency = 'daily' | 'several_weekly' | 'sometimes' | 'rarely' | 'never';
export type InsomniaFrequency = 'every_evening' | 'several_weekly' | 'sometimes' | 'rarely' | 'never';

export type EmotionalState =
  | 'fatigue'
  | 'irritability'
  | 'anxiety'
  | 'apathy'
  | 'sadness'
  | 'tension'
  | 'emptiness'
  | 'confusion'
  | 'guilt'
  | 'fear'
  | 'normal'
  | 'joy'
  | 'love'
  | 'inspiration';

// Import and re-export PainProtocol from types to ensure consistency
import type { PainProtocol } from './types';
export type { PainProtocol } from './types';

export type Goal =
  | 'reduce_anxiety'
  | 'better_sleep'
  | 'more_energy'
  | 'understand_emotions'
  | 'recover_after_loss'
  | 'inner_peace'
  | 'less_self_criticism'
  | 'stop_rushing'
  | 'self_care_ritual'
  | 'just_breathe';

export type ExperienceLevel = 'regular' | 'tried_few_times' | 'heard_never_tried' | 'none';
export type MorningTime = '6_7' | '7_8' | '8_9' | '9_10' | 'later' | 'not_morning_person';
export type AddressForm = 'informal' | 'formal';

export interface OnboardingAnswers {
  // Step 1: Welcome & Contact
  name?: string;
  addressForm?: AddressForm;

  // Step 2: Basic Profile
  age?: number;
  lifeStages?: LifeStage[];
  cycleType?: CycleType;

  // Step 3: Lifestyle
  sleepTime?: SleepTime;
  sleepHours?: SleepHours;
  sleepQuality?: SleepQuality;
  activityLevel?: ActivityLevel;

  // Step 4: Emotional State
  stressLevel?: number; // 1-10
  anxietyFrequency?: AnxietyFrequency;
  insomniaFrequency?: InsomniaFrequency;
  emotionalState?: EmotionalState[];
  painProtocol?: PainProtocol;

  // Step 5: Goals & Experience
  goals?: Goal[];
  experienceLevel?: ExperienceLevel;
  morningTime?: MorningTime;
  eveningTime?: SleepTime;

  // Step 6: Permissions
  pushEnabled?: boolean;
  cameraEnabled?: boolean;
  healthEnabled?: boolean;

  // Step 7: Photo
  beforePhoto?: string;
}

// Life stage options with labels
export const lifeStageOptions: { id: LifeStage; label: string }[] = [
  { id: 'studying', label: 'Учусь' },
  { id: 'working', label: 'Активно работаю' },
  { id: 'in_relationship', label: 'В отношениях' },
  { id: 'single', label: 'Не в отношениях' },
  { id: 'preparing_motherhood', label: 'Готовлюсь к материнству' },
  { id: 'pregnant', label: 'Беременность' },
  { id: 'postpartum', label: 'Послеродовый период' },
  { id: 'growing_kids', label: 'Растущие дети' },
  { id: 'teenagers', label: 'Подростки в семье' },
  { id: 'adult_kids', label: 'Взрослые дети' },
  { id: 'perimenopause', label: 'Перименопауза' },
  { id: 'career_change', label: 'Смена работы / поиск себя' },
  { id: 'breakup', label: 'Расставание / развод' },
  { id: 'loss', label: 'Потеря близкого' },
  { id: 'relocation', label: 'Переезд / эмиграция' },
  { id: 'just_myself', label: 'Просто хочу к себе' },
];

export const cycleOptions: { id: CycleType; label: string }[] = [
  { id: 'regular_tracking', label: 'Регулярный, отслеживаю' },
  { id: 'regular_no_tracking', label: 'Регулярный, не отслеживаю' },
  { id: 'irregular', label: 'Нерегулярный' },
  { id: 'no_cycle', label: 'Сейчас нет цикла (беременность, постпартум, перименопауза)' },
  { id: 'prefer_not_say', label: 'Не хочу указывать' },
];

export const emotionalStateOptions: { id: EmotionalState; label: string; type: 'negative' | 'neutral' | 'positive' }[] = [
  { id: 'fatigue', label: 'Усталость', type: 'negative' },
  { id: 'irritability', label: 'Раздражительность', type: 'negative' },
  { id: 'anxiety', label: 'Тревога', type: 'negative' },
  { id: 'apathy', label: 'Апатия', type: 'negative' },
  { id: 'sadness', label: 'Грусть', type: 'negative' },
  { id: 'tension', label: 'Напряжение', type: 'negative' },
  { id: 'emptiness', label: 'Внутренняя пустота', type: 'negative' },
  { id: 'confusion', label: 'Растерянность', type: 'negative' },
  { id: 'guilt', label: 'Вина', type: 'negative' },
  { id: 'fear', label: 'Страх', type: 'negative' },
  { id: 'normal', label: 'В целом нормально', type: 'neutral' },
  { id: 'joy', label: 'Радость', type: 'positive' },
  { id: 'love', label: 'Влюблённость', type: 'positive' },
  { id: 'inspiration', label: 'Вдохновение', type: 'positive' },
];

export const painProtocolOptions: { id: PainProtocol; label: string }[] = [
  { id: 'constant_anxiety', label: 'Постоянная тревога и беспокойство' },
  { id: 'burnout', label: 'Усталость и выгорание' },
  { id: 'sleep_issues', label: 'Не могу высыпаться' },
  { id: 'cant_let_go', label: 'Не могу отпустить прошлое (расставание, потеря)' },
  { id: 'feeling_lost', label: 'Чувствую себя потерянной' },
  { id: 'mood_swings', label: 'Перепады настроения' },
  { id: 'self_criticism', label: 'Самокритика и недовольство собой' },
  { id: 'loneliness', label: 'Одиночество' },
  { id: 'pms_hormones', label: 'ПМС или гормональные перепады' },
  { id: 'fear_future', label: 'Страх будущего' },
  { id: 'perfectionism', label: 'Перфекционизм и постоянная гонка' },
  { id: 'disconnected', label: 'Не чувствую себя' },
  { id: 'want_calm', label: 'Хочу просто стать спокойнее' },
  { id: 'want_understand', label: 'Хочу разобраться в себе' },
  { id: 'want_feel', label: 'Хочу научиться чувствовать' },
];

export const goalOptions: { id: Goal; label: string }[] = [
  { id: 'reduce_anxiety', label: 'Снизить тревогу' },
  { id: 'better_sleep', label: 'Лучше спать' },
  { id: 'more_energy', label: 'Поднять энергию' },
  { id: 'understand_emotions', label: 'Понять свои эмоции' },
  { id: 'recover_after_loss', label: 'Вернуть себя после расставания / потери' },
  { id: 'inner_peace', label: 'Научиться быть с собой в покое' },
  { id: 'less_self_criticism', label: 'Меньше критиковать себя' },
  { id: 'stop_rushing', label: 'Перестать гнаться и научиться отдыхать' },
  { id: 'self_care_ritual', label: 'Построить ритуал заботы о себе' },
  { id: 'just_breathe', label: 'Просто выдохнуть' },
];

export const experienceOptions: { id: ExperienceLevel; label: string }[] = [
  { id: 'regular', label: 'Да, регулярно' },
  { id: 'tried_few_times', label: 'Пробовала несколько раз' },
  { id: 'heard_never_tried', label: 'Слышала, но не пробовала' },
  { id: 'none', label: 'Нет' },
];

export const morningTimeOptions: { id: MorningTime; label: string }[] = [
  { id: '6_7', label: '6:00–7:00' },
  { id: '7_8', label: '7:00–8:00' },
  { id: '8_9', label: '8:00–9:00' },
  { id: '9_10', label: '9:00–10:00' },
  { id: 'later', label: 'Позже' },
  { id: 'not_morning_person', label: 'Я не утренний человек, без напоминаний' },
];

export const sleepTimeOptions: { id: SleepTime; label: string }[] = [
  { id: 'before_22', label: 'До 22:00' },
  { id: '22_23', label: '22:00–23:00' },
  { id: '23_00', label: '23:00–00:00' },
  { id: 'after_00', label: 'После полуночи' },
  { id: 'varies', label: 'По-разному' },
];

export const sleepHoursOptions: { id: SleepHours; label: string }[] = [
  { id: 'less_6', label: 'Меньше 6' },
  { id: '6_7', label: '6–7' },
  { id: '7_8', label: '7–8' },
  { id: 'more_8', label: 'Больше 8' },
];

export const sleepQualityOptions: { id: SleepQuality; label: string }[] = [
  { id: 'always', label: 'Почти всегда' },
  { id: 'sometimes', label: 'Иногда' },
  { id: 'rarely', label: 'Редко' },
  { id: 'never', label: 'Никогда' },
];

export const activityLevelOptions: { id: ActivityLevel; label: string }[] = [
  { id: 'daily', label: 'Да, ежедневно' },
  { id: '2_3_times', label: '2–3 раза в неделю' },
  { id: 'rarely', label: 'Редко' },
  { id: 'almost_none', label: 'Почти нет' },
];

export const anxietyOptions: { id: AnxietyFrequency; label: string }[] = [
  { id: 'daily', label: 'Почти каждый день' },
  { id: 'several_weekly', label: 'Несколько раз в неделю' },
  { id: 'sometimes', label: 'Иногда' },
  { id: 'rarely', label: 'Редко' },
  { id: 'never', label: 'Не помню, когда было в последний раз' },
];

export const insomniaOptions: { id: InsomniaFrequency; label: string }[] = [
  { id: 'every_evening', label: 'Да, почти каждый вечер' },
  { id: 'several_weekly', label: 'Несколько раз в неделю' },
  { id: 'sometimes', label: 'Иногда' },
  { id: 'rarely', label: 'Редко' },
  { id: 'never', label: 'Нет' },
];
