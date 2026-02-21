'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramContextType {
  user: TelegramUser | null;
  initData: string | null;
  startParam: string | null;
  isReady: boolean;
  isLoading: boolean;
  webApp: typeof window.Telegram.WebApp | null;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  showAlert: (message: string) => void;
  showConfirm: (message: string) => Promise<boolean>;
  close: () => void;
  expand: () => void;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  initData: null,
  startParam: null,
  isReady: false,
  isLoading: true,
  webApp: null,
  showMainButton: () => {},
  hideMainButton: () => {},
  showBackButton: () => {},
  hideBackButton: () => {},
  hapticFeedback: () => {},
  showAlert: () => {},
  showConfirm: async () => false,
  close: () => {},
  expand: () => {},
});

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        close: () => void;
        expand: () => void;
        initData: string;
        initDataUnsafe: {
          query_id?: string;
          user?: TelegramUser;
          auth_date?: number;
          hash?: string;
          start_param?: string;
        };
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        openLink: (url: string) => void;
        openTelegramLink: (url: string) => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}

function initializeTelegram() {
  if (typeof window === 'undefined') {
    return { tg: null, user: null, initData: null, startParam: null };
  }

  const tg = window.Telegram?.WebApp;
  const urlParams = new URLSearchParams(window.location.search);
  const refFromUrl = urlParams.get('ref');

  if (tg) {
    tg.ready();
    tg.expand();

    if (tg.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    const startParam = tg.initDataUnsafe?.start_param || refFromUrl || null;

    return {
      tg,
      user: tg.initDataUnsafe?.user || null,
      initData: tg.initData,
      startParam,
    };
  }

  // Development mode - mock data
  console.log('Running outside Telegram - using mock data');
  return {
    tg: null,
    user: {
      id: 123456789,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      language_code: 'ru',
    } as TelegramUser,
    initData: 'mock_init_data',
    startParam: refFromUrl,
  };
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegramData = useMemo(() => initializeTelegram(), []);

  const [user] = useState<TelegramUser | null>(telegramData.user);
  const [initData] = useState<string | null>(telegramData.initData);
  const [startParam] = useState<string | null>(telegramData.startParam);
  const [isReady] = useState(telegramData.tg !== null || telegramData.user !== null);
  const [isLoading] = useState(false);
  const [webApp] = useState<typeof window.Telegram.WebApp | null>(telegramData.tg);
  const [mainButtonCallback, setMainButtonCallback] = useState<(() => void) | null>(null);
  const [backButtonCallback, setBackButtonCallback] = useState<(() => void) | null>(null);

  const showMainButton = (text: string, onClick: () => void) => {
    if (!webApp) return;

    if (mainButtonCallback) {
      webApp.MainButton.offClick(mainButtonCallback);
    }

    webApp.MainButton.setText(text);
    webApp.MainButton.onClick(onClick);
    webApp.MainButton.show();

    setMainButtonCallback(() => onClick);
  };

  const hideMainButton = () => {
    if (!webApp) return;

    if (mainButtonCallback) {
      webApp.MainButton.offClick(mainButtonCallback);
    }
    webApp.MainButton.hide();
    setMainButtonCallback(null);
  };

  const showBackButton = (onClick: () => void) => {
    if (!webApp) return;

    if (backButtonCallback) {
      webApp.BackButton.offClick(backButtonCallback);
    }

    webApp.BackButton.onClick(onClick);
    webApp.BackButton.show();

    setBackButtonCallback(() => onClick);
  };

  const hideBackButton = () => {
    if (!webApp) return;

    if (backButtonCallback) {
      webApp.BackButton.offClick(backButtonCallback);
    }
    webApp.BackButton.hide();
    setBackButtonCallback(null);
  };

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    webApp?.HapticFeedback.impactOccurred(type);
  };

  const showAlert = (message: string) => {
    if (webApp) {
      webApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, (confirmed) => {
          resolve(confirmed);
        });
      } else {
        resolve(confirm(message));
      }
    });
  };

  const close = () => {
    webApp?.close();
  };

  const expand = () => {
    webApp?.expand();
  };

  return (
    <TelegramContext.Provider
      value={{
        user,
        initData,
        startParam,
        isReady,
        isLoading,
        webApp,
        showMainButton,
        hideMainButton,
        showBackButton,
        hideBackButton,
        hapticFeedback,
        showAlert,
        showConfirm,
        close,
        expand,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export const useTelegram = () => useContext(TelegramContext);
