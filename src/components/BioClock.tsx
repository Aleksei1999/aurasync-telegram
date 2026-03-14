'use client';

import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Sunrise, CloudSun, Headphones, Droplets, BookOpen, ChevronRight, X, Check, Play, Pause } from 'lucide-react';

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';
type RecommendationType = 'listen' | 'read' | 'checklist';

interface Recommendation {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  type: RecommendationType;
  hasVideo?: boolean;
  audioSrc?: string;
  content: {
    description: string;
    sections: {
      title: string;
      items: string[];
    }[];
    preparation?: string[];
    note?: string;
    buttonText: string;
  };
}

interface TimeConfig {
  greeting: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
  suggestion: string;
}

const timeConfigs: Record<TimeOfDay, TimeConfig> = {
  morning: {
    greeting: 'Доброе утро',
    icon: Sunrise,
    gradient: 'bg-morning',
    suggestion: 'Начни день с намерением',
  },
  day: {
    greeting: 'Добрый день',
    icon: Sun,
    gradient: 'bg-day',
    suggestion: 'Сохраняй фокус и баланс',
  },
  evening: {
    greeting: 'Добрый вечер',
    icon: CloudSun,
    gradient: 'bg-evening',
    suggestion: 'Время расслабиться и отпустить день',
  },
  night: {
    greeting: 'Доброй ночи',
    icon: Moon,
    gradient: 'bg-evening',
    suggestion: 'Подготовься к глубокому сну',
  },
};

const recommendations: Recommendation[] = [
  {
    id: 'dopamine_code',
    title: 'Код Дофамина',
    subtitle: 'Утренняя прошивка',
    duration: '7 мин',
    type: 'listen',
    audioSrc: '/audio/dopamine-code.wav',
    content: {
      description: '7 минут, чтобы перехватить управление своей биохимией и выйти из режима «выживания».',
      sections: [
        {
          title: 'Что внутри',
          items: [
            'Сброс стресса: Дыхательный ритм 4-2-6 для принудительного снижения кортизола',
            'Нейро-апгрейд: Активация центров радости и фокуса через визуализацию',
            'Эстетика: Снятие мышечных зажимов лица — естественный лифтинг'
          ]
        }
      ],
      preparation: [
        'Наушники (обязательно для бинауральных ритмов)',
        'Прямая спина (сигнал мозгу о вашей уверенности)'
      ],
      note: 'Результат накопительный. Сегодня вы создаёте нейронную связь, через 21 день она станет вашей новой чертой характера.',
      buttonText: 'Начать практику'
    }
  },
  {
    id: 'water_passport',
    title: 'Водный паспорт',
    subtitle: 'Персональный лимит',
    duration: '1 мин',
    type: 'read',
    content: {
      description: 'Настройка биологического растворителя. Твоя норма: 30 мл на 1 кг веса.',
      sections: [
        {
          title: 'Зачем это нужно',
          items: [
            'Молекулярный клининг: Кортизол и продукты его распада — это токсичный «мусор». Чтобы вымыть его из тканей и убрать «кортизоловое лицо», организму нужен растворитель.',
            'Проводимость мозга: Твои нейроны погружены в спинномозговую жидкость. При обезвоживании она становится вязкой, что замедляет передачу импульсов.',
            'Запуск лимфодренажа: Лимфа не имеет насоса. Чтобы она не превращалась в «болото», нужен объём жидкости.'
          ]
        },
        {
          title: 'Инструкция',
          items: [
            'Метод: Пей порциями по 200 мл каждые 1.5–2 часа',
            'Визуализация: Представь, что каждый глоток очищает твою систему'
          ]
        }
      ],
      note: 'Твой результат: Устранение «когнитивного тумана» и возвращение острых скул уже через 24 часа.',
      buttonText: 'Отметить в чек-листе'
    }
  },
  {
    id: 'jaw_relaxation',
    title: 'Маска спокойствия',
    subtitle: 'Расслабление жевательных',
    duration: '2 мин',
    type: 'read',
    hasVideo: true,
    content: {
      description: 'Твоё лицо — это не просто зеркало души, это биометрический терминал твоей нервной системы. Жевательные мышцы (masseters) — самые сильные мышцы в теле относительно своего размера и главные «депозитарии» твоего социального стресса.',
      sections: [
        {
          title: 'Зачем тебе это нужно',
          items: [
            'Разрыв нейронной петли страха: Когда ты злишься, терпишь или сверх-концентрируешься, ты сжимаешь челюсть. Это посылает мгновенный сигнал в амигдалу (центр страха): «Мы в опасности!». Разомкнув зубы, ты физически обрываешь этот сигнал.',
            'Ликвидация «кортизолового лица»: Хронический спазм жевательных мышц блокирует лимфоток и кровообращение в нижней трети лица. Снижение тонуса в этой зоне — самый быстрый способ вернуть лицу «скулы топ-модели» без филлеров.',
            'Выход из DMN: Расслабленная челюсть останавливает бесконечную «жвачку» тревожных мыслей в голове.'
          ]
        },
        {
          title: 'Инструкция',
          items: [
            'Зубы: Всегда разомкнуты (расстояние 3-5 мм)',
            'Губы: Мягко сомкнуты',
            'Язык: Кончик слегка касается верхнего нёба сразу за передними зубами (позиция «М-н»)',
            'Когда: Всегда, когда ты за экраном, в пробке или читаешь этот текст'
          ]
        }
      ],
      note: 'Соматический хак для обнуления стресса и лифтинга лица.',
      buttonText: 'Отметить в чек-листе'
    }
  },
  {
    id: 'alpha_immersion',
    title: 'Альфа-погружение',
    subtitle: 'Ночной ремонт',
    duration: '5 мин',
    type: 'listen',
    audioSrc: '/audio/alpha-immersion.wav',
    content: {
      description: '5 минут, чтобы переключить мозг с частоты дневного хаоса на волну глубокой регенерации.',
      sections: [
        {
          title: 'Зачем это нужно',
          items: [
            'Очистка «кэша»: Мы принудительно выключаем режим фоновой «мыслежвачки» (DMN), останавливая тревожные диалоги и списки дел',
            'Синхронизация нейронов: Альфа-ритмы готовят систему к фазе глубокого сна — именно в ней происходит реальный ремонт тканей и «лифтинг» лица',
            'Гормональный мост: Финальное подавление остаточного кортизола, чтобы дать дорогу мелатонину — вашему главному антиоксиданту'
          ]
        }
      ],
      preparation: [
        'Наушники (необходимы для работы частот)',
        'Горизонтальное положение и полная темнота'
      ],
      note: 'Ваш результат: Быстрое «проваливание» в сон и пробуждение с абсолютно ясным умом, без чувства разбитости.',
      buttonText: 'Слушать практику'
    }
  }
];

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function getRecommendationIcon(type: RecommendationType) {
  switch (type) {
    case 'listen':
      return Headphones;
    case 'read':
      return BookOpen;
    case 'checklist':
      return Check;
    default:
      return Droplets;
  }
}

function getRecommendationLabel(type: RecommendationType) {
  switch (type) {
    case 'listen':
      return 'Слушать';
    case 'read':
      return 'Читать';
    case 'checklist':
      return 'Чек-лист';
    default:
      return '';
  }
}

interface BioClockProps {
  userName?: string;
  onStartPractice?: () => void;
}

export function BioClock({ userName }: BioClockProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [currentTime, setCurrentTime] = useState('');
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setTimeOfDay(getTimeOfDay());
      setCurrentTime(new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('aura_completed_tasks');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      if (data.date === today) {
        setCompletedTasks(data.tasks);
      }
    }
  }, []);

  const handleComplete = (id: string) => {
    const newTasks = completedTasks.includes(id)
      ? completedTasks.filter(t => t !== id)
      : [...completedTasks, id];

    setCompletedTasks(newTasks);
    localStorage.setItem('aura_completed_tasks', JSON.stringify({
      date: new Date().toDateString(),
      tasks: newTasks
    }));

    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setAudioProgress(0);
    setSelectedRec(null);
  };

  const handleCloseModal = () => {
    // Stop audio when closing modal
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
    setSelectedRec(null);
  };

  const togglePlayPause = () => {
    if (!selectedRec?.audioSrc) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(selectedRec.audioSrc);
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setAudioProgress(progress);
          setAudioCurrentTime(audioRef.current.currentTime);
        }
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setAudioDuration(audioRef.current.duration);
        }
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setAudioProgress(0);
        setAudioCurrentTime(0);
        // Mark as completed when audio ends
        if (selectedRec) {
          handleComplete(selectedRec.id);
        }
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * audioDuration;
  };

  const config = timeConfigs[timeOfDay];

  return (
    <>
      <div className={`${config.gradient} rounded-3xl p-6 animated-gradient`}>
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm text-aura-slate/70 font-medium">{currentTime}</p>
          <h2 className="text-2xl font-semibold text-foreground">
            {config.greeting}{userName ? `, ${userName}` : ''}
          </h2>
        </div>

        {/* Suggestion */}
        <p className="text-aura-slate/80 mb-4">{config.suggestion}</p>

        {/* 4 Recommendations */}
        <div className="space-y-2">
          <p className="text-xs text-aura-slate/60 uppercase tracking-wide">
            Твоя программа на сегодня
          </p>
          {recommendations.map((rec) => {
            const Icon = getRecommendationIcon(rec.type);
            const isCompleted = completedTasks.includes(rec.id);

            return (
              <button
                key={rec.id}
                onClick={() => setSelectedRec(rec)}
                className={`w-full glass rounded-xl p-4 flex items-center gap-3 transition-all active:scale-[0.99] ${
                  isCompleted ? 'opacity-60' : ''
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-aura-mint/30'
                    : 'bg-gradient-to-br from-aura-mint/20 to-aura-lavender/20'
                }`}>
                  {isCompleted ? (
                    <Check size={20} className="text-aura-mint" />
                  ) : (
                    <Icon size={20} className="text-aura-mint" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`font-medium text-foreground ${isCompleted ? 'line-through' : ''}`}>
                    {rec.title}
                  </h3>
                  <p className="text-xs text-aura-slate/70">
                    {rec.subtitle} · {rec.duration} · {getRecommendationLabel(rec.type)}
                  </p>
                </div>
                <ChevronRight size={18} className="text-aura-slate/40" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedRec && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-aura-slate/10 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center">
                  {(() => {
                    const Icon = getRecommendationIcon(selectedRec.type);
                    return <Icon size={20} className="text-white" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedRec.title}</h3>
                  <p className="text-xs text-aura-slate/60">{selectedRec.subtitle}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="h-8 w-8 rounded-full bg-aura-slate/10 flex items-center justify-center"
              >
                <X size={18} className="text-aura-slate" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-5 py-6 overflow-auto max-h-[calc(85vh-140px)]">
              {/* Description */}
              <p className="text-aura-slate/80 leading-relaxed mb-6">
                {selectedRec.content.description}
              </p>

              {/* Sections */}
              {selectedRec.content.sections.map((section, idx) => (
                <div key={idx} className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">{section.title}</h4>
                  <div className="space-y-3">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="h-2 w-2 rounded-full bg-aura-mint mt-2 flex-shrink-0" />
                        <p className="text-sm text-aura-slate/80 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Audio Player */}
              {selectedRec.audioSrc && (
                <div className="mb-6 bg-gradient-to-br from-aura-mint/10 to-aura-lavender/10 rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlayPause}
                      className="h-14 w-14 rounded-full bg-gradient-to-br from-aura-mint to-aura-mint-dark flex items-center justify-center flex-shrink-0 shadow-lg"
                    >
                      {isPlaying ? (
                        <Pause size={24} className="text-white" />
                      ) : (
                        <Play size={24} className="text-white ml-1" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div
                        className="h-2 bg-aura-slate/20 rounded-full overflow-hidden cursor-pointer"
                        onClick={handleSeek}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-aura-mint to-aura-lavender transition-all duration-100"
                          style={{ width: `${audioProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-aura-slate/60">
                        <span>{formatTime(audioCurrentTime)}</span>
                        <span>{audioDuration ? formatTime(audioDuration) : selectedRec.duration}</span>
                      </div>
                    </div>
                  </div>
                  {isPlaying && (
                    <p className="text-center text-xs text-aura-mint mt-3 animate-pulse">
                      Воспроизведение...
                    </p>
                  )}
                </div>
              )}

              {/* Preparation */}
              {selectedRec.content.preparation && (
                <div className="mb-6 bg-aura-mint/10 rounded-2xl p-4">
                  <h4 className="font-semibold text-foreground mb-3">Подготовка</h4>
                  <div className="space-y-2">
                    {selectedRec.content.preparation.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={16} className="text-aura-mint flex-shrink-0" />
                        <p className="text-sm text-aura-slate/80">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Placeholder */}
              {selectedRec.hasVideo && (
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Видео-инструкция</h4>
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-aura-slate/10 to-aura-slate/5 flex flex-col items-center justify-center border-2 border-dashed border-aura-slate/20">
                    <div className="h-14 w-14 rounded-full bg-aura-slate/10 flex items-center justify-center mb-3">
                      <Play size={24} className="text-aura-slate/40 ml-1" />
                    </div>
                    <p className="text-sm text-aura-slate/50">Видео скоро появится</p>
                  </div>
                </div>
              )}

              {/* Note */}
              {selectedRec.content.note && (
                <div className="bg-aura-lavender/10 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-aura-slate/80 leading-relaxed italic">
                    {selectedRec.content.note}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-aura-slate/10 px-5 py-4 safe-area-bottom">
              <button
                onClick={() => handleComplete(selectedRec.id)}
                className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 ${
                  completedTasks.includes(selectedRec.id)
                    ? 'bg-aura-slate/50'
                    : 'bg-gradient-to-r from-aura-mint to-aura-mint-dark'
                }`}
              >
                {completedTasks.includes(selectedRec.id) ? (
                  <>
                    <Check size={20} />
                    Выполнено
                  </>
                ) : (
                  selectedRec.content.buttonText
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
