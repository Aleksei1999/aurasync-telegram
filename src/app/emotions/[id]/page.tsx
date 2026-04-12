'use client';

import { useParams } from 'next/navigation';
import { EmotionCardScreen } from '@/components/EmotionCard';

export default function EmotionDetailPage() {
  const params = useParams();
  const emotionId = params.id as string;

  return <EmotionCardScreen emotionId={emotionId} />;
}
