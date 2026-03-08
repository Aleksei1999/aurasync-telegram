'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Map, Star, Lock, CheckCircle, ChevronRight, Sparkles, Heart, Brain, Moon, Sun, Flower } from 'lucide-react';

interface MapNode {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isCompleted: boolean;
  isLocked: boolean;
  level: number;
}

const developmentMap: MapNode[] = [
  {
    id: 'basics',
    title: 'Основы осознанности',
    description: 'Первые шаги к гармонии',
    icon: Star,
    isCompleted: false,
    isLocked: false,
    level: 1,
  },
  {
    id: 'breathing',
    title: 'Дыхательные практики',
    description: 'Управление энергией через дыхание',
    icon: Sun,
    isCompleted: false,
    isLocked: false,
    level: 1,
  },
  {
    id: 'emotions',
    title: 'Эмоциональный интеллект',
    description: 'Понимание своих эмоций',
    icon: Heart,
    isCompleted: false,
    isLocked: true,
    level: 2,
  },
  {
    id: 'body',
    title: 'Связь с телом',
    description: 'Телесные практики и осознанность',
    icon: Flower,
    isCompleted: false,
    isLocked: true,
    level: 2,
  },
  {
    id: 'mind',
    title: 'Ясность ума',
    description: 'Медитации для концентрации',
    icon: Brain,
    isCompleted: false,
    isLocked: true,
    level: 3,
  },
  {
    id: 'sleep',
    title: 'Мастер сна',
    description: 'Глубокий восстановительный сон',
    icon: Moon,
    isCompleted: false,
    isLocked: true,
    level: 3,
  },
];

export default function MapPage() {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

  const levels = [1, 2, 3];

  return (
    <div className="min-h-screen bg-background pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-4 safe-area-top">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-aura-lavender to-aura-lavender-dark flex items-center justify-center">
            <Map size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Карта развития</h1>
            <p className="text-xs text-aura-slate/60">Твой путь к балансу</p>
          </div>
        </div>

        {/* Progress */}
        <div className="card-soft p-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Общий прогресс</span>
            <span className="text-sm text-aura-mint-dark font-medium">0%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill bg-gradient-to-r from-aura-lavender to-aura-mint"
              style={{ width: '0%' }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-aura-slate/60">
            <span>Уровень 1</span>
            <span>0/6 навыков</span>
          </div>
        </div>
      </header>

      {/* Map content */}
      <main className="px-5 py-4">
        {levels.map((level) => (
          <div key={level} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded-full bg-aura-lavender-light flex items-center justify-center">
                <span className="text-xs font-bold text-aura-lavender-dark">{level}</span>
              </div>
              <span className="font-medium text-foreground">Уровень {level}</span>
              {level > 1 && (
                <Lock size={14} className="text-aura-slate/40 ml-auto" />
              )}
            </div>

            <div className="space-y-3">
              {developmentMap
                .filter((node) => node.level === level)
                .map((node) => {
                  const Icon = node.icon;
                  return (
                    <button
                      key={node.id}
                      onClick={() => !node.isLocked && setSelectedNode(node)}
                      disabled={node.isLocked}
                      className={`w-full card-soft p-4 flex items-center gap-4 transition-all ${
                        node.isLocked ? 'opacity-50' : 'active:scale-[0.99]'
                      } ${selectedNode?.id === node.id ? 'ring-2 ring-aura-lavender' : ''}`}
                    >
                      <div
                        className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                          node.isCompleted
                            ? 'bg-aura-mint'
                            : node.isLocked
                            ? 'bg-aura-slate/10'
                            : 'bg-aura-lavender-light'
                        }`}
                      >
                        {node.isCompleted ? (
                          <CheckCircle size={24} className="text-white" />
                        ) : node.isLocked ? (
                          <Lock size={20} className="text-aura-slate/40" />
                        ) : (
                          <Icon size={24} className="text-aura-lavender-dark" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-medium text-foreground">{node.title}</h4>
                        <p className="text-sm text-aura-slate/60">{node.description}</p>
                      </div>
                      {!node.isLocked && (
                        <ChevronRight size={20} className="text-aura-slate/40" />
                      )}
                    </button>
                  );
                })}
            </div>

            {/* Connection line */}
            {level < 3 && (
              <div className="flex justify-center my-4">
                <div className="w-0.5 h-8 bg-aura-slate/20" />
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Selected node detail */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 animate-slide-up safe-area-bottom">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-xl bg-aura-lavender-light flex items-center justify-center">
                <selectedNode.icon size={28} className="text-aura-lavender-dark" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground">{selectedNode.title}</h3>
                <p className="text-sm text-aura-slate/60">{selectedNode.description}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-aura-slate/80">
                <Sparkles size={16} className="text-aura-mint" />
                <span>5 практик в модуле</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-aura-slate/80">
                <Star size={16} className="text-aura-peach" />
                <span>+50 XP за завершение</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedNode(null)}
                className="flex-1 btn-secondary"
              >
                Закрыть
              </button>
              <button className="flex-1 btn-primary">
                Начать
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
