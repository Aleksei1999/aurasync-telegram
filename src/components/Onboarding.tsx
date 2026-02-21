'use client';

import { useState } from 'react';
import { ChevronRight, Sparkles, Heart, BarChart3 } from 'lucide-react';
import { useTelegram } from './TelegramProvider';

interface OnboardingSlide {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

const slides: OnboardingSlide[] = [
  {
    icon: Sparkles,
    title: 'Your Personal Wellness Manager',
    description: 'AuraSync helps you manage stress, balance hormones, and feel your best every day.',
    gradient: 'from-aura-mint to-aura-mint-dark',
  },
  {
    icon: Heart,
    title: 'Science-Backed Practices',
    description: 'Our methods are based on neuroscience research, not esoteric practices.',
    gradient: 'from-aura-peach to-aura-peach-dark',
  },
  {
    icon: BarChart3,
    title: 'See Real Results',
    description: 'Track your progress and see how meditation affects your beauty and energy.',
    gradient: 'from-aura-lavender to-aura-lavender-dark',
  },
];

interface FeelingOption {
  id: string;
  label: string;
}

const feelings: FeelingOption[] = [
  { id: 'calm', label: 'Calm and grounded' },
  { id: 'light', label: 'Light and blissful' },
  { id: 'empowered', label: 'Empowered and worth' },
  { id: 'aligned', label: 'Aligned and connected' },
];

interface OnboardingProps {
  onComplete: (selectedFeelings: string[]) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const { hapticFeedback } = useTelegram();

  const isLastSlide = currentSlide === slides.length;
  const showFeelingSelection = currentSlide === slides.length;

  const handleNext = () => {
    hapticFeedback('light');
    if (isLastSlide) {
      if (selectedFeelings.length > 0) {
        onComplete(selectedFeelings);
      }
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleFeelingToggle = (id: string) => {
    hapticFeedback('light');
    setSelectedFeelings((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSkip = () => {
    hapticFeedback('light');
    setCurrentSlide(slides.length);
  };

  if (showFeelingSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-aura-lavender-light to-aura-cream flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-6 py-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            How would you like to feel?
          </h1>
          <p className="text-center text-aura-slate/70 mb-8">
            Select all that resonate with you
          </p>

          <div className="space-y-3">
            {feelings.map((feeling) => (
              <button
                key={feeling.id}
                onClick={() => handleFeelingToggle(feeling.id)}
                className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                  selectedFeelings.includes(feeling.id)
                    ? 'bg-aura-mint text-foreground'
                    : 'bg-white/70 text-aura-slate/80'
                }`}
              >
                {feeling.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="px-6 pb-12 safe-area-bottom">
          <button
            onClick={handleNext}
            disabled={selectedFeelings.length === 0}
            className={`w-full btn-primary flex items-center justify-center gap-2 ${
              selectedFeelings.length === 0 ? 'opacity-50' : ''
            }`}
          >
            Get Started
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-aura-cream to-white flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-4 safe-area-top">
        <button
          onClick={handleSkip}
          className="text-aura-slate/60 text-sm font-medium px-4 py-2"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Icon */}
        <div
          className={`h-24 w-24 rounded-3xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center mb-8 shadow-lg`}
        >
          <Icon size={48} className="text-white" />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-center text-foreground mb-4">
          {slide.title}
        </h1>
        <p className="text-center text-aura-slate/70 text-lg leading-relaxed">
          {slide.description}
        </p>
      </div>

      {/* Bottom */}
      <div className="px-6 pb-12 safe-area-bottom">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-aura-mint'
                  : 'w-2 bg-aura-slate/20'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
