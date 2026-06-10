'use client';

// AuraSync — client persistence layer.
//
// Stage 1: backed by localStorage so data survives re-entry on the device.
// Stage 2: the same API can be re-implemented against Supabase (see SETUP.md)
// without touching the screens that call it.

const PREFIX = 'aura:v1:';

function key(entity: string): string {
  return PREFIX + entity;
}

function read<T>(entity: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key(entity));
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(entity: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key(entity), JSON.stringify(value));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ─── Onboarding ─────────────────────────────────────────── */

export interface OnboardingAnswers {
  [field: string]: unknown;
  savedAt?: number;
}

export function saveOnboarding(answers: OnboardingAnswers): void {
  write('onboarding', { ...answers, savedAt: Date.now() });
  write('onboarding_completed', true);
}

export function getOnboarding(): OnboardingAnswers | null {
  return read<OnboardingAnswers | null>('onboarding', null);
}

export function isOnboarded(): boolean {
  // honour both the new store flag and the legacy flag used before
  return (
    read<boolean>('onboarding_completed', false) === true ||
    (typeof window !== 'undefined' &&
      window.localStorage.getItem('aura_onboarding_completed') === 'true')
  );
}

export function resetOnboarding(): void {
  write('onboarding_completed', false);
  try {
    window.localStorage.removeItem('aura_onboarding_completed');
  } catch {
    /* ignore */
  }
}

/* ─── Daily check-ins ────────────────────────────────────── */

export interface Checkin {
  date: string; // YYYY-MM-DD
  energy?: number;
  mood?: number;
  stress?: number;
  emotion?: string | null;
  note?: string;
  badDay?: boolean;
  extra?: Record<string, unknown>;
  at: number;
}

export function getCheckins(): Checkin[] {
  return read<Checkin[]>('checkins', []);
}

export function getTodayCheckin(): Checkin | null {
  const d = todayKey();
  return getCheckins().find((c) => c.date === d) || null;
}

export function saveCheckin(entry: Omit<Checkin, 'at'> & { at?: number }): Checkin {
  const full: Checkin = { ...entry, at: entry.at ?? Date.now() };
  const list = getCheckins().filter((c) => c.date !== full.date);
  list.unshift(full);
  write('checkins', list.slice(0, 400));
  return full;
}

/* ─── Diary entries ──────────────────────────────────────── */

export interface DiaryEntry {
  id: string;
  text: string;
  tags?: string[];
  emotion?: string | null;
  at: number;
}

export function getDiary(): DiaryEntry[] {
  return read<DiaryEntry[]>('diary', []);
}

export function addDiary(entry: Omit<DiaryEntry, 'id' | 'at'> & { id?: string; at?: number }): DiaryEntry {
  const full: DiaryEntry = {
    id: entry.id ?? `d_${Date.now()}_${Math.floor(Math.random() * 1e4)}`,
    text: entry.text,
    tags: entry.tags || [],
    emotion: entry.emotion ?? null,
    at: entry.at ?? Date.now(),
  };
  const list = getDiary();
  list.unshift(full);
  write('diary', list.slice(0, 500));
  return full;
}

/* ─── Stars / points ─────────────────────────────────────── */

export interface StarTxn {
  amount: number;
  label?: string;
  at: number;
}

export function getStars(fallback: number): number {
  const v = read<number | null>('stars', null);
  return v == null ? fallback : v;
}

export function setStars(n: number): void {
  write('stars', n);
}

export function getLedger(): StarTxn[] {
  return read<StarTxn[]>('stars_ledger', []);
}

export function addStarTxn(amount: number, label?: string): void {
  const list = getLedger();
  list.unshift({ amount, label, at: Date.now() });
  write('stars_ledger', list.slice(0, 200));
}
