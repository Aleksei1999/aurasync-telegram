import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { resolveUser } from '@/lib/serverUser';

// GET /api/data — return everything the current user has stored.
export async function GET(request: NextRequest) {
  try {
    const user = resolveUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const tid = user.id;

    const [profileRes, checkinsRes, diaryRes, ledgerRes] = await Promise.all([
      supabase
        .from('aura_profiles')
        .select('onboarding, onboarding_completed, stars')
        .eq('telegram_id', tid)
        .maybeSingle(),
      supabase
        .from('aura_checkins')
        .select('*')
        .eq('telegram_id', tid)
        .order('date', { ascending: false })
        .limit(400),
      supabase
        .from('aura_diary_entries')
        .select('*')
        .eq('telegram_id', tid)
        .order('created_at', { ascending: false })
        .limit(500),
      supabase
        .from('aura_stars_ledger')
        .select('amount, label, created_at')
        .eq('telegram_id', tid)
        .order('created_at', { ascending: false })
        .limit(200),
    ]);

    const profile = profileRes.data;

    const checkins = (checkinsRes.data || []).map((c) => ({
      date: c.date,
      energy: c.energy ?? undefined,
      mood: c.mood ?? undefined,
      stress: c.stress ?? undefined,
      emotion: c.emotion ?? null,
      note: c.note ?? '',
      badDay: c.bad_day ?? false,
      extra: c.extra ?? {},
      at: c.created_at ? Date.parse(c.created_at) : 0,
    }));

    const diary = (diaryRes.data || []).map((d) => ({
      id: d.id,
      text: d.text ?? '',
      tags: d.tags ?? [],
      emotion: d.emotion ?? null,
      at: d.created_at ? Date.parse(d.created_at) : 0,
    }));

    const ledger = (ledgerRes.data || []).map((l) => ({
      amount: l.amount,
      label: l.label ?? undefined,
      at: l.created_at ? Date.parse(l.created_at) : 0,
    }));

    return NextResponse.json({
      onboarding: profile?.onboarding ?? null,
      onboardingCompleted: profile?.onboarding_completed ?? false,
      stars: profile?.stars ?? null,
      checkins,
      diary,
      ledger,
    });
  } catch (error) {
    console.error('GET /api/data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/data — body { kind, payload }. Writes one entity for the user.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kind, payload } = body || {};

    const user = resolveUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const tid = user.id;

    // Make sure a profile row exists (stars/onboarding update it).
    await supabase
      .from('aura_profiles')
      .upsert(
        {
          telegram_id: tid,
          first_name: user.first_name ?? null,
          last_name: user.last_name ?? null,
          username: user.username ?? null,
          language_code: user.language_code ?? null,
          photo_url: user.photo_url ?? null,
        },
        { onConflict: 'telegram_id', ignoreDuplicates: true }
      );

    if (kind === 'checkin') {
      const p = payload || {};
      const { error } = await supabase.from('aura_checkins').upsert(
        {
          telegram_id: tid,
          date: p.date,
          energy: p.energy ?? null,
          mood: p.mood ?? null,
          stress: p.stress ?? null,
          emotion: p.emotion ?? null,
          note: p.note ?? null,
          bad_day: p.badDay ?? false,
          extra: p.extra ?? {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'telegram_id,date' }
      );
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (kind === 'diary') {
      const p = payload || {};
      const { data, error } = await supabase
        .from('aura_diary_entries')
        .insert({
          telegram_id: tid,
          text: p.text ?? '',
          tags: p.tags ?? [],
          emotion: p.emotion ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ ok: true, entry: data });
    }

    if (kind === 'onboarding') {
      const p = payload || {};
      const { error } = await supabase
        .from('aura_profiles')
        .update({
          onboarding: p,
          onboarding_completed: true,
          goals: Array.isArray(p.goals) ? p.goals : null,
          main_pain: p?.pain?.id ?? null,
          current_mood: p?.emotion ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('telegram_id', tid);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (kind === 'stars') {
      const p = payload || {};
      const amount = Number(p.amount) || 0;

      // read current balance, then write back (+ ledger row)
      const { data: row } = await supabase
        .from('aura_profiles')
        .select('stars')
        .eq('telegram_id', tid)
        .maybeSingle();

      const base = typeof row?.stars === 'number' ? row.stars : 1365;
      const next = base + amount;

      const [{ error: upErr }, { error: ledErr }] = await Promise.all([
        supabase
          .from('aura_profiles')
          .update({ stars: next, updated_at: new Date().toISOString() })
          .eq('telegram_id', tid),
        supabase
          .from('aura_stars_ledger')
          .insert({ telegram_id: tid, amount, label: p.label ?? null }),
      ]);
      if (upErr) throw upErr;
      if (ledErr) throw ledErr;
      return NextResponse.json({ ok: true, stars: next });
    }

    return NextResponse.json({ error: 'Unknown kind' }, { status: 400 });
  } catch (error) {
    console.error('POST /api/data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
