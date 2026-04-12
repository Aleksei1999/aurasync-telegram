'use client';

import { Home, BookOpen, BookText, Map, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTelegram } from './TelegramProvider';

interface NavItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  path: string;
  emoji?: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Сегодня', path: '/', emoji: '🏠' },
  { icon: BookOpen, label: 'Библиотека', path: '/library', emoji: '📚' },
  { icon: BookText, label: 'Дневник', path: '/journal', emoji: '📓' },
  { icon: Map, label: 'Карта', path: '/emotions', emoji: '🗺' },
  { icon: User, label: 'Профиль', path: '/profile', emoji: '👤' },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { hapticFeedback } = useTelegram();

  // Check if current path matches nav item (including nested routes)
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    hapticFeedback('light');
    router.push(path);
  };

  // Don't show navigation on certain screens
  const hideOnPaths = ['/onboarding', '/practice/', '/meditation/'];
  const shouldHide = hideOnPaths.some(p => pathname.startsWith(p));
  if (shouldHide) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-aura-sand safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[60px] transition-colors ${
                active ? 'text-aura-accent' : 'text-aura-text-muted'
              }`}
            >
              <Icon
                size={22}
                className={active ? 'text-aura-accent' : 'text-aura-text-muted'}
              />
              <span className={`text-[10px] font-medium ${active ? 'text-aura-accent' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default Navigation;
