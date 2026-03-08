'use client';

import { Home, Layers, Map, ShoppingBag, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTelegram } from './TelegramProvider';

interface NavItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Главная', path: '/' },
  { icon: Layers, label: 'Программа', path: '/program' },
  { icon: Map, label: 'Карта', path: '/map' },
  { icon: ShoppingBag, label: 'Магазин', path: '/shop' },
  { icon: User, label: 'Профиль', path: '/profile' },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { hapticFeedback } = useTelegram();

  const handleNavClick = (path: string) => {
    hapticFeedback('light');
    router.push(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="glass mx-4 mb-4 rounded-2xl px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                  isActive ? 'text-aura-mint-dark' : 'text-aura-slate/60'
                }`}
              >
                <Icon size={22} className={isActive ? 'text-aura-mint-dark' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
