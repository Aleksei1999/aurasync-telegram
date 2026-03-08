'use client';

import { useState, useEffect } from 'react';
import {
  Play,
  Check,
  Lock,
  Sparkles,
  Droplets,
  Moon,
  Sun,
  Heart,
  Wind,
  BookOpen,
  ChevronRight,
  Trophy,
  Flame
} from 'lucide-react';
import { useTelegram } from './TelegramProvider';

interface DailyTask {
  id: string;
  type: 'morning' | 'practice' | 'evening';
  title: string;
  subtitle: string;
  duration: string;
  icon: React.ReactNode;
  color: string;
  completed: boolean;
}

interface HabitCheck {
  id: string;
  title: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface DayProgress {
  date: string;
  tasksCompleted: string[];
  habitsCompleted: string[];
}

// 30-дневная программа
const programDays = [
  { theme: 'Начало пути', focus: 'осознанность' },
  { theme: 'Дыхание жизни', focus: 'энергия' },
  { theme: 'Внутренний покой', focus: 'спокойствие' },
  { theme: 'Сила намерения', focus: 'фокус' },
  { theme: 'Благодарность', focus: 'радость' },
  { theme: 'Принятие себя', focus: 'любовь' },
  { theme: 'Энергия утра', focus: 'бодрость' },
  { theme: 'Глубокий отдых', focus: 'восстановление' },
  { theme: 'Ясность ума', focus: 'концентрация' },
  { theme: 'Эмоциональный баланс', focus: 'гармония' },
  { theme: 'Творческая энергия', focus: 'вдохновение' },
  { theme: 'Внутренняя сила', focus: 'уверенность' },
  { theme: 'Отпускание', focus: 'легкость' },
  { theme: 'Связь с телом', focus: 'здоровье' },
  { theme: 'Интуиция', focus: 'мудрость' },
  { theme: 'Радость момента', focus: 'присутствие' },
  { theme: 'Исцеление', focus: 'обновление' },
  { theme: 'Изобилие', focus: 'благодарность' },
  { theme: 'Внутренний свет', focus: 'сияние' },
  { theme: 'Гармония отношений', focus: 'любовь' },
  { theme: 'Сила духа', focus: 'стойкость' },
  { theme: 'Освобождение', focus: 'свобода' },
  { theme: 'Жизненная энергия', focus: 'витальность' },
  { theme: 'Мир внутри', focus: 'тишина' },
  { theme: 'Трансформация', focus: 'рост' },
  { theme: 'Самолюбие', focus: 'забота' },
  { theme: 'Ясное видение', focus: 'цели' },
  { theme: 'Единство', focus: 'целостность' },
  { theme: 'Благословение', focus: 'благодать' },
  { theme: 'Новое начало', focus: 'обновление' },
];

function getDayOfProgram(): number {
  const startDate = localStorage.getItem('aura_program_start');
  if (!startDate) {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('aura_program_start', today);
    return 1;
  }

  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return Math.min(diffDays + 1, 30);
}

function getTodayProgress(): DayProgress | null {
  const saved = localStorage.getItem('aura_daily_progress');
  if (!saved) return null;

  const progress = JSON.parse(saved);
  const today = new Date().toDateString();

  if (progress.date === today) {
    return progress;
  }

  return null;
}

function saveTodayProgress(progress: DayProgress) {
  localStorage.setItem('aura_daily_progress', JSON.stringify(progress));
}

export function DailyProgram() {
  const { hapticFeedback } = useTelegram();
  const [dayNumber, setDayNumber] = useState(1);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [habits, setHabits] = useState<HabitCheck[]>([]);
  const [streak, setStreak] = useState(0);
  const [showAllHabits, setShowAllHabits] = useState(false);

  useEffect(() => {
    const day = getDayOfProgram();
    setDayNumber(day);

    // Загружаем прогресс
    const progress = getTodayProgress();
    const completedTasks = progress?.tasksCompleted || [];
    const completedHabits = progress?.habitsCompleted || [];

    // Загружаем streak
    const savedStreak = localStorage.getItem('aura_streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }

    // Формируем задания дня
    const dayData = programDays[(day - 1) % 30];

    setTasks([
      {
        id: 'morning',
        type: 'morning',
        title: 'Утренняя аффирмация',
        subtitle: dayData.theme,
        duration: '3 мин',
        icon: <Sun size={20} />,
        color: 'from-amber-400 to-orange-400',
        completed: completedTasks.includes('morning'),
      },
      {
        id: 'meditation',
        type: 'practice',
        title: 'Медитация дня',
        subtitle: `Фокус: ${dayData.focus}`,
        duration: '10 мин',
        icon: <Sparkles size={20} />,
        color: 'from-aura-lavender to-purple-400',
        completed: completedTasks.includes('meditation'),
      },
      {
        id: 'breathing',
        type: 'practice',
        title: 'Дыхательная практика',
        subtitle: 'Энергизирующее дыхание',
        duration: '5 мин',
        icon: <Wind size={20} />,
        color: 'from-aura-mint to-teal-400',
        completed: completedTasks.includes('breathing'),
      },
      {
        id: 'evening',
        type: 'evening',
        title: 'Вечерняя рефлексия',
        subtitle: 'Благодарность и отпускание',
        duration: '5 мин',
        icon: <Moon size={20} />,
        color: 'from-indigo-400 to-purple-500',
        completed: completedTasks.includes('evening'),
      },
    ]);

    setHabits([
      {
        id: 'water',
        title: 'Выпила 8 стаканов воды',
        icon: <Droplets size={18} />,
        completed: completedHabits.includes('water'),
      },
      {
        id: 'meditation_done',
        title: 'Медитация выполнена',
        icon: <Sparkles size={18} />,
        completed: completedHabits.includes('meditation_done'),
      },
      {
        id: 'gratitude',
        title: 'Записала 3 благодарности',
        icon: <Heart size={18} />,
        completed: completedHabits.includes('gratitude'),
      },
      {
        id: 'movement',
        title: 'Физическая активность',
        icon: <Flame size={18} />,
        completed: completedHabits.includes('movement'),
      },
      {
        id: 'reading',
        title: 'Чтение/обучение',
        icon: <BookOpen size={18} />,
        completed: completedHabits.includes('reading'),
      },
      {
        id: 'selfcare',
        title: 'Забота о себе',
        icon: <Heart size={18} />,
        completed: completedHabits.includes('selfcare'),
      },
    ]);
  }, []);

  const toggleTask = (taskId: string) => {
    hapticFeedback('light');

    setTasks(prev => {
      const updated = prev.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );

      // Сохраняем прогресс
      const completedTasks = updated.filter(t => t.completed).map(t => t.id);
      const progress = getTodayProgress() || {
        date: new Date().toDateString(),
        tasksCompleted: [],
        habitsCompleted: [],
      };
      progress.tasksCompleted = completedTasks;
      saveTodayProgress(progress);

      return updated;
    });
  };

  const toggleHabit = (habitId: string) => {
    hapticFeedback('light');

    setHabits(prev => {
      const updated = prev.map(h =>
        h.id === habitId ? { ...h, completed: !h.completed } : h
      );

      // Сохраняем прогресс
      const completedHabits = updated.filter(h => h.completed).map(h => h.id);
      const progress = getTodayProgress() || {
        date: new Date().toDateString(),
        tasksCompleted: [],
        habitsCompleted: [],
      };
      progress.habitsCompleted = completedHabits;
      saveTodayProgress(progress);

      // Обновляем streak если все привычки выполнены
      if (completedHabits.length === habits.length) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('aura_streak', newStreak.toString());
        hapticFeedback('success');
      }

      return updated;
    });
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const completedHabitsCount = habits.filter(h => h.completed).length;
  const totalProgress = Math.round(((completedTasksCount + completedHabitsCount) / (tasks.length + habits.length)) * 100);

  const dayData = programDays[(dayNumber - 1) % 30];
  const visibleHabits = showAllHabits ? habits : habits.slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Header карточка */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-aura-mint to-aura-lavender shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={16} className="text-white/80" />
              <span className="text-sm font-medium text-white/90">Бесплатная программа</span>
            </div>
            <h3 className="text-xl font-bold text-white">День {dayNumber} из 30</h3>
            <p className="text-sm text-white/80 mt-0.5">{dayData.theme}</p>
          </div>

          <div className="text-right">
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 mb-2">
                <Flame size={14} className="text-orange-300" />
                <span className="text-sm font-medium text-white">{streak} дн.</span>
              </div>
            )}
            <div className="relative h-14 w-14">
              <svg className="h-14 w-14 -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${totalProgress * 1.51} 151`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{totalProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Мини-прогресс бар по дням */}
        <div className="flex gap-1">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < dayNumber - 1
                  ? 'bg-white'
                  : i === dayNumber - 1
                  ? 'bg-white/70'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Задания дня */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="font-semibold text-foreground">Практики дня</h4>
          <span className="text-sm text-aura-slate/60">
            {completedTasksCount}/{tasks.length} выполнено
          </span>
        </div>

        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`w-full card-soft p-4 flex items-center gap-4 transition-all ${
              task.completed ? 'opacity-70' : ''
            }`}
          >
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${task.color} flex items-center justify-center text-white shrink-0`}>
              {task.completed ? <Check size={20} /> : task.icon}
            </div>

            <div className="flex-1 text-left">
              <div className={`font-medium text-foreground ${task.completed ? 'line-through opacity-60' : ''}`}>
                {task.title}
              </div>
              <div className="text-sm text-aura-slate/60">{task.subtitle}</div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-aura-slate/50">{task.duration}</span>
              {!task.completed && (
                <div className="h-8 w-8 rounded-full bg-aura-mint/10 flex items-center justify-center">
                  <Play size={14} className="text-aura-mint ml-0.5" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Вечерний чеклист */}
      <div className="card-soft p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Moon size={18} className="text-aura-lavender" />
            <h4 className="font-semibold text-foreground">Вечерний чеклист</h4>
          </div>
          <span className="text-sm text-aura-slate/60">
            {completedHabitsCount}/{habits.length}
          </span>
        </div>

        <div className="space-y-2">
          {visibleHabits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                habit.completed
                  ? 'bg-aura-mint/10'
                  : 'bg-aura-slate/5 hover:bg-aura-slate/10'
              }`}
            >
              <div className={`h-6 w-6 rounded-lg flex items-center justify-center transition-all ${
                habit.completed
                  ? 'bg-aura-mint text-white'
                  : 'bg-white border-2 border-aura-slate/20'
              }`}>
                {habit.completed && <Check size={14} />}
              </div>

              <div className={`flex items-center gap-2 flex-1 text-left ${
                habit.completed ? 'text-aura-slate/60' : 'text-foreground'
              }`}>
                <span className={habit.completed ? 'text-aura-mint' : 'text-aura-slate/40'}>
                  {habit.icon}
                </span>
                <span className={`text-sm ${habit.completed ? 'line-through' : ''}`}>
                  {habit.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {habits.length > 4 && (
          <button
            onClick={() => setShowAllHabits(!showAllHabits)}
            className="w-full mt-3 flex items-center justify-center gap-1 text-sm text-aura-lavender font-medium"
          >
            {showAllHabits ? 'Скрыть' : `Ещё ${habits.length - 4}`}
            <ChevronRight size={16} className={`transition-transform ${showAllHabits ? 'rotate-90' : ''}`} />
          </button>
        )}

        {/* Мотивация */}
        {completedHabitsCount === habits.length && (
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-aura-mint/20 to-aura-lavender/20 flex items-center gap-3">
            <div className="text-2xl">🎉</div>
            <div className="text-sm text-foreground">
              <span className="font-medium">Отлично!</span> Все привычки выполнены!
            </div>
          </div>
        )}
      </div>

      {/* Кнопка перехода в программу */}
      <button
        onClick={() => window.location.href = '/program'}
        className="w-full card-soft p-4 flex items-center justify-between hover:bg-aura-slate/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-aura-lavender to-purple-400 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="text-left">
            <div className="font-medium text-foreground">Все программы</div>
            <div className="text-sm text-aura-slate/60">Премиум медитации и курсы</div>
          </div>
        </div>
        <ChevronRight size={20} className="text-aura-slate/40" />
      </button>
    </div>
  );
}
