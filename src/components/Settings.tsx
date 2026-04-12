'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Bell, Shield, Palette, Mic,
  Globe, User, Trash2, Moon, Sun, Type
} from 'lucide-react';
import { useTelegram } from './TelegramProvider';
import { Card, Button } from './ui';

interface SettingsState {
  // Notifications
  morningPush: boolean;
  morningPushTime: string;
  eveningPush: boolean;
  eveningPushTime: string;
  dailyTip: boolean;
  motivational: boolean;
  quietMode: boolean;
  quietStart: string;
  quietEnd: string;

  // Privacy
  faceId: boolean;
  diaryPin: boolean;
  cloudSync: boolean;
  analytics: boolean;

  // Appearance
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  colorPalette: number;

  // Voice
  voiceType: 'female1' | 'female2' | 'male' | 'none';

  // Language
  language: 'ru' | 'en';
}

const defaultSettings: SettingsState = {
  morningPush: true,
  morningPushTime: '08:00',
  eveningPush: true,
  eveningPushTime: '21:30',
  dailyTip: true,
  motivational: false,
  quietMode: false,
  quietStart: '23:00',
  quietEnd: '07:00',

  faceId: false,
  diaryPin: false,
  cloudSync: true,
  analytics: false,

  theme: 'light',
  fontSize: 'medium',
  colorPalette: 0,

  voiceType: 'female1',

  language: 'ru',
};

export function SettingsScreen() {
  const router = useRouter();
  const { hapticFeedback } = useTelegram();
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load settings
  useEffect(() => {
    const saved = localStorage.getItem('aura_settings');
    if (saved) {
      setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, []);

  // Save settings
  const saveSettings = (newSettings: Partial<SettingsState>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('aura_settings', JSON.stringify(updated));
    hapticFeedback('light');
  };

  const handleBack = () => {
    hapticFeedback('light');
    router.back();
  };

  const handleDeleteAccount = () => {
    hapticFeedback('heavy');
    // Clear all localStorage
    localStorage.clear();
    // Redirect to start
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-aura-bg pb-8">
      {/* Header */}
      <header className="px-5 pt-4 pb-4 safe-area-top border-b border-aura-sand">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="h-10 w-10 rounded-full bg-aura-sand flex items-center justify-center"
          >
            <ChevronLeft size={20} className="text-aura-text" />
          </button>
          <h1 className="text-headline text-aura-text">Настройки</h1>
        </div>
      </header>

      <main className="px-5 py-4 space-y-6">
        {/* Notifications */}
        <Section title="Уведомления" icon={<Bell size={18} />}>
          <ToggleItem
            label="Утренний пуш"
            description={settings.morningPushTime}
            value={settings.morningPush}
            onChange={(v) => saveSettings({ morningPush: v })}
          />
          <ToggleItem
            label="Вечерний пуш"
            description={settings.eveningPushTime}
            value={settings.eveningPush}
            onChange={(v) => saveSettings({ eveningPush: v })}
          />
          <ToggleItem
            label="Дневной совет"
            value={settings.dailyTip}
            onChange={(v) => saveSettings({ dailyTip: v })}
          />
          <ToggleItem
            label="Мотивационные"
            value={settings.motivational}
            onChange={(v) => saveSettings({ motivational: v })}
          />
          <ToggleItem
            label="Тихий режим"
            description={settings.quietMode ? `${settings.quietStart} — ${settings.quietEnd}` : undefined}
            value={settings.quietMode}
            onChange={(v) => saveSettings({ quietMode: v })}
          />
        </Section>

        {/* Privacy */}
        <Section title="Приватность" icon={<Shield size={18} />}>
          <ToggleItem
            label="Face ID / Touch ID"
            description="Вход по биометрии"
            value={settings.faceId}
            onChange={(v) => saveSettings({ faceId: v })}
          />
          <ToggleItem
            label="PIN на дневник"
            description="Дополнительная защита"
            value={settings.diaryPin}
            onChange={(v) => saveSettings({ diaryPin: v })}
          />
          <ToggleItem
            label="Облачная синхронизация"
            value={settings.cloudSync}
            onChange={(v) => saveSettings({ cloudSync: v })}
          />
          <ToggleItem
            label="Анонимная аналитика"
            description="Помогает улучшить приложение"
            value={settings.analytics}
            onChange={(v) => saveSettings({ analytics: v })}
          />
        </Section>

        {/* Appearance */}
        <Section title="Внешний вид" icon={<Palette size={18} />}>
          <SelectItem
            label="Тема"
            value={settings.theme === 'light' ? 'Светлая' : settings.theme === 'dark' ? 'Тёмная' : 'Авто'}
            onClick={() => {
              const next = settings.theme === 'light' ? 'dark' : settings.theme === 'dark' ? 'auto' : 'light';
              saveSettings({ theme: next });
            }}
            icon={settings.theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          />
          <SelectItem
            label="Размер шрифта"
            value={settings.fontSize === 'small' ? 'Маленький' : settings.fontSize === 'medium' ? 'Средний' : 'Большой'}
            onClick={() => {
              const next = settings.fontSize === 'small' ? 'medium' : settings.fontSize === 'medium' ? 'large' : 'small';
              saveSettings({ fontSize: next });
            }}
            icon={<Type size={16} />}
          />
        </Section>

        {/* Voice */}
        <Section title="Голос диктора" icon={<Mic size={18} />}>
          <SelectItem
            label="Тип голоса"
            value={
              settings.voiceType === 'female1' ? 'Женский 1' :
              settings.voiceType === 'female2' ? 'Женский 2' :
              settings.voiceType === 'male' ? 'Мужской' : 'Без голоса'
            }
            onClick={() => {
              const voices: SettingsState['voiceType'][] = ['female1', 'female2', 'male', 'none'];
              const idx = voices.indexOf(settings.voiceType);
              saveSettings({ voiceType: voices[(idx + 1) % voices.length] });
            }}
          />
        </Section>

        {/* Language */}
        <Section title="Язык" icon={<Globe size={18} />}>
          <SelectItem
            label="Язык приложения"
            value={settings.language === 'ru' ? 'Русский' : 'English'}
            onClick={() => {
              saveSettings({ language: settings.language === 'ru' ? 'en' : 'ru' });
            }}
          />
        </Section>

        {/* Account */}
        <Section title="Аккаунт" icon={<User size={18} />}>
          <MenuItem
            label="Email"
            value="Не привязан"
            onClick={() => router.push('/settings/email')}
          />
          <MenuItem
            label="Сменить пароль"
            onClick={() => router.push('/settings/password')}
          />
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={18} className="text-red-500" />
              <span className="text-body text-red-500">Удалить аккаунт</span>
            </div>
          </button>
        </Section>
      </main>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5">
          <Card variant="default" className="w-full max-w-sm p-6">
            <h3 className="text-title text-aura-text mb-2">Удалить аккаунт?</h3>
            <p className="text-body text-aura-text-secondary mb-6">
              Все данные будут удалены без возможности восстановления.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Отмена
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDeleteAccount}
              >
                Удалить
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ============================================
// Helper Components
// ============================================

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-aura-accent">{icon}</span>
        <h2 className="text-caption text-aura-text-muted uppercase tracking-wide">{title}</h2>
      </div>
      <Card variant="default" className="divide-y divide-aura-sand">
        {children}
      </Card>
    </div>
  );
}

interface ToggleItemProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

function ToggleItem({ label, description, value, onChange }: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <p className="text-body text-aura-text">{label}</p>
        {description && (
          <p className="text-caption text-aura-text-muted">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-7 rounded-full transition-colors ${
          value ? 'bg-aura-accent' : 'bg-aura-sand'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

interface SelectItemProps {
  label: string;
  value: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

function SelectItem({ label, value, onClick, icon }: SelectItemProps) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        {icon && <span className="text-aura-text-muted">{icon}</span>}
        <span className="text-body text-aura-text">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-body text-aura-text-secondary">{value}</span>
        <ChevronRight size={16} className="text-aura-text-muted" />
      </div>
    </button>
  );
}

interface MenuItemProps {
  label: string;
  value?: string;
  onClick: () => void;
}

function MenuItem({ label, value, onClick }: MenuItemProps) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4">
      <span className="text-body text-aura-text">{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-body text-aura-text-secondary">{value}</span>}
        <ChevronRight size={16} className="text-aura-text-muted" />
      </div>
    </button>
  );
}

export default SettingsScreen;
