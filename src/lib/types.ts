// ============================================
// AuraSync — Типы данных
// На основе документации проекта
// ============================================

// ============================================
// ПОЛЬЗОВАТЕЛЬ
// ============================================

export type AddressForm = 'ty' | 'vy'; // ты / вы

export type LifeStage =
  | 'studying'           // Учусь
  | 'working'            // Активно работаю
  | 'in_relationship'    // В отношениях
  | 'single'             // Не в отношениях
  | 'preparing_motherhood' // Готовлюсь к материнству
  | 'pregnant'           // Беременность
  | 'postpartum'         // Послеродовый период
  | 'growing_kids'       // Растущие дети
  | 'teenagers'          // Подростки в семье
  | 'adult_kids'         // Взрослые дети
  | 'perimenopause'      // Перименопауза
  | 'career_change'      // Замена работы / поиск себя
  | 'breakup'            // Расставание / развод
  | 'loss'               // Потеря близкого
  | 'relocation'         // Переезд / эмиграция
  | 'self_focus';        // Просто хочу к себе

export type CycleType =
  | 'regular_tracking'   // Регулярный, отслеживаю
  | 'regular_no_tracking' // Регулярный, не отслеживаю
  | 'irregular'          // Нерегулярный
  | 'no_cycle'           // Сейчас нет цикла
  | 'not_specified';     // Не хочу указывать

export type SleepTime = 'before_22' | '22_23' | '23_00' | 'after_00' | 'varies';
export type SleepHours = 'less_6' | '6_7' | '7_8' | 'more_8';
export type SleepQuality = 'almost_always' | 'sometimes' | 'rarely' | 'never';
export type ActivityLevel = 'daily' | '2_3_week' | 'rarely' | 'almost_none';

export type AnxietyFrequency =
  | 'daily'              // Почти каждый день
  | 'several_week'       // Несколько раз в неделю
  | 'sometimes'          // Иногда
  | 'rarely'             // Редко
  | 'never';             // Не помню когда

export type InsomniaFrequency =
  | 'every_evening'      // Да, почти каждый вечер
  | 'several_week'       // Несколько раз в неделю
  | 'sometimes'          // Иногда
  | 'rarely'             // Редко
  | 'no';                // Нет

export type EmotionalState =
  | 'fatigue'            // Усталость
  | 'irritability'       // Раздражительность
  | 'anxiety'            // Тревога
  | 'apathy'             // Апатия
  | 'sadness'            // Грусть
  | 'tension'            // Напряжение
  | 'emptiness'          // Внутренняя пустота
  | 'confusion'          // Растерянность
  | 'guilt'              // Вина
  | 'fear'               // Страх
  | 'normal'             // В целом нормально
  | 'joy'                // Радость
  | 'love'               // Влюблённость
  | 'inspiration';       // Вдохновение

// 15 болевых протоколов
export type PainProtocol =
  | 'constant_anxiety'     // 1. Постоянная тревога и беспокойство
  | 'burnout'              // 2. Усталость и выгорание
  | 'sleep_issues'         // 3. Не могу высыпаться
  | 'cant_let_go'          // 4. Не могу отпустить прошлое
  | 'low_self_esteem'      // 5. Низкая самооценка
  | 'relationship_tension' // 6. Напряжение в отношениях
  | 'emotional_eating'     // 7. Эмоциональное переедание
  | 'no_energy'            // 8. Нет сил и энергии
  | 'cant_focus'           // 9. Не могу сосредоточиться
  | 'mood_swings'          // 10. Перепады настроения
  | 'loneliness'           // 11. Одиночество
  | 'life_transition'      // 12. Жизненный переход
  | 'perfectionism'        // 13. Перфекционизм
  | 'body_tension'         // 14. Телесное напряжение
  | 'emotional_numbness'   // 15. Эмоциональная заглушённость
  | 'feeling_lost'         // Потерянность
  | 'self_criticism'       // Самокритика
  | 'pms_hormones'         // ПМС/гормоны
  | 'fear_future'          // Страх будущего
  | 'disconnected'         // Отключённость
  | 'want_calm'            // Хочу спокойствия
  | 'want_understand'      // Хочу понять себя
  | 'want_feel';           // Хочу чувствовать

export type UserGoal =
  | 'reduce_anxiety'     // Снизить тревогу
  | 'better_sleep'       // Лучше спать
  | 'more_energy'        // Поднять энергию
  | 'understand_emotions' // Понять свои эмоции
  | 'recover_from_loss'  // Вернуть себя после расставания/потери
  | 'inner_peace'        // Научиться быть с собой в покое
  | 'less_self_criticism' // Меньше критиковать себя
  | 'stop_rushing'       // Перестать гнаться и научиться отдыхать
  | 'self_care_ritual'   // Построить ритуал заботы о себе
  | 'just_breathe';      // Просто выдохнуть

export type ExperienceLevel = 'regular' | 'tried_few' | 'heard' | 'none';

export type SubscriptionTier = 'free' | 'premium' | 'premium_yearly' | 'lifetime';

export type UserLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface User {
  id: string;

  // Базовые данные
  email?: string;
  name?: string;
  addressForm: AddressForm;
  avatarUrl?: string;
  telegramId?: string;

  // Из онбординга
  birthYear?: number;
  lifeStages: LifeStage[];
  cycleType?: CycleType;

  // Образ жизни
  sleepTime?: SleepTime;
  sleepHours?: SleepHours;
  sleepQuality?: SleepQuality;
  activityLevel?: ActivityLevel;

  // Эмоциональное состояние
  stressLevel: number; // 1-10
  anxietyFrequency?: AnxietyFrequency;
  insomniaFrequency?: InsomniaFrequency;
  emotionalStates: EmotionalState[];

  // Протокол и цели
  painProtocol?: PainProtocol;
  goals: UserGoal[]; // до 3
  experienceLevel?: ExperienceLevel;

  // Настройки времени
  morningPushTime?: string; // HH:MM
  eveningPushTime?: string;

  // Подписка
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date;

  // Прогресс
  level: UserLevel;

  // Мета
  createdAt: Date;
  onboardingCompleted: boolean;
  lastActiveAt?: Date;
}

// ============================================
// ПРОГРЕСС ПОЛЬЗОВАТЕЛЯ
// ============================================

export interface UserProgress {
  userId: string;
  streakDays: number;
  longestStreak: number;
  totalPractices: number;
  totalMorningPractices: number;
  totalEveningPractices: number;
  totalBreathingPauses: number;
  totalDiaryEntries: number;
  totalWords: number;
  emotionsExplored: string[]; // ID эмоций
  bonusBalance: number;
  achievements: string[]; // ID достижений
}

// ============================================
// ПРОГРАММА
// ============================================

export type ProgramSlot = 'morning' | 'midday' | 'evening';
export type ProgramItemStatus = 'planned' | 'completed' | 'skipped';

export interface Program {
  id: string;
  userId: string;
  weekNumber: number;
  startDate: Date;
  theme: string;
  themeDescription: string;
  createdAt: Date;
}

export interface ProgramItem {
  id: string;
  programId: string;
  dayOfWeek: number; // 0-6 (воскресенье-суббота)
  slot: ProgramSlot;
  contentId: string;
  status: ProgramItemStatus;
  completedAt?: Date;
}

// ============================================
// КОНТЕНТ (БИБЛИОТЕКА)
// ============================================

export type ContentType =
  | 'meditation'         // Медитация
  | 'breathing'          // Дыхательная практика
  | 'article'            // Текстовый материал
  | 'audio_essay'        // Аудио-эссе
  | 'video'              // Видео
  | 'course_day';        // День курса

export type ContentCategory =
  | 'emotions'           // Работа с эмоциями
  | 'life_transitions'   // Жизненные переходы
  | 'body_health'        // Тело и здоровье
  | 'sleep_evening'      // Сон и вечер
  | 'morning_energy'     // Утро и энергия
  | 'feminine'           // Женское
  | 'breathing'          // Дыхательные практики
  | 'courses';           // Курсы

export type ContentLevel = 'basic' | 'medium' | 'advanced';

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'any';

export interface Content {
  id: string;
  type: ContentType;
  category: ContentCategory;
  subcategory?: string;

  title: string;
  description: string;
  longDescription?: string;

  durationSeconds: number;
  level: ContentLevel;
  timeOfDay: TimeOfDay;

  tags: string[];
  emotionTags?: string[]; // Связь с эмоциями

  audioUrl?: string;
  textContent?: string;
  videoUrl?: string;
  imageUrl?: string;

  isPremium: boolean;
  protocols: PainProtocol[]; // Какие протоколы используют этот контент

  scientificSources?: string;
  contraindications?: string;

  // Для дыхательных практик
  breathingPattern?: {
    inhale: number;
    holdIn?: number;
    exhale: number;
    holdOut?: number;
  };

  // Текст аудио-инструкции (для озвучки)
  audioScript?: string;

  createdAt: Date;
}

// ============================================
// КУРСЫ
// ============================================

export interface Course {
  id: string;
  title: string;
  description: string;
  durationDays: number; // 7, 14, 21, 28, 30, 60, 90
  category: ContentCategory;

  isPremium: boolean;
  imageUrl?: string;

  days: CourseDay[];
}

export interface CourseDay {
  dayNumber: number;
  title: string;
  practiceId: string; // ID контента
  textMessage: string;
  diaryPrompt?: string;
}

export interface UserCourseProgress {
  userId: string;
  courseId: string;
  currentDay: number;
  startedAt: Date;
  completedAt?: Date;
  isPaused: boolean;
}

// ============================================
// ДНЕВНИК ЭМОЦИЙ
// ============================================

export type MoodEmoji = '😊' | '😌' | '😐' | '😔' | '😢' | '😰' | '😡' | '😴' | '🥰';

export type DiaryTag =
  | 'work'               // Работа
  | 'relationships'      // Отношения
  | 'self'               // Я сама
  | 'family'             // Семья
  | 'children'           // Дети
  | 'parents'            // Родители
  | 'money'              // Деньги
  | 'health'             // Здоровье
  | 'body'               // Тело
  | 'sleep'              // Сон
  | 'past'               // Прошлое
  | 'future'             // Будущее
  | 'creativity'         // Творчество
  | 'rest'               // Отдых
  | 'loneliness';        // Одиночество

export type NlpTonality = 'positive' | 'neutral' | 'negative';

export interface DiaryEntry {
  id: string;
  userId: string;

  timestamp: Date;

  // Уровень 1: Эмодзи
  moodEmoji?: MoodEmoji;
  moodScore?: number; // 1-10

  // Уровень 2: Тэги
  tags: DiaryTag[];

  // Уровень 3: Текст/голос
  textContent?: string; // Зашифрованный текст
  audioUrl?: string;
  audioTranscript?: string;

  // NLP-анализ
  detectedEmotions?: string[]; // ID эмоций из карты
  nlpTonality?: NlpTonality;
  nlpIntensity?: number; // 1-10
  crisisMarkers?: boolean;
  nlpThemes?: string[];

  // Связь с практикой
  relatedPracticeId?: string;

  createdAt: Date;
}

// ============================================
// КАРТА ЭМОЦИЙ
// ============================================

export type BaseEmotion =
  | 'joy'          // Радость
  | 'sadness'      // Грусть
  | 'fear'         // Страх
  | 'anger'        // Гнев
  | 'disgust'      // Отвращение
  | 'surprise'     // Удивление
  | 'shame'        // Стыд
  | 'guilt';       // Вина

// ============================================
// МЕДИТАЦИИ
// ============================================

export type MeditationTimeOfDay = 'morning' | 'evening' | 'any';
export type MeditationCategory = 'general' | 'emotion' | 'sleep' | 'energy' | 'focus';

export interface Meditation {
  id: string;
  name: string;
  theme: string;
  protocols: PainProtocol[];
  technique: string;
  durationMinutes: number;
  timeOfDay: MeditationTimeOfDay;
  category: MeditationCategory;
  script: string;
  isPremium: boolean;
}

// ============================================
// ДЫХАТЕЛЬНЫЕ ПРАКТИКИ
// ============================================

export type BreathingLevel = 'basic' | 'medium' | 'advanced' | 'master';

export interface BreathingPractice {
  id: string;
  name: string;
  englishName?: string;
  level: BreathingLevel;
  whenToUse: string;
  howToDo: string;
  scientificBasis?: string;
  contraindications?: string;
  durationMinutes: {
    min: number;
    max: number;
  };
  breathingPattern?: {
    inhale: number;
    holdIn?: number;
    exhale: number;
    holdOut?: number;
  };
  audioScript?: string;
  isPremium: boolean;
}

// Simplified interface for breathing timer component
export interface BreathingExercise {
  id: string;
  name: string;
  description?: string;
  pattern: string; // e.g., "5-5", "4-7-8", "4-4-4-4"
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  isPremium?: boolean;
}

export type BreathingPhase = 'inhale' | 'hold_in' | 'exhale' | 'hold_out';

// Helper to convert BreathingPractice to BreathingExercise
export function toBreathingExercise(practice: BreathingPractice): BreathingExercise {
  let pattern = '5-5'; // default coherent breathing
  if (practice.breathingPattern) {
    const { inhale, holdIn, exhale, holdOut } = practice.breathingPattern;
    if (holdIn && holdOut) {
      pattern = `${inhale}-${holdIn}-${exhale}-${holdOut}`;
    } else if (holdIn) {
      pattern = `${inhale}-${holdIn}-${exhale}`;
    } else {
      pattern = `${inhale}-${exhale}`;
    }
  }

  // Map BreathingLevel to level
  const levelMap: Record<BreathingLevel, BreathingExercise['level']> = {
    basic: 'beginner',
    medium: 'intermediate',
    advanced: 'advanced',
    master: 'advanced',
  };

  return {
    id: practice.id,
    name: practice.name,
    description: practice.howToDo,
    pattern,
    duration: practice.durationMinutes.min,
    level: levelMap[practice.level] || 'beginner',
    isPremium: practice.isPremium,
  };
}

// ============================================
// КАРТА ЭМОЦИЙ
// ============================================

export interface Emotion {
  id: string;
  name: string;
  baseEmotion: BaseEmotion;

  // Карточка эмоции (9 блоков)
  definition: string;           // Что это
  bodyLocation: string;         // Где живёт в теле
  bodyZones?: string[];         // Зоны тела (для визуализации)
  meaning: string;              // О чём говорит
  triggers: string[];           // Что её вызывает
  confusedWith: {               // Не путай с
    emotionId: string;
    difference: string;
  }[];
  whatHelps: {                  // Что помогает
    description: string;
    practiceId?: string;
  }[];
  whatDoesntHelp: string[];     // Что НЕ помогает
  supportingThought: string;    // Мысль в поддержку

  color: string;                // Цвет для UI
  isPremium: boolean;
}

// ============================================
// ВОСКРЕСНЫЙ ЧЕК-АП
// ============================================

export type WeekComparison =
  | 'much_better'      // Заметно лучше
  | 'bit_better'       // Немного лучше
  | 'same'             // Так же
  | 'bit_worse'        // Немного хуже
  | 'much_worse'       // Заметно хуже
  | 'dont_remember';   // Не помню

export type WeeklyFocus =
  | 'deep_sleep'       // Глубокий сон
  | 'reduce_anxiety'   // Снижение тревоги
  | 'energy'           // Энергия и бодрость
  | 'inner_support'    // Внутренняя опора
  | 'understand_emotions' // Понимание эмоций
  | 'return_to_self'   // Возвращение к себе
  | 'continue'         // Просто продолжить
  | 'algorithm_choice'; // На усмотрение алгоритма

export interface WeeklyCheckup {
  id: string;
  userId: string;
  weekNumber: number;
  date: Date;

  // Ответы
  weekRating: number; // 1-10
  comparisonToPrevious: WeekComparison;
  sleepQuality: SleepQuality;
  energyLevel: number; // 1-10
  whatWorked: string[];
  whatWasHard: string[];
  focusNextWeek: WeeklyFocus[]; // до 2
  weekWord?: string;
  photoUrl?: string;

  createdAt: Date;
}

export interface WeeklyReport {
  id: string;
  userId: string;
  weekNumber: number;

  // Данные отчёта
  stressDelta: number; // Изменение стресса
  moodData: { date: Date; score: number }[];
  stressData: { date: Date; score: number }[];
  energyData: { date: Date; score: number }[];

  topEmotions: { emotionId: string; percentage: number }[];
  practiceStats: {
    morningCompleted: number;
    eveningCompleted: number;
    breathingCompleted: number;
    diaryEntries: number;
    emotionsExplored: number;
  };

  insights: string[];
  mainTheme: string;

  // Подарок
  giftType: 'voice_message' | 'quote' | 'new_emotion';
  giftContent: string;

  // Следующая неделя
  nextWeekTheme: string;
  nextWeekProgramId: string;

  createdAt: Date;
}

// ============================================
// ДОСТИЖЕНИЯ И УРОВНИ
// ============================================

export type AchievementCategory =
  | 'regularity'       // Регулярность
  | 'depth'            // Глубина
  | 'return'           // Возвращение
  | 'discovery'        // Открытия
  | 'courage'          // Смелость
  | 'connection'       // Связь
  | 'courses';         // Курсы

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  bonusReward: number;
  condition: string; // Описание условия
}

export interface Level {
  level: UserLevel;
  name: string;
  condition: string;
  gift?: string;
  requiredXp?: number;
  icon?: string;
}

// ============================================
// РЕФЕРАЛЬНАЯ ПРОГРАММА
// ============================================

export interface Referral {
  id: string;
  inviterUserId: string;
  invitedUserId?: string;
  code: string;
  createdAt: Date;
  acceptedAt?: Date;
  bonusPaid: boolean;
}

// ============================================
// СОВЕТЫ ДНЯ
// ============================================

export interface DailyTip {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: string;
  protocols?: PainProtocol[]; // Для каких протоколов релевантен
}

// ============================================
// ПУШИ
// ============================================

export type PushType =
  | 'morning'          // Утренний
  | 'midday'           // Дневной
  | 'evening'          // Вечерний
  | 'return'           // Возвратный (после пропуска)
  | 'achievement'      // Достижение
  | 'weekly_checkup'   // Воскресный чек-ап
  | 'emotion_of_week'; // Эмоция недели

export interface PushTemplate {
  id: string;
  type: PushType;
  titleTemplate: string;
  bodyTemplate: string;
  // Плейсхолдеры: {{name}}, {{context}}, {{practiceTitle}}
}

// ============================================
// ОНБОРДИНГ
// ============================================

export interface OnboardingAnswers {
  name?: string;
  addressForm: AddressForm;
  birthYear?: number;
  lifeStages: LifeStage[];
  cycleType?: CycleType;
  sleepTime?: SleepTime;
  sleepHours?: SleepHours;
  sleepQuality?: SleepQuality;
  activityLevel?: ActivityLevel;
  stressLevel: number;
  anxietyFrequency?: AnxietyFrequency;
  insomniaFrequency?: InsomniaFrequency;
  emotionalStates: EmotionalState[];
  painProtocol?: PainProtocol;
  goals: UserGoal[];
  experienceLevel?: ExperienceLevel;
  morningPushTime?: string;
  eveningPushTime?: string;
  pushEnabled: boolean;
  cameraEnabled: boolean;
  healthKitEnabled: boolean;
  photoUrl?: string;
}

// ============================================
// ВРЕМЯ СУТОК
// ============================================

export type DayPeriod = 'morning' | 'day' | 'evening' | 'night' | 'sunday';

export function getCurrentDayPeriod(): DayPeriod {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  // Воскресенье
  if (day === 0) return 'sunday';

  // Ночь: 23:00 - 4:59
  if (hour >= 23 || hour < 5) return 'night';

  // Утро: 5:00 - 11:59
  if (hour >= 5 && hour < 12) return 'morning';

  // День: 12:00 - 17:59
  if (hour >= 12 && hour < 18) return 'day';

  // Вечер: 18:00 - 22:59
  return 'evening';
}

export function getGreeting(name?: string, period?: DayPeriod): string {
  const p = period || getCurrentDayPeriod();
  const n = name ? `, ${name}` : '';

  switch (p) {
    case 'morning':
      return `Доброе утро${n}`;
    case 'day':
      return `Добрый день${n}`;
    case 'evening':
      return `Добрый вечер${n}`;
    case 'night':
      return `Поздно${n.replace(',', '.')} Как ты?`;
    case 'sunday':
      return `Привет${n}. Воскресенье`;
    default:
      return `Привет${n}`;
  }
}
