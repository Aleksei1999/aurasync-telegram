'use client';

import dynamic from 'next/dynamic';
import { useTelegram } from '@/components/TelegramProvider';
import { useAuth } from '@/components/AuthProvider';

const App = dynamic(() => import('@/proto/app').then((m) => m.App), {
  ssr: false,
  loading: () => <Splash />,
});

function Splash() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background:
          'radial-gradient(ellipse 600px 500px at 50% -10%, rgba(124,107,217,0.5), transparent 60%), linear-gradient(180deg, #2E2266 0%, #1E1849 50%, #15113A 100%)',
      }}
    />
  );
}

export default function HomePage() {
  const { user, webApp } = useTelegram();
  const { profile } = useAuth();

  const userName = profile?.first_name || user?.first_name;

  const handleModeChange = () => {
    try {
      webApp?.setHeaderColor('#15113A');
      webApp?.setBackgroundColor('#15113A');
    } catch (e) {}
  };

  return (
    <main style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#15113A' }}>
      <App userName={userName} onModeChange={handleModeChange} />
    </main>
  );
}
