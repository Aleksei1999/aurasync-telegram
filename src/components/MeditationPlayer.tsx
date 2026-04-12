'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, MoreVertical, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import { Meditation } from '@/lib/types';
import { Button, BottomSheet } from './ui';

interface MeditationPlayerProps {
  meditation: Meditation;
  onClose: () => void;
  onComplete?: () => void;
}

export function MeditationPlayer({ meditation, onClose, onComplete }: MeditationPlayerProps) {
  const { hapticFeedback } = useTelegram();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(meditation.durationMinutes * 60);
  const [isMuted, setIsMuted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showWhyThis, setShowWhyThis] = useState(false);
  const [pulsePhase, setPulsePhase] = useState<'inhale' | 'exhale'>('inhale');

  // Animation for breathing visualization
  useEffect(() => {
    if (!isPlaying) return;

    const breathCycle = 10000; // 5s inhale + 5s exhale
    const interval = setInterval(() => {
      setPulsePhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, breathCycle / 2);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update current time
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration) {
          setIsPlaying(false);
          onComplete?.();
          return duration;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, onComplete]);

  // Format time as mm:ss
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Progress percentage
  const progress = (currentTime / duration) * 100;

  // Controls
  const togglePlay = () => {
    hapticFeedback('medium');
    setIsPlaying(!isPlaying);
  };

  const skip = (seconds: number) => {
    hapticFeedback('light');
    setCurrentTime(prev => Math.max(0, Math.min(duration, prev + seconds)));
  };

  const toggleMute = () => {
    hapticFeedback('light');
    setIsMuted(!isMuted);
  };

  const handleClose = () => {
    hapticFeedback('light');
    setIsPlaying(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2 safe-area-top">
        <button
          onClick={handleClose}
          className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X size={20} className="text-white" />
        </button>

        <button
          onClick={() => setShowOptions(true)}
          className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <MoreVertical size={20} className="text-white" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5">
        {/* Animated Circle */}
        <div className="relative w-64 h-64 mb-8">
          {/* Outer glow */}
          <div
            className={`absolute inset-0 rounded-full bg-aura-accent/20 blur-2xl transition-transform duration-[5000ms] ease-in-out ${
              pulsePhase === 'inhale' ? 'scale-110' : 'scale-90'
            }`}
          />

          {/* Main circle */}
          <div
            className={`absolute inset-4 rounded-full bg-gradient-to-br from-aura-accent/40 to-aura-lavender/40 backdrop-blur-xl border border-white/10 transition-transform duration-[5000ms] ease-in-out flex items-center justify-center ${
              pulsePhase === 'inhale' ? 'scale-105' : 'scale-95'
            }`}
          >
            {/* Inner pulse */}
            <div
              className={`w-24 h-24 rounded-full bg-white/10 transition-transform duration-[5000ms] ease-in-out ${
                pulsePhase === 'inhale' ? 'scale-125' : 'scale-75'
              }`}
            />
          </div>

          {/* Breathing hint */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/40 text-sm font-light">
              {isPlaying ? (pulsePhase === 'inhale' ? 'Вдох...' : 'Выдох...') : ''}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-headline text-white text-center mb-2">
          {meditation.name}
        </h1>

        {/* Subtitle */}
        <p className="text-body text-white/60 text-center mb-8">
          {meditation.timeOfDay === 'morning' ? 'Утренняя практика' :
           meditation.timeOfDay === 'evening' ? 'Вечерняя практика' : 'Дневная практика'}
          {' | '}{meditation.durationMinutes} минут
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-sm mb-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-aura-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-caption text-white/40">{formatTime(currentTime)}</span>
            <span className="text-caption text-white/40">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => skip(-15)}
            className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center"
          >
            <SkipBack size={20} className="text-white" />
          </button>

          <button
            onClick={togglePlay}
            className="h-16 w-16 rounded-full bg-aura-accent flex items-center justify-center shadow-lg shadow-aura-accent/30"
          >
            {isPlaying ? (
              <Pause size={28} className="text-white" />
            ) : (
              <Play size={28} className="text-white ml-1" />
            )}
          </button>

          <button
            onClick={() => skip(15)}
            className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center"
          >
            <SkipForward size={20} className="text-white" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 pb-8 safe-area-bottom">
        <button
          onClick={() => setShowWhyThis(true)}
          className="flex items-center justify-center gap-2 mx-auto text-white/50 hover:text-white/70 transition-colors"
        >
          <HelpCircle size={16} />
          <span className="text-caption">Почему эта практика?</span>
        </button>
      </footer>

      {/* Options Bottom Sheet */}
      <BottomSheet
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
        title="Настройки"
      >
        <div className="space-y-4">
          <button
            onClick={toggleMute}
            className="w-full flex items-center justify-between p-4 bg-aura-sand rounded-2xl"
          >
            <div className="flex items-center gap-3">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              <span>Звук</span>
            </div>
            <span className="text-aura-text-secondary">
              {isMuted ? 'Выкл' : 'Вкл'}
            </span>
          </button>

          <div className="text-center text-caption text-aura-text-muted pt-4">
            Больше настроек скоро появится
          </div>
        </div>
      </BottomSheet>

      {/* Why This Practice Bottom Sheet */}
      <BottomSheet
        isOpen={showWhyThis}
        onClose={() => setShowWhyThis(false)}
        title="Почему эта практика?"
      >
        <div className="space-y-4">
          <p className="text-body text-aura-text-secondary">
            {meditation.theme}
          </p>

          <p className="text-caption text-aura-text-muted">
            Техника: {meditation.technique}
          </p>

          <Button
            variant="primary"
            fullWidth
            onClick={() => setShowWhyThis(false)}
          >
            Понятно
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
