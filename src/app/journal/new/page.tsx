'use client';

import { Suspense } from 'react';
import { JournalNewEntry } from '@/components/JournalNewEntry';

function JournalLoading() {
  return (
    <div className="min-h-screen bg-aura-bg flex items-center justify-center">
      <div className="text-aura-text-muted">Загрузка...</div>
    </div>
  );
}

export default function NewJournalPage() {
  return (
    <Suspense fallback={<JournalLoading />}>
      <JournalNewEntry />
    </Suspense>
  );
}
