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
  post('onboarding', answers);
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
  post('checkin', full);
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
  post('diary', { text: full.text, tags: full.tags, emotion: full.emotion });
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
  post('stars', { amount, label });
}

/* ─── Generic per-user state (saved insights, bookmarks, shop, …) ─ */

export function getState<T>(key: string, fallback: T): T {
  return read<T>('state:' + key, fallback);
}

export function setState(key: string, value: unknown): void {
  write('state:' + key, value);
  post('state', { key, value });
}

function localStateKeys(): string[] {
  if (typeof window === 'undefined') return [];
  const out: string[] = [];
  const p = PREFIX + 'state:';
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(p)) out.push(k.slice(p.length));
    }
  } catch {
    /* ignore */
  }
  return out;
}

/* ─── Server sync (Supabase via /api/data) ───────────────── */

interface PullResponse {
  onboarding: OnboardingAnswers | null;
  onboardingCompleted: boolean;
  stars: number | null;
  checkins: Checkin[];
  diary: DiaryEntry[];
  ledger: StarTxn[];
  state: Record<string, unknown>;
}

function getInitData(): string {
  if (typeof window === 'undefined') return '';
  try {
    const tg = window.Telegram?.WebApp;
    if (tg?.initData) return tg.initData;
  } catch {
    /* ignore */
  }
  // dev / outside Telegram — the API accepts this only when NODE_ENV=development
  return 'mock_init_data';
}

// fire-and-forget write to the server; localStorage already holds the value
function post(kind: string, payload: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    void fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': getInitData(),
      },
      body: JSON.stringify({ kind, payload }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* offline — ignore */
  }
}

// Pull the user's server data on startup and merge into the local cache.
// Server wins on conflicts; local-only items are preserved AND pushed up,
// so nothing is lost (e.g. data created before the server existed).
export async function pullAll(): Promise<void> {
  if (typeof window === 'undefined') return;
  let data: PullResponse | null = null;
  try {
    const res = await fetch('/api/data', {
      headers: { 'X-Telegram-Init-Data': getInitData() },
    });
    if (!res.ok) return;
    data = (await res.json()) as PullResponse;
  } catch {
    return;
  }
  if (!data) return;

  // ── check-ins: union by date, server wins ──
  const localC = getCheckins();
  const serverC = data.checkins || [];
  const serverDates = new Set(serverC.map((c) => c.date));
  const localOnlyC = localC.filter((c) => !serverDates.has(c.date));
  const byDate = new Map<string, Checkin>();
  for (const c of localC) byDate.set(c.date, c);
  for (const c of serverC) byDate.set(c.date, c);
  const mergedC = Array.from(byDate.values()).sort((a, b) => (b.at || 0) - (a.at || 0));
  write('checkins', mergedC.slice(0, 400));

  // ── diary: union by id ──
  const localD = getDiary();
  const serverD = data.diary || [];
  const serverIds = new Set(serverD.map((d) => d.id));
  const localOnlyD = localD.filter((d) => !serverIds.has(d.id));
  const mergedD = [...serverD, ...localOnlyD].sort((a, b) => (b.at || 0) - (a.at || 0));
  write('diary', mergedD.slice(0, 500));

  // ── stars: server is source of truth when present ──
  if (typeof data.stars === 'number') write('stars', data.stars);
  if (Array.isArray(data.ledger) && data.ledger.length) {
    write('stars_ledger', data.ledger.slice(0, 200));
  }

  // ── onboarding ──
  if (data.onboardingCompleted) {
    write('onboarding_completed', true);
    if (data.onboarding) write('onboarding', data.onboarding);
  }

  // ── generic state: server wins, local-only keys pushed up ──
  const serverState = data.state || {};
  for (const [k, v] of Object.entries(serverState)) write('state:' + k, v);
  const serverStateKeys = new Set(Object.keys(serverState));
  const localOnlyState = localStateKeys().filter((k) => !serverStateKeys.has(k));

  // push local-only items up so the server catches up
  for (const c of localOnlyC) post('checkin', c);
  for (const d of localOnlyD) post('diary', { text: d.text, tags: d.tags, emotion: d.emotion });
  for (const k of localOnlyState) post('state', { key: k, value: getState(k, null) });

  // notify mounted components (e.g. the stars balance) to re-read the cache
  try {
    window.dispatchEvent(new Event('aura:store-updated'));
  } catch {
    /* ignore */
  }
}

