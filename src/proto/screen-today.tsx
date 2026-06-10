// @ts-nocheck
'use client';
import React from 'react';
import { IconArrow, IconCheckSmall, IconChevron, IconClose, IconHelp, IconPause, IconPlay, IconBack15, IconFwd15, IconSettings } from './icons';
import { StarrySky, Particles } from './primitives';
import { MoonFox, MeditatingFox } from './mascot';
import { MAIN_PAINS } from './data';
import { useStars, useStarsPulse } from './stars';

// AuraSync — Today (Сегодня) + Player · Milu-inspired layout
// Hero week plan → day strip → Sunday teaser → main practice → upcoming carousel → diary analytics

export const DAYPART_BG = {
  morning: 'bg-morning',
  day:     'bg-day',
  evening: 'bg-night',
  night:   'bg-night',
  sunday:  'bg-dawn',
};

export const DAYS_RU_FULL = ['понедельник','вторник','среда','четверг','пятница','суббота','воскресенье'];
export const DAYS_RU      = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];

// Decline a Russian first name to genitive case (для Анны, для Виктории, для Сергея).
// Heuristic — covers the common female/male first-name endings without a full dictionary.
export function genName(name) {
  if (!name) return '';
  const last = name.slice(-1);
  const lastLow = last.toLowerCase();
  const prevLow = name.slice(-2, -1).toLowerCase();
  if (lastLow === 'а') {
    // After г/к/х/ч/щ/ж/ш — write -и (spelling rule), else -ы
    if ('гкхчщжш'.includes(prevLow)) return name.slice(0, -1) + 'и';
    return name.slice(0, -1) + 'ы';
  }
  if (lastLow === 'я') return name.slice(0, -1) + 'и';      // Виктория → Виктории, Илья → Ильи
  if (lastLow === 'й') return name.slice(0, -1) + 'я';      // Сергей → Сергея
  if (lastLow === 'ь') return name.slice(0, -1) + 'я';      // Игорь → Игоря (приближённо)
  // ending in а consonant — male, add а
  if (/[а-яё]/i.test(last)) return name + 'а';
  return name;
}

// Themes for week-plan cards (per practice family)
export const PRACTICE_THEMES = {
  warm:    { bg: 'linear-gradient(160deg, #4A2B1F 0%, #2A1A1A 100%)',  accent: '#F5A88E', emoji: '🔥', pill: 'rgba(245,168,142,0.18)', pillFg: '#F5A88E' },
  indigo:  { bg: 'linear-gradient(160deg, #1F2A55 0%, #18204A 100%)',  accent: '#9CB2F0', emoji: '🌙', pill: 'rgba(156,178,240,0.18)', pillFg: '#BFD2FF' },
  lavender:{ bg: 'linear-gradient(160deg, #3A2B5C 0%, #221A40 100%)',  accent: '#BFB2F0', emoji: '🪷', pill: 'rgba(191,178,240,0.18)', pillFg: '#D3C8FF' },
  rose:    { bg: 'linear-gradient(160deg, #4A2538 0%, #2C182A 100%)',  accent: '#E89BB0', emoji: '💗', pill: 'rgba(232,155,176,0.18)', pillFg: '#F0B6C6' },
  sage:    { bg: 'linear-gradient(160deg, #1F3A2E 0%, #18241F 100%)',  accent: '#9CCEAF', emoji: '🌿', pill: 'rgba(156,206,175,0.18)', pillFg: '#B6E1C6' },
};

// ─── Mock data for the week ahead ────────────────────────────
export const TODAY_IDX = 4;                              // 0..6 — Friday
export const TODAY_DATE = 18;                            // April 18
export const MONTH_RU = 'апреля';
export const WEEK_NUM = 3;
export const WEEK_DONE = [true, true, true, true, false, false, false];

// Per-day plan (assignments themed for AuraSync · anxiety program).
// Each: morning + evening practice + advice with theme.
export const WEEK_PLAN = [
  // ПН
  { morning: { title: 'Удлинённый выдох',       theme: 'warm',     block: 'Опора',     mins: 10, desc: 'мягкое снижение фонового напряжения',
               why: 'Выдох длиннее вдоха активирует блуждающий нерв. По данным Stanford 2023, кортизол снижается за 5 минут — самый быстрый способ снять фоновое напряжение в моменте.' },
    evening: { title: 'Заземление 5-4-3-2-1',    theme: 'indigo',   block: 'Тишина',    mins: 12, desc: 'возвращаем внимание в тело перед сном',
               why: 'Базовая техника КПТ: 5 предметов глазами, 4 на ощупь, 3 звука, 2 запаха, 1 вкус. Возвращает в «здесь и сейчас», когда мысли крутятся ночью.' } },
  // ВТ
  { morning: { title: 'Физиологический вздох',  theme: 'warm',     block: 'Опора',     mins: 8,  desc: 'быстрая регуляция нервной системы',
               why: 'Двойной вдох + длинный выдох — техника, которую изучал Huberman Lab. 1–3 минуты снижают активацию симпатики надёжнее, чем любая другая дыхательная практика.' },
    evening: { title: 'Сканирование тела',       theme: 'sage',     block: 'Восстановление', mins: 14, desc: 'снимаем накопленное напряжение',
               why: 'Body scan по MBSR — Jon Kabat-Zinn. Внимание последовательно проходит по телу. Снимает соматическое возбуждение, готовит к глубокому сну.' } },
  // СР
  { morning: { title: 'Когерентное дыхание',    theme: 'lavender', block: 'Ритм',      mins: 10, desc: '5/5 для среднего пика дня',
               why: 'Вдох 5 секунд, выдох 5 секунд. Сердечный ритм синхронизируется с дыханием — это состояние называют «когерентность». Стабилизирует фон на 4–6 часов.' },
    evening: { title: 'Дыхание 4-7-8',           theme: 'indigo',   block: 'Сон',       mins: 11, desc: 'засыпание ускоряется на 15 минут',
               why: 'Техника Эндрю Вейла (University of Arizona). Вдох 4 · удержание 7 · выдох 8. Засыпание ускоряется в среднем на 15 минут по клиническим данным.' } },
  // ЧТ
  { morning: { title: 'Утренняя ясность',       theme: 'warm',     block: 'Ясность',   mins: 9,  desc: 'настройка внимания на день',
               why: 'Короткая медитация на дыхание + одно намерение на день. Снижает количество переключений между задачами на 28% (Cambridge, 2021).' },
    evening: { title: 'Тёплая визуализация',     theme: 'rose',     block: 'Нежность',  mins: 12, desc: 'мягкое замедление',
               why: 'Визуализация тёплого, безопасного места активирует парасимпатику. Особенно полезна, когда тело держит напряжение и физически не получается «отпустить».' } },
  // ПТ — today
  { morning: { title: 'Мягкая перезагрузка',    theme: 'lavender', block: 'Опора',     mins: 10, desc: 'пятница: разгружаем неделю',
               why: 'Комбинированная практика: дыхание + короткий body scan + одно «отпускающее» намерение. Помогает закрыть рабочую неделю и не тащить её в выходные.' },
    evening: { title: 'Альфа-погружение',        theme: 'indigo',   block: 'Сон',       mins: 14, desc: 'самая глубокая практика недели',
               why: 'Йога-нидра в укороченной форме. 22 минуты йога-нидры эквивалентны 2 часам глубокого сна по EEG (NIH study, 2022). Эта версия — 14 минут, но эффект сохраняется.' } },
  // СБ
  { morning: { title: 'Шесть вдохов в минуту',  theme: 'sage',     block: 'Тело',      mins: 8,  desc: 'выходной ритм для тела',
               why: '6 циклов дыхания в минуту — нижняя граница спокойного состояния. На выходных, без рабочего давления, можно реально удержать этот ритм.' },
    evening: { title: 'Письмо тревоге',          theme: 'lavender', block: 'Эмоции',    mins: 12, desc: 'выгружаем мысли на бумагу',
               why: 'Метод James Pennebaker (UT Austin): 12 минут письма о тяжёлых мыслях клинически снижает руминацию. Не дневник — прямое обращение к тревоге, как к собеседнику.' } },
  // ВС
  { morning: { title: 'Чек-ап и подарок',       theme: 'rose',     block: 'Итоги',     mins: 6,  desc: 'смотрим на неделю без оценок',
               why: 'Пять коротких вопросов о неделе. Программа пересоберётся точнее под ваше состояние. Без оценок и сравнения — только наблюдение.' },
    evening: { title: 'Тишина 7 минут',          theme: 'indigo',   block: 'Тишина',    mins: 7,  desc: 'тихий вход в новую неделю',
               why: 'Просто тишина. Без инструкций, без голоса. Семь минут, чтобы услышать собственный ритм перед началом новой недели.' } },
];

// One advice per day — light habit prompt
export const WEEK_ADVICE = [
  { icon: '💧', title: 'Стакан воды до кофе',  desc: 'Лёгкая дегидратация усиливает фоновую тревогу.',
    why: 'Даже 2% обезвоживания заметно снижают концентрацию и ухудшают настроение. Стакан воды до кофе — простой сигнал телу, что о нём помнят.' },
  { icon: '☀️', title: 'Свет в глаза с утра',  desc: '10 минут естественного света — настраивают сон.',
    why: 'Утренний свет на сетчатке в течение 10 минут запускает выработку мелатонина к вечеру. Самый сильный регулятор сна без таблеток.' },
  { icon: '🚶‍♀️', title: '15 минут прогулки', desc: 'Мягкая нагрузка снижает кортизол.',
    why: 'Спокойная прогулка в естественном ритме снижает кортизол на 21% (Stanford). Это рабочий способ выйти из режима борьбы — без спортзала и насилия над собой.' },
  { icon: '🥚', title: 'Белок на завтрак',     desc: 'Стабилизирует сахар, меньше перепадов днём.',
    why: '25–30 г белка на завтрак выравнивает уровень сахара и снижает тягу к сладкому к 16:00. Меньше перепадов сахара — меньше эмоциональных перепадов.' },
  { icon: '📵', title: 'Час без экрана',        desc: 'Один час до сна без телефона.',
    why: 'Синий свет экранов блокирует выработку мелатонина. Один час «оффлайн» до сна сокращает время засыпания почти вдвое.' },
  { icon: '🌿', title: '5 минут тишины',       desc: 'Короткая перезагрузка дня.',
    why: 'Пять минут без задач и без стимулов — мозг переключается из «делать» в «быть». В выходные это особенно работает, потому что нет дедлайна.' },
  { icon: '🌅', title: 'День без «должна»',     desc: 'Воскресенье — без обязательств.',
    why: 'Один день в неделю без слова «должна» снижает уровень самокритики и улучшает настроение к понедельнику. Это не лень — это восстановление.' },
];

// ════════════════════════════════════════════════════════════
export function TodayScreen({ user, daypart, onOpenPlayer, onOpenDiary, onOpenProfile, onOpenSunday }) {
  const greeting = {
    morning: 'доброе утро~',
    day:     'добрый день~',
    evening: 'добрый вечер~',
    night:   'поздний вечер~',
    sunday:  'воскресенье~',
  }[daypart] || 'добрый день~';

  const { stars } = (typeof useStars === 'function') ? useStars() : { stars: 1365 };

  // Auto-completion for today's items based on daypart
  const completion = {
    morning: daypart === 'day' || daypart === 'evening' || daypart === 'night',
    advice:  daypart === 'evening' || daypart === 'night',
    evening: daypart === 'night',
  };

  // Future days for the carousel: today+1 .. Sunday
  const futureDays = React.useMemo(() => {
    const arr = [];
    for (let i = TODAY_IDX + 1; i < 7; i++) arr.push(i);
    return arr;
  }, []);

  // Sheets state
  const [openItem, setOpenItem] = React.useState(null); // { dayIdx, slot }
  const [openDay,  setOpenDay]  = React.useState(null); // dayIdx

  // Start a practice from a sheet
  const startPractice = (dayIdx, slot, srcEl) => {
    const p = WEEK_PLAN[dayIdx][slot];
    if (!p) return;
    // Silent reward for opening today's main practice
    if (window.__awardStars && dayIdx === TODAY_IDX) {
      window.__awardStars(slot === 'evening' ? 12 : 8, srcEl, 'практика');
    }
    onOpenPlayer({
      id: `d${dayIdx}-${slot}`,
      title: p.title,
      subtitle: slot === 'evening' ? 'вечерняя практика · подготовка ко сну' : 'утренняя практика · настройка дня',
      mins: p.mins,
      tag: slot === 'evening' ? 'вечерняя' : 'утренняя',
      mood: slot === 'evening' ? 'plum' : 'lavender',
      kind: slot,
      gradient: p.theme === 'warm' ? 'peach' : p.theme === 'rose' ? 'rose' : 'lavender',
    });
  };

  return (
    <div className="bg-night" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <StarrySky density={0.7} includeShootingStar={false}/>
      <Particles count={6} palette="lavender"/>

      <div className="fade-in stagger" style={{
        position: 'relative', height: '100%', overflowY: 'auto', overflowX: 'hidden',
        padding: '56px 20px 116px',
      }}>
        {/* ═════════ HEADER ═════════ */}
        <TopHeader name={user.name} greeting={greeting} bonus={stars} onOpenProfile={onOpenProfile}/>

        {/* ═════════ HERO WEEK PLAN ═════════ */}
        <WeekHero
          user={user}
          weekNum={WEEK_NUM}
          painLabel={(MAIN_PAINS.find(p => p.id === user.pain) || MAIN_PAINS[0]).label.toLowerCase()}
        />

        {/* ═════════ WEEK STRIP ═════════ */}
        <DayStrip todayIdx={TODAY_IDX} todayDate={TODAY_DATE} weekDone={WEEK_DONE}/>

        {/* ═════════ SUNDAY TEASER ═════════ */}
        <SundayTeaser
          progress={[true,true,true,true,true,false,false].filter(Boolean).length}
          total={7}
          onClick={onOpenSunday}
        />

        {/* ═════════ TODAY · 3-ITEM STACK ═════════ */}
        <SectionHeader
          eyebrow={`СЕГОДНЯ · ${DAYS_RU_FULL[TODAY_IDX]}`}
          title="На сегодня"
          marginTop={28}
        />
        <TodayStack
          dayIdx={TODAY_IDX}
          completion={completion}
          onPick={(slot) => setOpenItem({ dayIdx: TODAY_IDX, slot })}
        />

        {/* ═════════ UPCOMING ON THIS WEEK ═════════ */}
        <SectionHeader
          eyebrow="ДАЛЬШЕ НА НЕДЕЛЕ"
          title={`План для ${genName(user.name)}`}
          action="План недели →"
          marginTop={28}
        />
        <UpcomingDays days={futureDays} onPickDay={(dayIdx) => setOpenDay(dayIdx)}/>

        {/* ═════════ EMOTION DIARY · ANALYTICS ═════════ */}
        <SectionHeader
          eyebrow="ДНЕВНИК ЭМОЦИЙ · PRO"
          title="Как идёт неделя"
          action="Открыть дневник →"
          onAction={onOpenDiary}
          marginTop={28}
        />
        <DiaryAnalyticsCard onOpen={onOpenDiary}/>
      </div>

      {/* Sheets */}
      {openItem && (
        <DayItemSheet
          dayIdx={openItem.dayIdx}
          slot={openItem.slot}
          isToday={openItem.dayIdx === TODAY_IDX}
          completion={openItem.dayIdx === TODAY_IDX ? completion : null}
          onClose={() => setOpenItem(null)}
          onStart={(e) => {
            const slot = openItem.slot;
            const dayIdx = openItem.dayIdx;
            setOpenItem(null);
            if (slot !== 'advice') startPractice(dayIdx, slot, e && e.currentTarget);
          }}
        />
      )}
      {openDay !== null && (
        <DayDetailSheet
          dayIdx={openDay}
          onClose={() => setOpenDay(null)}
          onPickItem={(slot) => { const d = openDay; setOpenDay(null); setOpenItem({ dayIdx: d, slot }); }}
        />
      )}
    </div>
  );
}

// ─── Top header: handwritten greeting + name + bonus + avatar ───
export function TopHeader({ name, greeting, bonus, onOpenProfile }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--script)', fontWeight: 500,
          fontSize: 22, color: 'var(--on-night-2)',
          lineHeight: 1, marginBottom: 2,
          letterSpacing: '0.005em',
        }}>{greeting}</div>
        <div className="serif" style={{
          fontSize: 38, lineHeight: 1, letterSpacing: '-0.02em',
          color: 'var(--on-night)', fontWeight: 500,
        }}>{name}!</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginTop: 8 }}>
        <BonusPill value={bonus}/>
        <button onClick={onOpenProfile} style={{
          width: 42, height: 42, borderRadius: 21,
          background: 'linear-gradient(135deg, rgba(191,178,240,0.30), rgba(124,107,217,0.50))',
          border: '1px solid rgba(242,238,255,0.20)',
          cursor: 'pointer', padding: 0, color: 'var(--on-night)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 500,
          letterSpacing: '-0.01em',
        }}>{(name || '?').charAt(0)}</button>
      </div>
    </div>
  );
}

export function BonusPill({ value }) {
  const { pillRef } = (typeof useStars === 'function' ? useStars() : {});
  const pulsing = (typeof useStarsPulse === 'function') ? useStarsPulse() : false;
  return (
    <div ref={pillRef} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '6px 12px 6px 10px', borderRadius: 99,
      background: pulsing ? 'rgba(244, 213, 138, 0.32)' : 'rgba(244, 213, 138, 0.10)',
      border: pulsing ? '1px solid rgba(244, 213, 138, 0.65)' : '1px solid rgba(244, 213, 138, 0.22)',
      color: 'var(--on-night)', whiteSpace: 'nowrap',
      transform: pulsing ? 'scale(1.14)' : 'scale(1)',
      boxShadow: pulsing ? '0 0 18px rgba(244,213,138,0.55)' : 'none',
      transition: 'transform 0.25s cubic-bezier(0.2,0.7,0.2,1.4), background 0.3s, box-shadow 0.3s, border-color 0.3s',
    }}>
      <span style={{ fontSize: 12, lineHeight: 1, color: '#F4D58A' }}>★</span>
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
        letterSpacing: 0.2, fontVariantNumeric: 'tabular-nums',
      }}>{value.toLocaleString('ru-RU').replace(',', ' ')}</span>
    </div>
  );
}

// ─── Week hero card ─────────────────────────────────────────
export function WeekHero({ user, weekNum, painLabel }) {
  return (
    <div style={{
      marginTop: 18,
      position: 'relative', overflow: 'hidden',
      borderRadius: 26,
      background: 'linear-gradient(160deg, #2A1F5C 0%, #1A1340 100%)',
      border: '1px solid rgba(191,178,240,0.18)',
      boxShadow: '0 18px 40px -12px rgba(20,14,50,0.55)',
    }}>
      {/* decorative orbs */}
      <div style={{
        position: 'absolute', right: -40, top: -30, width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(191,178,240,0.35) 0%, transparent 70%)',
        filter: 'blur(8px)',
      }}/>
      <div style={{
        position: 'absolute', right: 36, top: 32, fontSize: 11, color: 'rgba(255,255,255,0.55)',
      }}>· · ·</div>
      <span style={{
        position: 'absolute', right: 90, top: 64, fontSize: 14, color: 'rgba(244,213,138,0.9)',
      }}>✦</span>
      <span style={{
        position: 'absolute', right: 22, bottom: 80, fontSize: 12, color: 'rgba(244,213,138,0.7)',
      }}>✦</span>

      {/* mascot */}
      <div style={{
        position: 'absolute', right: -10, bottom: -12, opacity: 0.95,
        pointerEvents: 'none',
      }}>
        <MoonFox size={170} sleeping={true} glow={false}/>
      </div>

      <div style={{ position: 'relative', padding: '18px 20px 22px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 99,
          background: 'rgba(191,178,240,0.16)',
          border: '1px solid rgba(191,178,240,0.20)',
          fontSize: 10, color: 'var(--lav-200, #D3C8FF)',
          textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600,
        }}>персонально · неделя {weekNum}</div>

        <div className="serif" style={{
          fontSize: 28, lineHeight: 1.08, letterSpacing: '-0.015em',
          marginTop: 14, color: 'var(--on-night)', maxWidth: '70%',
          fontWeight: 500,
        }}>
          План развития<br/>на эту неделю
        </div>

        <div style={{
          marginTop: 8, fontSize: 12.5, color: 'var(--on-night-2)',
          maxWidth: '60%', lineHeight: 1.45,
        }}>
          Подобрано для {genName(user.name)} — {painLabel}
        </div>

        <button style={{
          marginTop: 18, padding: '12px 22px', borderRadius: 99,
          background: '#FFF9E0', color: '#2A1F5C', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 20px rgba(20,14,50,0.35)',
        }}>
          Открыть план <IconArrow size={13} color="#2A1F5C"/>
        </button>
      </div>
    </div>
  );
}

// ─── Day strip (7 day cards) ───────────────────────────────
export function DayStrip({ todayIdx, todayDate, weekDone }) {
  return (
    <div style={{
      marginTop: 16, display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)', gap: 6,
    }}>
      {DAYS_RU.map((d, i) => {
        const isToday = i === todayIdx;
        const done    = weekDone[i];
        const date    = todayDate - todayIdx + i;
        return (
          <div key={d} style={{
            position: 'relative',
            padding: '10px 0 12px',
            borderRadius: 14,
            background: isToday
              ? 'linear-gradient(180deg, #9A87E5 0%, #5C4BC0 100%)'
              : 'rgba(242,238,255,0.06)',
            border: '1px solid ' + (isToday ? 'transparent' : 'rgba(242,238,255,0.10)'),
            boxShadow: isToday ? '0 8px 18px rgba(92,75,192,0.45)' : 'none',
            color: isToday ? '#FFF9E0' : 'var(--on-night)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          }}>
            <span style={{
              fontSize: 9.5, letterSpacing: 0.4, opacity: 0.7,
              textTransform: 'uppercase', fontWeight: 600,
            }}>{d}</span>
            <span className="serif" style={{
              fontSize: 19, letterSpacing: '-0.01em', lineHeight: 1,
              fontWeight: 500,
            }}>{date}</span>
            <div style={{ marginTop: 4, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isToday ? (
                <div style={{
                  width: 6, height: 6, borderRadius: 3, background: '#FFF9E0',
                  boxShadow: '0 0 8px #FFF9E0',
                }}/>
              ) : done ? (
                <div style={{
                  width: 14, height: 14, borderRadius: 7,
                  background: 'rgba(124, 200, 174, 0.30)',
                  border: '1px solid rgba(124, 200, 174, 0.40)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IconCheckSmall size={8} color="#9CDDB7"/>
                </div>
              ) : (
                <div style={{
                  width: 4, height: 4, borderRadius: 2,
                  background: 'rgba(242,238,255,0.20)',
                }}/>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Sunday teaser ─────────────────────────────────────────
export function SundayTeaser({ progress, total, onClick }) {
  const pct = progress / total;
  return (
    <button onClick={onClick} style={{
      marginTop: 16, width: '100%',
      padding: '14px 14px 16px',
      borderRadius: 22,
      background: 'rgba(255, 249, 224, 0.04)',
      border: '1px solid rgba(255, 249, 224, 0.14)',
      cursor: 'pointer', textAlign: 'left',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, flexShrink: 0,
          background: 'rgba(244, 213, 138, 0.08)',
          border: '1px dashed rgba(244, 213, 138, 0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 26, opacity: 0.92 }}>🌅</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap',
          }}>
            <span className="eyebrow" style={{ fontSize: 9.5, letterSpacing: 0.6, color: 'var(--on-night-3)' }}>
              ВОСКРЕСНЫЙ ОТЧЁТ
            </span>
            <span style={{ fontSize: 9.5, color: 'rgba(244, 213, 138, 0.85)', letterSpacing: 0.4 }}>
              · через 2 дня
            </span>
          </div>
          <div className="serif" style={{
            fontSize: 17, lineHeight: 1.2, marginTop: 4, letterSpacing: '-0.005em',
            color: 'var(--on-night)', fontWeight: 500,
          }}>
            Соберём итоги вашей недели
          </div>
        </div>
        <IconChevron size={14} color="var(--on-night-3)"/>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          flex: 1, height: 5, borderRadius: 3,
          background: 'rgba(242,238,255,0.10)', overflow: 'hidden',
          display: 'flex', gap: 3, padding: 0,
        }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '100%',
              background: i < progress ? '#9CDDB7' : 'transparent',
              borderRadius: 2,
            }}/>
          ))}
        </div>
        <span style={{ fontSize: 11, color: 'var(--on-night-3)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
          {progress}/{total}
        </span>
      </div>
    </button>
  );
}

// ─── Section header (eyebrow + title + optional action) ───
export function SectionHeader({ eyebrow, title, action, onAction, marginTop = 28 }) {
  return (
    <div style={{ marginTop, marginBottom: 14 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="eyebrow" style={{ letterSpacing: 0.6 }}>{eyebrow}</div>
          <div className="serif" style={{
            fontSize: 24, lineHeight: 1.1, marginTop: 4, letterSpacing: '-0.01em',
            color: 'var(--on-night)', fontWeight: 500,
          }}>{title}</div>
        </div>
        {action && (
          <button onClick={onAction} style={{
            flexShrink: 0, padding: '8px 14px', borderRadius: 99,
            background: 'rgba(242,238,255,0.08)',
            border: '1px solid rgba(242,238,255,0.14)',
            color: 'var(--on-night-2)', cursor: 'pointer',
            fontFamily: 'var(--sans)', fontSize: 11.5, fontWeight: 500,
            whiteSpace: 'nowrap',
          }}>{action}</button>
        )}
      </div>
    </div>
  );
}

// ─── Slot helpers ──────────────────────────────────────────
export function slotMeta(slot) {
  if (slot === 'morning') return { label: 'Утро',  emoji: '🌅', accent: '#F5A88E', timeHint: '8:00' };
  if (slot === 'evening') return { label: 'Вечер', emoji: '🌙', accent: '#9CB2F0', timeHint: '21:00' };
  return { label: 'Совет дня', emoji: '💡', accent: '#F4D58A', timeHint: '13:00' };
}

export function itemFor(dayIdx, slot) {
  if (slot === 'advice') return { ...WEEK_ADVICE[dayIdx], slot: 'advice' };
  return { ...WEEK_PLAN[dayIdx][slot], slot };
}

// ─── Per-slot visual themes ────────────────────────────────
export const SLOT_THEMES = {
  morning: {
    bg: 'linear-gradient(150deg, #5B3E32 0%, #2F1F18 100%)',
    glow: 'radial-gradient(circle, rgba(245,168,142,0.35) 0%, transparent 65%)',
    accent: '#F5A88E', accentSoft: '#FFD9B0',
    pillBg: 'rgba(245,168,142,0.18)', pillFg: '#FFD9B0',
    deco: (s) => <SunDeco size={s}/>,
  },
  advice: {
    bg: 'linear-gradient(150deg, #4A3818 0%, #2A1D0E 100%)',
    glow: 'radial-gradient(circle, rgba(244,213,138,0.40) 0%, transparent 65%)',
    accent: '#F4D58A', accentSoft: '#FFE7A8',
    pillBg: 'rgba(244,213,138,0.20)', pillFg: '#FFE7A8',
    deco: (s) => <BulbDeco size={s}/>,
  },
  evening: {
    bg: 'linear-gradient(150deg, #2E2A6E 0%, #18154A 100%)',
    glow: 'radial-gradient(circle, rgba(156,178,240,0.35) 0%, transparent 65%)',
    accent: '#BFD2FF', accentSoft: '#D6E1FF',
    pillBg: 'rgba(156,178,240,0.18)', pillFg: '#D6E1FF',
    deco: (s) => <MoonDeco size={s}/>,
  },
};

export function SunDeco({ size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="sunG" cx="55" cy="55" r="40">
          <stop offset="0%"  stopColor="#FFE3C6" stopOpacity="1"/>
          <stop offset="60%" stopColor="#F5A88E" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#E08B72" stopOpacity="0.7"/>
        </radialGradient>
      </defs>
      {[0, 45, 90, 135].map(a => (
        <line key={a} x1="55" y1="55" x2="55" y2="14"
          stroke="#F5A88E" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.45"
          transform={`rotate(${a} 55 55)`}/>
      ))}
      <circle cx="55" cy="55" r="26" fill="url(#sunG)"/>
      <circle cx="55" cy="55" r="34" fill="none" stroke="#FFE3C6" strokeOpacity="0.25" strokeWidth="1.2"/>
    </svg>
  );
}

export function BulbDeco({ size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="bulbG" cx="55" cy="42" r="32">
          <stop offset="0%" stopColor="#FFF4C6" stopOpacity="0.95"/>
          <stop offset="60%" stopColor="#F4D58A" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#D6A442" stopOpacity="0.55"/>
        </radialGradient>
      </defs>
      {/* halo */}
      <circle cx="55" cy="42" r="38" fill="#F4D58A" opacity="0.10"/>
      {/* bulb */}
      <path d="M55 14 C 38 14, 30 30, 36 46 C 40 56, 44 58, 44 64 L 66 64 C 66 58, 70 56, 74 46 C 80 30, 72 14, 55 14 Z"
        fill="url(#bulbG)"/>
      <path d="M46 66 L 64 66 M47 72 L 63 72 M50 78 L 60 78"
        stroke="#D6A442" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      {/* sparkles */}
      <g fill="#FFE7A8">
        <circle cx="22" cy="34" r="1.6"/>
        <circle cx="88" cy="46" r="1.6"/>
        <circle cx="80" cy="22" r="1.2"/>
      </g>
    </svg>
  );
}

export function MoonDeco({ size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="moonG" cx="50" cy="50" r="30">
          <stop offset="0%"  stopColor="#FFFFFF" stopOpacity="0.92"/>
          <stop offset="80%" stopColor="#BFD2FF" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="#7B95D6" stopOpacity="0.40"/>
        </radialGradient>
        <mask id="moonMask">
          <rect width="110" height="110" fill="white"/>
          <circle cx="68" cy="42" r="28" fill="black"/>
        </mask>
      </defs>
      <circle cx="55" cy="55" r="34" fill="url(#moonG)" mask="url(#moonMask)"/>
      <g fill="#FFFFFF" opacity="0.85">
        <circle cx="22" cy="24" r="1.6"/>
        <circle cx="94" cy="64" r="1.4"/>
        <circle cx="88" cy="22" r="1.2"/>
        <circle cx="18" cy="78" r="1.4"/>
      </g>
      <g stroke="#FFFFFF" strokeOpacity="0.7" fill="none">
        <path d="M85 80 l1.5 -3 l-3 -1.5 l3 -1.5 l1.5 -3 l1.5 3 l3 1.5 l-3 1.5 z" strokeWidth="0.6" fill="#FFFFFF" fillOpacity="0.6"/>
      </g>
    </svg>
  );
}

// ─── Today stack — 3 themed cards ──────────────────────────
export function TodayStack({ dayIdx, completion, onPick }) {
  const slots = ['morning', 'advice', 'evening'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {slots.map(slot => (
        <TodayCard
          key={slot}
          slot={slot}
          data={itemFor(dayIdx, slot)}
          done={completion[slot]}
          isNext={!completion[slot] && slots.findIndex(s => !completion[s]) === slots.indexOf(slot)}
          onClick={() => onPick(slot)}
        />
      ))}
    </div>
  );
}

// ─── Single today card — big themed ───────────────────────
export function TodayCard({ slot, data, done, isNext, onClick }) {
  const meta = slotMeta(slot);
  const theme = SLOT_THEMES[slot];
  const isAdvice = slot === 'advice';
  const mins = isAdvice ? '1 мин' : `${data.mins} мин`;

  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      padding: 0,
      borderRadius: 22, overflow: 'hidden',
      border: '1px solid ' + (done ? 'rgba(156,221,183,0.22)' : 'rgba(242,238,255,0.10)'),
      background: done ? 'rgba(156,221,183,0.06)' : theme.bg,
      color: 'var(--on-night)',
      position: 'relative',
      boxShadow: done ? 'none' : '0 12px 28px -14px rgba(20,14,50,0.55)',
    }}>
      {/* glow */}
      {!done && (
        <div style={{
          position: 'absolute', right: -30, top: -28, width: 160, height: 160,
          background: theme.glow, filter: 'blur(10px)',
          pointerEvents: 'none',
        }}/>
      )}
      {/* decorative illustration on right */}
      {!done && (
        <div style={{
          position: 'absolute', right: 8, top: 14,
          opacity: 0.95, pointerEvents: 'none',
        }}>{theme.deco(96)}</div>
      )}

      <div style={{ position: 'relative', padding: '14px 16px 16px' }}>
        {/* top row: slot label + time/status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 99,
            background: done ? 'rgba(156,221,183,0.18)' : theme.pillBg,
            color: done ? '#9CDDB7' : theme.pillFg,
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          }}>
            {done ? <IconCheckSmall size={10} color="#9CDDB7"/> : (
              isNext ? (
                <span style={{
                  width: 5, height: 5, borderRadius: 3, background: theme.accent,
                  boxShadow: `0 0 6px ${theme.accent}`,
                  animation: 'pulse-soft 1.6s ease-in-out infinite',
                }}/>
              ) : null
            )}
            {meta.label}
            {isNext && !done && <span style={{ opacity: 0.7, fontWeight: 500 }}>· сейчас</span>}
          </span>
          <span style={{ fontSize: 10, color: 'var(--on-night-3)', marginLeft: 'auto' }}>
            {done ? '' : `${meta.timeHint} · ${mins}`}
          </span>
        </div>

        {/* title */}
        <div className="serif" style={{
          fontSize: 24, lineHeight: 1.1, marginTop: 14, letterSpacing: '-0.01em',
          color: 'var(--on-night)', maxWidth: done ? '100%' : '64%', fontWeight: 500,
          textDecoration: done ? 'line-through' : 'none',
          textDecorationColor: 'rgba(156,221,183,0.4)',
        }}>
          {data.title}
        </div>

        {/* description */}
        <div style={{
          marginTop: 6, fontSize: 12, color: done ? 'var(--on-night-3)' : 'var(--on-night-2)',
          maxWidth: done ? '100%' : '62%', lineHeight: 1.45,
        }}>
          {isAdvice ? data.desc : `Блок ${data.block} · ${data.desc}`}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: done ? 6 : 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          {done ? (
            <div style={{
              fontSize: 11, color: '#9CDDB7', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <IconCheckSmall size={11} color="#9CDDB7"/> выполнено сегодня
            </div>
          ) : (
            <div style={{
              padding: '8px 16px', borderRadius: 99,
              background: isNext ? '#FFF9E0' : 'rgba(242,238,255,0.10)',
              color: isNext ? '#2A1F5C' : 'var(--on-night)',
              border: isNext ? 'none' : '1px solid rgba(242,238,255,0.18)',
              fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: isNext ? '0 6px 14px rgba(20,14,50,0.30)' : 'none',
            }}>
              {isAdvice
                ? <>Узнать больше <IconArrow size={11} color={isNext ? '#2A1F5C' : 'var(--on-night)'}/></>
                : <><IconPlay size={10} color={isNext ? '#2A1F5C' : 'var(--on-night)'}/> Начать</>}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Lightweight day item (used inside DayDetailSheet) ────
export function DayItem({ slot, data, done, isToday, onClick }) {
  const meta = slotMeta(slot);
  const isAdvice = slot === 'advice';
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      padding: '12px 14px',
      border: '1px solid ' + (done ? 'rgba(156,221,183,0.20)' : 'rgba(242,238,255,0.10)'),
      borderRadius: 16,
      background: done ? 'rgba(156,221,183,0.06)' : 'rgba(242,238,255,0.05)',
      color: 'var(--on-night)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 13, flexShrink: 0,
        background: done
          ? 'rgba(156,221,183,0.20)'
          : `linear-gradient(160deg, ${meta.accent}40, ${meta.accent}18)`,
        border: '1px solid ' + (done ? 'rgba(156,221,183,0.30)' : `${meta.accent}40`),
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
      }}>
        {done ? <IconCheckSmall size={16} color="#9CDDB7"/> : <span>{meta.emoji}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 9.5, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600,
          color: done ? 'rgba(156,221,183,0.85)' : meta.accent,
        }}>{meta.label} · {isAdvice ? '1 мин' : `${data.mins} мин`}</div>
        <div className="serif" style={{ fontSize: 16, lineHeight: 1.2, marginTop: 3, letterSpacing: '-0.005em', fontWeight: 500 }}>
          {data.title}
        </div>
      </div>
      <IconChevron size={12} color="var(--on-night-3)" style={{ flexShrink: 0, opacity: 0.6 }}/>
    </button>
  );
}

// ─── Upcoming days — horizontal carousel ──────────────────
export function UpcomingDays({ days, onPickDay }) {
  return (
    <div style={{
      display: 'flex', gap: 12,
      marginLeft: -20, paddingLeft: 20, marginRight: -20, paddingRight: 20,
      overflowX: 'auto', scrollbarWidth: 'none',
      paddingBottom: 4, paddingTop: 2,
    }}>
      {days.map(dayIdx => (
        <UpcomingDayCard key={dayIdx} dayIdx={dayIdx} onClick={() => onPickDay(dayIdx)}/>
      ))}
      {/* spacer at end so last card isn't flush */}
      <div style={{ flexShrink: 0, width: 4 }}/>
    </div>
  );
}

export function UpcomingDayCard({ dayIdx, onClick }) {
  const m = WEEK_PLAN[dayIdx].morning;
  const e = WEEK_PLAN[dayIdx].evening;
  const a = WEEK_ADVICE[dayIdx];
  // Pick the "headline" practice for the day's theme — evening usually carries the mood
  const headline = e;
  const themeKey = headline.theme;
  const theme = PRACTICE_THEMES[themeKey] || PRACTICE_THEMES.lavender;
  const slotTheme = SLOT_THEMES.evening;

  const dayDate = TODAY_DATE - TODAY_IDX + dayIdx;
  const offset = dayIdx - TODAY_IDX;
  const offsetLabel = offset === 1 ? 'ЗАВТРА' : `через ${offset} дня`;

  return (
    <button onClick={onClick} style={{
      flexShrink: 0, width: 230, height: 320,
      textAlign: 'left', cursor: 'pointer', padding: 0,
      border: '1px solid rgba(242,238,255,0.10)',
      borderRadius: 24, overflow: 'hidden',
      background: theme.bg, color: 'var(--on-night)',
      position: 'relative',
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 14px 28px -16px rgba(20,14,50,0.55)',
    }}>
      {/* large glow */}
      <div style={{
        position: 'absolute', right: -30, top: -30, width: 180, height: 180,
        background: `radial-gradient(circle, ${theme.accent}30 0%, transparent 65%)`,
        filter: 'blur(14px)', pointerEvents: 'none',
      }}/>

      {/* big decorative illustration */}
      <div style={{
        position: 'absolute', right: -8, top: 36,
        opacity: 0.92, pointerEvents: 'none',
        transform: 'scale(1.4)', transformOrigin: 'right top',
      }}>
        {dayIdx === 6 ? <SunDeco size={108}/> : <MoonDeco size={108}/>}
      </div>

      {/* top: day pill + date */}
      <div style={{ position: 'relative', padding: '14px 16px 0' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 99,
          background: 'rgba(242,238,255,0.10)',
          border: '1px solid rgba(242,238,255,0.16)',
          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          color: 'var(--on-night)',
        }}>
          {DAYS_RU[dayIdx]} · {offsetLabel}
        </span>
        <div className="serif" style={{
          fontSize: 56, lineHeight: 1, letterSpacing: '-0.04em', marginTop: 14,
          color: 'var(--on-night)', fontWeight: 500,
        }}>{dayDate}</div>
        <div style={{
          fontSize: 11, color: 'var(--on-night-3)', letterSpacing: 0.3, marginTop: -2,
        }}>{MONTH_RU}</div>
      </div>

      {/* spacer that pushes content down */}
      <div style={{ flex: 1 }}/>

      {/* bottom: theme label + headline + mini plan */}
      <div style={{ position: 'relative', padding: '12px 16px 14px' }}>
        <div style={{
          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
          color: theme.pillFg,
        }}>
          {headline.block}
        </div>
        <div className="serif" style={{
          fontSize: 19, lineHeight: 1.12, marginTop: 4, letterSpacing: '-0.005em',
          color: 'var(--on-night)', fontWeight: 500,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {headline.title}
        </div>

        {/* 3-item mini plan */}
        <div style={{
          marginTop: 12,
          padding: '10px 12px', borderRadius: 12,
          background: 'rgba(8, 5, 22, 0.40)',
          border: '1px solid rgba(242,238,255,0.08)',
          display: 'flex', flexDirection: 'column', gap: 5,
        }}>
          <MiniPlanLine slot="morning" label={m.title} mins={m.mins}/>
          <MiniPlanLine slot="advice"  label={a.title} mins={null}/>
          <MiniPlanLine slot="evening" label={e.title} mins={e.mins}/>
        </div>
      </div>
    </button>
  );
}

export function MiniPlanLine({ slot, label, mins }) {
  const meta = slotMeta(slot);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 11, color: 'var(--on-night-2)',
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: 5, flexShrink: 0,
        background: `${meta.accent}22`, border: `1px solid ${meta.accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9,
      }}>{meta.emoji}</span>
      <span style={{
        flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{label}</span>
      {mins != null && (
        <span style={{ fontSize: 9.5, color: 'var(--on-night-3)', flexShrink: 0 }}>
          {mins} мин
        </span>
      )}
    </div>
  );
}

// ─── Modal sheet base ──────────────────────────────────────
export function SheetBackdrop({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 90,
      background: 'rgba(8, 5, 22, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'fade-in 0.25s ease both',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%',
        background: 'linear-gradient(180deg, #1B1448 0%, #110A36 100%)',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        border: '1px solid rgba(191,178,240,0.16)',
        borderBottom: 'none',
        padding: '12px 20px 24px',
        maxHeight: '88%', overflowY: 'auto',
        position: 'relative',
        animation: 'fade-up 0.3s cubic-bezier(.2,.7,.2,1) both',
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: 'rgba(242,238,255,0.20)',
          margin: '0 auto 16px',
        }}/>
        {children}
      </div>
    </div>
  );
}

// ─── Single item sheet (morning / evening / advice details) ─
export function DayItemSheet({ dayIdx, slot, isToday, completion, onClose, onStart }) {
  const data = itemFor(dayIdx, slot);
  const meta = slotMeta(slot);
  const isAdvice = slot === 'advice';
  const done = completion ? completion[slot] : false;
  const dayDate = TODAY_DATE - TODAY_IDX + dayIdx;
  const dayLabel = isToday ? 'сегодня' : (dayIdx === TODAY_IDX + 1 ? 'завтра' : `${DAYS_RU[dayIdx]}, ${dayDate} ${MONTH_RU}`);

  return (
    <SheetBackdrop onClose={onClose}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 18, flexShrink: 0,
          background: `linear-gradient(160deg, ${meta.accent}50, ${meta.accent}20)`,
          border: `1px solid ${meta.accent}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26,
          boxShadow: `0 0 20px ${meta.accent}30`,
        }}>
          {isAdvice ? data.icon : meta.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600,
            color: meta.accent,
          }}>{meta.label} · {dayLabel}</div>
          <div className="serif" style={{
            fontSize: 24, lineHeight: 1.1, letterSpacing: '-0.01em', marginTop: 4,
            color: 'var(--on-night)', fontWeight: 500,
          }}>{data.title}</div>
        </div>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: 16, flexShrink: 0,
          background: 'rgba(242,238,255,0.08)',
          border: '1px solid rgba(242,238,255,0.14)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconClose size={12} color="var(--on-night)"/>
        </button>
      </div>

      {!isAdvice && (
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4, marginBottom: 14,
        }}>
          <SheetChip>Блок: {data.block}</SheetChip>
          <SheetChip>{data.mins} минут</SheetChip>
          <SheetChip>{meta.timeHint}</SheetChip>
          {done && <SheetChip done>✓ выполнено</SheetChip>}
        </div>
      )}
      {isAdvice && (
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4, marginBottom: 14,
        }}>
          <SheetChip>совет дня</SheetChip>
          {done && <SheetChip done>✓ принято</SheetChip>}
        </div>
      )}

      <SheetSection title="Что внутри">
        <div style={{
          fontSize: 13.5, lineHeight: 1.55, color: 'var(--on-night-2)',
        }}>
          {isAdvice ? data.desc : `${data.desc.charAt(0).toUpperCase()}${data.desc.slice(1)}.`}
        </div>
      </SheetSection>

      <SheetSection title="Зачем это нужно">
        <div style={{
          fontSize: 13.5, lineHeight: 1.55, color: 'var(--on-night-2)',
        }}>
          {data.why}
        </div>
      </SheetSection>

      {!isAdvice && (
        <div style={{ marginTop: 22 }}>
          <button onClick={(e) => onStart && onStart(e)} disabled={done} style={{
            width: '100%', padding: '14px 18px', borderRadius: 99,
            background: done
              ? 'rgba(156,221,183,0.20)'
              : 'linear-gradient(180deg, #FFF9E0 0%, #F4D58A 100%)',
            color: done ? '#9CDDB7' : '#2A1F5C',
            border: 'none', cursor: done ? 'default' : 'pointer',
            fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: done ? 'none' : '0 10px 24px rgba(244,213,138,0.40)',
          }}>
            {done ? (
              <>
                <IconCheckSmall size={14} color="#9CDDB7"/> Уже выполнено
              </>
            ) : (
              <>
                <IconPlay size={12} color="#2A1F5C"/> Начать практику
              </>
            )}
          </button>
        </div>
      )}
      {isAdvice && (
        <div style={{ marginTop: 22 }}>
          <button onClick={onClose} style={{
            width: '100%', padding: '14px 18px', borderRadius: 99,
            background: 'rgba(242,238,255,0.10)',
            color: 'var(--on-night)', border: '1px solid rgba(242,238,255,0.20)',
            cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
          }}>
            Понятно
          </button>
        </div>
      )}
    </SheetBackdrop>
  );
}

export function SheetChip({ children, done }) {
  return (
    <span style={{
      padding: '4px 10px', borderRadius: 99,
      background: done ? 'rgba(156,221,183,0.18)' : 'rgba(242,238,255,0.08)',
      border: '1px solid ' + (done ? 'rgba(156,221,183,0.30)' : 'rgba(242,238,255,0.14)'),
      color: done ? '#9CDDB7' : 'var(--on-night-2)',
      fontSize: 11, letterSpacing: 0.2,
    }}>{children}</span>
  );
}

export function SheetSection({ title, children }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div className="eyebrow" style={{ letterSpacing: 0.6, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

// ─── Full day sheet (utro/sovet/vecher list) ───────────────
export function DayDetailSheet({ dayIdx, onClose, onPickItem }) {
  const dayDate = TODAY_DATE - TODAY_IDX + dayIdx;
  const offset = dayIdx - TODAY_IDX;
  const offsetLabel = offset === 1 ? 'завтра' : `через ${offset} дня`;

  return (
    <SheetBackdrop onClose={onClose}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        marginBottom: 18,
      }}>
        <div>
          <div className="eyebrow" style={{ letterSpacing: 0.6 }}>
            {DAYS_RU_FULL[dayIdx]} · {dayDate} {MONTH_RU} · {offsetLabel}
          </div>
          <div className="serif" style={{
            fontSize: 28, lineHeight: 1.05, letterSpacing: '-0.015em', marginTop: 6,
            color: 'var(--on-night)', fontWeight: 500,
          }}>
            План на день
          </div>
        </div>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: 16, flexShrink: 0,
          background: 'rgba(242,238,255,0.08)',
          border: '1px solid rgba(242,238,255,0.14)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconClose size={12} color="var(--on-night)"/>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['morning', 'advice', 'evening'].map(slot => (
          <DayItem
            key={slot}
            slot={slot}
            data={itemFor(dayIdx, slot)}
            done={false}
            isToday={false}
            onClick={() => onPickItem(slot)}
          />
        ))}
      </div>

      <div style={{
        marginTop: 18, fontSize: 11.5, color: 'var(--on-night-3)', lineHeight: 1.5,
      }}>
        Темы могут смениться — программа подстраивается под ваши ответы и состояние.
      </div>
    </SheetBackdrop>
  );
}

// ─── Diary analytics card ──────────────────────────────────
export function DiaryAnalyticsCard({ onOpen }) {
  // 7-day bars — current week
  const bars = [3, 5, 4, 6, 7, 0, 0]; // entries per day; today=Friday (idx 4)
  const max = Math.max(...bars, 1);
  return (
    <button onClick={onOpen} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      padding: 18, borderRadius: 22,
      background: 'linear-gradient(160deg, rgba(124,107,217,0.12) 0%, rgba(20,14,50,0.30) 100%)',
      border: '1px solid rgba(191,178,240,0.20)',
      color: 'var(--on-night)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,155,176,0.25) 0%, transparent 70%)',
        filter: 'blur(10px)',
      }}/>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          padding: '3px 9px', borderRadius: 99,
          background: 'rgba(244,213,138,0.18)', color: '#F4D58A',
          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>PRO</span>
        <span style={{ fontSize: 11, color: 'var(--on-night-3)', letterSpacing: 0.2 }}>
          аналитика дневника
        </span>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 14 }}>
        <span className="serif" style={{
          fontSize: 56, lineHeight: 1, letterSpacing: '-0.03em',
          color: '#F4D58A', fontWeight: 500,
        }}>−24%</span>
        <span style={{ fontSize: 13, color: 'var(--on-night-2)', lineHeight: 1.35, maxWidth: 160 }}>
          реже отмечаете тревогу<br/>чем на прошлой неделе
        </span>
      </div>

      {/* mini bars */}
      <div style={{
        marginTop: 16, position: 'relative',
        display: 'flex', alignItems: 'flex-end', gap: 6, height: 40,
      }}>
        {bars.map((v, i) => {
          const isToday = i === TODAY_IDX;
          const future  = i > TODAY_IDX;
          const h = future ? 12 : Math.max(8, (v / max) * 40);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%', height: h, borderRadius: 6,
                background: isToday
                  ? 'linear-gradient(180deg, #F4D58A, #E89BB0)'
                  : future
                    ? 'rgba(242,238,255,0.08)'
                    : 'rgba(191,178,240,0.40)',
                border: future ? '1px dashed rgba(242,238,255,0.16)' : 'none',
              }}/>
              <span style={{
                fontSize: 8.5, letterSpacing: 0.3,
                color: isToday ? '#F4D58A' : 'var(--on-night-3)',
                fontWeight: isToday ? 600 : 500,
              }}>{DAYS_RU[i]}</span>
            </div>
          );
        })}
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// PLAYER (unchanged)
// ═══════════════════════════════════════════════════════════════
export function PlayerScreen({ practice, onClose }) {
  const [playing, setPlaying] = React.useState(true);
  const [elapsed, setElapsed] = React.useState(82);
  const total = (practice?.mins || 10) * 60;

  React.useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setElapsed(e => Math.min(e + 1, total)), 1000);
    return () => clearInterval(t);
  }, [playing, total]);

  const [phase, setPhase] = React.useState('вдох');
  React.useEffect(() => {
    if (!playing) return;
    const cycle = ['вдох', 'выдох'];
    let i = 0;
    setPhase(cycle[0]);
    const t = setInterval(() => { i = (i + 1) % 2; setPhase(cycle[i]); }, 4500);
    return () => clearInterval(t);
  }, [playing]);

  const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const progress = elapsed / total;
  const isSleep = practice?.mood === 'plum' || practice?.kind === 'evening' || practice?.kind === 'night';

  return (
    <div className="bg-night" style={{
      position: 'absolute', inset: 0, zIndex: 100,
      overflow: 'hidden', color: 'var(--on-night)',
      animation: 'fade-up 0.5s cubic-bezier(.2,.7,.2,1) both',
    }}>
      <StarrySky density={1.4}/>
      <Particles count={14}/>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '54px 24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onClose} style={{
            width: 38, height: 38, borderRadius: 19,
            background: 'rgba(242,238,255,0.10)', border: '1px solid rgba(242,238,255,0.14)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconClose size={14} color="var(--on-night)"/>
          </button>
          <div style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ color: 'var(--on-night-3)' }}>сейчас играет</div>
            <div style={{ fontSize: 11, color: 'var(--on-night-2)', marginTop: 3 }}>{practice?.tag}</div>
          </div>
          <button style={{
            width: 38, height: 38, borderRadius: 19,
            background: 'rgba(242,238,255,0.10)', border: '1px solid rgba(242,238,255,0.14)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconSettings size={14} color="var(--on-night)"/>
          </button>
        </div>

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 0,
        }}>
          {isSleep
            ? <MoonFox size={260} breath={playing} sleeping={true}/>
            : <MeditatingFox size={240} breath={playing} mood={practice?.mood === 'peach' ? 'peach' : practice?.mood === 'rose' ? 'rose' : 'lavender'}/>
          }
          <div style={{
            position: 'absolute', bottom: -8, fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 28, color: 'rgba(255,249,224,0.95)',
            transition: 'all 0.5s', textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}>{phase}</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="serif" style={{ fontSize: 24, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
            {practice?.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--on-night-3)', marginTop: 6 }}>
            {practice?.subtitle}
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ height: 3, borderRadius: 2, background: 'rgba(242,238,255,0.14)', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              width: `${progress * 100}%`, height: '100%',
              background: 'linear-gradient(90deg, #F4D58A, #E89BB0)',
              borderRadius: 2, transition: 'width 0.5s linear',
            }}/>
            <div style={{
              position: 'absolute', left: `calc(${progress * 100}% - 5px)`, top: -3,
              width: 9, height: 9, borderRadius: 5, background: '#FFF9E0',
              boxShadow: '0 0 12px #FFD993',
            }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>
            <span style={{ color: 'var(--on-night-2)' }}>{fmt(elapsed)}</span>
            <span style={{ color: 'var(--on-night-3)' }}>−{fmt(total - elapsed)}</span>
          </div>
        </div>

        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <button style={{
            width: 44, height: 44, borderRadius: 22,
            background: 'transparent', border: '1px solid rgba(242,238,255,0.18)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconBack15 size={18} color="var(--on-night)"/>
          </button>
          <button onClick={() => setPlaying(p => !p)} style={{
            width: 72, height: 72, borderRadius: 36,
            background: 'linear-gradient(180deg, #FFF9E0 0%, #F4D58A 100%)',
            color: '#2A1F5C', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 36px rgba(244, 213, 138, 0.55)',
          }}>
            {playing ? <IconPause size={22} color="#2A1F5C"/> : <IconPlay size={22} color="#2A1F5C"/>}
          </button>
          <button style={{
            width: 44, height: 44, borderRadius: 22,
            background: 'transparent', border: '1px solid rgba(242,238,255,0.18)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconFwd15 size={18} color="var(--on-night)"/>
          </button>
        </div>

        <button style={{
          marginTop: 18, background: 'transparent', border: 'none',
          color: 'var(--on-night-3)', fontFamily: 'var(--sans)', fontSize: 12,
          cursor: 'pointer', textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <IconHelp size={12} color="var(--on-night-3)"/> почему эта практика?
        </button>
      </div>
    </div>
  );
}
