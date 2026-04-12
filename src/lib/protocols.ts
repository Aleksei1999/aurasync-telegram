// ============================================
// AuraSync — 15 Протоколов подбора первой программы
// На основе документации 01.2
// ============================================

import { PainProtocol } from './types';

// ============================================
// ТИПЫ
// ============================================

export interface Protocol {
  id: PainProtocol;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;

  // Программа
  program: {
    title: string;
    duration: string;
    dailyMinutes: number;
    description: string;

    // Компоненты
    breathing: string[];
    meditations: string[];
    practices: string[];
    emotions: string[];

    // Расписание
    morning?: string;
    day?: string;
    evening?: string;
    sos?: string;
  };

  // Ответ бота
  botResponse: string;

  // Поисковые ключевые слова
  keywords: string[];
}

export interface DailyTip {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Practice {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  type: 'meditation' | 'breathing' | 'body' | 'journaling';
  tags: string[];
  description: string;
}

export interface WeeklyProgram {
  morningPractices: Practice[];
  dayPractices: Practice[];
  eveningPractices: Practice[];
  dailyTips: DailyTip[];
  weekTheme?: string;
  weekDescription?: string;
}

// ============================================
// 15 ПРОТОКОЛОВ
// ============================================

export const protocols: Protocol[] = [
  // 1. Постоянная тревога
  {
    id: 'constant_anxiety',
    name: 'Постоянная тревога',
    shortName: 'Тревога',
    description: 'Беспокойство, которое не отпускает. Мысли крутятся по кругу, сложно расслабиться.',
    icon: '😰',
    color: '#9B59B6',
    program: {
      title: 'Спокойствие внутри',
      duration: '7 дней',
      dailyMinutes: 15,
      description: 'Программа для снижения уровня тревоги через дыхание, заземление и работу с тревожными мыслями.',
      breathing: ['breathing_478', 'box_breathing', 'calming_breath', 'extended_exhale'],
      meditations: ['anxiety_release', 'grounding_meditation', 'body_scan'],
      practices: ['grounding_54321', 'thought_record', 'worry_time'],
      emotions: ['anxiety', 'worry', 'fear', 'serenity'],
      morning: 'Утреннее заземление (5 мин)',
      evening: 'Вечерняя медитация расслабления (10 мин)',
      sos: 'SOS-дыхание 4-7-8'
    },
    botResponse: 'Тревога — это сигнал, что твоя нервная система в напряжении. Мы начнём с простых техник, которые помогут телу вспомнить, как расслабляться. Первые результаты ты почувствуешь уже через пару дней.',
    keywords: ['тревога', 'беспокойство', 'не могу расслабиться', 'мысли крутятся', 'страх', 'паника', 'волнение']
  },

  // 2. Усталость и выгорание
  {
    id: 'burnout',
    name: 'Усталость и выгорание',
    shortName: 'Выгорание',
    description: 'Нет сил даже на то, что раньше нравилось. Ощущение, что батарейка разряжена в ноль.',
    icon: '🔋',
    color: '#E67E22',
    program: {
      title: 'Восстановление энергии',
      duration: '10 дней',
      dailyMinutes: 12,
      description: 'Мягкая программа для восстановления ресурса. Учимся отдыхать по-настоящему.',
      breathing: ['energizing_breath', 'relaxing_breath', 'natural_breath'],
      meditations: ['energy_restoration', 'self_care_meditation', 'body_gratitude'],
      practices: ['energy_audit', 'boundary_setting', 'micro_rest'],
      emotions: ['exhaustion', 'serenity', 'gratitude', 'joy'],
      morning: 'Мягкое пробуждение (5 мин)',
      day: 'Микро-перезагрузка (3 мин)',
      evening: 'Благодарность телу (7 мин)'
    },
    botResponse: 'Выгорание — это не слабость, а сигнал, что ты долго игнорировала свои потребности. Мы пойдём очень мягко, по чуть-чуть восстанавливая контакт с собой и своей энергией.',
    keywords: ['усталость', 'выгорание', 'нет сил', 'устала', 'истощение', 'работа', 'burnout']
  },

  // 3. Проблемы со сном
  {
    id: 'sleep_issues',
    name: 'Не могу высыпаться',
    shortName: 'Сон',
    description: 'Трудно уснуть, просыпаюсь по ночам или встаю разбитой, даже если спала достаточно.',
    icon: '😴',
    color: '#3498DB',
    program: {
      title: 'Глубокий сон',
      duration: '7 дней',
      dailyMinutes: 15,
      description: 'Вечерние ритуалы и техники для здорового сна. Учимся готовить тело и разум ко сну.',
      breathing: ['breathing_478', 'moon_breath', 'sleep_breath'],
      meditations: ['sleep_preparation', 'body_scan', 'letting_go_meditation'],
      practices: ['sleep_hygiene', 'evening_ritual', 'worry_dump'],
      emotions: ['anxiety', 'serenity', 'peace'],
      evening: 'Вечерний ритуал (15 мин за час до сна)',
      sos: 'Дыхание для засыпания'
    },
    botResponse: 'Сон — это основа всего. Когда мы плохо спим, всё остальное рассыпается. Давай построим вечерний ритуал, который поможет твоему телу мягко переключаться в режим отдыха.',
    keywords: ['сон', 'бессонница', 'не высыпаюсь', 'просыпаюсь', 'уснуть', 'ночь', 'кошмары']
  },

  // 4. Не могу отпустить прошлое
  {
    id: 'cant_let_go',
    name: 'Не могу отпустить прошлое',
    shortName: 'Прошлое',
    description: 'Застряла в воспоминаниях, обидах или сожалениях. Прошлое не отпускает.',
    icon: '⏳',
    color: '#1ABC9C',
    program: {
      title: 'Отпускание и движение',
      duration: '14 дней',
      dailyMinutes: 15,
      description: 'Работа с прошлым через принятие, прощение и создание нового. Мягко, в своём темпе.',
      breathing: ['releasing_breath', 'heart_breath', 'grounding_breath'],
      meditations: ['letting_go_meditation', 'forgiveness_meditation', 'past_gratitude'],
      practices: ['letter_writing', 'memory_ritual', 'grief_process'],
      emotions: ['grief', 'resentment', 'sadness', 'acceptance', 'peace'],
      morning: 'Утреннее намерение (5 мин)',
      evening: 'Работа с прошлым (10 мин)'
    },
    botResponse: 'Отпустить — не значит забыть или простить. Это значит перестать нести эту тяжесть каждый день. Мы будем идти постепенно, уважая твой темп и твои чувства.',
    keywords: ['прошлое', 'отпустить', 'обида', 'сожаление', 'забыть', 'не отпускает', 'расставание', 'бывший']
  },

  // 5. Низкая самооценка
  {
    id: 'low_self_esteem',
    name: 'Не уверена в себе',
    shortName: 'Самооценка',
    description: 'Внутренний критик не даёт покоя. Сравниваю себя с другими не в свою пользу.',
    icon: '💔',
    color: '#E91E63',
    program: {
      title: 'Внутренняя опора',
      duration: '14 дней',
      dailyMinutes: 12,
      description: 'Укрепление самоценности. Учимся слышать свои потребности и относиться к себе с добротой.',
      breathing: ['confidence_breath', 'heart_breath', 'grounding_breath'],
      meditations: ['self_compassion', 'inner_strength', 'self_acceptance'],
      practices: ['strengths_inventory', 'self_compassion', 'critic_dialogue'],
      emotions: ['shame', 'insecurity', 'self_criticism', 'acceptance', 'gratitude'],
      morning: 'Утреннее намерение (5 мин)',
      evening: 'Практика самосострадания (7 мин)'
    },
    botResponse: 'Твоя ценность не зависит от достижений или мнения других. Но я знаю, что услышать это недостаточно — нужно прочувствовать. Этим и займёмся.',
    keywords: ['самооценка', 'уверенность', 'критик', 'сравнение', 'не достойна', 'неудачница', 'комплексы']
  },

  // 6. Напряжение в отношениях
  {
    id: 'relationship_tension',
    name: 'Напряжение в отношениях',
    shortName: 'Отношения',
    description: 'Конфликты, недопонимание или отдаление от близких. Чувствую себя одинокой рядом с другими.',
    icon: '💑',
    color: '#F44336',
    program: {
      title: 'Связь с собой и другими',
      duration: '10 дней',
      dailyMinutes: 12,
      description: 'Работа с границами, эмоциями в отношениях и коммуникацией. Начинаем с себя.',
      breathing: ['heart_breath', 'calming_breath', 'connection_breath'],
      meditations: ['loving_kindness', 'boundary_meditation', 'communication_clarity'],
      practices: ['i_message', 'boundary_awareness', 'expectation_check'],
      emotions: ['resentment', 'loneliness', 'anger', 'love', 'gratitude'],
      morning: 'Утреннее центрирование (5 мин)',
      evening: 'Рефлексия отношений (7 мин)'
    },
    botResponse: 'Отношения — это зеркало нашего внутреннего состояния. Начнём с того, чтобы понять свои чувства и потребности, а потом посмотрим, как выражать их так, чтобы быть услышанной.',
    keywords: ['отношения', 'конфликт', 'партнёр', 'семья', 'ссоры', 'понимание', 'муж', 'жена']
  },

  // 7. Эмоциональное переедание
  {
    id: 'emotional_eating',
    name: 'Заедаю эмоции',
    shortName: 'Еда',
    description: 'Еда стала способом справляться с эмоциями. Ем не от голода, а от стресса или скуки.',
    icon: '🍰',
    color: '#FF9800',
    program: {
      title: 'Осознанное питание',
      duration: '14 дней',
      dailyMinutes: 10,
      description: 'Учимся различать физический и эмоциональный голод. Находим другие способы заботы о себе.',
      breathing: ['calming_breath', 'pause_breath', 'body_awareness_breath'],
      meditations: ['hunger_awareness', 'emotional_check', 'body_scan'],
      practices: ['hunger_scale', 'emotion_diary', 'alternative_comfort'],
      emotions: ['anxiety', 'boredom', 'loneliness', 'comfort', 'pleasure'],
      morning: 'Проверка состояния (3 мин)',
      day: 'Пауза перед едой (2 мин)',
      evening: 'Рефлексия дня (5 мин)'
    },
    botResponse: 'Еда — это один из первых способов утешения, который мы узнаём. Но он перестаёт работать. Мы найдём другие способы заботиться о себе, не отнимая удовольствие от еды.',
    keywords: ['еда', 'переедание', 'заедаю', 'вес', 'стресс', 'сладкое', 'диета', 'срыв']
  },

  // 8. Нет энергии
  {
    id: 'no_energy',
    name: 'Нет сил ни на что',
    shortName: 'Апатия',
    description: 'Апатия, всё кажется бессмысленным. Даже встать с кровати — подвиг.',
    icon: '😶',
    color: '#607D8B',
    program: {
      title: 'Маленькие шаги',
      duration: '7 дней',
      dailyMinutes: 5,
      description: 'Микро-практики для самых тяжёлых дней. Не требуют сил, но возвращают в тело.',
      breathing: ['gentle_breath', 'grounding_breath', 'energy_sip'],
      meditations: ['body_awareness', 'tiny_joy', 'present_moment'],
      practices: ['micro_movement', 'one_thing', 'gratitude_one'],
      emotions: ['apathy', 'exhaustion', 'hope', 'curiosity'],
      morning: 'Одно дыхание (1 мин)',
      day: 'Микро-движение (2 мин)',
      evening: 'Одна благодарность (2 мин)'
    },
    botResponse: 'Когда сил нет совсем, большие задачи только усугубляют. Мы начнём с крошечных шагов — настолько маленьких, что их невозможно не сделать. Это работает.',
    keywords: ['апатия', 'нет сил', 'бессмысленно', 'депрессия', 'ничего не хочу', 'пустота', 'безразличие']
  },

  // 9. Не могу сосредоточиться
  {
    id: 'cant_focus',
    name: 'Не могу сосредоточиться',
    shortName: 'Фокус',
    description: 'Мысли скачут, внимание рассеивается. Начинаю много дел, но ничего не заканчиваю.',
    icon: '🎯',
    color: '#673AB7',
    program: {
      title: 'Ясный фокус',
      duration: '7 дней',
      dailyMinutes: 10,
      description: 'Тренировка внимания и техники для концентрации. Учимся возвращать ум в настоящее.',
      breathing: ['focus_breath', 'box_breathing', 'single_point_breath'],
      meditations: ['attention_training', 'present_moment', 'clarity_meditation'],
      practices: ['pomodoro_breath', 'single_tasking', 'mind_dump'],
      emotions: ['anxiety', 'frustration', 'serenity', 'interest'],
      morning: 'Утренний фокус (5 мин)',
      day: 'Перезагрузка внимания (3 мин)',
      evening: 'Отпускание дня (2 мин)'
    },
    botResponse: 'Рассеянное внимание — признак перегруженного ума. Мы научимся мягко возвращать фокус и создавать островки концентрации в течение дня.',
    keywords: ['концентрация', 'внимание', 'фокус', 'рассеянность', 'мысли', 'продуктивность', 'прокрастинация']
  },

  // 10. Перепады настроения
  {
    id: 'mood_swings',
    name: 'Перепады настроения',
    shortName: 'Настроение',
    description: 'Эмоции как на американских горках. То нормально, то накрывает — и не знаю почему.',
    icon: '🎢',
    color: '#FF5722',
    program: {
      title: 'Эмоциональный баланс',
      duration: '10 дней',
      dailyMinutes: 12,
      description: 'Учимся понимать триггеры и паттерны. Находим баланс, не подавляя эмоции.',
      breathing: ['balancing_breath', 'calming_breath', 'centering_breath'],
      meditations: ['emotional_awareness', 'wave_meditation', 'inner_stability'],
      practices: ['emotion_diary', 'trigger_tracking', 'mood_planning'],
      emotions: ['anger', 'sadness', 'joy', 'anxiety', 'serenity'],
      morning: 'Проверка состояния (3 мин)',
      day: 'SOS-стабилизация по необходимости',
      evening: 'Дневник эмоций (5 мин)'
    },
    botResponse: 'Перепады — это не «плохой характер». Часто за ними стоят паттерны, которые можно отследить и понять. Мы разберёмся, что запускает волны, и научимся их сглаживать.',
    keywords: ['настроение', 'перепады', 'эмоции', 'нестабильность', 'пмс', 'гормоны', 'истерики']
  },

  // 11. Одиночество
  {
    id: 'loneliness',
    name: 'Чувствую себя одинокой',
    shortName: 'Одиночество',
    description: 'Даже среди людей — одна. Не с кем поговорить по-настоящему.',
    icon: '🌙',
    color: '#2196F3',
    program: {
      title: 'Связь и принадлежность',
      duration: '10 дней',
      dailyMinutes: 12,
      description: 'Работа с одиночеством начинается с дружбы с собой. Потом — шаги к другим.',
      breathing: ['heart_breath', 'connection_breath', 'self_hug_breath'],
      meditations: ['self_companionship', 'loving_kindness', 'belonging_meditation'],
      practices: ['self_date', 'reaching_out', 'community_finding'],
      emotions: ['loneliness', 'sadness', 'shame', 'love', 'gratitude'],
      morning: 'Дружба с собой (5 мин)',
      evening: 'Loving-kindness медитация (7 мин)'
    },
    botResponse: 'Одиночество — одна из самых болезненных эмоций. Но связь с другими начинается с связи с собой. Мы будем работать на обоих уровнях.',
    keywords: ['одиночество', 'одна', 'изоляция', 'не с кем', 'непонимание', 'друзья', 'близкие']
  },

  // 12. Переживаю изменения
  {
    id: 'life_transition',
    name: 'Переживаю изменения',
    shortName: 'Перемены',
    description: 'Жизнь меняется — переезд, развод, смена работы, материнство. Земля уходит из-под ног.',
    icon: '🦋',
    color: '#009688',
    program: {
      title: 'Опора в переменах',
      duration: '14 дней',
      dailyMinutes: 12,
      description: 'Поддержка в период трансформации. Находим стабильность внутри, когда снаружи всё меняется.',
      breathing: ['grounding_breath', 'stability_breath', 'heart_breath'],
      meditations: ['change_acceptance', 'inner_anchor', 'transition_support'],
      practices: ['values_clarification', 'new_identity', 'grief_process'],
      emotions: ['fear', 'anxiety', 'grief', 'hope', 'courage'],
      morning: 'Утренняя опора (5 мин)',
      evening: 'Принятие и отпускание (7 мин)'
    },
    botResponse: 'Перемены — это потеря, даже если они к лучшему. Нужно время, чтобы отпустить старое и принять новое. Я буду рядом на этом пути.',
    keywords: ['изменения', 'перемены', 'переезд', 'развод', 'новое', 'трансформация', 'декрет', 'увольнение']
  },

  // 13. Перфекционизм
  {
    id: 'perfectionism',
    name: 'Требую от себя слишком много',
    shortName: 'Перфекционизм',
    description: 'Всё должно быть идеально, иначе — провал. Устала от собственных стандартов.',
    icon: '✨',
    color: '#FFC107',
    program: {
      title: 'Достаточно хороша',
      duration: '10 дней',
      dailyMinutes: 10,
      description: 'Ослабление хватки перфекционизма. Учимся принимать «достаточно хорошо» и радоваться процессу.',
      breathing: ['releasing_breath', 'calming_breath', 'acceptance_breath'],
      meditations: ['good_enough', 'self_compassion', 'process_joy'],
      practices: ['imperfection_practice', 'done_not_perfect', 'progress_celebration'],
      emotions: ['shame', 'anxiety', 'self_criticism', 'acceptance', 'joy'],
      morning: 'Намерение на несовершенство (3 мин)',
      evening: 'Празднование сделанного (5 мин)'
    },
    botResponse: 'Перфекционизм — это попытка контролировать мнение других через идеальность. Но он крадёт радость. Давай попробуем по-другому — и увидим, что мир не рухнет.',
    keywords: ['перфекционизм', 'идеально', 'стандарты', 'критика', 'недостаточно', 'ошибки', 'контроль']
  },

  // 14. Напряжение в теле
  {
    id: 'body_tension',
    name: 'Напряжение в теле',
    shortName: 'Тело',
    description: 'Зажатые плечи, головные боли, сжатая челюсть. Тело как в панцире.',
    icon: '💆',
    color: '#4CAF50',
    program: {
      title: 'Свободное тело',
      duration: '7 дней',
      dailyMinutes: 15,
      description: 'Снятие хронического напряжения через дыхание, осознанность и мягкое движение.',
      breathing: ['body_release_breath', 'progressive_relaxation', 'jaw_release'],
      meditations: ['body_scan', 'tension_release', 'body_gratitude'],
      practices: ['micro_stretching', 'tension_awareness', 'somatic_release'],
      emotions: ['anxiety', 'stress', 'anger', 'serenity', 'pleasure'],
      morning: 'Утреннее пробуждение тела (5 мин)',
      day: 'Микро-разрядка (3 мин)',
      evening: 'Полное расслабление (7 мин)'
    },
    botResponse: 'Тело хранит всё, что мы не выразили. Хроническое напряжение — это накопленный стресс. Мы будем мягко учить тело отпускать и чувствовать себя безопасно.',
    keywords: ['напряжение', 'тело', 'плечи', 'головная боль', 'зажим', 'спина', 'шея', 'челюсть']
  },

  // 15. Эмоциональная отключённость
  {
    id: 'emotional_numbness',
    name: 'Не чувствую эмоций',
    shortName: 'Онемение',
    description: 'Как будто отключилась от чувств. Ни радости, ни грусти — пустота.',
    icon: '🫥',
    color: '#795548',
    program: {
      title: 'Возвращение чувств',
      duration: '14 дней',
      dailyMinutes: 10,
      description: 'Мягкое восстановление контакта с эмоциями. Безопасно и постепенно.',
      breathing: ['feeling_breath', 'heart_breath', 'body_awareness_breath'],
      meditations: ['emotion_inviting', 'body_feelings', 'safety_first'],
      practices: ['emotion_vocabulary', 'sensation_tracking', 'creative_expression'],
      emotions: ['numbness', 'fear', 'sadness', 'curiosity', 'joy'],
      morning: 'Проверка ощущений (3 мин)',
      evening: 'Приглашение чувств (7 мин)'
    },
    botResponse: 'Отключение от эмоций — это защита, которая когда-то помогла. Но теперь она мешает жить полноценно. Мы будем очень осторожно и безопасно возвращать связь с чувствами.',
    keywords: ['онемение', 'не чувствую', 'пустота', 'эмоции', 'отключился', 'ничего', 'безразличие']
  }
];

// ============================================
// СОВЕТЫ ДНЯ
// ============================================

export const dailyTips: DailyTip[] = [
  { id: 'water', icon: '💧', title: 'Стакан воды', description: 'Вода вымывает продукты стресса. Простой шаг с большим эффектом.' },
  { id: 'walk', icon: '🚶‍♀️', title: '15 минут на воздухе', description: 'Короткая прогулка перезагружает нервную систему лучше любого гаджета.' },
  { id: 'grounding', icon: '🌿', title: 'Заземление', description: 'Встань босиком на траву или пол. 2 минуты — и ты чувствуешь опору.' },
  { id: 'limit_news', icon: '📵', title: 'Пауза от новостей', description: 'Сегодня — без новостной ленты. Твоя нервная система скажет спасибо.' },
  { id: 'body_scan', icon: '🧘', title: 'Сканирование тела', description: 'Пройдись вниманием по телу. Где напряжение? Просто заметь.' },
  { id: 'warm_bath', icon: '🛁', title: 'Тёплая ванна', description: 'Вечерняя ванна снижает кортизол и готовит тело ко сну.' },
  { id: 'early_sleep', icon: '🌙', title: 'Ложись на час раньше', description: 'Сегодня — эксперимент. Ложись на час раньше и почувствуй разницу утром.' },
  { id: 'daytime_rest', icon: '😴', title: '10 минут дневного отдыха', description: 'Не сон, а просто лежание с закрытыми глазами. Мозг всё равно отдохнёт.' },
  { id: 'protein_breakfast', icon: '🥚', title: 'Белковый завтрак', description: 'Белок утром = стабильная энергия до обеда. Без скачков сахара.' },
  { id: 'digital_sunset', icon: '📱', title: 'Цифровой закат', description: 'За час до сна — никаких экранов. Мелатонин скажет спасибо.' },
  { id: 'nature', icon: '🌳', title: 'Время на природе', description: '20 минут среди деревьев снижают кортизол на 20%. Доказано наукой.' },
  { id: 'self_compassion', icon: '💝', title: 'Добрые слова себе', description: 'Скажи себе то, что сказала бы лучшей подруге в трудный момент.' },
  { id: 'journaling', icon: '📝', title: 'Пиши, что чувствуешь', description: 'Выгрузи мысли на бумагу. Не для красоты — для разгрузки головы.' },
  { id: 'gentle_movement', icon: '🤸‍♀️', title: 'Мягкое движение', description: 'Потянись, покрутись, пошевелись. Тело хранит эмоции — отпусти их.' },
  { id: 'gratitude', icon: '🙏', title: '3 благодарности', description: 'Назови 3 вещи, за которые благодарна сегодня. Маленькие тоже считаются.' },
  { id: 'sunlight', icon: '☀️', title: 'Солнечный свет', description: 'Первые 30 минут после пробуждения — свет в глаза. Это настраивает циркадные ритмы.' },
  { id: 'breathe', icon: '🌬️', title: 'Одно глубокое дыхание', description: 'Прямо сейчас — один глубокий вдох и длинный выдох. Уже лучше.' },
  { id: 'hug', icon: '🤗', title: 'Обними кого-то', description: 'Или себя. 20 секунд объятия выделяют окситоцин.' },
  { id: 'music', icon: '🎵', title: 'Любимая песня', description: 'Включи то, что поднимает настроение. Музыка меняет химию мозга.' },
  { id: 'tea_ritual', icon: '🍵', title: 'Чайная церемония', description: 'Завари чай осознанно. Наблюдай за паром, вдыхай аромат, пей медленно.' },
  { id: 'window', icon: '🪟', title: 'Посмотри в окно', description: '2 минуты смотреть вдаль. Отдых для глаз и перезагрузка для ума.' },
  { id: 'cold_water', icon: '🧊', title: 'Холодная вода на лицо', description: 'Активирует рефлекс погружения и мгновенно успокаивает.' },
  { id: 'declutter', icon: '🧹', title: 'Убери одну вещь', description: 'Порядок снаружи = порядок внутри. Начни с малого.' },
  { id: 'say_no', icon: '🚫', title: 'Скажи «нет» чему-то', description: 'Границы — это забота о себе. Сегодня попрактикуйся.' },
  { id: 'call_friend', icon: '📞', title: 'Позвони близкому', description: 'Не писать, а позвонить. Голос создаёт связь.' },
  { id: 'laugh', icon: '😄', title: 'Посмотри что-то смешное', description: 'Смех снижает кортизол и повышает эндорфины. Лечись комедией.' },
  { id: 'stretch', icon: '🙆‍♀️', title: 'Потянись', description: 'Подними руки вверх, потянись в стороны. 1 минута — и тело благодарит.' },
  { id: 'flowers', icon: '🌸', title: 'Купи себе цветы', description: 'Или сорви травинку. Живая природа в доме меняет настроение.' },
];

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

export function getProtocolById(id: PainProtocol): Protocol | undefined {
  return protocols.find(p => p.id === id);
}

export function getProtocolByKeyword(keyword: string): Protocol[] {
  const lowerKeyword = keyword.toLowerCase();
  return protocols.filter(p =>
    p.keywords.some(k => k.includes(lowerKeyword) || lowerKeyword.includes(k))
  );
}

export function getAllProtocols(): Protocol[] {
  return protocols;
}

export function getRandomDailyTips(count: number = 3): DailyTip[] {
  const shuffled = [...dailyTips].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getDailyTipById(id: string): DailyTip | undefined {
  return dailyTips.find(t => t.id === id);
}

// Helper to create Practice from protocol info
function createPracticeFromProtocol(
  protocol: Protocol,
  type: 'morning' | 'day' | 'evening'
): Practice {
  const programField = protocol.program[type];
  const title = programField || `${type === 'morning' ? 'Утренняя' : type === 'day' ? 'Дневная' : 'Вечерняя'} практика`;

  // Extract duration from title like "Утреннее заземление (5 мин)"
  const durationMatch = title.match(/\((\d+)\s*мин/);
  const duration = durationMatch ? parseInt(durationMatch[1]) : 5;

  return {
    id: `${protocol.id}_${type}`,
    title: title.replace(/\s*\(\d+\s*мин\)/, ''),
    subtitle: protocol.program.title,
    duration,
    type: type === 'morning' ? 'breathing' : 'meditation',
    tags: protocol.keywords.slice(0, 3),
    description: protocol.program.description,
  };
}

// Generate a weekly program based on user's onboarding answers
export function generateWeeklyProgram(answers: {
  painProtocol?: PainProtocol;
  goals?: string[];
  experience?: string;
}): WeeklyProgram {
  const protocol = answers.painProtocol
    ? getProtocolById(answers.painProtocol)
    : protocols[0];

  const effectiveProtocol = protocol || protocols[0];

  const morningPractice = createPracticeFromProtocol(effectiveProtocol, 'morning');
  const dayPractice = createPracticeFromProtocol(effectiveProtocol, 'day');
  const eveningPractice = createPracticeFromProtocol(effectiveProtocol, 'evening');

  return {
    morningPractices: Array(7).fill(morningPractice),
    dayPractices: Array(7).fill(dayPractice),
    eveningPractices: Array(7).fill(eveningPractice),
    dailyTips: getRandomDailyTips(7),
    weekTheme: effectiveProtocol.program.title,
    weekDescription: effectiveProtocol.program.description,
  };
}
