'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import { useTelegram } from './TelegramProvider';

interface DayData {
  date: string;
  mood?: string;
  energy?: number;
  sleep?: string;
  period?: boolean;
}

interface CalendarProps {
  onDaySelect?: (date: string, data: DayData | null) => void;
}

const moodEmojis: Record<string, string> = {
  great: '😊',
  good: '🙂',
  okay: '😐',
  tired: '😴',
  stressed: '😰',
  anxious: '😟',
  sad: '😢',
  irritated: '😤',
};

const moodColors: Record<string, string> = {
  great: 'bg-green-100',
  good: 'bg-aura-mint-light',
  okay: 'bg-aura-cream',
  tired: 'bg-aura-lavender-light',
  stressed: 'bg-aura-peach-light',
  anxious: 'bg-orange-100',
  sad: 'bg-blue-100',
  irritated: 'bg-red-100',
};

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export function Calendar({ onDaySelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [daysData, setDaysData] = useState<Record<string, DayData>>({});
  const { hapticFeedback } = useTelegram();

  useEffect(() => {
    // Загружаем данные из localStorage
    const savedData = localStorage.getItem('aura_calendar_data');
    if (savedData) {
      setDaysData(JSON.parse(savedData));
    }

    // Также загружаем данные из ежедневных чекинов
    const checkinData = localStorage.getItem('aura_today_checkin');
    if (checkinData) {
      const checkin = JSON.parse(checkinData);
      if (checkin.date) {
        const dateKey = new Date(checkin.date).toISOString().split('T')[0];
        setDaysData(prev => ({
          ...prev,
          [dateKey]: {
            date: dateKey,
            mood: checkin.mood,
            energy: checkin.energy,
            sleep: checkin.sleep,
            period: prev[dateKey]?.period,
          }
        }));
      }
    }
  }, []);

  const saveData = (newData: Record<string, DayData>) => {
    localStorage.setItem('aura_calendar_data', JSON.stringify(newData));
    setDaysData(newData);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Понедельник = 0, Воскресенье = 6
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days: (number | null)[] = [];

    // Пустые ячейки до первого дня месяца
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Дни месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const formatDateKey = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const handlePrevMonth = () => {
    hapticFeedback('light');
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    hapticFeedback('light');
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    hapticFeedback('light');

    const dateKey = formatDateKey(day);
    setSelectedDate(dateKey);

    if (onDaySelect) {
      onDaySelect(dateKey, daysData[dateKey] || null);
    }
  };

  const togglePeriod = (dateKey: string) => {
    hapticFeedback('medium');
    const newData = { ...daysData };

    if (newData[dateKey]) {
      newData[dateKey] = { ...newData[dateKey], period: !newData[dateKey].period };
    } else {
      newData[dateKey] = { date: dateKey, period: true };
    }

    saveData(newData);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isFuture = (day: number) => {
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate > today;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="h-10 w-10 rounded-xl bg-aura-slate/5 flex items-center justify-center"
        >
          <ChevronLeft size={20} className="text-aura-slate" />
        </button>
        <h3 className="font-semibold text-foreground">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={handleNextMonth}
          className="h-10 w-10 rounded-xl bg-aura-slate/5 flex items-center justify-center"
        >
          <ChevronRight size={20} className="text-aura-slate" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-aura-slate/60 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateKey = formatDateKey(day);
          const dayData = daysData[dateKey];
          const hasMood = dayData?.mood;
          const hasPeriod = dayData?.period;
          const selected = selectedDate === dateKey;
          const today = isToday(day);
          const future = isFuture(day);

          return (
            <button
              key={dateKey}
              onClick={() => handleDayClick(day)}
              disabled={future}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                selected
                  ? 'ring-2 ring-aura-mint ring-offset-2'
                  : ''
              } ${
                hasMood
                  ? moodColors[dayData.mood!]
                  : today
                  ? 'bg-aura-mint-light'
                  : future
                  ? 'bg-aura-slate/5 opacity-50'
                  : 'bg-aura-slate/5'
              }`}
            >
              <span className={`text-sm font-medium ${today ? 'text-aura-mint-dark' : 'text-foreground'}`}>
                {day}
              </span>
              {hasMood && (
                <span className="text-xs">{moodEmojis[dayData.mood!]}</span>
              )}
              {hasPeriod && (
                <div className="absolute top-1 right-1">
                  <Droplets size={10} className="text-red-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day details */}
      {selectedDate && (
        <div className="mt-4 p-4 rounded-xl bg-aura-slate/5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-foreground">
              {new Date(selectedDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
              })}
            </span>
            <button
              onClick={() => togglePeriod(selectedDate)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                daysData[selectedDate]?.period
                  ? 'bg-red-100 text-red-600'
                  : 'bg-aura-slate/10 text-aura-slate'
              }`}
            >
              <Droplets size={14} />
              <span>{daysData[selectedDate]?.period ? 'Месячные' : 'Отметить'}</span>
            </button>
          </div>

          {daysData[selectedDate]?.mood ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{moodEmojis[daysData[selectedDate].mood!]}</span>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Настроение
                  </div>
                  <div className="text-xs text-aura-slate/60">
                    Энергия: {daysData[selectedDate].energy}/5
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-aura-slate/60">
              {isFuture(parseInt(selectedDate.split('-')[2]))
                ? 'Будущая дата'
                : 'Нет данных за этот день'}
            </p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-1 text-xs text-aura-slate/60">
          <Droplets size={12} className="text-red-400" />
          <span>Месячные</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-aura-slate/60">
          <span>😊</span>
          <span>Настроение</span>
        </div>
      </div>
    </div>
  );
}
