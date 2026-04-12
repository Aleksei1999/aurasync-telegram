'use client';

import { Navigation } from '@/components/Navigation';
import { ProfileScreen } from '@/components/Profile';
import { useAuth } from '@/components/AuthProvider';
import { useTelegram } from '@/components/TelegramProvider';

export default function ProfilePage() {
  const { profile } = useAuth();
  const { user } = useTelegram();

  const userName = profile?.first_name || user?.first_name;
  const userPhoto = profile?.photo_url || user?.photo_url;

  return (
    <>
      <ProfileScreen userName={userName} userPhoto={userPhoto} />
      <Navigation />
    </>
  );
}
