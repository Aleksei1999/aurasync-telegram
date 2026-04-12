// ============================================
// AuraSync — Достижения и Уровни
// На основе документации проекта
// ============================================

import { Achievement, Level, AchievementCategory, UserLevel } from './types';

// ============================================
// УРОВНИ (10 уровней)
// ============================================

export const levels: Level[] = [
  {
    level: 1,
    name: 'Гостья',
    condition: 'Только что зарегистрировалась, не прошла онбординг',
  },
  {
    level: 2,
    name: 'Знакомая',
    condition: 'Прошла онбординг',
  },
  {
    level: 3,
    name: 'Наблюдательница',
    condition: '7 дней с момента регистрации + 3 практики выполнены',
    gift: 'Новая иллюстрация в шапке профиля',
  },
  {
    level: 4,
    name: 'Слушающая себя',
    condition: '7 записей в дневнике',
    gift: 'Разблокированная новая категория в библиотеке (+5 материалов)',
  },
  {
    level: 5,
    name: 'Исследовательница',
    condition: 'Открыла 10 эмоций на карте',
    gift: 'Доступ к одной премиум-эмоции на месяц бесплатно',
  },
  {
    level: 6,
    name: 'Спутница себе',
    condition: '21 день в приложении (не обязательно подряд)',
    gift: 'Новая медитация-подарок «21 день со мной»',
  },
  {
    level: 7,
    name: 'Внутренний компас',
    condition: '30 практик выполнено + 20 записей в дневнике',
    gift: 'Бонусы на счёт + одна сессия с AI-наставником',
  },
  {
    level: 8,
    name: 'Возвращающаяся',
    condition: '90 дней в приложении',
    gift: 'Месяц premium бесплатно',
  },
  {
    level: 9,
    name: 'Своя женщина',
    condition: '6 месяцев + 100+ практик',
    gift: 'Доступ к закрытому контенту, новые курсы',
  },
  {
    level: 10,
    name: 'Опора',
    condition: '1 год + регулярные практики',
    gift: 'Статус «амбассадор», личный годовой отчёт расширенный',
  },
];

// ============================================
// ДОСТИЖЕНИЯ — КАТЕГОРИЯ "РЕГУЛЯРНОСТЬ"
// ============================================

const regularityAchievements: Achievement[] = [
  {
    id: 'first_morning',
    name: 'Первое утро',
    description: 'Выполни первую утреннюю практику',
    category: 'regularity',
    icon: '🌅',
    bonusReward: 10,
    condition: 'Первая утренняя практика выполнена',
  },
  {
    id: 'first_evening',
    name: 'Первый вечер',
    description: 'Выполни первую вечернюю практику',
    category: 'regularity',
    icon: '🌙',
    bonusReward: 10,
    condition: 'Первая вечерняя практика выполнена',
  },
  {
    id: 'streak_3',
    name: 'Три дня подряд',
    description: 'Практикуй 3 дня подряд',
    category: 'regularity',
    icon: '🔥',
    bonusReward: 15,
    condition: 'Streak = 3 дня',
  },
  {
    id: 'streak_7',
    name: 'Семь дней подряд',
    description: 'Практикуй неделю без перерывов',
    category: 'regularity',
    icon: '🔥',
    bonusReward: 25,
    condition: 'Streak = 7 дней',
  },
  {
    id: 'streak_21',
    name: 'Двадцать один день подряд',
    description: 'Новая привычка сформирована',
    category: 'regularity',
    icon: '🔥',
    bonusReward: 50,
    condition: 'Streak = 21 день',
  },
  {
    id: 'streak_30',
    name: 'Месяц практики',
    description: '30 дней без пропусков',
    category: 'regularity',
    icon: '🔥',
    bonusReward: 75,
    condition: 'Streak = 30 дней',
  },
  {
    id: 'streak_90',
    name: 'Квартал осознанности',
    description: '90 дней регулярной практики',
    category: 'regularity',
    icon: '🔥',
    bonusReward: 150,
    condition: 'Streak = 90 дней',
  },
  {
    id: 'streak_365',
    name: 'Год с собой',
    description: '365 дней практики — ты невероятна',
    category: 'regularity',
    icon: '🔥',
    bonusReward: 500,
    condition: 'Streak = 365 дней',
  },
];

// ============================================
// ДОСТИЖЕНИЯ — КАТЕГОРИЯ "ГЛУБИНА"
// ============================================

const depthAchievements: Achievement[] = [
  {
    id: 'first_diary_entry',
    name: 'Первая запись',
    description: 'Сделай первую запись в дневнике',
    category: 'depth',
    icon: '📖',
    bonusReward: 10,
    condition: 'Первая запись в дневнике создана',
  },
  {
    id: 'diary_10',
    name: 'Десять записей',
    description: 'Веди дневник регулярно',
    category: 'depth',
    icon: '📖',
    bonusReward: 25,
    condition: '10 записей в дневнике',
  },
  {
    id: 'diary_50',
    name: 'Пятьдесят записей',
    description: 'Дневник стал привычкой',
    category: 'depth',
    icon: '📖',
    bonusReward: 50,
    condition: '50 записей в дневнике',
  },
  {
    id: 'diary_100',
    name: 'Сто записей',
    description: 'Ты знаешь себя лучше, чем многие',
    category: 'depth',
    icon: '📖',
    bonusReward: 100,
    condition: '100 записей в дневнике',
  },
  {
    id: 'first_voice',
    name: 'Голос внутри',
    description: 'Сделай первую голосовую запись',
    category: 'depth',
    icon: '🎤',
    bonusReward: 15,
    condition: 'Первая голосовая запись в дневнике',
  },
  {
    id: 'emotions_10',
    name: 'Открыватель',
    description: 'Открой 10 эмоций на карте',
    category: 'depth',
    icon: '🗺',
    bonusReward: 25,
    condition: '10 эмоций открыто на карте',
  },
  {
    id: 'emotions_25',
    name: 'Картограф',
    description: 'Открой 25 эмоций на карте',
    category: 'depth',
    icon: '🗺',
    bonusReward: 50,
    condition: '25 эмоций открыто на карте',
  },
  {
    id: 'emotions_all',
    name: 'Знающая',
    description: 'Открой все 56 оттенков эмоций',
    category: 'depth',
    icon: '🗺',
    bonusReward: 150,
    condition: 'Все 56 эмоций открыты на карте',
  },
  {
    id: 'words_1000',
    name: 'Тысяча слов',
    description: 'Напиши 1000 слов в дневнике',
    category: 'depth',
    icon: '✍️',
    bonusReward: 30,
    condition: '1000 слов в дневнике',
  },
  {
    id: 'words_10000',
    name: 'Десять тысяч слов',
    description: 'Целая книга о себе',
    category: 'depth',
    icon: '✍️',
    bonusReward: 100,
    condition: '10000 слов в дневнике',
  },
];

// ============================================
// ДОСТИЖЕНИЯ — КАТЕГОРИЯ "ВОЗВРАЩЕНИЕ"
// ============================================

const returnAchievements: Achievement[] = [
  {
    id: 'return_7days',
    name: 'Я снова здесь',
    description: 'Возвращение после недельного перерыва',
    category: 'return',
    icon: '💚',
    bonusReward: 20,
    condition: 'Вернулась после 7+ дней отсутствия',
  },
  {
    id: 'return_30days',
    name: 'Время на восстановление',
    description: 'Возвращение после большого перерыва',
    category: 'return',
    icon: '💚',
    bonusReward: 50,
    condition: 'Вернулась после 30+ дней отсутствия',
  },
  {
    id: 'return_90days',
    name: 'Никогда не поздно',
    description: 'Возвращение после долгого отсутствия',
    category: 'return',
    icon: '💚',
    bonusReward: 75,
    condition: 'Вернулась после 90+ дней отсутствия',
  },
];

// ============================================
// ДОСТИЖЕНИЯ — КАТЕГОРИЯ "ОТКРЫТИЯ"
// ============================================

const discoveryAchievements: Achievement[] = [
  {
    id: 'first_insight',
    name: 'Первый инсайт',
    description: 'Увидь первый инсайт от алгоритма',
    category: 'discovery',
    icon: '💡',
    bonusReward: 15,
    condition: 'Первый инсайт показан',
  },
  {
    id: 'pattern_seen',
    name: 'Связь увидена',
    description: 'Замети паттерн в своих эмоциях',
    category: 'discovery',
    icon: '💡',
    bonusReward: 25,
    condition: 'Паттерн эмоций обнаружен и показан',
  },
  {
    id: 'word_found',
    name: 'Слово найдено',
    description: 'Найди точное слово через эмоциональный компас',
    category: 'discovery',
    icon: '💡',
    bonusReward: 20,
    condition: 'Впервые использовала эмоциональный компас',
  },
  {
    id: 'weekly_report_first',
    name: 'Первый отчёт',
    description: 'Получи первый воскресный отчёт',
    category: 'discovery',
    icon: '📊',
    bonusReward: 15,
    condition: 'Первый воскресный отчёт получен',
  },
  {
    id: 'weekly_checkup_first',
    name: 'Первый чек-ап',
    description: 'Заполни первый воскресный чек-ап',
    category: 'discovery',
    icon: '📊',
    bonusReward: 15,
    condition: 'Первый воскресный чек-ап заполнен',
  },
];

// ============================================
// ДОСТИЖЕНИЯ — КАТЕГОРИЯ "СМЕЛОСТЬ"
// ============================================

const courageAchievements: Achievement[] = [
  {
    id: 'first_tenderness',
    name: 'Первая нежность',
    description: 'Добавь нежность в дневник',
    category: 'courage',
    icon: '💛',
    bonusReward: 15,
    condition: 'Запись с тегом "нежность" или позитивной эмоцией',
  },
  {
    id: 'admitted',
    name: 'Призналась себе',
    description: 'Запиши тяжёлое состояние честно',
    category: 'courage',
    icon: '💛',
    bonusReward: 20,
    condition: 'Запись с тяжёлой эмоцией создана',
  },
  {
    id: 'self_forgiveness',
    name: 'Прощение',
    description: 'Запиши прощение себя',
    category: 'courage',
    icon: '💛',
    bonusReward: 25,
    condition: 'Запись о прощении себя',
  },
  {
    id: 'vulnerability',
    name: 'Уязвимость как сила',
    description: 'Позволь себе быть уязвимой',
    category: 'courage',
    icon: '💛',
    bonusReward: 20,
    condition: 'Медитация про уязвимость выполнена',
  },
  {
    id: 'anger_expressed',
    name: 'Гнев признан',
    description: 'Признай и проработай гнев',
    category: 'courage',
    icon: '💛',
    bonusReward: 20,
    condition: 'Практика работы с гневом выполнена',
  },
];

// ============================================
// ДОСТИЖЕНИЯ — КАТЕГОРИЯ "СВЯЗЬ"
// ============================================

const connectionAchievements: Achievement[] = [
  {
    id: 'first_referral',
    name: 'Первая подруга',
    description: 'Пригласи первого человека',
    category: 'connection',
    icon: '🤝',
    bonusReward: 100,
    condition: 'Первый реферал присоединился',
  },
  {
    id: 'referral_3',
    name: 'Команда',
    description: 'Пригласи трёх подруг',
    category: 'connection',
    icon: '🤝',
    bonusReward: 150,
    condition: '3 реферала присоединились',
  },
  {
    id: 'referral_5',
    name: 'Круг поддержки',
    description: 'Пригласи пять подруг',
    category: 'connection',
    icon: '🤝',
    bonusReward: 200,
    condition: '5 рефералов присоединились',
  },
  {
    id: 'referral_10',
    name: 'Амбассадор',
    description: 'Пригласи десять человек',
    category: 'connection',
    icon: '🤝',
    bonusReward: 500,
    condition: '10 рефералов присоединились',
  },
];

// ============================================
// ДОСТИЖЕНИЯ — КАТЕГОРИЯ "КУРСЫ"
// ============================================

const courseAchievements: Achievement[] = [
  {
    id: 'course_first_week',
    name: 'Первая неделя курса',
    description: 'Пройди неделю любого курса',
    category: 'courses',
    icon: '📚',
    bonusReward: 30,
    condition: '7 дней курса пройдено',
  },
  {
    id: 'course_completed_first',
    name: 'Месяц со мной',
    description: 'Заверши один курс полностью',
    category: 'courses',
    icon: '📚',
    bonusReward: 75,
    condition: 'Первый курс завершён',
  },
  {
    id: 'course_completed_3',
    name: 'Три курса',
    description: 'Заверши три курса',
    category: 'courses',
    icon: '📚',
    bonusReward: 150,
    condition: '3 курса завершено',
  },
  {
    id: 'course_completed_all',
    name: 'Мастер курсов',
    description: 'Заверши все доступные курсы',
    category: 'courses',
    icon: '📚',
    bonusReward: 500,
    condition: 'Все курсы завершены',
  },
  {
    id: 'course_90_days',
    name: '90 дней трансформации',
    description: 'Пройди курс "90 дней нового я"',
    category: 'courses',
    icon: '📚',
    bonusReward: 300,
    condition: 'Курс "90 дней нового я" завершён',
  },
];

// ============================================
// ЭКСПОРТ
// ============================================

export const allAchievements: Achievement[] = [
  ...regularityAchievements,
  ...depthAchievements,
  ...returnAchievements,
  ...discoveryAchievements,
  ...courageAchievements,
  ...connectionAchievements,
  ...courseAchievements,
];

export function getAchievementById(id: string): Achievement | undefined {
  return allAchievements.find((a) => a.id === id);
}

export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return allAchievements.filter((a) => a.category === category);
}

export function getLevelByNumber(level: UserLevel): Level | undefined {
  return levels.find((l) => l.level === level);
}

export function getNextLevel(currentLevel: UserLevel): Level | undefined {
  if (currentLevel >= 10) return undefined;
  return levels.find((l) => l.level === (currentLevel + 1) as UserLevel);
}

export function calculateTotalBonusReward(achievementIds: string[]): number {
  return achievementIds.reduce((total, id) => {
    const achievement = getAchievementById(id);
    return total + (achievement?.bonusReward || 0);
  }, 0);
}

// ============================================
// ПРОВЕРКА УСЛОВИЙ ДОСТИЖЕНИЙ
// ============================================

export interface UserStats {
  // Achievement tracking
  streakDays: number;
  totalPractices: number;
  totalMorningPractices: number;
  totalEveningPractices: number;
  totalDiaryEntries: number;
  totalWords: number;
  emotionsExplored: number;
  totalVoiceEntries: number;
  totalCourseWeeks: number;
  coursesCompleted: number;
  referralsJoined: number;
  daysInactive: number;
  hasFirstInsight: boolean;
  hasPatternSeen: boolean;
  hasUsedCompass: boolean;
  hasWeeklyReport: boolean;
  hasWeeklyCheckup: boolean;
  hasTendernessEntry: boolean;
  hasHardEmotionEntry: boolean;
  hasForgivenessEntry: boolean;
  hasVulnerabilityPractice: boolean;
  hasAngerPractice: boolean;
  has90DaysCourse: boolean;

  // Profile stats
  totalMeditations?: number;
  totalBreathing?: number;
  totalMinutes?: number;
  currentStreak?: number;
  longestStreak?: number;
  diaryEntries?: number;
  coursesStarted?: number;
  achievementsUnlocked?: number;
  currentLevel?: number;
  xp?: number;
  bonusBalance?: number;
  referrals?: number;
  joinedAt?: string;
  lastActiveAt?: string;
}

export function checkAchievementUnlocked(achievement: Achievement, stats: UserStats): boolean {
  switch (achievement.id) {
    // Регулярность
    case 'first_morning':
      return stats.totalMorningPractices >= 1;
    case 'first_evening':
      return stats.totalEveningPractices >= 1;
    case 'streak_3':
      return stats.streakDays >= 3;
    case 'streak_7':
      return stats.streakDays >= 7;
    case 'streak_21':
      return stats.streakDays >= 21;
    case 'streak_30':
      return stats.streakDays >= 30;
    case 'streak_90':
      return stats.streakDays >= 90;
    case 'streak_365':
      return stats.streakDays >= 365;

    // Глубина
    case 'first_diary_entry':
      return stats.totalDiaryEntries >= 1;
    case 'diary_10':
      return stats.totalDiaryEntries >= 10;
    case 'diary_50':
      return stats.totalDiaryEntries >= 50;
    case 'diary_100':
      return stats.totalDiaryEntries >= 100;
    case 'first_voice':
      return stats.totalVoiceEntries >= 1;
    case 'emotions_10':
      return stats.emotionsExplored >= 10;
    case 'emotions_25':
      return stats.emotionsExplored >= 25;
    case 'emotions_all':
      return stats.emotionsExplored >= 56;
    case 'words_1000':
      return stats.totalWords >= 1000;
    case 'words_10000':
      return stats.totalWords >= 10000;

    // Возвращение
    case 'return_7days':
      return stats.daysInactive >= 7;
    case 'return_30days':
      return stats.daysInactive >= 30;
    case 'return_90days':
      return stats.daysInactive >= 90;

    // Открытия
    case 'first_insight':
      return stats.hasFirstInsight;
    case 'pattern_seen':
      return stats.hasPatternSeen;
    case 'word_found':
      return stats.hasUsedCompass;
    case 'weekly_report_first':
      return stats.hasWeeklyReport;
    case 'weekly_checkup_first':
      return stats.hasWeeklyCheckup;

    // Смелость
    case 'first_tenderness':
      return stats.hasTendernessEntry;
    case 'admitted':
      return stats.hasHardEmotionEntry;
    case 'self_forgiveness':
      return stats.hasForgivenessEntry;
    case 'vulnerability':
      return stats.hasVulnerabilityPractice;
    case 'anger_expressed':
      return stats.hasAngerPractice;

    // Связь
    case 'first_referral':
      return stats.referralsJoined >= 1;
    case 'referral_3':
      return stats.referralsJoined >= 3;
    case 'referral_5':
      return stats.referralsJoined >= 5;
    case 'referral_10':
      return stats.referralsJoined >= 10;

    // Курсы
    case 'course_first_week':
      return stats.totalCourseWeeks >= 1;
    case 'course_completed_first':
      return stats.coursesCompleted >= 1;
    case 'course_completed_3':
      return stats.coursesCompleted >= 3;
    case 'course_completed_all':
      return stats.coursesCompleted >= 10;
    case 'course_90_days':
      return stats.has90DaysCourse;

    default:
      return false;
  }
}

export function getUnlockedAchievements(stats: UserStats): Achievement[] {
  return allAchievements.filter((achievement) =>
    checkAchievementUnlocked(achievement, stats)
  );
}

export function getNextAchievements(
  currentAchievementIds: string[],
  stats: UserStats,
  limit = 3
): Achievement[] {
  const notUnlocked = allAchievements.filter(
    (a) => !currentAchievementIds.includes(a.id)
  );

  // Сортируем по близости к разблокировке (эвристика)
  const scored = notUnlocked.map((a) => ({
    achievement: a,
    score: getAchievementProgressScore(a, stats),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.achievement);
}

function getAchievementProgressScore(achievement: Achievement, stats: UserStats): number {
  // Возвращает число от 0 до 1, показывающее близость к достижению
  switch (achievement.id) {
    case 'streak_3':
      return Math.min(stats.streakDays / 3, 1);
    case 'streak_7':
      return Math.min(stats.streakDays / 7, 1);
    case 'streak_21':
      return Math.min(stats.streakDays / 21, 1);
    case 'diary_10':
      return Math.min(stats.totalDiaryEntries / 10, 1);
    case 'emotions_10':
      return Math.min(stats.emotionsExplored / 10, 1);
    case 'words_1000':
      return Math.min(stats.totalWords / 1000, 1);
    default:
      return 0;
  }
}
