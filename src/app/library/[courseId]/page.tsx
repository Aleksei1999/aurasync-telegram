'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Play, Check, Lock } from 'lucide-react';
import { useTelegram } from '@/components/TelegramProvider';
import { getCourseById, allCourses } from '@/lib/courses';
import { Course, CourseDay } from '@/lib/types';

interface CourseProgress {
  completedDays: number[];
  currentDay?: number;
}

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const { hapticFeedback } = useTelegram();

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress>({ completedDays: [] });
  const [selectedDay, setSelectedDay] = useState<CourseDay | null>(null);
  const [isPremium] = useState(false); // In real app, get from user subscription status

  useEffect(() => {
    const foundCourse = getCourseById(courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    }

    // Load progress
    const savedProgress = localStorage.getItem('aura_course_progress');
    if (savedProgress) {
      const allProgress = JSON.parse(savedProgress);
      if (allProgress[courseId]) {
        setProgress(allProgress[courseId]);
      }
    }
  }, [courseId]);

  const saveProgress = (newProgress: CourseProgress) => {
    const savedProgress = localStorage.getItem('aura_course_progress');
    const allProgress = savedProgress ? JSON.parse(savedProgress) : {};
    allProgress[courseId] = newProgress;
    localStorage.setItem('aura_course_progress', JSON.stringify(allProgress));
    setProgress(newProgress);
  };

  const handleDayClick = (day: CourseDay) => {
    // Check if locked (premium content and user is not premium)
    if (course?.isPremium && !isPremium && day.dayNumber > 1) {
      hapticFeedback('heavy');
      // Show premium modal in future
      return;
    }

    hapticFeedback('light');
    setSelectedDay(day);
  };

  const handleDayComplete = () => {
    if (!selectedDay || !course) return;

    const newCompletedDays = [...progress.completedDays];
    if (!newCompletedDays.includes(selectedDay.dayNumber)) {
      newCompletedDays.push(selectedDay.dayNumber);
    }

    saveProgress({
      ...progress,
      completedDays: newCompletedDays,
      currentDay: selectedDay.dayNumber < course.durationDays ? selectedDay.dayNumber + 1 : undefined,
    });

    hapticFeedback('heavy');
    setSelectedDay(null);
  };

  const closeDay = () => {
    setSelectedDay(null);
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-aura-bg flex items-center justify-center">
        <div className="text-aura-text-muted">Загрузка...</div>
      </div>
    );
  }

  const completedCount = progress.completedDays.length;
  const progressPercent = Math.round((completedCount / course.durationDays) * 100);

  return (
    <div className="min-h-screen bg-aura-bg">
      {/* Header */}
      <div className="pt-4 pb-6 px-5 safe-area-top bg-gradient-to-br from-aura-lavender/20 to-aura-accent/20">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm mb-4"
        >
          <ChevronLeft size={20} className="text-aura-text" />
        </button>

        <h1 className="text-2xl font-bold text-aura-text mb-2">{course.title}</h1>
        <p className="text-sm text-aura-text-secondary mb-4">{course.durationDays} дней</p>

        {/* Progress */}
        <div className="bg-white/60 rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-aura-text">Прогресс</span>
            <span className="text-sm font-bold text-aura-text">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-aura-accent rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-aura-text-muted mt-2">
            {completedCount} из {course.durationDays} дней завершено
          </p>
        </div>
      </div>

      {/* Course Info */}
      <div className="px-5 py-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-aura-text mb-2">О курсе</h3>
          <p className="text-sm text-aura-text-secondary whitespace-pre-line">{course.description}</p>
        </div>

        {/* Days List */}
        <h3 className="font-semibold text-aura-text mb-3">Дни курса</h3>
        <div className="space-y-3 pb-24">
          {course.days.map((day) => {
            const isCompleted = progress.completedDays.includes(day.dayNumber);
            const isLocked = course.isPremium && !isPremium && day.dayNumber > 1;

            return (
              <button
                key={day.dayNumber}
                onClick={() => handleDayClick(day)}
                disabled={isLocked}
                className={`w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 transition-all ${
                  isLocked ? 'opacity-60' : 'active:scale-[0.98]'
                }`}
              >
                {/* Day number / status */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-aura-accent text-white'
                      : isLocked
                      ? 'bg-gray-200 text-gray-400'
                      : 'bg-aura-accent/10 text-aura-accent'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={18} />
                  ) : isLocked ? (
                    <Lock size={16} />
                  ) : (
                    <span className="font-semibold">{day.dayNumber}</span>
                  )}
                </div>

                {/* Day info */}
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-aura-text">День {day.dayNumber}: {day.title}</h4>
                  {day.diaryPrompt && (
                    <p className="text-xs text-aura-text-muted line-clamp-1">{day.diaryPrompt}</p>
                  )}
                </div>

                {/* Play button */}
                {!isLocked && !isCompleted && (
                  <div className="w-10 h-10 rounded-full bg-aura-accent flex items-center justify-center">
                    <Play size={18} className="text-white ml-0.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-aura-text">
                  День {selectedDay.dayNumber}: {selectedDay.title}
                </h3>
              </div>
              <button
                onClick={closeDay}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <ChevronLeft size={18} className="rotate-[270deg] text-aura-text-muted" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-aura-sand/30 rounded-xl p-4">
                <p className="text-sm text-aura-text whitespace-pre-line">{selectedDay.textMessage}</p>
              </div>

              {selectedDay.diaryPrompt && (
                <div className="bg-aura-lavender/10 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-aura-text mb-2">Вопрос для дневника:</h4>
                  <p className="text-sm text-aura-text-secondary">{selectedDay.diaryPrompt}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/practice/${selectedDay.practiceId}`)}
                className="flex-1 py-4 bg-aura-accent/10 text-aura-accent font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <Play size={18} />
                К практике
              </button>
              <button
                onClick={handleDayComplete}
                className="flex-1 py-4 bg-aura-accent text-white font-semibold rounded-xl"
              >
                Завершить день
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
