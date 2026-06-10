'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTelegram } from '@/components/TelegramProvider';
import { useAuth } from '@/components/AuthProvider';
import { pullAll } from '@/lib/store';

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
  const [synced, setSynced] = useState(false);

  // Pull the user's data from the server into the local cache before the app
  // mounts, so screens render with the saved values. Falls back to the local
  // cache if the server is slow/unreachable (graceful — never blocks for long).
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        setSynced(true);
      }
    };
    pullAll().finally(finish);
    const t = setTimeout(finish, 2500);
    return () => clearTimeout(t);
  }, []);

  const userName = profile?.first_name || user?.first_name;

  const handleModeChange = () => {
    try {
      webApp?.setHeaderColor('#15113A');
      webApp?.setBackgroundColor('#15113A');
    } catch (e) {}
  };

  if (!synced) return <Splash />;

  return (
    <main style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#15113A' }}>
      <App userName={userName} onModeChange={handleModeChange} />
    </main>
  );
}
