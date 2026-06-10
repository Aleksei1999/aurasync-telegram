// @ts-nocheck
'use client';
import React from 'react';
import { IconPlay, IconClose, IconCheckSmall, IconSearch, IconBookmark, IconMic, IconEdit, IconArrow, IconLock, IconClock } from './icons';
import { StarrySky, Particles, Sparkle, PrimaryButton, HeaderBar } from './primitives';
import { SAMPLE_TRACKS, SAMPLE_DIARY } from './data';
import { saveCheckin, getTodayCheckin, addDiary, getDiary, todayKey, getState, setState } from '@/lib/store';

// AuraSync — Library + Diary

// ─── Library content (new): Situational + Developmental ──
export const SITUATIONAL_CATS = [
  { id: 'breakup',   emoji: '💔', accent: '#E89BB0', label: 'Расставание\nи развод',     desc: 'опора, когда рушится привычное',  count: 24, shape: 'heart' },
  { id: 'burnout',   emoji: '🔥', accent: '#F5A88E', label: 'Выгорание\nи истощение',    desc: 'ресурс возвращается медленно',     count: 22, shape: 'flame' },
  { id: 'stress',    emoji: '⚡',  accent: '#F4D58A', label: 'Высокий\nстресс',            desc: 'снижаем кортизол телом',          count: 28, shape: 'bolt'  },
  { id: 'weight',    emoji: '🌿', accent: '#9CCEAF', label: 'Тело\nи вес',                desc: 'без насилия и без диет',          count: 14, shape: 'leaf'  },
  { id: 'insomnia',  emoji: '🌙', accent: '#9CB2F0', label: 'Бессонница\nи руминация',    desc: 'засыпание и качество сна',        count: 18, shape: 'moon'  },
  { id: 'pregnancy', emoji: '🤰', accent: '#BFB2F0', label: 'Беременность\nи материнство',desc: 'мягкие практики для нового этапа',count: 16, shape: 'pearl' },
  { id: 'loss',      emoji: '🕊️', accent: '#C49BC8', label: 'Потеря\nблизкого',           desc: 'горе и медленное возвращение',    count: 12, shape: 'dove'  },
  { id: 'future',    emoji: '🌫',  accent: '#7C9BB5', label: 'Тревога\nперед будущим',     desc: 'когда мысли крутятся',            count: 20, shape: 'mist'  },
  { id: 'selfcrit',  emoji: '🪞', accent: '#C49B97', label: 'Самокритика\nи стыд',        desc: 'разговор с внутренним критиком',  count: 17, shape: 'mirror' },
  { id: 'work',      emoji: '💼', accent: '#B89967', label: 'Работа\nи карьера',          desc: 'когда не отпускает после 19:00',  count: 15, shape: 'brief' },
  { id: 'cycle',     emoji: '🩸', accent: '#D97A65', label: 'ПМС\nи цикл',                desc: 'практики по фазам',               count: 11, shape: 'drop'  },
  { id: 'lonely',    emoji: '🥺', accent: '#B69BB1', label: 'Одиночество',                desc: 'когда некому позвонить',          count: 13, shape: 'star'  },
];

export const DEVELOPMENTAL_CATS = [
  { id: 'eq',         emoji: '🪞', accent: '#BFB2F0', label: 'Эмоциональный\nинтеллект',  desc: 'словарь для того, что внутри',    count: 32, shape: 'mirror' },
  { id: 'compassion', emoji: '🫶', accent: '#E89BB0', label: 'Самосострадание',           desc: 'относитесь к себе как к подруге', count: 20, shape: 'heart' },
  { id: 'regulation', emoji: '🌊', accent: '#7C9BB5', label: 'Регуляция\nэмоций',          desc: 'дыхание, тело, паузы',            count: 26, shape: 'wave'  },
  { id: 'awareness',  emoji: '🌅', accent: '#F5A88E', label: 'Осознанность\nдня',          desc: 'присутствие в моменте',           count: 22, shape: 'sun'   },
  { id: 'energy',     emoji: '⚡',  accent: '#FFB875', label: 'Энергия\nи ресурс',          desc: 'утренние и дневные ритуалы',     count: 24, shape: 'bolt'  },
  { id: 'focus',      emoji: '🎯', accent: '#9CB2F0', label: 'Концентрация\nи фокус',      desc: 'для тех, кто живёт в задачах',    count: 16, shape: 'target' },
  { id: 'bounds',     emoji: '🤲', accent: '#9CCEAF', label: 'Границы\nи близость',        desc: 'сказать «нет» без вины',          count: 12, shape: 'leaf'  },
  { id: 'ritual',     emoji: '🧘‍♀️', accent: '#C49BC8', label: 'Ритуал\nи дисциплина',     desc: 'привычка как опора',              count: 14, shape: 'pearl' },
  { id: 'self-acc',   emoji: '💛', accent: '#F4D58A', label: 'Принятие\nсебя',             desc: 'без условий и без оценок',        count: 18, shape: 'sun'   },
  { id: 'sleep',      emoji: '🌙', accent: '#9CA9E0', label: 'Глубокий\nсон',              desc: 'для долгосрочного качества',     count: 18, shape: 'moon'  },
  { id: 'feminine',   emoji: '🌺', accent: '#C49B97', label: 'Женственность',              desc: 'связь с цикличностью',            count: 14, shape: 'star'  },
  { id: 'journal',    emoji: '✍️', accent: '#B89967', label: 'Дневник\nи письмо',          desc: 'выгрузка мыслей на бумагу',       count: 10, shape: 'brief' },
];

// Decorative SVG by shape
export function CatShape({ shape, accent, size = 96 }) {
  const a = accent;
  const opa = 0.42;
  const W = 100;
  const props = { width: size, height: size, viewBox: '0 0 100 100', style: { display: 'block', opacity: opa } };
  switch (shape) {
    case 'moon':
      return (<svg {...props}>
        <defs><mask id="m1"><rect width="100" height="100" fill="white"/><circle cx="62" cy="40" r="28" fill="black"/></mask></defs>
        <circle cx="50" cy="50" r="34" fill={a} mask="url(#m1)"/>
      </svg>);
    case 'sun':
      return (<svg {...props}>
        {[0,45,90,135].map(r => <line key={r} x1="50" y1="50" x2="50" y2="14" stroke={a} strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${r} 50 50)`}/>)}
        <circle cx="50" cy="50" r="22" fill={a}/>
      </svg>);
    case 'heart':
      return (<svg {...props}>
        <path d="M50 84 C 18 60, 8 36, 26 22 C 38 12, 50 24, 50 32 C 50 24, 62 12, 74 22 C 92 36, 82 60, 50 84 Z" fill={a}/>
      </svg>);
    case 'flame':
      return (<svg {...props}>
        <path d="M50 16 C 60 30, 78 38, 74 60 A 24 24 0 1 1 30 60 C 30 50, 38 46, 38 38 C 38 44, 32 50, 36 56 C 38 60, 44 56, 44 50 C 44 36, 50 28, 50 16 Z" fill={a}/>
      </svg>);
    case 'bolt':
      return (<svg {...props}>
        <path d="M52 6 L 26 56 L 46 56 L 36 96 L 76 40 L 54 40 L 64 6 Z" fill={a}/>
      </svg>);
    case 'leaf':
      return (<svg {...props}>
        <path d="M20 80 C 24 30, 56 14, 88 20 C 88 56, 60 84, 20 80 Z" fill={a}/>
        <path d="M20 80 C 40 60, 60 44, 80 28" stroke="#0E0A2E" strokeWidth="2" strokeOpacity="0.30" fill="none"/>
      </svg>);
    case 'wave':
      return (<svg {...props}>
        <path d="M6 60 C 24 40, 36 80, 56 60 C 76 40, 88 80, 100 60 L 100 100 L 0 100 Z" fill={a}/>
        <path d="M6 40 C 24 20, 36 60, 56 40 C 76 20, 88 60, 100 40" stroke={a} strokeOpacity="0.5" strokeWidth="2" fill="none"/>
      </svg>);
    case 'pearl':
      return (<svg {...props}>
        <circle cx="50" cy="50" r="30" fill={a}/>
        <circle cx="40" cy="40" r="10" fill="white" fillOpacity="0.5"/>
      </svg>);
    case 'dove':
      return (<svg {...props}>
        <path d="M14 60 C 22 44, 40 36, 56 42 L 70 30 L 70 46 L 84 50 L 70 56 L 70 70 L 56 60 C 40 70, 22 76, 14 60 Z" fill={a}/>
      </svg>);
    case 'mist':
      return (<svg {...props}>
        <path d="M14 40 H 80" stroke={a} strokeWidth="6" strokeLinecap="round"/>
        <path d="M22 56 H 86" stroke={a} strokeWidth="6" strokeLinecap="round"/>
        <path d="M14 72 H 70" stroke={a} strokeWidth="6" strokeLinecap="round"/>
      </svg>);
    case 'mirror':
      return (<svg {...props}>
        <rect x="28" y="14" width="44" height="60" rx="22" fill={a}/>
        <rect x="48" y="76" width="4" height="14" fill={a}/>
        <ellipse cx="42" cy="32" rx="6" ry="10" fill="white" fillOpacity="0.4"/>
      </svg>);
    case 'brief':
      return (<svg {...props}>
        <rect x="14" y="28" width="72" height="52" rx="6" fill={a}/>
        <rect x="36" y="18" width="28" height="12" rx="3" fill={a}/>
        <rect x="44" y="46" width="12" height="6" fill="#0E0A2E" fillOpacity="0.30"/>
      </svg>);
    case 'drop':
      return (<svg {...props}>
        <path d="M50 12 C 30 40, 22 58, 30 74 C 38 90, 62 90, 70 74 C 78 58, 70 40, 50 12 Z" fill={a}/>
      </svg>);
    case 'star':
      return (<svg {...props}>
        <path d="M50 12 L 60 40 L 90 44 L 66 62 L 74 90 L 50 74 L 26 90 L 34 62 L 10 44 L 40 40 Z" fill={a}/>
      </svg>);
    case 'target':
      return (<svg {...props}>
        <circle cx="50" cy="50" r="34" fill="none" stroke={a} strokeWidth="3"/>
        <circle cx="50" cy="50" r="22" fill="none" stroke={a} strokeWidth="3"/>
        <circle cx="50" cy="50" r="10" fill={a}/>
      </svg>);
    default:
      return <div style={{ fontSize: size * 0.7, opacity: opa }}>{'·'}</div>;
  }
}

export function LibraryScreen({ onOpenPlayer }) {
  const [tab, setTab] = React.useState('situational');
  const [openCat, setOpenCat] = React.useState(null);
  const allCats = [...SITUATIONAL_CATS, ...DEVELOPMENTAL_CATS];
  const cat = openCat ? allCats.find(c => c.id === openCat) : null;

  if (cat) {
    return (
      <div className="bg-night" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <StarrySky density={0.5} includeShootingStar={false}/>
        <Particles count={4} palette="lavender"/>
        <div className="fade-in" style={{
          position: 'relative', height: '100%', overflowY: 'auto', overflowX: 'hidden',
          padding: '54px 20px 116px',
        }}>
          <LibraryCategoryView cat={cat} onBack={() => setOpenCat(null)} onOpenPlayer={onOpenPlayer}/>
        </div>
      </div>
    );
  }

  // featured "под вас" picks
  const featuredPicks = [
    { ...SITUATIONAL_CATS[2], pick: 'Удлинённый выдох',       reason: 'под ваш стресс 7/10',     mins: 10 },
    { ...SITUATIONAL_CATS[4], pick: 'Дыхание 4-7-8',           reason: 'сон 5–6 ч — ниже нормы', mins: 11 },
    { ...DEVELOPMENTAL_CATS[2], pick: 'Body scan для тревоги', reason: 'фон тревоги',            mins: 14 },
  ];

  const cats = tab === 'situational' ? SITUATIONAL_CATS : DEVELOPMENTAL_CATS;

  return (
    <div className="bg-night" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <StarrySky density={0.6} includeShootingStar={false}/>
      <Particles count={5} palette="lavender"/>

      <div className="fade-in stagger" style={{
        position: 'relative', height: '100%', overflowY: 'auto', overflowX: 'hidden',
        padding: '54px 20px 116px',
      }}>
        {/* Header */}
        <div className="eyebrow">Библиотека</div>
        <div className="serif" style={{
          fontSize: 32, lineHeight: 1.05, marginTop: 8, letterSpacing: '-0.02em',
          color: 'var(--on-night)', fontWeight: 500,
        }}>
          200+ практик,<br/>
          <span className="serif-it" style={{ color: 'var(--dawn-peach)' }}>подобранных под вас</span>.
        </div>

        {/* Search pill */}
        <div style={{
          marginTop: 18, padding: '11px 14px', borderRadius: 14,
          background: 'rgba(242,238,255,0.06)', border: '1px solid rgba(242,238,255,0.12)',
          display: 'flex', alignItems: 'center', gap: 10, color: 'var(--on-night-3)',
        }}>
          <IconSearch size={14} color="var(--on-night-3)"/>
          <span style={{ fontSize: 13 }}>Поиск по состоянию или практике</span>
        </div>

        {/* "Подобрано под вас" — featured picks based on user state */}
        <SectionLib eyebrow="ПОДОБРАНО ПОД ВАС" title="Из вашего состояния" marginTop={26}/>
        <div style={{
          display: 'flex', gap: 12,
          marginLeft: -20, paddingLeft: 20, marginRight: -20, paddingRight: 20,
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {featuredPicks.map((p, i) => (
            <FeaturedPick key={i} pick={p} onClick={() => onOpenPlayer({
              id: `lib-pick-${i}`, title: p.pick, subtitle: p.reason, mins: p.mins,
              tag: 'под вас', mood: 'lavender', kind: 'morning', gradient: 'lavender',
            })}/>
          ))}
          <div style={{ flexShrink: 0, width: 4 }}/>
        </div>

        {/* Tabs */}
        <div style={{
          marginTop: 28, padding: 5,
          background: 'rgba(8,5,22,0.50)',
          border: '1px solid rgba(242,238,255,0.10)',
          borderRadius: 99,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
        }}>
          {[
            { id: 'situational',   label: 'Ситуативные', hint: '12' },
            { id: 'developmental', label: 'Развивающие', hint: '12' },
          ].map(t => {
            const on = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '10px 14px', borderRadius: 99, cursor: 'pointer',
                background: on ? 'linear-gradient(180deg, #9A87E5, #5C4BC0)' : 'transparent',
                border: 'none', color: on ? '#FFF9E0' : 'var(--on-night-2)',
                fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: on ? '0 6px 14px rgba(92,75,192,0.40)' : 'none',
                transition: 'all 0.25s',
              }}>
                {t.label}
                <span style={{
                  fontSize: 10, padding: '2px 7px', borderRadius: 99,
                  background: on ? 'rgba(255,249,224,0.20)' : 'rgba(242,238,255,0.08)',
                  color: on ? '#FFF9E0' : 'var(--on-night-3)',
                  fontWeight: 500,
                }}>{t.hint}</span>
              </button>
            );
          })}
        </div>

        {/* Tab description */}
        <div style={{
          marginTop: 14, fontSize: 12.5, color: 'var(--on-night-2)', lineHeight: 1.5,
        }}>
          {tab === 'situational'
            ? <>Острые жизненные ситуации: расставание, выгорание, потеря, ПМС, тревога перед будущим. Прицельные подборки для конкретного состояния.</>
            : <>Долгие линии работы: эмоциональный интеллект, осознанность, самосострадание. Развиваются месяцами, дают опору на годы.</>}
        </div>

        {/* Category grid */}
        <div style={{
          marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
        }}>
          {cats.map(c => (
            <CategoryCard key={c.id} cat={c} onClick={() => setOpenCat(c.id)}/>
          ))}
        </div>

        {/* Popular searches */}
        <div style={{ marginTop: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 10, letterSpacing: 0.6 }}>· Чаще ищут женщины как вы</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['тревога вечером', 'обида', 'не могу уснуть', 'ПМС', 'выгорание', 'благодарность', 'самокритика', 'границы'].map(q => (
              <span key={q} style={{
                padding: '8px 14px', borderRadius: 99,
                background: 'rgba(242,238,255,0.06)',
                border: '1px solid rgba(242,238,255,0.12)',
                fontSize: 12, color: 'var(--on-night-2)',
              }}>{q}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section header (library variant) ───────────────────
export function SectionLib({ eyebrow, title, marginTop = 24 }) {
  return (
    <div style={{ marginTop, marginBottom: 12 }}>
      <div className="eyebrow" style={{ letterSpacing: 0.6 }}>{eyebrow}</div>
      <div className="serif" style={{
        fontSize: 22, lineHeight: 1.12, marginTop: 4, letterSpacing: '-0.01em',
        color: 'var(--on-night)', fontWeight: 500,
      }}>{title}</div>
    </div>
  );
}

// ─── Featured pick card ─────────────────────────────────
export function FeaturedPick({ pick, onClick }) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, width: 240, textAlign: 'left', cursor: 'pointer',
      padding: 0, border: '1px solid rgba(242,238,255,0.10)',
      borderRadius: 22, overflow: 'hidden',
      background: `linear-gradient(155deg, ${pick.accent}38 0%, rgba(8,5,22,0.55) 75%)`,
      color: 'var(--on-night)', position: 'relative',
      minHeight: 162,
    }}>
      <div style={{
        position: 'absolute', right: -16, top: -8,
        opacity: 0.7, pointerEvents: 'none',
      }}>
        <CatShape shape={pick.shape} accent={pick.accent} size={108}/>
      </div>
      <div style={{ position: 'relative', padding: '14px 16px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 99,
          background: 'rgba(244, 213, 138, 0.18)',
          border: '1px solid rgba(244,213,138,0.30)',
          color: '#FFE7A8',
          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
        }}>
          <Sparkle size={9} color="#FFE7A8" spin={false}/>
          для вас
        </span>

        <div className="serif" style={{
          fontSize: 19, lineHeight: 1.15, marginTop: 30, letterSpacing: '-0.005em',
          color: 'var(--on-night)', fontWeight: 500, maxWidth: '90%',
        }}>{pick.pick}</div>
        <div style={{
          fontSize: 11, color: 'var(--on-night-2)', marginTop: 6,
        }}>{pick.reason}</div>

        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 11, color: 'var(--on-night-3)',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <IconClock size={10} color="var(--on-night-3)"/> {pick.mins} мин
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: pick.accent,
          }}>
            <IconPlay size={9} color={pick.accent}/> начать
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Category card (grid item) ───────────────────────────
export function CategoryCard({ cat, onClick }) {
  const lines = cat.label.split('\n');
  return (
    <button onClick={onClick} style={{
      textAlign: 'left', cursor: 'pointer',
      padding: 0, border: '1px solid rgba(242,238,255,0.08)',
      borderRadius: 20, overflow: 'hidden',
      background: `linear-gradient(160deg, ${cat.accent}30 0%, rgba(8,5,22,0.65) 78%)`,
      color: 'var(--on-night)', position: 'relative', minHeight: 168,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      {/* Big decorative shape */}
      <div style={{
        position: 'absolute', right: -14, top: -14,
        pointerEvents: 'none',
      }}>
        <CatShape shape={cat.shape} accent={cat.accent} size={92}/>
      </div>

      <div style={{ position: 'relative', padding: '14px 14px 12px' }}>
        <div className="serif" style={{
          fontSize: 17, lineHeight: 1.12, letterSpacing: '-0.005em',
          color: 'var(--on-night)', fontWeight: 500,
        }}>
          {lines.map((l, i) => <div key={i}>{l}</div>)}
        </div>
        <div style={{
          fontSize: 10.5, color: 'var(--on-night-3)', marginTop: 6, lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{cat.desc}</div>

        <div style={{
          marginTop: 10, paddingTop: 10,
          borderTop: '1px solid rgba(242,238,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 10.5, color: cat.accent, fontWeight: 600 }}>
            {cat.count} {pluralPractices(cat.count)}
          </span>
          <IconArrow size={11} color={cat.accent}/>
        </div>
      </div>
    </button>
  );
}

export function pluralPractices(n) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'практик';
  if (mod10 === 1) return 'практика';
  if (mod10 >= 2 && mod10 <= 4) return 'практики';
  return 'практик';
}

// ─── Category view ───────────────────────────────────────
export function LibraryCategoryView({ cat, onBack, onOpenPlayer }) {
  // Fallback tracks (reuse existing samples by mapping)
  const trackPool = SAMPLE_TRACKS.emotions.concat(SAMPLE_TRACKS.sleep || []).concat(SAMPLE_TRACKS.morning || []);
  const tracks = trackPool.slice(0, 6);

  // Sub-tags suggested for situational vs developmental
  const subTags = {
    breakup:   ['Острый период', 'Возвращение к себе', 'Письмо', 'Самосострадание'],
    burnout:   ['Тело', 'Сон', 'Микро-восстановление', 'Разрешение'],
    stress:    ['Дыхание', 'Заземление', 'Релаксация', 'Тело'],
    insomnia:  ['Засыпание', 'Йога-нидра', 'Бинауральные', 'Дыхание 4-7-8'],
    selfcrit:  ['Внутренний критик', 'Достаточно', 'Сострадание'],
    eq:        ['Словарь', 'Различение', 'Распознавание', 'Письмо'],
    compassion:['Метта', 'Внутренний ребёнок', 'Прощение'],
    regulation:['Дыхание', 'Тело', 'Паузы'],
  }[cat.id] || ['Базовые', 'Глубже', 'На каждый день'];

  return (
    <>
      <HeaderBar title={cat.label.replace('\n', ' ')} onBack={onBack}/>

      {/* Hero */}
      <div style={{
        marginTop: 14, padding: 0, borderRadius: 24, overflow: 'hidden',
        border: '1px solid rgba(242,238,255,0.10)',
        background: `linear-gradient(160deg, ${cat.accent}35 0%, rgba(8,5,22,0.65) 78%)`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', right: -10, top: -10, pointerEvents: 'none',
        }}>
          <CatShape shape={cat.shape} accent={cat.accent} size={140}/>
        </div>
        <div style={{ position: 'relative', padding: '18px 20px 20px' }}>
          <div className="eyebrow" style={{ letterSpacing: 0.6, color: cat.accent }}>направление</div>
          <div className="serif" style={{
            fontSize: 28, lineHeight: 1.08, marginTop: 8, letterSpacing: '-0.01em',
            color: 'var(--on-night)', fontWeight: 500, maxWidth: '75%',
          }}>
            {cat.label.replace('\n', ' ')}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--on-night-2)', marginTop: 8, maxWidth: '78%', lineHeight: 1.45 }}>
            {cat.desc}
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{
              padding: '6px 12px', borderRadius: 99,
              background: 'rgba(242,238,255,0.10)', border: '1px solid rgba(242,238,255,0.18)',
              fontSize: 11, color: 'var(--on-night)',
            }}>{cat.count} {pluralPractices(cat.count)}</span>
            <span style={{ fontSize: 11, color: 'var(--on-night-3)' }}>обновлено вчера</span>
          </div>
        </div>
      </div>

      {/* Subtags */}
      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {subTags.map(s => (
          <span key={s} style={{
            padding: '7px 12px', borderRadius: 99,
            background: 'rgba(242,238,255,0.06)',
            border: '1px solid rgba(242,238,255,0.12)',
            fontSize: 11.5, color: 'var(--on-night-2)',
          }}>{s}</span>
        ))}
      </div>

      {/* Tracks */}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tracks.map((t, i) => (
          <button key={t.id || i} onClick={() => onOpenPlayer({
            id: t.id, title: t.title, subtitle: t.author, mins: t.mins,
            mood: cat.id === 'insomnia' || cat.id === 'sleep' ? 'plum' : 'lavender',
            tag: cat.label.toLowerCase(),
            kind: cat.id === 'sleep' ? 'evening' : 'day',
            gradient: 'lavender',
          })} style={{
            width: '100%', textAlign: 'left', cursor: 'pointer',
            padding: '12px 14px', border: '1px solid rgba(242,238,255,0.10)',
            borderRadius: 16, background: 'rgba(242,238,255,0.04)',
            color: 'var(--on-night)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 13, flexShrink: 0,
              background: `linear-gradient(160deg, ${cat.accent}55, ${cat.accent}22)`,
              border: `1px solid ${cat.accent}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 14px ${cat.accent}25`,
            }}>
              <CatShape shape={cat.shape} accent={cat.accent} size={28}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="serif" style={{ fontSize: 15.5, letterSpacing: '-0.005em', fontWeight: 500 }}>{t.title}</div>
              <div style={{ fontSize: 10.5, color: 'var(--on-night-3)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{t.author}</span><span style={{ opacity: 0.5 }}>·</span>
                <IconClock size={9} color="var(--on-night-3)"/> {t.mins} мин
                <span style={{ opacity: 0.5 }}>·</span><span>{t.level}</span>
                {t.premium && <><span style={{ opacity: 0.5 }}>·</span><IconLock size={9} color="var(--lav-300, #BFB2F0)"/></>}
              </div>
            </div>
            <button style={{
              width: 32, height: 32, borderRadius: 16, flexShrink: 0,
              background: 'rgba(242,238,255,0.10)',
              border: '1px solid rgba(242,238,255,0.18)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconPlay size={11} color="var(--on-night)"/>
            </button>
          </button>
        ))}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// DIARY
// ═══════════════════════════════════════════════════════════════
// DIARY
// ═══════════════════════════════════════════════════════════════

// 7-day series (today = ПТ, idx 4)
export const D_DAYS  = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
export const D_MOOD  = [4, 6, 5, 5, 3, 7, 6];
export const D_STRESS= [7, 5, 5, 6, 8, 4, 5];
export const D_ENERGY= [3, 5, 5, 4, 3, 6, 7];

// Top emotions of the week + colors
export const EMOTIONS_THIS_WEEK = [
  { l: 'Усталость',    pct: 32, c: '#C49B97' },
  { l: 'Тревога',      pct: 24, c: '#9CB2F0' },
  { l: 'Обида',        pct: 14, c: '#E89BB0' },
  { l: 'Благодарность',pct: 11, c: '#F4D58A' },
  { l: 'Нежность',     pct:  8, c: '#D9B4DC' },
  { l: 'Прочее',       pct: 11, c: 'rgba(242,238,255,0.18)' },
];

export function DiaryScreen({ onOpenWrite }) {
  const [picked, setPicked] = React.useState(null);

  return (
    <div className="bg-night" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <StarrySky density={0.45} includeShootingStar={false}/>
      <Particles count={4} palette="lavender"/>

      {/* ambient rose glow at top */}
      <div style={{
        position: 'absolute', top: -60, left: -40, right: -40, height: 240,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(232,155,176,0.20) 0%, transparent 70%)',
        filter: 'blur(20px)', pointerEvents: 'none',
      }}/>

      <div className="fade-in stagger" style={{
        position: 'relative', height: '100%', overflowY: 'auto', overflowX: 'hidden',
        padding: '54px 20px 132px',
      }}>
        {/* ── HEADER ── */}
        <DiaryHeader/>

        {/* ── HERO CHECK-IN ── */}
        <CheckInCard picked={picked} onPick={setPicked} onOpenWrite={onOpenWrite}/>

        {/* ── Recent entries ── */}
        <SectionDiary eyebrow="ЗАПИСИ" title="Ваша лента" action={`${EXTENDED_DIARY.length} записей`} marginTop={28}/>
        <EntriesTimeline/>

        {/* ── Footer: privacy note ── */}
        <div style={{
          marginTop: 24, padding: '14px 16px', borderRadius: 16,
          background: 'rgba(8, 5, 22, 0.40)',
          border: '1px solid rgba(242,238,255,0.08)',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: 'rgba(232,155,176,0.18)', border: '1px solid rgba(232,155,176,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconLock size={13} color="#E89BB0"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--on-night)', fontWeight: 500 }}>Закрытое пространство</div>
            <div style={{ fontSize: 11, color: 'var(--on-night-3)', marginTop: 3, lineHeight: 1.45 }}>
              Все записи шифруются и хранятся на устройстве. Никаких внешних серверов, рекламы и шеринга.
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 14, padding: '12px 14px', borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(244,213,138,0.10), rgba(232,155,176,0.10))',
          border: '1px solid rgba(244,213,138,0.18)',
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 11.5, color: 'var(--on-night-2)', lineHeight: 1.45,
        }}>
          <Sparkle size={12} color="#F4D58A" spin={false}/>
          <span>
            Аналитика и паттерны — на вкладке <span style={{ color: '#F4D58A', fontWeight: 600 }}>Анализ</span>.
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ANALYSIS — Зеркало (5 sub-screens)
// Пульс · Паттерны · Динамика · Связи · История
// ═══════════════════════════════════════════════════════════════

// Demo data — would be populated from check-ins
export const ANALYSIS_DATA = {
  phase: 'Стабилизация',
  phaseDesc: 'неделя без резких пиков. Энергия чуть выше прошлой.',
  dominantEmotion: { label: 'тревога', color: '#F0B6C6', days: 4 },
  companion: ['усталость', 'благодарность'],
  energyDays:  [3, 3, 2, 3, 3, 3, 4],
  moodDays:    [2, 3, 3, 4, 3, 4, 3],
  stressDays:  [4, 4, 4, 4, 5, 3, 4],
  monthAgo: { metric: 'тревога 4+', then: '5 дней из 7', now: '2 дня из 7' },
  resources: [
    { label: 'Общение',     weight: 0.85, color: '#F4D58A' },
    { label: 'Движение',    weight: 0.60, color: '#9CCEAF' },
    { label: 'Природа',     weight: 0.45, color: '#BFD2FF' },
  ],
  triggers: [
    { label: 'Работа',     weight: 0.90, color: '#F0B6C6' },
    { label: 'Инфошум',    weight: 0.55, color: '#E89BB0' },
    { label: 'Я сам',      weight: 0.40, color: '#9CA9E0' },
  ],
  somatic: [{ part: 'шея/плечи', weight: 0.8 }, { part: 'грудь', weight: 0.4 }],
  insights: [
    { id: 1, age: 'новое',  text: 'Среда — твой самый сложный день, повторяется 4 недели подряд.', saved: false },
    { id: 2, age: '3 дня',  text: 'После звонков с мамой энергия падает на 2 дня.', saved: false },
    { id: 3, age: '5 дней', text: 'Когда ты выбираешь «не слышу себя» — на следующий день стресс выше.', saved: true },
    { id: 4, age: '1 нед',  text: 'Ты дважды отметил «загонял себя» — и оба раза за день до этого был стресс 5/5.', saved: false },
  ],
  connections: [
    { text: 'В дни с движением твоя средняя энергия на 1.3 выше.', viz: 'bars', a: 2.4, b: 3.7, aLabel: 'без движения', bLabel: 'с движением' },
    { text: 'Когда ты спишь меньше 6 часов — на следующий день стресс почти всегда выше.', viz: 'compare', a: 2.4, b: 3.8, aLabel: '7+ часов', bLabel: '<6 часов' },
    { text: 'Твоя тревога связана с инфошумом сильнее, чем с работой.', viz: 'pair', a: 0.72, b: 0.41, aLabel: 'инфошум', bLabel: 'работа' },
    { text: 'После общения как источника энергии — следующее утро лучше в 70% случаев.', viz: 'percent', value: 70 },
  ],
  monthly: [
    { id: '2026-04', label: 'Апрель 2026', emotion: 'тревога', color: '#F0B6C6',
      shift: 'научилась отличать тревогу от усталости' },
    { id: '2026-03', label: 'Март 2026',   emotion: 'апатия',  color: '#9CA9E0',
      shift: 'появились первые ресурсы' },
    { id: '2026-02', label: 'Февраль 2026', emotion: 'грусть', color: '#7C9BB5',
      shift: 'старт пути' },
  ],
  phaseHistory: [
    { phase: 'Стабилизация', weeks: 6, color: '#9CCEAF' },
    { phase: 'Исследование', weeks: 4, color: '#BFB2F0' },
    { phase: 'Выживание',    weeks: 2, color: '#9CA9E0' },
    { phase: 'Рост',         weeks: 1, color: '#F4D58A' },
  ],
  weekHeatmap: [
    // 4 weeks × 7 days, dominant emotion family color
    ['BL','TL','BL','BL','TL','BR','BR'],
    ['TL','TL','BL','TL','BL','BR','TR'],
    ['BL','TL','TL','TR','BR','BR','TR'],
    ['TL','TL','TR','BR','TL','BR','TR'],
  ],
};

export const PHASE_COLORS = {
  'Стабилизация':   { color: '#9CCEAF', icon: '🌿' },
  'Восстановление': { color: '#BFD2FF', icon: '💧' },
  'Рост':           { color: '#F4D58A', icon: '✨' },
  'Спад':           { color: '#9CA9E0', icon: '🌫' },
  'Турбулентность': { color: '#F0B6C6', icon: '🌹' },
  'Выживание':      { color: '#7C9BB5', icon: '🛡' },
  'Исследование':   { color: '#BFB2F0', icon: '🔭' },
};

export const FAMILY_COLOR_BY_ID = {
  TL: '#F0B6C6', TR: '#F4D58A', BL: '#9CA9E0', BR: '#9CCEAF',
};

export function AnalysisScreen() {
  const [sub, setSub] = React.useState('pulse');
  const subTabs = [
    { id: 'pulse',    label: 'Пульс' },
    { id: 'patterns', label: 'Паттерны' },
    { id: 'dynamics', label: 'Динамика' },
    { id: 'links',    label: 'Связи' },
    { id: 'history',  label: 'История' },
  ];

  return (
    <div className="bg-night" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <StarrySky density={0.55} includeShootingStar={false}/>
      <Particles count={5} palette="lavender"/>

      <div style={{
        position: 'absolute', top: -60, left: -40, right: -40, height: 260,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(191,178,240,0.22) 0%, transparent 70%)',
        filter: 'blur(20px)', pointerEvents: 'none',
      }}/>

      <div className="fade-in stagger" style={{
        position: 'relative', height: '100%', overflowY: 'auto', overflowX: 'hidden',
        padding: '54px 20px 132px',
      }}>
        {/* HEADER */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 99,
          background: 'rgba(191,178,240,0.12)',
          border: '1px solid rgba(191,178,240,0.24)',
          color: '#D3C8FF',
          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>
          <Sparkle size={9} color="#D3C8FF" spin={false}/> анализ
        </div>
        <div className="serif" style={{
          fontSize: 28, lineHeight: 1.05, marginTop: 10, letterSpacing: '-0.02em',
          color: 'var(--on-night)', fontWeight: 500,
        }}>
          Я заметила<br/>
          <span className="serif-it" style={{ color: '#D3C8FF' }}>про тебя</span>.
        </div>
        <div style={{
          fontSize: 12.5, color: 'var(--on-night-2)', marginTop: 8, lineHeight: 1.5, maxWidth: 320,
        }}>
          Зеркало, в котором видно то, что трудно увидеть в моменте.
        </div>

        {/* Sub-nav */}
        <div style={{
          marginTop: 18, display: 'flex', gap: 4,
          marginLeft: -20, paddingLeft: 20, marginRight: -20, paddingRight: 20,
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {subTabs.map(t => {
            const on = sub === t.id;
            return (
              <button key={t.id} onClick={() => setSub(t.id)} style={{
                flexShrink: 0,
                padding: '8px 14px', borderRadius: 99, cursor: 'pointer',
                background: on
                  ? 'linear-gradient(180deg, #9A87E5, #5C4BC0)'
                  : 'rgba(242,238,255,0.06)',
                border: 'none',
                color: on ? '#FFF9E0' : 'var(--on-night-2)',
                fontFamily: 'var(--sans)', fontSize: 12, fontWeight: on ? 600 : 500,
                letterSpacing: 0.1,
                boxShadow: on ? '0 4px 12px rgba(92,75,192,0.40)' : 'none',
                transition: 'all 0.25s',
              }}>{t.label}</button>
            );
          })}
        </div>

        {/* Active sub-screen */}
        <div style={{ marginTop: 18 }}>
          {sub === 'pulse'    && <PulseSubscreen/>}
          {sub === 'patterns' && <PatternsSubscreen/>}
          {sub === 'dynamics' && <DynamicsSubscreen/>}
          {sub === 'links'    && <LinksSubscreen/>}
          {sub === 'history'  && <HistorySubscreen/>}
        </div>
      </div>
    </div>
  );
}

// ═════════ Sub-screen 1 — Пульс ═════════
export function PulseSubscreen() {
  const d = ANALYSIS_DATA;

  // Detect "care needed" — flat energy / sustained anxiety / poor sleep
  const avgEnergy = d.energyDays.reduce((a, b) => a + b, 0) / d.energyDays.length;
  const avgStress = d.stressDays.reduce((a, b) => a + b, 0) / d.stressDays.length;
  const anxietyDays = d.dominantEmotion.label === 'тревога' ? d.dominantEmotion.days : 0;
  const careNeeded = avgEnergy <= 3.4 || avgStress >= 3.8 || anxietyDays >= 4;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PhaseCard phase={d.phase} desc={d.phaseDesc}/>
      <ScalesCard energy={d.energyDays} mood={d.moodDays} stress={d.stressDays}/>
      <DominantEmotionCard emotion={d.dominantEmotion} companion={d.companion}/>
      {careNeeded && <CareCard avgEnergy={avgEnergy} avgStress={avgStress} anxietyDays={anxietyDays}/>}
      <InsightCard text={d.insights[0].text} age="новое" saved={false}/>
      <MonthAgoCard data={d.monthAgo}/>
      <ResourcesCard resources={d.resources}/>
    </div>
  );
}

// Care recommendations — surfaced when state is low for several days
export function CareCard({ avgEnergy, avgStress, anxietyDays }) {
  // Decide priority
  let priority;
  if (avgEnergy <= 3.4) {
    priority = {
      tag: 'мягкая забота',
      title: 'Энергия держится низкой',
      reason: `${(5 - avgEnergy).toFixed(1)} ниже середины уже несколько дней — стоит позаботиться о теле`,
      color: '#F5A88E',
      tips: [
        { icon: '🍃', title: 'Витамин D',           sub: 'при усталости — частая нехватка зимой и весной', kind: 'supplement' },
        { icon: '🌊', title: 'Магний B6',           sub: 'нервная система, мышцы и сон',                    kind: 'supplement' },
        { icon: '💧', title: 'Стакан воды',         sub: 'до кофе утром — лёгкая дегидратация усиливает усталость', kind: 'habit' },
        { icon: '🌅', title: 'Свет в глаза 10 мин', sub: 'утром — выровняет циркадный ритм',                 kind: 'habit' },
      ],
    };
  } else if (avgStress >= 3.8) {
    priority = {
      tag: 'забота',
      title: 'Стресс держится высоким',
      reason: 'кортизол накапливается — телу нужно мягкое замедление',
      color: '#E89BB0',
      tips: [
        { icon: '🌿', title: 'Адаптогены · сбор',  sub: 'родиола, ашваганда — при хроническом стрессе',     kind: 'supplement' },
        { icon: '🍵', title: 'Чай-набор «Тишина»', sub: 'липа, ромашка, мята — на месяц',                    kind: 'product' },
        { icon: '🛏', title: 'Час без экрана',     sub: 'перед сном — сократит время засыпания вдвое',       kind: 'habit' },
        { icon: '🚶‍♀️', title: '15 минут прогулки',  sub: 'спокойно, без музыки — −21% кортизола',             kind: 'habit' },
      ],
    };
  } else {
    priority = {
      tag: 'забота',
      title: 'Тревога держится 4+ дня',
      reason: 'имеет смысл укрепить нервную систему телом, а не только практиками',
      color: '#F0B6C6',
      tips: [
        { icon: '🌊', title: 'Магний B6',          sub: 'поддержка нервной системы',                          kind: 'supplement' },
        { icon: '🍵', title: 'Травяной чай',       sub: 'мелисса и пассифлора · вечером',                    kind: 'product' },
        { icon: '✍️', title: 'Утреннее письмо',    sub: '3 страницы свободного письма от руки',              kind: 'habit' },
        { icon: '🌳', title: 'Лес или парк',       sub: '20 минут — снижает тревогу как небольшая доза анксиолитика', kind: 'habit' },
      ],
    };
  }

  const [acknowledged, setAcknowledged] = React.useState(false);

  return (
    <div style={{
      padding: '18px 18px', borderRadius: 22, position: 'relative', overflow: 'hidden',
      background: `linear-gradient(155deg, ${priority.color}22 0%, rgba(20,14,50,0.55) 80%)`,
      border: `1px solid ${priority.color}38`,
    }}>
      <div style={{
        position: 'absolute', right: -20, top: -20, width: 130, height: 130, borderRadius: '50%',
        background: `radial-gradient(circle, ${priority.color}30 0%, transparent 65%)`,
        filter: 'blur(12px)', pointerEvents: 'none',
      }}/>

      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 9px', borderRadius: 99,
            background: `${priority.color}22`,
            border: `1px solid ${priority.color}45`,
            color: priority.color,
            fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 3, background: priority.color, boxShadow: `0 0 6px ${priority.color}` }}/>
            {priority.tag}
          </span>
          <span style={{ fontSize: 10, color: 'var(--on-night-3)' }}>· не диагноз, наблюдение</span>
        </div>

        <div className="serif" style={{
          fontSize: 18, color: 'var(--on-night)', marginTop: 10,
          letterSpacing: '-0.005em', lineHeight: 1.25, fontWeight: 500, maxWidth: '88%',
        }}>
          {priority.title}
        </div>
        <div style={{
          fontSize: 11.5, color: 'var(--on-night-2)', marginTop: 6, lineHeight: 1.45,
        }}>
          {priority.reason}
        </div>

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {priority.tips.map((t, i) => (
            <CareTipRow key={i} t={t} color={priority.color}/>
          ))}
        </div>

        <div style={{
          marginTop: 12, paddingTop: 12,
          borderTop: '1px dashed rgba(242,238,255,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <span style={{ fontSize: 10, color: 'var(--on-night-3)', lineHeight: 1.4, flex: 1 }}>
            Если состояние держится больше 2 недель — стоит сходить к врачу или психологу.
          </span>
          <button onClick={() => setAcknowledged(a => !a)} style={{
            padding: '6px 11px', borderRadius: 99,
            background: acknowledged ? `${priority.color}28` : 'transparent',
            border: `1px solid ${acknowledged ? priority.color + '50' : 'rgba(242,238,255,0.18)'}`,
            color: acknowledged ? priority.color : 'var(--on-night-2)',
            cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 10.5, fontWeight: 500,
            flexShrink: 0, letterSpacing: 0.2,
          }}>
            {acknowledged ? 'учту' : 'спасибо'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CareTipRow({ t, color }) {
  const tagByKind = {
    supplement: { label: 'добавка', color: '#9CCEAF' },
    product:    { label: 'товар',   color: '#F4D58A' },
    habit:      { label: 'привычка',color: '#BFD2FF' },
  };
  const tag = tagByKind[t.kind] || tagByKind.habit;
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 12,
      background: 'rgba(8,5,22,0.40)',
      border: '1px solid rgba(242,238,255,0.08)',
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      <span style={{
        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
        background: `${color}24`, border: `1px solid ${color}48`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
      }}>{t.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 12.5, color: 'var(--on-night)', fontWeight: 500 }}>{t.title}</span>
          <span style={{
            fontSize: 8.5, color: tag.color, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
            padding: '1px 6px', borderRadius: 99,
            background: `${tag.color}1A`, border: `1px solid ${tag.color}40`,
          }}>{tag.label}</span>
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--on-night-3)', marginTop: 3, lineHeight: 1.45 }}>
          {t.sub}
        </div>
      </div>
    </div>
  );
}

export function PhaseCard({ phase, desc }) {
  const meta = PHASE_COLORS[phase] || { color: '#BFB2F0', icon: '◯' };
  return (
    <div style={{
      padding: '18px 18px', borderRadius: 22, position: 'relative', overflow: 'hidden',
      background: `linear-gradient(160deg, ${meta.color}24 0%, rgba(20,14,50,0.55) 70%)`,
      border: `1px solid ${meta.color}40`,
    }}>
      <div style={{
        position: 'absolute', right: -20, top: -20, width: 130, height: 130, borderRadius: '50%',
        background: `radial-gradient(circle, ${meta.color}40 0%, transparent 65%)`,
        filter: 'blur(12px)', pointerEvents: 'none',
      }}/>
      <div style={{ position: 'relative' }}>
        <div className="eyebrow" style={{ color: meta.color, letterSpacing: 0.6 }}>фаза недели</div>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8,
        }}>
          <span style={{ fontSize: 26 }}>{meta.icon}</span>
          <span className="serif-it" style={{
            fontSize: 30, color: 'var(--on-night)', letterSpacing: '-0.01em', lineHeight: 1,
          }}>{phase}.</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--on-night-2)', marginTop: 8, lineHeight: 1.5, maxWidth: 280 }}>
          {desc}
        </div>
      </div>
    </div>
  );
}

export function ScalesCard({ energy, mood, stress }) {
  const summary = (arr, low, mid, high) => {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    if (avg < 2.5) return low;
    if (avg < 3.7) return mid;
    return high;
  };
  return (
    <div style={{
      padding: '16px 16px', borderRadius: 22,
      background: 'rgba(242,238,255,0.04)',
      border: '1px solid rgba(242,238,255,0.10)',
    }}>
      <div className="eyebrow" style={{ letterSpacing: 0.6 }}>как тебе эта неделя</div>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ScaleBars
          label="энергия"
          color="#F5A88E"
          days={energy}
          caption={summary(energy, 'скорее низкая', 'ровная', 'насыщенная')}/>
        <ScaleBars
          label="настроение"
          color="#BFB2F0"
          days={mood}
          caption={summary(mood, 'тише обычного', 'ровнее обычного', 'легче обычного')}/>
        <ScaleBars
          label="стресс"
          color="#F0B6C6"
          days={stress}
          caption={summary(stress, 'почти не было', 'фоновый', 'плотный, пик в пятницу')}/>
      </div>
    </div>
  );
}

export function ScaleBars({ label, color, days, caption }) {
  const max = 5;
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 11, color: 'var(--on-night-2)', letterSpacing: 0.2, textTransform: 'lowercase',
        }}>{label}</span>
        <span style={{ fontSize: 10.5, color, fontWeight: 600, letterSpacing: 0.2 }}>{caption}</span>
      </div>
      <div style={{
        marginTop: 6, display: 'flex', alignItems: 'flex-end', gap: 4, height: 30,
      }}>
        {days.map((v, i) => {
          const fill = v / max;
          return (
            <div key={i} style={{
              flex: 1, position: 'relative',
              height: `${Math.max(15, fill * 30)}px`,
              background: `linear-gradient(180deg, ${color}, ${color}55)`,
              opacity: 0.4 + fill * 0.6,
              borderRadius: 4,
            }}/>
          );
        })}
      </div>
      <div style={{
        marginTop: 4, display: 'flex', justifyContent: 'space-between',
        fontSize: 8.5, color: 'var(--on-night-3)', letterSpacing: 0.3,
      }}>
        {['пн','вт','ср','чт','пт','сб','вс'].map(d => <span key={d}>{d}</span>)}
      </div>
    </div>
  );
}

export function DominantEmotionCard({ emotion, companion }) {
  return (
    <div style={{
      padding: '18px 18px', borderRadius: 22,
      background: `linear-gradient(160deg, ${emotion.color}24 0%, rgba(20,14,50,0.55) 70%)`,
      border: `1px solid ${emotion.color}38`,
    }}>
      <div className="eyebrow" style={{ color: emotion.color, letterSpacing: 0.6 }}>эмоция недели</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10 }}>
        <span className="serif-it" style={{
          fontSize: 36, color: 'var(--on-night)', letterSpacing: '-0.01em', lineHeight: 1,
        }}>{emotion.label}.</span>
        <span style={{ fontSize: 11, color: 'var(--on-night-3)', letterSpacing: 0.2 }}>
          {emotion.days} из 7 дней
        </span>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 9.5, color: 'var(--on-night-3)', letterSpacing: 0.4, fontWeight: 600, textTransform: 'uppercase',
          alignSelf: 'center',
        }}>рядом:</span>
        {companion.map(w => (
          <span key={w} style={{
            padding: '4px 10px', borderRadius: 99,
            background: 'rgba(242,238,255,0.06)',
            border: '1px solid rgba(242,238,255,0.12)',
            fontSize: 11, color: 'var(--on-night-2)',
          }}>{w}</span>
        ))}
      </div>
    </div>
  );
}

export function InsightCard({ text, age, saved: initialSaved }) {
  const insightKey = text;
  const [saved, setSaved] = React.useState(() => {
    const set = getState('saved_insights', []);
    return insightKey != null ? set.includes(insightKey) : initialSaved;
  });
  const toggleSaved = () => {
    setSaved(s => {
      const next = !s;
      if (insightKey != null) {
        const set = getState('saved_insights', []);
        let nextArr;
        if (next) {
          nextArr = set.includes(insightKey) ? set : [...set, insightKey];
        } else {
          nextArr = set.filter(k => k !== insightKey);
        }
        setState('saved_insights', nextArr);
      }
      return next;
    });
  };
  return (
    <div style={{
      padding: '16px 16px', borderRadius: 20, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(244,213,138,0.16) 0%, rgba(232,155,176,0.10) 50%, rgba(20,14,50,0.50) 100%)',
      border: '1px solid rgba(244,213,138,0.25)',
    }}>
      <div style={{ position: 'absolute', right: -10, top: -10, opacity: 0.5, pointerEvents: 'none' }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          {[[40,20],[60,40],[24,48],[52,60]].map(([x,y], i) => (
            <path key={i} d={`M${x} ${y} l2 -4 l-4 -2 l4 -2 l2 -4 l2 4 l4 2 l-4 2 z`} fill="#F4D58A" opacity={0.55 - i * 0.1}/>
          ))}
        </svg>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            padding: '3px 9px', borderRadius: 99,
            background: 'rgba(244,213,138,0.20)',
            border: '1px solid rgba(244,213,138,0.40)',
            color: '#FFE7A8',
            fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <Sparkle size={8} color="#FFE7A8" spin={false}/> {age}
          </span>
          <span style={{ fontSize: 10, color: 'var(--on-night-3)', letterSpacing: 0.4, textTransform: 'lowercase' }}>
            я заметила
          </span>
        </div>
        <div style={{
          fontSize: 14, color: 'var(--on-night)', marginTop: 12, lineHeight: 1.55, maxWidth: '90%',
        }}>
          {text}
        </div>
        <div style={{
          marginTop: 14, display: 'flex', gap: 8,
        }}>
          <button onClick={toggleSaved} style={{
            padding: '7px 12px', borderRadius: 99,
            background: saved ? 'rgba(244,213,138,0.30)' : 'rgba(242,238,255,0.08)',
            border: `1px solid ${saved ? 'rgba(244,213,138,0.50)' : 'rgba(242,238,255,0.18)'}`,
            color: saved ? '#FFE7A8' : 'var(--on-night)',
            cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <IconBookmark size={10} color={saved ? '#FFE7A8' : 'var(--on-night)'}/>
            {saved ? 'в «обо мне»' : 'сохранить'}
          </button>
          <button style={{
            padding: '7px 12px', borderRadius: 99,
            background: 'transparent',
            border: '1px solid rgba(242,238,255,0.16)',
            color: 'var(--on-night-2)', cursor: 'pointer',
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500,
          }}>рассказать больше</button>
        </div>
      </div>
    </div>
  );
}

export function MonthAgoCard({ data }) {
  return (
    <div style={{
      padding: '16px 16px', borderRadius: 20,
      background: 'rgba(242,238,255,0.04)',
      border: '1px solid rgba(242,238,255,0.10)',
    }}>
      <div className="eyebrow" style={{ letterSpacing: 0.6 }}>месяц назад → сейчас</div>
      <div style={{
        marginTop: 12, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          flex: 1, padding: '10px 12px', borderRadius: 12,
          background: 'rgba(8,5,22,0.40)',
          border: '1px solid rgba(242,238,255,0.10)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 9, color: 'var(--on-night-3)', letterSpacing: 0.4, textTransform: 'uppercase' }}>тогда</div>
          <div className="serif" style={{ fontSize: 17, color: 'var(--on-night)', marginTop: 4, letterSpacing: '-0.005em' }}>
            {data.then}
          </div>
        </div>
        <span style={{ fontSize: 14, color: 'var(--on-night-3)' }}>→</span>
        <div style={{
          flex: 1, padding: '10px 12px', borderRadius: 12,
          background: 'rgba(156,206,175,0.14)',
          border: '1px solid rgba(156,206,175,0.30)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 9, color: '#9CCEAF', letterSpacing: 0.4, textTransform: 'uppercase' }}>сейчас</div>
          <div className="serif" style={{ fontSize: 17, color: 'var(--on-night)', marginTop: 4, letterSpacing: '-0.005em' }}>
            {data.now}
          </div>
        </div>
      </div>
      <div style={{
        marginTop: 10, fontSize: 11, color: 'var(--on-night-2)', lineHeight: 1.5, fontStyle: 'italic',
      }}>
        Стало тише. Не «лучше» — тише. Тебе самому решать, что это значит.
      </div>
    </div>
  );
}

export function ResourcesCard({ resources }) {
  return (
    <div style={{
      padding: '16px 16px', borderRadius: 20,
      background: 'rgba(242,238,255,0.04)',
      border: '1px solid rgba(242,238,255,0.10)',
    }}>
      <div className="eyebrow" style={{ letterSpacing: 0.6 }}>что давало опору</div>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {resources.map((r, i) => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 16, fontSize: 10, color: 'var(--on-night-3)', fontWeight: 600,
            }}>{i + 1}</span>
            <span style={{ minWidth: 90, fontSize: 12, color: 'var(--on-night)' }}>{r.label}</span>
            <div style={{
              flex: 1, height: 10, borderRadius: 5,
              background: 'rgba(8,5,22,0.40)',
              border: '1px solid rgba(242,238,255,0.08)',
              overflow: 'hidden', position: 'relative',
            }}>
              <div style={{
                width: `${r.weight * 100}%`, height: '100%',
                background: `linear-gradient(90deg, ${r.color}AA, ${r.color})`,
                borderRadius: 5,
                boxShadow: `0 0 8px ${r.color}55`,
              }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═════════ Sub-screen 2 — Паттерны ═════════
export function PatternsSubscreen() {
  const d = ANALYSIS_DATA;
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11.5, color: 'var(--on-night-2)', lineHeight: 1.5 }}>
        Что я вижу про тебя после <span style={{ color: '#FFE7A8', fontWeight: 600 }}>3 недель</span> наблюдений.
      </div>

      {d.insights.slice(0, 4).map(ins => (
        <InsightCard key={ins.id} text={ins.text} age={ins.age} saved={ins.saved}/>
      ))}

      <SectionDiary eyebrow="ЧТО ЧАЩЕ ЗАБИРАЕТ ЭНЕРГИЮ" title="Триггеры" marginTop={8}/>
      <ResourcesCard resources={d.triggers}/>

      <SectionDiary eyebrow="ЧТО ЧАЩЕ ПОДДЕРЖИВАЕТ" title="Ресурсы" marginTop={8}/>
      <ResourcesCard resources={d.resources}/>

      <SectionDiary eyebrow="ГДЕ ТЕЛО ДЕРЖИТ" title="Соматическая карта" marginTop={8}/>
      <SomaticMapCard somatic={d.somatic}/>
    </div>
  );
}

export function SomaticMapCard({ somatic }) {
  // Heat zones by part id
  const zones = {
    head:    somatic.find(s => s.part === 'голова')?.weight || 0,
    shoulders: somatic.find(s => s.part === 'шея/плечи')?.weight || 0,
    chest:   somatic.find(s => s.part === 'грудь')?.weight || 0,
    back:    somatic.find(s => s.part === 'спина')?.weight || 0,
    belly:   somatic.find(s => s.part === 'живот')?.weight || 0,
  };

  const heat = (w) => `rgba(232,155,176,${0.15 + w * 0.55})`;

  return (
    <div style={{
      padding: '16px 16px', borderRadius: 20,
      background: 'rgba(242,238,255,0.04)',
      border: '1px solid rgba(242,238,255,0.10)',
      display: 'flex', alignItems: 'center', gap: 18,
    }}>
      <svg width="80" height="180" viewBox="0 0 80 180" style={{ flexShrink: 0 }}>
        {/* head */}
        <circle cx="40" cy="18" r="12" fill={zones.head > 0 ? heat(zones.head) : 'rgba(242,238,255,0.10)'} stroke="rgba(242,238,255,0.30)" strokeWidth="1"/>
        {/* neck */}
        <rect x="36" y="30" width="8" height="6" fill="rgba(242,238,255,0.10)"/>
        {/* shoulders */}
        <path d="M 12 42 Q 40 32 68 42 L 68 50 Q 40 44 12 50 Z" fill={zones.shoulders > 0 ? heat(zones.shoulders) : 'rgba(242,238,255,0.10)'} stroke="rgba(242,238,255,0.30)" strokeWidth="1"/>
        {/* chest */}
        <path d="M 18 50 L 62 50 L 60 90 L 20 90 Z" fill={zones.chest > 0 ? heat(zones.chest) : 'rgba(242,238,255,0.10)'} stroke="rgba(242,238,255,0.30)" strokeWidth="1"/>
        {/* belly */}
        <path d="M 20 90 L 60 90 L 58 130 L 22 130 Z" fill={zones.belly > 0 ? heat(zones.belly) : 'rgba(242,238,255,0.10)'} stroke="rgba(242,238,255,0.30)" strokeWidth="1"/>
        {/* legs */}
        <path d="M 22 130 L 36 130 L 32 170 L 24 170 Z" fill="rgba(242,238,255,0.06)" stroke="rgba(242,238,255,0.20)" strokeWidth="1"/>
        <path d="M 44 130 L 58 130 L 56 170 L 48 170 Z" fill="rgba(242,238,255,0.06)" stroke="rgba(242,238,255,0.20)" strokeWidth="1"/>
        {/* arms */}
        <path d="M 12 44 L 6 90 L 12 90 L 18 50 Z" fill="rgba(242,238,255,0.06)" stroke="rgba(242,238,255,0.20)" strokeWidth="1"/>
        <path d="M 68 44 L 74 90 L 68 90 L 62 50 Z" fill="rgba(242,238,255,0.06)" stroke="rgba(242,238,255,0.20)" strokeWidth="1"/>
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: 'var(--on-night)', lineHeight: 1.5 }}>
          Чаще всего напряжение собирается в <span style={{ color: '#F0B6C6', fontWeight: 600 }}>шее и плечах</span>.
        </div>
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {somatic.map(s => (
            <div key={s.part} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 11, color: 'var(--on-night-2)',
            }}>
              <span style={{ flex: 1 }}>{s.part}</span>
              <div style={{
                width: 50, height: 4, borderRadius: 2,
                background: 'rgba(242,238,255,0.10)', overflow: 'hidden',
              }}>
                <div style={{ width: `${s.weight * 100}%`, height: '100%', background: '#F0B6C6' }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═════════ Sub-screen 3 — Динамика ═════════
export function DynamicsSubscreen() {
  const [period, setPeriod] = React.useState('week');
  const d = ANALYSIS_DATA;
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Period switcher */}
      <div style={{
        display: 'inline-flex', padding: 4, borderRadius: 99,
        background: 'rgba(8,5,22,0.45)',
        border: '1px solid rgba(242,238,255,0.10)',
        gap: 2,
        alignSelf: 'flex-start',
      }}>
        {[
          { id: 'week',  label: 'Неделя' },
          { id: 'month', label: 'Месяц' },
          { id: 'q',     label: '3 месяца' },
        ].map(p => {
          const on = period === p.id;
          return (
            <button key={p.id} onClick={() => setPeriod(p.id)} style={{
              padding: '6px 14px', borderRadius: 99,
              background: on ? 'rgba(191,178,240,0.20)' : 'transparent',
              border: on ? '1px solid rgba(191,178,240,0.40)' : '1px solid transparent',
              color: on ? '#D3C8FF' : 'var(--on-night-2)',
              cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 11.5, fontWeight: on ? 600 : 500,
            }}>{p.label}</button>
          );
        })}
      </div>

      {/* Trend with amplitude */}
      <div style={{
        padding: '16px 16px', borderRadius: 20,
        background: 'rgba(242,238,255,0.04)',
        border: '1px solid rgba(242,238,255,0.10)',
      }}>
        <div className="eyebrow" style={{ letterSpacing: 0.6 }}>тренд по шкалам</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <TrendBand label="энергия"    color="#F5A88E" mid={3.0}  range={[2, 4]}/>
          <TrendBand label="настроение" color="#BFB2F0" mid={3.4}  range={[2.5, 4.5]}/>
          <TrendBand label="стресс"     color="#F0B6C6" mid={3.0}  range={[2, 4]}/>
        </div>
        <div style={{ fontSize: 11, color: 'var(--on-night-2)', marginTop: 12, lineHeight: 1.5, fontStyle: 'italic' }}>
          Твоя тревога идёт по тому же паттерну, что и две недели назад — пик в среду, спад к субботе.
        </div>
      </div>

      {/* Calendar heatmap */}
      <div style={{
        padding: '16px 16px', borderRadius: 20,
        background: 'rgba(242,238,255,0.04)',
        border: '1px solid rgba(242,238,255,0.10)',
      }}>
        <div className="eyebrow" style={{ letterSpacing: 0.6 }}>календарь · 4 недели</div>
        <div style={{ marginTop: 12 }}>
          <CalendarHeatmap weeks={d.weekHeatmap}/>
        </div>
        <LegendRow/>
      </div>

      {/* Then vs Now */}
      <MonthAgoCard data={d.monthAgo}/>

      {/* Progress on request */}
      <div style={{
        padding: '16px 16px', borderRadius: 20,
        background: 'linear-gradient(155deg, rgba(156,206,175,0.16) 0%, rgba(20,14,50,0.50) 80%)',
        border: '1px solid rgba(156,206,175,0.28)',
      }}>
        <div className="eyebrow" style={{ color: '#9CDDB7', letterSpacing: 0.6 }}>твой запрос недели</div>
        <div className="serif" style={{
          fontSize: 18, color: 'var(--on-night)', marginTop: 6, letterSpacing: '-0.005em', fontWeight: 500,
        }}>
          Снизить тревогу
        </div>
        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            flex: 1, height: 8, borderRadius: 4,
            background: 'rgba(8,5,22,0.45)', overflow: 'hidden',
          }}>
            <div style={{
              width: '64%', height: '100%',
              background: 'linear-gradient(90deg, #9CCEAF, #9CDDB7)',
              borderRadius: 4,
              boxShadow: '0 0 8px #9CDDB755',
            }}/>
          </div>
          <span style={{ fontSize: 11, color: '#9CDDB7', fontWeight: 600 }}>−24%</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--on-night-2)', marginTop: 10, lineHeight: 1.5 }}>
          Тревога 4+ стала появляться реже — раньше 5 дней из 7, сейчас 2.
        </div>
      </div>
    </div>
  );
}

export function TrendBand({ label, color, mid, range }) {
  // Display: band from range[0] to range[1] (out of 5), mid value marker
  const toPct = (v) => (v / 5) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--on-night-2)', marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ color }}>сейчас {mid.toFixed(1)} из 5</span>
      </div>
      <div style={{
        position: 'relative', height: 12, borderRadius: 6,
        background: 'rgba(8,5,22,0.50)', overflow: 'hidden',
        border: '1px solid rgba(242,238,255,0.08)',
      }}>
        <div style={{
          position: 'absolute', left: `${toPct(range[0])}%`,
          width: `${toPct(range[1] - range[0])}%`,
          top: 0, bottom: 0,
          background: `linear-gradient(90deg, ${color}25, ${color}55, ${color}25)`,
        }}/>
        <div style={{
          position: 'absolute', left: `calc(${toPct(mid)}% - 2px)`,
          top: -2, bottom: -2, width: 4, borderRadius: 2,
          background: color, boxShadow: `0 0 6px ${color}`,
        }}/>
      </div>
    </div>
  );
}

export function CalendarHeatmap({ weeks }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, fontSize: 8.5, color: 'var(--on-night-3)' }}>
        {['пн','вт','ср','чт','пт','сб','вс'].map(d => <span key={d} style={{ textAlign: 'center' }}>{d}</span>)}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {week.map((dayFam, di) => {
            const color = FAMILY_COLOR_BY_ID[dayFam] || 'rgba(242,238,255,0.08)';
            return (
              <div key={di} style={{
                aspectRatio: '1', borderRadius: 6,
                background: `linear-gradient(160deg, ${color}88, ${color}44)`,
                border: `1px solid ${color}50`,
              }}/>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function LegendRow() {
  const items = [
    { c: '#F0B6C6', l: 'напряжение' },
    { c: '#F4D58A', l: 'радость' },
    { c: '#9CA9E0', l: 'тяжёлое' },
    { c: '#9CCEAF', l: 'тёплое' },
  ];
  return (
    <div style={{
      marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 10,
      justifyContent: 'center',
    }}>
      {items.map(i => (
        <span key={i.l} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 10, color: 'var(--on-night-2)',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: i.c }}/>
          {i.l}
        </span>
      ))}
    </div>
  );
}

// ═════════ Sub-screen 4 — Связи ═════════
export function LinksSubscreen() {
  const d = ANALYSIS_DATA;
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{
        padding: '14px 14px', borderRadius: 16,
        background: 'rgba(191,178,240,0.10)',
        border: '1px solid rgba(191,178,240,0.22)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Sparkle size={12} color="#D3C8FF" spin={false}/>
        <div style={{ flex: 1, fontSize: 11.5, color: 'var(--on-night-2)', lineHeight: 1.45 }}>
          Связи появляются после ~14 дней наблюдений. Это не корреляции — это «когда — тогда».
        </div>
      </div>

      {d.connections.map((c, i) => (
        <ConnectionCard key={i} c={c}/>
      ))}

      <div style={{
        marginTop: 6,
        padding: '14px 14px', borderRadius: 16,
        background: 'rgba(8,5,22,0.40)',
        border: '1px dashed rgba(242,238,255,0.14)',
        fontSize: 11.5, color: 'var(--on-night-3)', lineHeight: 1.5, textAlign: 'center',
      }}>
        Чтобы найти ещё связи, нужно ещё ~7 дней наблюдений.
      </div>
    </div>
  );
}

export function ConnectionCard({ c }) {
  const [reaction, setReaction] = React.useState(null); // 'agree' | 'no'

  let viz = null;
  if (c.viz === 'bars' || c.viz === 'compare') {
    const max = 5;
    viz = (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 56, marginTop: 12 }}>
        <BarCompare label={c.aLabel} value={c.a} max={max} color="rgba(242,238,255,0.20)"/>
        <BarCompare label={c.bLabel} value={c.b} max={max} color="#F4D58A"/>
      </div>
    );
  } else if (c.viz === 'pair') {
    viz = (
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <PairBar label={c.aLabel} value={c.a} color="#F0B6C6"/>
        <PairBar label={c.bLabel} value={c.b} color="rgba(242,238,255,0.30)"/>
      </div>
    );
  } else if (c.viz === 'percent') {
    viz = (
      <div style={{
        marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 10,
      }}>
        <span className="serif" style={{
          fontSize: 38, color: '#9CDDB7', lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 500,
        }}>{c.value}%</span>
        <span style={{ fontSize: 11, color: 'var(--on-night-2)', lineHeight: 1.4 }}>
          случаев — лучше следующее утро
        </span>
      </div>
    );
  }

  return (
    <div style={{
      padding: '16px 16px', borderRadius: 20,
      background: 'rgba(242,238,255,0.04)',
      border: '1px solid rgba(242,238,255,0.10)',
    }}>
      <div className="serif" style={{
        fontSize: 16, color: 'var(--on-night)', letterSpacing: '-0.005em', lineHeight: 1.4, fontWeight: 500,
      }}>{c.text}</div>
      {viz}
      <div style={{
        marginTop: 14, paddingTop: 12,
        borderTop: '1px dashed rgba(242,238,255,0.12)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button style={{
          padding: '6px 12px', borderRadius: 99, fontSize: 11,
          background: 'rgba(191,178,240,0.16)',
          border: '1px solid rgba(191,178,240,0.30)',
          color: '#D3C8FF', cursor: 'pointer', fontFamily: 'var(--sans)', fontWeight: 600,
        }}>как ты это используешь?</button>
        <button onClick={() => setReaction(reaction === 'no' ? null : 'no')} style={{
          padding: '6px 10px', borderRadius: 99, fontSize: 10.5,
          background: reaction === 'no' ? 'rgba(232,155,176,0.20)' : 'transparent',
          border: '1px solid ' + (reaction === 'no' ? 'rgba(232,155,176,0.45)' : 'rgba(242,238,255,0.18)'),
          color: reaction === 'no' ? '#F0B6C6' : 'var(--on-night-3)',
          cursor: 'pointer', fontFamily: 'var(--sans)', fontWeight: 500,
        }}>
          {reaction === 'no' ? 'отмечено' : 'не моё'}
        </button>
      </div>
    </div>
  );
}

export function BarCompare({ label, value, max, color }) {
  const h = (value / max) * 56;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: '100%', height: h, borderRadius: 6,
        background: color === 'rgba(242,238,255,0.20)'
          ? 'linear-gradient(180deg, rgba(242,238,255,0.20), rgba(242,238,255,0.08))'
          : `linear-gradient(180deg, ${color}, ${color}88)`,
        boxShadow: color !== 'rgba(242,238,255,0.20)' ? `0 0 8px ${color}55` : 'none',
      }}/>
      <span style={{ fontSize: 9.5, color: 'var(--on-night-3)', letterSpacing: 0.2 }}>
        {label} · <span style={{ color: 'var(--on-night)', fontWeight: 600 }}>{value.toFixed(1)}</span>
      </span>
    </div>
  );
}

export function PairBar({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ minWidth: 80, fontSize: 11, color: 'var(--on-night-2)' }}>{label}</span>
      <div style={{
        flex: 1, height: 8, borderRadius: 4,
        background: 'rgba(8,5,22,0.40)', overflow: 'hidden',
      }}>
        <div style={{
          width: `${value * 100}%`, height: '100%',
          background: `linear-gradient(90deg, ${color}AA, ${color})`,
          borderRadius: 4,
        }}/>
      </div>
      <span style={{ fontSize: 10.5, color: 'var(--on-night-3)', minWidth: 28, textAlign: 'right' }}>
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

// ═════════ Sub-screen 5 — История ═════════
export function HistorySubscreen() {
  const d = ANALYSIS_DATA;
  const persistedSaved = getState('saved_insights', []);
  const aboutMe = (() => {
    const seen = new Set();
    const items = [];
    d.insights.filter(i => i.saved).forEach(i => {
      if (!seen.has(i.text)) { seen.add(i.text); items.push({ id: i.id, text: i.text }); }
    });
    persistedSaved.forEach((text, idx) => {
      if (!seen.has(text)) { seen.add(text); items.push({ id: `saved-${idx}`, text }); }
    });
    return items;
  })();
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 11.5, color: 'var(--on-night-2)', lineHeight: 1.5 }}>
        Твой путь. То, что было, не теряется.
      </div>

      {/* Monthly summaries */}
      <SectionDiary eyebrow="МЕСЯЦЫ" title="Сводки по месяцам" marginTop={4}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {d.monthly.map(m => (
          <MonthCard key={m.id} m={m}/>
        ))}
      </div>

      {/* Phases gallery */}
      <SectionDiary eyebrow="ГДЕ ТЫ БЫЛ" title="Фазы пути" marginTop={14}/>
      <div style={{
        padding: '14px 14px', borderRadius: 18,
        background: 'rgba(242,238,255,0.04)',
        border: '1px solid rgba(242,238,255,0.10)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {d.phaseHistory.map(p => (
          <div key={p.phase} style={{
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: 4, flexShrink: 0,
              background: p.color, boxShadow: `0 0 6px ${p.color}88`,
            }}/>
            <span className="serif" style={{ fontSize: 14, color: 'var(--on-night)', flex: 1, letterSpacing: '-0.005em' }}>
              {p.phase}
            </span>
            <span style={{ fontSize: 11, color: 'var(--on-night-3)' }}>{p.weeks} нед.</span>
            <div style={{
              width: 80, height: 6, borderRadius: 3,
              background: 'rgba(8,5,22,0.40)', overflow: 'hidden',
            }}>
              <div style={{
                width: `${(p.weeks / 13) * 100}%`, height: '100%',
                background: p.color, borderRadius: 3,
              }}/>
            </div>
          </div>
        ))}
        <div style={{ fontSize: 10.5, color: 'var(--on-night-3)', marginTop: 6, lineHeight: 1.45, fontStyle: 'italic' }}>
          Нелинейно. Откатываться — нормально.
        </div>
      </div>

      {/* About me */}
      <SectionDiary eyebrow="ОБО МНЕ" title="Что важно про меня" marginTop={14}/>
      <div style={{
        padding: '14px 14px', borderRadius: 18,
        background: 'linear-gradient(135deg, rgba(244,213,138,0.12) 0%, rgba(8,5,22,0.50) 80%)',
        border: '1px solid rgba(244,213,138,0.25)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {aboutMe.map(i => (
          <div key={i.id} style={{
            padding: '10px 12px', borderRadius: 12,
            background: 'rgba(8,5,22,0.40)',
            border: '1px solid rgba(244,213,138,0.20)',
            fontSize: 12, color: 'var(--on-night)', lineHeight: 1.45,
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <IconBookmark size={11} color="#FFE7A8" style={{ marginTop: 2, flexShrink: 0 }}/>
            <span>{i.text}</span>
          </div>
        ))}
        <div style={{ fontSize: 10.5, color: 'var(--on-night-3)', lineHeight: 1.45, marginTop: 2 }}>
          Сохранённое отсюда используется при подборе программы на следующую неделю.
        </div>
      </div>
    </div>
  );
}

export function MonthCard({ m }) {
  return (
    <div style={{
      padding: '14px 14px', borderRadius: 18, position: 'relative', overflow: 'hidden',
      background: `linear-gradient(160deg, ${m.color}22 0%, rgba(20,14,50,0.55) 80%)`,
      border: `1px solid ${m.color}30`,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <span className="serif" style={{
          fontSize: 16, color: 'var(--on-night)', letterSpacing: '-0.005em', fontWeight: 500,
        }}>{m.label}</span>
        <span className="serif-it" style={{
          fontSize: 13, color: m.color, letterSpacing: 0.2,
        }}>{m.emotion}</span>
      </div>
      <div style={{
        marginTop: 8, fontSize: 11.5, color: 'var(--on-night-2)', lineHeight: 1.45,
      }}>
        <span style={{ color: 'var(--on-night-3)' }}>главный сдвиг:</span> {m.shift}.
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────
export function DiaryHeader() {
  return (
    <div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderRadius: 99,
        background: 'rgba(232,155,176,0.10)',
        border: '1px solid rgba(232,155,176,0.22)',
        color: '#F0B6C6',
        fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
      }}>
        <IconLock size={10} color="#F0B6C6"/> закрытое пространство
      </div>
      <div className="serif" style={{
        fontSize: 32, lineHeight: 1.05, marginTop: 12, letterSpacing: '-0.02em',
        color: 'var(--on-night)', fontWeight: 500,
      }}>
        Дневник<br/>
        <span className="serif-it" style={{ color: '#F0B6C6' }}>эмоций</span>.
      </div>
      <div style={{
        fontSize: 12.5, color: 'var(--on-night-2)', marginTop: 8, lineHeight: 1.5, maxWidth: 320,
      }}>
        Здесь только вы. Я слушаю, как меняется ваше состояние, и подбираю практики под то, что вы чувствуете.
      </div>
    </div>
  );
}

// ─── Section header ─────────────────────────────────────
export function SectionDiary({ eyebrow, title, action, marginTop = 24 }) {
  return (
    <div style={{ marginTop, marginBottom: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="eyebrow" style={{ letterSpacing: 0.6 }}>{eyebrow}</div>
        <div className="serif" style={{
          fontSize: 22, lineHeight: 1.12, marginTop: 4, letterSpacing: '-0.01em',
          color: 'var(--on-night)', fontWeight: 500,
        }}>{title}</div>
      </div>
      {action && (
        <span style={{
          fontSize: 11, color: 'var(--on-night-3)', flexShrink: 0,
        }}>{action}</span>
      )}
    </div>
  );
}

// ═════════ Emotion families — expanded (~12 per group, 48 total) ═════════
export const EMOTION_FAMILIES = [
  {
    id: 'TR', label: 'Радостные',  color: '#F4D58A', icon: '✨',
    desc: 'приятно и активно',
    words: ['радость','вдохновение','азарт','нежность','игривость','влюблённость','удивление','гордость','эйфория','восторг','любопытство','увлечённость'],
  },
  {
    id: 'TL', label: 'Напряжённые', color: '#F0B6C6', icon: '🌹',
    desc: 'неприятно и активно',
    words: ['тревога','напряжение','злость','страх','обида','стыд','раздражение','паника','ярость','отвращение','ревность','зависть'],
  },
  {
    id: 'BR', label: 'Тёплые',     color: '#9CCEAF', icon: '🌿',
    desc: 'приятно и спокойно',
    words: ['спокойствие','благодарность','тепло','умиротворение','удовлетворённость','безопасность','доверие','принятие','гармония','лёгкость','уют','надежда'],
  },
  {
    id: 'BL', label: 'Тяжёлые',    color: '#9CA9E0', icon: '💧',
    desc: 'неприятно и тихо',
    words: ['усталость','грусть','опустошённость','одиночество','тоска','безразличие','апатия','разочарование','бессилие','вина','печаль','скука'],
  },
];

export const FAMILY_BY_WORD = (() => {
  const m = {};
  EMOTION_FAMILIES.forEach(f => f.words.forEach(w => { m[w] = f; }));
  return m;
})();
// ═════════ Context tags ═════════
export const CONTEXTS = [
  { id: 'work',      label: 'Работа',       icon: '💼' },
  { id: 'relations', label: 'Отношения',    icon: '🤝' },
  { id: 'sleep',     label: 'Сон',          icon: '🌙' },
  { id: 'body',      label: 'Тело',         icon: '🌿' },
  { id: 'self',      label: 'К себе',       icon: '🪞' },
  { id: 'money',     label: 'Деньги',       icon: '💰' },
  { id: 'future',    label: 'Будущее',      icon: '🌫' },
  { id: 'family',    label: 'Семья',        icon: '🏠' },
];

// Practice suggestions per emotion family — used elsewhere
export const PRACTICE_FOR = {
  'TL': [
    { title: 'Удлинённый выдох',         mins: 6,  block: 'Опора',    why: 'снижает кортизол быстро' },
    { title: 'Заземление 5-4-3-2-1',     mins: 8,  block: 'Тишина',   why: 'возвращает в «здесь и сейчас»' },
    { title: 'Письмо тревоге',           mins: 12, block: 'Эмоции',   why: 'выгружает мысли' },
  ],
  'TR': [
    { title: 'Сохранить ресурс',          mins: 6,  block: 'Тело',     why: 'закрепить приятное' },
    { title: 'Якорь благодарности',       mins: 8,  block: 'Нежность', why: 'превратить момент в опору' },
    { title: 'Дневник радости',           mins: 5,  block: 'Эмоции',   why: 'замечать хорошее' },
  ],
  'BL': [
    { title: 'Йога-нидра',                mins: 14, block: 'Восст.',   why: '14 мин = 2 ч сна' },
    { title: 'Тёплая визуализация',       mins: 10, block: 'Нежность', why: 'мягко поднимает энергию' },
    { title: 'Самосострадание',           mins: 8,  block: 'Эмоции',   why: 'к себе бережно' },
  ],
  'BR': [
    { title: 'Тишина 7 минут',            mins: 7,  block: 'Тишина',   why: 'закрепить' },
    { title: 'Сканирование тела',         mins: 14, block: 'Тело',     why: 'углубить расслабление' },
    { title: 'Метта',                     mins: 10, block: 'Нежность', why: 'распространить тепло' },
  ],
};

// ═════════ Daily prompt rotates by hour ═════════
export function dailyPrompt() {
  const h = new Date().getHours();
  if (h < 11) return { eyebrow: 'утро · вторник', title: 'Доброе утро. Как вы проснулись?', sub: 'Понаблюдайте за телом и настроением. Без оценок.' };
  if (h < 17) return { eyebrow: 'день · вторник', title: 'Середина дня. Как вы сейчас?',     sub: 'Остановитесь на минуту и послушайте себя.' };
  if (h < 22) return { eyebrow: 'вечер · вторник', title: 'Каким был день?',                  sub: 'Назовите состояние — это поможет завершить день.' };
  return       { eyebrow: 'ночь · вторник',  title: 'Перед сном. Что осталось?',              sub: 'Зафиксируйте — и отпустите.' };
}

// ═════════ DAILY CHECK-IN — 45-90 sec, scales + buttons only ═════════

// 8 dominant emotions per spec
export const CORE_EMOTIONS = [
  { id: 'calm',        label: 'Спокойствие', icon: '🌿', color: '#9CCEAF' },
  { id: 'joy',         label: 'Радость',     icon: '✨', color: '#F4D58A' },
  { id: 'anxiety',     label: 'Тревога',     icon: '🌹', color: '#F0B6C6' },
  { id: 'irritation',  label: 'Раздражение', icon: '⚡',  color: '#FFB089' },
  { id: 'sadness',     label: 'Грусть',      icon: '💧', color: '#9CA9E0' },
  { id: 'apathy',      label: 'Апатия',      icon: '🌫',  color: '#8FA0BA' },
  { id: 'inspiration', label: 'Вдохновение', icon: '🎯', color: '#FFE7A8' },
  { id: 'anger',       label: 'Злость',      icon: '🔥', color: '#D97A65' },
];

// Rotating extra question by day of week (0=Sun … 6=Sat)
export const DAILY_ROTATION = {
  1: { id: 'sleep_quality', kind: 'sleep' },        // Mon
  2: { id: 'body_tension',  kind: 'multi',
       title: 'Где в теле напряжение?',
       options: ['Голова','Шея/плечи','Спина','Живот','Грудь','Нигде'] },
  3: { id: 'drain', kind: 'single',
       title: 'Что забирало энергию больше всего?',
       options: ['Работа','Отношения','Инфошум','Я сам/мысли','Быт','Ничего конкретного'] },
  4: { id: 'fuel', kind: 'single',
       title: 'Что давало энергию?',
       options: ['Общение','Отдых','Движение','Творчество','Смысл','Природа','Одиночество','Ничего'] },
  5: { id: 'self_contact', kind: 'scale5',
       title: 'Удалось побыть с собой и услышать себя?',
       left: 'почти нет', right: 'да, ясно' },
  6: { id: 'movement_screen', kind: 'double',
       title1: 'Движение сегодня', options1: ['Нет','Немного','Много'],
       title2: 'Часов экрана',     options2: ['<2','2–5','5–8','8+'] },
  0: { id: 'week_close', kind: 'weekclose' },       // Sun
};

export const WEEKDAY_LABELS = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];

export function CheckInCard({ picked, onPick, onOpenWrite }) {
  // Use current weekday or pin to Tuesday for demo if it's not set
  const today = new Date();
  const dow = today.getDay(); // 0..6
  const dayLabel = WEEKDAY_LABELS[dow];

  // Core answers
  const [energy,   setEnergy]   = React.useState(null);  // 1..5
  const [mood,     setMood]     = React.useState(null);
  const [stress,   setStress]   = React.useState(null);
  const [emotion,  setEmotion]  = React.useState(null);  // id

  // Rotating
  const rotation = DAILY_ROTATION[dow];
  const [bodyTension, setBodyTension] = React.useState([]);   // tue
  const [drain, setDrain]             = React.useState(null); // wed
  const [fuel,  setFuel]              = React.useState(null); // thu
  const [selfContact, setSelfContact] = React.useState(null); // fri
  const [movement, setMovement]       = React.useState(null); // sat
  const [screen,   setScreen]         = React.useState(null);
  const [sleepQ,  setSleepQ]          = React.useState(null); // mon
  const [sleepH,  setSleepH]          = React.useState(null);
  const [weekRate, setWeekRate]       = React.useState(null); // sun
  const [weekWish, setWeekWish]       = React.useState(null);

  // Note (optional)
  const [noteMode, setNoteMode] = React.useState(null);
  const [noteText, setNoteText] = React.useState('');

  // States
  const [badDay, setBadDay] = React.useState(false);
  const [saved, setSaved]   = React.useState(false);

  const emotionMeta = CORE_EMOTIONS.find(e => e.id === emotion);
  const activeColor = emotionMeta ? emotionMeta.color : '#BFB2F0';

  // Streak
  const STREAK_DONE = 3, STREAK_SKIP = 1, STREAK_TOTAL = 7;

  const coreFilled = energy != null && mood != null && stress != null && emotion != null;

  // Bad-day quick toggle
  const handleBadDay = (e) => {
    setBadDay(true);
    setSaved(true);
    saveCheckin({ date: todayKey(), emotion, note: noteText, badDay: true });
    if (window.__awardStars) window.__awardStars(5, e.currentTarget, 'честность');
  };
  const handleSave = (e) => {
    if (saved) return;
    saveCheckin({
      date: todayKey(), energy, mood, stress, emotion, note: noteText, badDay,
      extra: { bodyTension, drain, fuel, selfContact, movement, screen, sleepQ, sleepH, weekRate, weekWish },
    });
    setSaved(true);
    if (emotion) onPick(emotionMeta.label.toLowerCase());
    if (window.__awardStars) window.__awardStars(10, e.currentTarget, 'чек-ин');
  };

  // Hydrate today's check-in from storage on mount
  React.useEffect(() => {
    const t = getTodayCheckin();
    if (!t) return;
    if (t.energy != null)  setEnergy(t.energy);
    if (t.mood != null)    setMood(t.mood);
    if (t.stress != null)  setStress(t.stress);
    if (t.emotion != null) setEmotion(t.emotion);
    if (t.note != null)    setNoteText(t.note);
    if (t.badDay != null)  setBadDay(t.badDay);
    const ex = t.extra || {};
    if (ex.bodyTension != null) setBodyTension(ex.bodyTension);
    if (ex.drain != null)       setDrain(ex.drain);
    if (ex.fuel != null)        setFuel(ex.fuel);
    if (ex.selfContact != null) setSelfContact(ex.selfContact);
    if (ex.movement != null)    setMovement(ex.movement);
    if (ex.screen != null)      setScreen(ex.screen);
    if (ex.sleepQ != null)      setSleepQ(ex.sleepQ);
    if (ex.sleepH != null)      setSleepH(ex.sleepH);
    if (ex.weekRate != null)    setWeekRate(ex.weekRate);
    if (ex.weekWish != null)    setWeekWish(ex.weekWish);
    setSaved(true);
  }, []);

  // — derived helpers —
  const handleEmotion = (id) => { setEmotion(id); setSaved(false); };

  return (
    <div style={{
      marginTop: 22, position: 'relative', overflow: 'hidden',
      borderRadius: 26,
      background: `linear-gradient(160deg, ${activeColor}26 0%, rgba(124,107,217,0.18) 55%, rgba(20,14,50,0.55) 100%)`,
      border: `1px solid ${activeColor}30`,
      boxShadow: '0 20px 40px -16px rgba(20,14,50,0.55)',
      transition: 'background 0.5s, border-color 0.5s',
    }}>
      <div style={{
        position: 'absolute', right: -40, top: -40, width: 220, height: 220, borderRadius: '50%',
        background: `radial-gradient(circle, ${activeColor}48 0%, transparent 65%)`,
        filter: 'blur(16px)', pointerEvents: 'none', transition: 'background 0.5s',
      }}/>

      <div style={{ position: 'relative', padding: '20px 20px 22px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="eyebrow" style={{ color: activeColor, letterSpacing: 0.6 }}>
              ежедневный чек-ин · {dayLabel}
            </div>
            <div className="serif" style={{
              fontSize: 22, lineHeight: 1.12, marginTop: 6, letterSpacing: '-0.01em',
              color: 'var(--on-night)', fontWeight: 500,
            }}>
              Как ты сейчас?
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--on-night-2)', marginTop: 6, lineHeight: 1.45 }}>
              45–90 секунд. Только шкалы — без оценок.
            </div>
          </div>
          <StreakBadge done={STREAK_DONE} skip={STREAK_SKIP} total={STREAK_TOTAL}/>
        </div>

        {/* Bad day badge */}
        {badDay && <BadDayBadge onUndo={() => { setBadDay(false); setSaved(false); }}/>}

        {!badDay && (
          <>
            {/* Q1 ENERGY */}
            <ScaleQ
              icon="⚡" label="ЭНЕРГИЯ СЕГОДНЯ"
              left="выжат" right="полон сил"
              value={energy} onChange={(v) => { setEnergy(v); setSaved(false); }}
              color="#F5A88E"/>

            {/* Q2 MOOD */}
            <ScaleQ
              icon="☁️" label="НАСТРОЕНИЕ"
              left="тяжело" right="легко"
              value={mood} onChange={(v) => { setMood(v); setSaved(false); }}
              color="#BFB2F0"/>

            {/* Q3 STRESS */}
            <ScaleQ
              icon="🌡️" label="СТРЕСС / НАПРЯЖЕНИЕ"
              left="спокойно" right="накрывает"
              value={stress} onChange={(v) => { setStress(v); setSaved(false); }}
              color="#E89BB0"
              inverted/>

            {/* Q4 DOMINANT EMOTION */}
            <div style={{ marginTop: 18 }}>
              <SectionLabel icon="●" label="ДОМИНИРУЮЩАЯ ЭМОЦИЯ" hint="одна"/>
              <div style={{
                marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
              }}>
                {CORE_EMOTIONS.map(em => (
                  <EmotionBtn key={em.id} em={em} active={emotion === em.id} onClick={() => handleEmotion(em.id)}/>
                ))}
              </div>
            </div>

            {/* Day-rotating extra */}
            <RotatingQuestion
              rotation={rotation}
              state={{ bodyTension, setBodyTension, drain, setDrain, fuel, setFuel,
                       selfContact, setSelfContact, movement, setMovement, screen, setScreen,
                       sleepQ, setSleepQ, sleepH, setSleepH, weekRate, setWeekRate, weekWish, setWeekWish }}
              color={activeColor}
              onChange={() => setSaved(false)}/>
          </>
        )}

        {/* Note */}
        <NoteSection
          noteMode={noteMode}
          setNoteMode={(m) => { setNoteMode(m); setSaved(false); }}
          noteText={noteText} setNoteText={setNoteText}
          color={activeColor}/>

        {/* Save row */}
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button onClick={handleSave} disabled={!badDay && !coreFilled} style={{
            flex: 1, padding: '14px 18px', borderRadius: 99,
            background: (!badDay && !coreFilled)
              ? 'rgba(242,238,255,0.06)'
              : saved
                ? 'rgba(156,221,183,0.30)'
                : 'linear-gradient(180deg, #FFF9E0 0%, #F4D58A 100%)',
            color: (!badDay && !coreFilled) ? 'var(--on-night-3)' : (saved ? '#9CDDB7' : '#2A1F5C'),
            border: (!badDay && !coreFilled) ? '1px solid rgba(242,238,255,0.08)' : 'none',
            cursor: (!badDay && !coreFilled) ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: (!badDay && !coreFilled) || saved ? 'none' : '0 8px 18px rgba(244,213,138,0.40)',
            transition: 'all 0.3s',
          }}>
            {saved
              ? <><IconCheckSmall size={13} color="#9CDDB7"/> записано</>
              : <>✓ Сохранить чек-ин</>}
          </button>
          {!badDay && (
            <button onClick={handleBadDay} title="Сегодня тяжёлый день" style={{
              padding: '14px 14px', borderRadius: 99,
              background: 'rgba(242,238,255,0.06)',
              border: '1px solid rgba(242,238,255,0.14)',
              color: 'var(--on-night-2)', cursor: 'pointer',
              fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500,
              whiteSpace: 'nowrap',
            }}>
              плохой день
            </button>
          )}
        </div>

        {/* Algorithm notice */}
        <div style={{
          marginTop: 14, padding: '12px 14px', borderRadius: 14,
          background: `linear-gradient(135deg, ${activeColor}1A 0%, rgba(8,5,22,0.45) 80%)`,
          border: `1px solid ${activeColor}28`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9, flexShrink: 0,
            background: `${activeColor}22`, border: `1px solid ${activeColor}45`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkle size={12} color={activeColor} spin={false}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--on-night)', fontWeight: 500, lineHeight: 1.4 }}>
              Алгоритм запоминает это состояние.
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--on-night-3)', marginTop: 2, lineHeight: 1.4 }}>
              В воскресенье — короткий онбординг и программа на следующую неделю.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────

export function StreakBadge({ done, skip, total }) {
  return (
    <div style={{
      flexShrink: 0, padding: '6px 10px', borderRadius: 14,
      background: 'rgba(244,213,138,0.12)',
      border: '1px solid rgba(244,213,138,0.25)',
      textAlign: 'center', minWidth: 76,
    }}>
      <div style={{
        fontSize: 8.5, color: '#FFE7A8', letterSpacing: 0.5, fontWeight: 700, textTransform: 'uppercase',
      }}>серия</div>
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 2, marginTop: 5,
      }}>
        {Array.from({ length: total }).map((_, i) => {
          const isDone = i < done;
          const isSkip = i >= done && i < done + skip;
          return (
            <span key={i} style={{
              width: 6, height: 6, borderRadius: 3,
              background: isDone ? '#F4D58A' : (isSkip ? 'rgba(244,213,138,0.30)' : 'rgba(242,238,255,0.15)'),
              boxShadow: isDone ? '0 0 4px #F4D58A88' : 'none',
            }}/>
          );
        })}
      </div>
      <div style={{
        fontSize: 9.5, color: 'var(--on-night-2)', marginTop: 5,
        fontVariantNumeric: 'tabular-nums', letterSpacing: 0.2,
      }}>
        {done} + {skip} свободный
      </div>
    </div>
  );
}

export function BadDayBadge({ onUndo }) {
  return (
    <div style={{
      marginTop: 14, padding: '14px 16px', borderRadius: 16,
      background: 'rgba(156,169,224,0.14)',
      border: '1px solid rgba(156,169,224,0.30)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 11, flexShrink: 0,
        background: 'rgba(156,169,224,0.30)', border: '1px solid rgba(156,169,224,0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
      }}>💧</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: 'var(--on-night)', fontWeight: 500 }}>
          Отмечено: тяжёлый день
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--on-night-3)', marginTop: 2, lineHeight: 1.4 }}>
          Серия сохранится. Алгоритм увидит это и предложит мягкое.
        </div>
      </div>
      <button onClick={onUndo} style={{
        padding: '4px 10px', borderRadius: 99, fontSize: 11,
        background: 'transparent', border: 'none', color: 'var(--on-night-3)',
        cursor: 'pointer', fontFamily: 'var(--sans)',
      }}>отменить</button>
    </div>
  );
}

export function SectionLabel({ icon, label, hint }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ fontSize: 10, color: 'var(--on-night-3)' }}>{icon}</span>
      <span className="eyebrow" style={{ letterSpacing: 0.6 }}>{label}</span>
      {hint && (
        <span style={{ fontSize: 9.5, color: 'var(--on-night-3)', textTransform: 'lowercase', letterSpacing: 0.1, fontWeight: 500 }}>
          · {hint}
        </span>
      )}
    </div>
  );
}

export function ScaleQ({ icon, label, left, right, value, onChange, color, inverted }) {
  return (
    <div style={{ marginTop: 18 }}>
      <SectionLabel icon={icon} label={label}/>
      <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => {
          const isOn = value === n;
          const isFill = value != null && n <= value;
          return (
            <button key={n} onClick={() => onChange(n)} style={{
              flex: 1, height: 38, borderRadius: 12, cursor: 'pointer', padding: 0,
              background: isOn
                ? `linear-gradient(180deg, ${color}, ${color}CC)`
                : isFill
                  ? `${color}38`
                  : 'rgba(8,5,22,0.45)',
              border: `1px solid ${isOn ? 'transparent' : isFill ? color + '55' : 'rgba(242,238,255,0.10)'}`,
              color: isOn ? '#15113A' : 'var(--on-night-2)',
              fontFamily: 'var(--sans)', fontSize: 12, fontWeight: isOn ? 700 : 500,
              boxShadow: isOn ? `0 4px 10px ${color}55` : 'none',
              transition: 'all 0.2s',
            }}>{n}</button>
          );
        })}
      </div>
      <div style={{
        marginTop: 5, display: 'flex', justifyContent: 'space-between',
        fontSize: 9.5, color: 'var(--on-night-3)', letterSpacing: 0.3, fontWeight: 600, textTransform: 'lowercase',
      }}>
        <span>1 · {left}</span><span>5 · {right}</span>
      </div>
    </div>
  );
}

export function EmotionBtn({ em, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 12px', borderRadius: 14,
      background: active
        ? `linear-gradient(180deg, ${em.color}, ${em.color}CC)`
        : 'rgba(8,5,22,0.45)',
      border: `1px solid ${active ? 'transparent' : em.color + '40'}`,
      color: active ? '#15113A' : 'var(--on-night)',
      cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12.5,
      fontWeight: active ? 600 : 500, letterSpacing: 0.1,
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: active ? `0 4px 12px ${em.color}55` : 'none',
      transition: 'all 0.2s',
    }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{em.icon}</span>
      <span style={{ flex: 1, textAlign: 'left' }}>{em.label}</span>
    </button>
  );
}

// ─── Rotating day-specific question ──────────────────────
export function RotatingQuestion({ rotation, state, color, onChange }) {
  if (!rotation) return null;

  if (rotation.kind === 'multi') {
    return (
      <div style={{ marginTop: 18 }}>
        <SectionLabel icon="●" label={rotation.title} hint="можно несколько"/>
        <ChipMultiSelect
          options={rotation.options}
          value={state.bodyTension}
          onChange={(v) => { state.setBodyTension(v); onChange(); }}
          color={color}/>
      </div>
    );
  }
  if (rotation.kind === 'single') {
    const isDrain = rotation.id === 'drain';
    const val = isDrain ? state.drain : state.fuel;
    const setVal = isDrain ? state.setDrain : state.setFuel;
    return (
      <div style={{ marginTop: 18 }}>
        <SectionLabel icon="●" label={rotation.title}/>
        <ChipSingleSelect
          options={rotation.options}
          value={val}
          onChange={(v) => { setVal(v); onChange(); }}
          color={color}/>
      </div>
    );
  }
  if (rotation.kind === 'scale5') {
    return (
      <ScaleQ
        icon="●" label={rotation.title}
        left={rotation.left} right={rotation.right}
        value={state.selfContact} onChange={(v) => { state.setSelfContact(v); onChange(); }}
        color={color}/>
    );
  }
  if (rotation.kind === 'double') {
    return (
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <SectionLabel icon="●" label={rotation.title1}/>
          <ChipSingleSelect
            options={rotation.options1}
            value={state.movement}
            onChange={(v) => { state.setMovement(v); onChange(); }}
            color={color}/>
        </div>
        <div>
          <SectionLabel icon="●" label={rotation.title2}/>
          <ChipSingleSelect
            options={rotation.options2}
            value={state.screen}
            onChange={(v) => { state.setScreen(v); onChange(); }}
            color={color}/>
        </div>
      </div>
    );
  }
  if (rotation.kind === 'sleep') {
    return (
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ScaleQ
          icon="●" label="КАЧЕСТВО СНА"
          left="плохо" right="отлично"
          value={state.sleepQ} onChange={(v) => { state.setSleepQ(v); onChange(); }}
          color={color}/>
        <div>
          <SectionLabel icon="●" label="ЧАСОВ СНА"/>
          <ChipSingleSelect
            options={['<5','5–6','6–7','7–8','8+']}
            value={state.sleepH}
            onChange={(v) => { state.setSleepH(v); onChange(); }}
            color={color}/>
        </div>
      </div>
    );
  }
  if (rotation.kind === 'weekclose') {
    return (
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ScaleQ
          icon="●" label="НЕДЕЛЯ БЫЛА"
          left="тяжёлой" right="хорошей"
          value={state.weekRate} onChange={(v) => { state.setWeekRate(v); onChange(); }}
          color={color}/>
        <div>
          <SectionLabel icon="●" label="ЧТО ХОЧЕТСЯ ИЗМЕНИТЬ"/>
          <ChipSingleSelect
            options={['Меньше стресса','Больше энергии','Лучше спать','Больше радости','Разобраться с эмоциями']}
            value={state.weekWish}
            onChange={(v) => { state.setWeekWish(v); onChange(); }}
            color={color}/>
        </div>
      </div>
    );
  }
  return null;
}

export function ChipSingleSelect({ options, value, onChange, color }) {
  return (
    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {options.map(o => {
        const on = value === o;
        return (
          <button key={o} onClick={() => onChange(on ? null : o)} style={{
            padding: '7px 12px', borderRadius: 99,
            background: on
              ? `linear-gradient(180deg, ${color}, ${color}CC)`
              : 'rgba(8,5,22,0.45)',
            border: `1px solid ${on ? 'transparent' : 'rgba(242,238,255,0.12)'}`,
            color: on ? '#15113A' : 'var(--on-night-2)',
            fontFamily: 'var(--sans)', fontSize: 12,
            fontWeight: on ? 600 : 500, letterSpacing: 0.1, cursor: 'pointer',
            boxShadow: on ? `0 3px 8px ${color}55` : 'none',
            transition: 'all 0.2s',
          }}>{o}</button>
        );
      })}
    </div>
  );
}

export function ChipMultiSelect({ options, value, onChange, color }) {
  const toggle = (o) => {
    onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o]);
  };
  return (
    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {options.map(o => {
        const on = value.includes(o);
        return (
          <button key={o} onClick={() => toggle(o)} style={{
            padding: '7px 12px', borderRadius: 99,
            background: on
              ? `${color}38`
              : 'rgba(8,5,22,0.45)',
            border: `1px solid ${on ? color + 'AA' : 'rgba(242,238,255,0.12)'}`,
            color: on ? '#FFF9E0' : 'var(--on-night-2)',
            fontFamily: 'var(--sans)', fontSize: 12,
            fontWeight: on ? 600 : 500, letterSpacing: 0.1, cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            {on && <IconCheckSmall size={10} color="#FFF9E0"/>}
            {o}
          </button>
        );
      })}
    </div>
  );
}


// ═════════ Optional note section ═════════
export function NoteSection({ noteMode, setNoteMode, noteText, setNoteText, color }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div className="eyebrow" style={{ letterSpacing: 0.6, marginBottom: 8 }}>
        оставить запись · <span style={{ color: 'var(--on-night-3)', textTransform: 'none', letterSpacing: 0.2, fontWeight: 500 }}>по желанию</span>
      </div>
      {noteMode === null && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <NoteToggleBtn onClick={() => setNoteMode('text')}  icon={<IconEdit size={13} color="var(--on-night)"/>} label="Написать"/>
          <NoteToggleBtn onClick={() => setNoteMode('voice')} icon={<IconMic size={13} color="var(--on-night)"/>}  label="Голосом"/>
        </div>
      )}
      {noteMode === 'text' && (
        <div style={{ position: 'relative' }}>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Что важно зафиксировать? Деталь, мысль или разговор…"
            style={{
              width: '100%', minHeight: 88, padding: '12px 14px', borderRadius: 14,
              background: 'rgba(8,5,22,0.45)', border: `1px solid ${color}30`,
              color: 'var(--on-night)', fontFamily: 'var(--sans)', fontSize: 13,
              lineHeight: 1.5, resize: 'vertical', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setNoteMode(null)} style={{
              padding: '4px 10px', borderRadius: 99, fontSize: 11,
              background: 'transparent', border: 'none', color: 'var(--on-night-3)',
              cursor: 'pointer', fontFamily: 'var(--sans)',
            }}>отмена</button>
            <span style={{ fontSize: 10, color: 'var(--on-night-3)', fontVariantNumeric: 'tabular-nums' }}>
              {noteText.length}/500
            </span>
          </div>
        </div>
      )}
      {noteMode === 'voice' && (
        <VoiceRecorder color={color} onCancel={() => setNoteMode(null)}/>
      )}
    </div>
  );
}

export function NoteToggleBtn({ onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      padding: '12px 14px', borderRadius: 14,
      background: 'rgba(242,238,255,0.06)',
      border: '1px solid rgba(242,238,255,0.14)',
      cursor: 'pointer', color: 'var(--on-night)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
    }}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function VoiceRecorder({ color, onCancel }) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    const i = setInterval(() => setT(s => s + 1), 1000);
    return () => clearInterval(i);
  }, []);
  const mm = String(Math.floor(t / 60)).padStart(2, '0');
  const ss = String(t % 60).padStart(2, '0');
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 14,
      background: `linear-gradient(135deg, ${color}22 0%, rgba(8,5,22,0.50) 80%)`,
      border: `1px solid ${color}38`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 21, flexShrink: 0,
          background: `radial-gradient(circle, ${color} 0%, ${color}AA 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 0 4px ${color}25, 0 0 16px ${color}88`,
          animation: 'pulse-soft 1.6s ease-in-out infinite',
        }}>
          <IconMic size={16} color="#15113A"/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--on-night)', fontWeight: 600 }}>
            Запись…
          </div>
          <div style={{
            marginTop: 6, height: 16, display: 'flex', alignItems: 'flex-end', gap: 2,
          }}>
            {Array.from({ length: 24 }).map((_, i) => {
              const h = 4 + Math.abs(Math.sin((t + i) * 0.7)) * 12;
              return <span key={i} style={{ flex: 1, height: h, background: color, borderRadius: 1, opacity: 0.7 }}/>;
            })}
          </div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--on-night-2)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
          {mm}:{ss}
        </span>
      </div>
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onCancel} style={{
          padding: '4px 10px', borderRadius: 99, fontSize: 11,
          background: 'transparent', border: 'none', color: 'var(--on-night-3)',
          cursor: 'pointer', fontFamily: 'var(--sans)',
        }}>отмена</button>
        <button style={{
          padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
          background: `${color}25`, border: `1px solid ${color}45`,
          cursor: 'pointer', color, fontFamily: 'var(--sans)',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 1, background: color }}/>
          стоп
        </button>
      </div>
    </div>
  );
}

// ─── AI insight ─────────────────────────────────────────
export function AIInsight() {
  return (
    <div style={{
      marginTop: 14, padding: '16px 18px',
      borderRadius: 22, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(155deg, rgba(244,213,138,0.20) 0%, rgba(232,155,176,0.10) 45%, rgba(20,14,50,0.55) 100%)',
      border: '1px solid rgba(244,213,138,0.20)',
    }}>
      <div style={{ position: 'absolute', right: -10, top: -10, opacity: 0.55, pointerEvents: 'none' }}>
        <SparkleDeco/>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 99,
          background: 'rgba(244,213,138,0.16)',
          border: '1px solid rgba(244,213,138,0.28)',
          color: '#FFE7A8',
          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>
          <Sparkle size={9} color="#FFE7A8" spin={false}/> я слышу
        </div>

        <div className="serif" style={{
          fontSize: 18, lineHeight: 1.3, marginTop: 12, letterSpacing: '-0.005em',
          color: 'var(--on-night)', maxWidth: '88%', fontWeight: 500,
        }}>
          За эту неделю слова <span className="serif-it" style={{ color: '#FFE7A8' }}>«устала»</span> и <span className="serif-it" style={{ color: '#FFE7A8' }}>«должна»</span> появились 12 раз. Большинство записей — после 21:00.
        </div>

        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', gap: 10,
          flexWrap: 'wrap',
        }}>
          <button style={{
            padding: '8px 14px', borderRadius: 99,
            background: 'rgba(255,249,224,0.92)', color: '#2A1F5C',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <IconPlay size={10} color="#2A1F5C"/> открыть «Достаточно»
          </button>
          <span style={{ fontSize: 11, color: 'var(--on-night-3)' }}>
            10 минут · самосострадание
          </span>
        </div>
      </div>
    </div>
  );
}

export function SparkleDeco() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[[60,30],[90,60],[34,72],[78,90],[44,40]].map(([x,y], i) => (
        <path key={i}
          d={`M${x} ${y} l3 -6 l-6 -3 l6 -3 l3 -6 l3 6 l6 3 l-6 3 z`}
          fill="#F4D58A" opacity={0.6 - i * 0.08}/>
      ))}
    </svg>
  );
}

// ─── State of the week — 3 metrics overlay ───────────────
export function StateWeekCard() {
  return (
    <div style={{
      padding: '18px 16px 14px', borderRadius: 22,
      background: 'linear-gradient(160deg, rgba(124,107,217,0.18) 0%, rgba(20,14,50,0.55) 70%)',
      border: '1px solid rgba(191,178,240,0.18)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* metric pills row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
      }}>
        <MetricPill label="Настроение" delta={+1.7} color="#E89BB0" value="5.1"/>
        <MetricPill label="Стресс"     delta={-1.2} color="#BFB2F0" value="5.7" inverted/>
        <MetricPill label="Энергия"    delta={+0.6} color="#F5A88E" value="4.7"/>
      </div>

      {/* overlay chart */}
      <div style={{ marginTop: 16, position: 'relative', height: 110 }}>
        <ThreeLineChart width={320} height={110}
          series={[
            { data: D_MOOD,   color: '#E89BB0', label: 'настроение' },
            { data: D_STRESS, color: '#BFB2F0', label: 'стресс' },
            { data: D_ENERGY, color: '#F5A88E', label: 'энергия' },
          ]}
          labels={D_DAYS}
          highlightIdx={4}
        />
      </div>

      {/* legend */}
      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        <LegendDot color="#E89BB0" label="настроение"/>
        <LegendDot color="#BFB2F0" label="стресс"/>
        <LegendDot color="#F5A88E" label="энергия"/>
      </div>
    </div>
  );
}

export function MetricPill({ label, value, delta, color, inverted }) {
  const positive = inverted ? delta < 0 : delta > 0;
  const arrow = delta === 0 ? '·' : (delta > 0 ? '↗' : '↘');
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 14,
      background: 'rgba(8,5,22,0.40)',
      border: `1px solid ${color}28`,
    }}>
      <div style={{
        fontSize: 9.5, color, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600,
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
        <span className="serif" style={{ fontSize: 22, letterSpacing: '-0.01em', color: 'var(--on-night)', fontWeight: 500 }}>
          {value}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: delta === 0 ? 'var(--on-night-3)' : (positive ? '#9CDDB7' : '#E89BB0'),
        }}>
          {arrow} {Math.abs(delta).toFixed(1)}
        </span>
      </div>
    </div>
  );
}

export function LegendDot({ color, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 10, color: 'var(--on-night-2)',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 4, background: color }}/>
      {label}
    </span>
  );
}

export function ThreeLineChart({ series, labels, width, height, highlightIdx }) {
  const max = 10, min = 0, range = max - min;
  const padL = 4, padR = 4, padT = 8, padB = 18;
  const W = width - padL - padR;
  const H = height - padT - padB;
  const n = series[0].data.length;
  const dx = W / (n - 1);

  const pathFor = (data) => data.map((v, i) =>
    `${i === 0 ? 'M' : 'L'} ${padL + i * dx} ${padT + H - (v - min) / range * H}`
  ).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      {/* gridlines */}
      {[0, 0.33, 0.66, 1].map((p, i) => (
        <line key={i} x1={padL} y1={padT + H * p} x2={padL + W} y2={padT + H * p}
          stroke="rgba(242,238,255,0.06)" strokeWidth="1"/>
      ))}
      {/* highlight today */}
      {highlightIdx != null && (
        <line x1={padL + highlightIdx * dx} y1={padT - 2} x2={padL + highlightIdx * dx} y2={padT + H + 2}
          stroke="rgba(255,249,224,0.20)" strokeWidth="1" strokeDasharray="2 3"/>
      )}
      {/* lines */}
      {series.map((s, si) => (
        <g key={si}>
          <path d={pathFor(s.data)} stroke={s.color} strokeWidth="2"
            fill="none" strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 6px ${s.color}66)` }}/>
          {s.data.map((v, i) => (
            <circle key={i}
              cx={padL + i * dx}
              cy={padT + H - (v - min) / range * H}
              r={i === highlightIdx ? 4 : 2.5}
              fill={s.color}
              stroke={i === highlightIdx ? '#FFF9E0' : 'transparent'}
              strokeWidth={i === highlightIdx ? 1.5 : 0}/>
          ))}
        </g>
      ))}
      {/* labels */}
      {labels.map((l, i) => (
        <text key={i}
          x={padL + i * dx}
          y={height - 4}
          fontSize="9"
          fill={i === highlightIdx ? '#FFF9E0' : 'rgba(242,238,255,0.55)'}
          fontWeight={i === highlightIdx ? '600' : '500'}
          textAnchor="middle"
          fontFamily="var(--sans)"
          letterSpacing="0.4">{l}</text>
      ))}
    </svg>
  );
}

// ─── Emotions breakdown — donut + list ──────────────────
export function EmotionsBreakdownCard() {
  const total = EMOTIONS_THIS_WEEK.reduce((s, e) => s + e.pct, 0);
  return (
    <div style={{
      padding: '18px 16px', borderRadius: 22,
      background: 'linear-gradient(160deg, rgba(232,155,176,0.15) 0%, rgba(20,14,50,0.55) 70%)',
      border: '1px solid rgba(232,155,176,0.18)',
    }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Donut data={EMOTIONS_THIS_WEEK} size={120}/>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {EMOTIONS_THIS_WEEK.slice(0, 4).map(em => (
            <div key={em.l} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 11.5, color: 'var(--on-night-2)',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: em.c, flexShrink: 0 }}/>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{em.l}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--on-night)', fontWeight: 500 }}>
                {em.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <button style={{
        marginTop: 14, width: '100%', padding: '10px 14px', borderRadius: 12,
        background: 'rgba(232,155,176,0.12)',
        border: '1px solid rgba(232,155,176,0.22)',
        color: '#F0B6C6', cursor: 'pointer',
        fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        Открыть на карте эмоций <IconArrow size={11} color="#F0B6C6"/>
      </button>
    </div>
  );
}

export function Donut({ data, size = 120 }) {
  const r = size / 2 - 4;
  const cx = size / 2, cy = size / 2;
  const total = data.reduce((s, d) => s + d.pct, 0);
  let cum = 0;
  const C = 2 * Math.PI * r;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(242,238,255,0.06)" strokeWidth="8"/>
      {data.map((d, i) => {
        const frac = d.pct / total;
        const dash = frac * C;
        const offset = -cum * C;
        cum += frac;
        return (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={d.c} strokeWidth="8"
            strokeDasharray={`${dash} ${C - dash}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"/>
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fill="rgba(242,238,255,0.55)" fontFamily="var(--sans)" letterSpacing="0.4">эмоций</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontFamily="var(--serif)" fontSize="22" fill="#FFF9E0" letterSpacing="-0.01em">{data.length - 1}</text>
    </svg>
  );
}

// ─── Patterns cards ─────────────────────────────────────
export function PatternsCards() {
  const patterns = [
    { icon: '📉', label: 'СРЕДА', text: 'По средам настроение в среднем на 1.4 ниже остальных дней. Паттерн или совпадение?', cta: 'Подумать', accent: '#BFB2F0' },
    { icon: '🌅', label: 'ПРАКТИКИ', text: 'После утренних практик настроение в среднем +1.7. Это работает.', cta: 'Открыть практику', accent: '#F5A88E' },
    { icon: '✍️', label: 'СЛОВО',   text: 'Слово «должна» — 12 раз за неделю. Если хотите, есть практика про самокритику.', cta: 'Открыть «Достаточно»', accent: '#F0B6C6' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {patterns.map((p, i) => (
        <button key={i} style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          padding: '14px 16px', borderRadius: 18,
          background: `linear-gradient(155deg, ${p.accent}22 0%, rgba(8,5,22,0.45) 70%)`,
          border: `1px solid ${p.accent}28`,
          color: 'var(--on-night)',
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background: `${p.accent}24`, border: `1px solid ${p.accent}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>{p.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 9.5, color: p.accent, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700,
            }}>{p.label}</div>
            <div style={{ fontSize: 12.5, color: 'var(--on-night)', marginTop: 4, lineHeight: 1.45 }}>
              {p.text}
            </div>
            <div style={{
              marginTop: 8, fontSize: 11, color: p.accent, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              {p.cta} <IconArrow size={10} color={p.accent}/>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Recent entries timeline ────────────────────────────
export const EXTENDED_DIARY = [
  ...SAMPLE_DIARY.map(d => ({ ...d, sentiment: d.tag === 'сон' ? 'усталость' : d.tag === 'работа' ? 'тревога' : 'нежность' })),
  { id: 'dx3', when: 'ВТ · 21:40', emoji: '😌', tag: 'вечер', text: 'Сделала практику. Стало легче — впервые за неделю.', sentiment: 'благодарность' },
  { id: 'dx4', when: 'ПН · 19:12', emoji: '😤', tag: 'злость',  text: 'Разговор с мамой выбил. Опять одно и то же.', sentiment: 'обида' },
];

export const SENTIMENT_COLOR = {
  усталость:   '#C49B97',
  тревога:     '#9CB2F0',
  обида:       '#E89BB0',
  нежность:    '#D9B4DC',
  благодарность:'#F4D58A',
};

// Map a stored diary entry { id, text, tags, emotion, at } → timeline card shape
function mapSavedDiary(e) {
  const d = new Date(e.at);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const SHORT_DOW = ['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ'];
  const dow = SHORT_DOW[d.getDay()] || '';
  const when = dow ? `${dow} · ${hh}:${mm}` : `${hh}:${mm}`;
  const tag = (e.tags && e.tags.length) ? e.tags[0] : '';
  return {
    id: e.id, when, emoji: '📝', tag, text: e.text,
    sentiment: e.emotion || 'нежность',
  };
}

export function EntriesTimeline() {
  const [entries, setEntries] = React.useState([]);
  React.useEffect(() => { setEntries(getDiary()); }, []);

  const items = [...entries.map(mapSavedDiary), ...EXTENDED_DIARY];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map(d => {
        const c = SENTIMENT_COLOR[d.sentiment] || '#BFB2F0';
        return (
          <div key={d.id} style={{
            padding: '14px 14px', borderRadius: 18,
            background: 'rgba(242,238,255,0.04)',
            border: '1px solid rgba(242,238,255,0.10)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* sentiment accent stripe */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
              background: c,
              boxShadow: `0 0 12px ${c}55`,
            }}/>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingLeft: 6 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: `${c}22`, border: `1px solid ${c}38`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>{d.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                  fontSize: 10, color: 'var(--on-night-3)', letterSpacing: 0.2,
                }}>
                  <span>{d.when}</span>
                  {d.tag && (
                    <span style={{
                      padding: '2px 8px', borderRadius: 99,
                      background: 'rgba(242,238,255,0.08)',
                      border: '1px solid rgba(242,238,255,0.12)',
                      fontSize: 10, color: 'var(--on-night-2)',
                    }}>#{d.tag}</span>
                  )}
                  <span style={{
                    padding: '2px 8px', borderRadius: 99,
                    background: `${c}1F`, border: `1px solid ${c}40`,
                    fontSize: 10, color: c, display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <Sparkle size={8} color={c} spin={false}/> {d.sentiment}
                  </span>
                </div>
                <div style={{
                  fontSize: 13, color: 'var(--on-night)', marginTop: 6, lineHeight: 1.55,
                }}>
                  {d.text}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Diary write modal ──────────────────────────────────
export function DiaryWriteModal({ onClose, onSave }) {
  const [text, setText] = React.useState('Сегодня снова трудный день. Кажется, что всё слишком — а на самом деле, может, я просто устала.');
  const [recognized, setRecognized] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setRecognized(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 90,
      background: 'rgba(20,14,50,0.55)', backdropFilter: 'blur(10px)',
      animation: 'fade-in 0.3s ease both',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div className="fade-up" style={{
        width: '100%', background: 'var(--cream)',
        borderRadius: '24px 24px 0 0', padding: '22px 22px 28px',
        maxHeight: '90%', overflowY: 'auto',
        color: 'var(--ink)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="eyebrow on-card">· Новая запись</div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 16,
            background: 'var(--sand)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconClose size={12} color="var(--ink)"/>
          </button>
        </div>

        <div className="serif" style={{ fontSize: 24, marginTop: 14, letterSpacing: '-0.01em' }}>
          О чём вы <span className="serif-it" style={{ color: 'var(--pink-400)' }}>сейчас?</span>
        </div>

        <textarea value={text} onChange={e => setText(e.target.value)}
          style={{
            marginTop: 14, width: '100%', minHeight: 140,
            padding: 16, borderRadius: 16,
            background: 'var(--cream-2)', border: '1px solid var(--hairline)',
            fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--ink)',
            outline: 'none', resize: 'none', lineHeight: 1.5,
          }}/>

        <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['работа', 'отношения', 'я сама', 'сон', 'тело'].map(t => (
            <button key={t} style={{
              padding: '7px 12px', borderRadius: 99,
              background: 'transparent', border: '1px solid var(--hairline-2)',
              fontSize: 11, color: 'var(--text-2)', cursor: 'pointer',
              fontFamily: 'var(--sans)',
            }}>{t}</button>
          ))}
        </div>

        {recognized && (
          <div className="fade-up" style={{
            marginTop: 16, padding: 16, borderRadius: 18,
            background: 'linear-gradient(135deg, #BFB2F033, #F4D58A22)',
            border: '1px solid var(--lav-100)',
          }}>
            <div className="eyebrow on-card" style={{ color: 'var(--lav-500)' }}>· я слышу здесь</div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'Усталость',  c: '#8C8268' },
                { label: 'Самокритика',c: '#5C4BC0' },
              ].map(em => (
                <div key={em.label} style={{
                  padding: '8px 14px', borderRadius: 12,
                  background: 'var(--cream-2)', border: `1px solid ${em.c}33`,
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: em.c }}/>
                  {em.label}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 10, lineHeight: 1.5 }}>
              Это нормально. Открыть карточку «Усталость»?
            </div>
          </div>
        )}

        <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
          <button style={{
            width: 48, height: 48, borderRadius: 24, flexShrink: 0,
            background: 'var(--cream-2)', border: '1px solid var(--hairline)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconMic size={16} color="var(--ink)"/>
          </button>
          <PrimaryButton variant="inkOnLight" size="md" onClick={() => {
            addDiary({ text, tags: [], emotion: null });
            if (onSave) onSave();
          }}>
            Сохранить
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

