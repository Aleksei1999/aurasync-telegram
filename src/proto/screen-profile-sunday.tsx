// @ts-nocheck
'use client';
import React from 'react';
import { IconSettings, IconShare, IconChevron, IconClose, IconCheckSmall, IconArrow } from './icons';
import { StarrySky, Particles, Icon3D, AreaChart, PrimaryButton, HeaderBar } from './primitives';
import { FoxAvatar, MeditatingFox } from './mascot';
import { SAMPLE_INSIGHTS, ACHIEVEMENTS } from './data';
import { useStars } from './stars';
import { getState, setState } from '@/lib/store';

// AuraSync — Profile + Sunday Checkup Report

// StatCell — small stat tile used in the weekly report grid
// (referenced in the prototype's WeeklyReport but never defined there)
export function StatCell({ label, value, hint, gradient = 'lavender', emoji }) {
  return (
    <div className="card" style={{ padding: 14, borderRadius: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon3D size={40} gradient={gradient} emoji={emoji}/>
      <div style={{ minWidth: 0 }}>
        <div className="serif" style={{ fontSize: 24, color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-soft)', marginTop: 3 }}>{label}</div>
        <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{hint}</div>
      </div>
    </div>
  );
}

export function ProfileScreen({ user, onReplayOnboarding, onAwardDemo }) {
  const { stars, award } = (typeof useStars === 'function') ? useStars() : { stars: 1365, award: () => {} };
  const [shopOpen, setShopOpen] = React.useState(false);

  // Level system
  const LEVELS = [
    { id: 'l1', label: 'Знакомая',       min: 0,    icon: '🌱' },
    { id: 'l2', label: 'Наблюдательница', min: 500,  icon: '🪞' },
    { id: 'l3', label: 'Чувствующая',    min: 1500, icon: '💗' },
    { id: 'l4', label: 'Осознающая',     min: 3000, icon: '✨' },
    { id: 'l5', label: 'Хранительница',  min: 6000, icon: '🌙' },
  ];
  const cur = LEVELS.findLast(l => stars >= l.min) || LEVELS[0];
  const next = LEVELS[Math.min(LEVELS.length - 1, LEVELS.indexOf(cur) + 1)];
  const pct = next === cur ? 100 : Math.min(100, ((stars - cur.min) / (next.min - cur.min)) * 100);

  // Ways to earn stars
  const SOURCES = [
    { icon: '✓',  label: 'Ежедневный чек-ин',     value: 10, sub: 'каждый день, минута' },
    { icon: '🌅', label: 'Утренняя практика',     value: 8,  sub: '5–10 минут' },
    { icon: '🌙', label: 'Вечерняя практика',     value: 12, sub: '10–14 минут' },
    { icon: '✍️', label: 'Запись в дневник',      value: 15, sub: 'когда есть, что сказать' },
    { icon: '🌅', label: 'Воскресный онбординг',  value: 50, sub: 'раз в неделю' },
    { icon: '🔥', label: '7 дней серии',          value: 70, sub: 'бонус' },
    { icon: '⭐', label: '30 дней серии',         value: 300, sub: 'большой бонус' },
    { icon: '💌', label: 'Пригласить подругу',    value: 100, sub: 'ей — premium на 30 дней' },
  ];

  // Recent transactions
  const HISTORY = [
    { when: 'Сегодня · 14:32', label: 'Чек-ин',                    amount: 10 },
    { when: 'Сегодня · 08:12', label: 'Утренняя · Мягкая перезагрузка', amount: 8 },
    { when: 'Вчера · 21:40',  label: 'Альфа-погружение',           amount: 12 },
    { when: 'Вчера · 13:05',  label: 'Запись в дневник',           amount: 15 },
    { when: '2 дня · 22:18',  label: 'Дыхание 4-7-8',              amount: 11 },
    { when: '3 дня · 21:50',  label: 'Бонус: 3 дня серии',         amount: 30 },
  ];

  return (
    <div className="bg-night" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <StarrySky density={0.6} includeShootingStar={false}/>
      <Particles count={6} palette="lavender"/>

      <div className="fade-in stagger" style={{
        position: 'relative', height: '100%', overflowY: 'auto', overflowX: 'hidden',
        padding: '54px 20px 132px',
      }}>
        {/* HEADER */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 36, flexShrink: 0,
            background: 'linear-gradient(135deg, #BFB2F0, #F4D58A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 22px rgba(124,107,217,0.40), inset 0 2px 8px rgba(255,255,255,0.40)',
            padding: 0,
          }}>
            <FoxAvatar size={64}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="eyebrow" style={{ letterSpacing: 0.6 }}>· профиль</div>
            <div className="serif" style={{
              fontSize: 26, lineHeight: 1.05, marginTop: 4, letterSpacing: '-0.01em',
              color: 'var(--on-night)', fontWeight: 500,
            }}>{user.name}</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6,
              padding: '4px 10px', borderRadius: 99,
              background: 'rgba(191,178,240,0.18)',
              border: '1px solid rgba(191,178,240,0.30)',
              fontSize: 10, color: '#D3C8FF', fontWeight: 600,
              letterSpacing: 0.4, textTransform: 'uppercase',
            }}>
              <span>{cur.icon}</span> {cur.label}
            </div>
          </div>
          <button style={{
            width: 36, height: 36, borderRadius: 18, flexShrink: 0,
            background: 'rgba(242,238,255,0.08)',
            border: '1px solid rgba(242,238,255,0.14)',
            cursor: 'pointer', color: 'var(--on-night)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconSettings size={14} color="var(--on-night)"/>
          </button>
        </div>

        {/* STARS HERO */}
        <StarsHero stars={stars} onAwardDemo={onAwardDemo} onOpenShop={() => setShopOpen(true)}/>

        {/* LEVEL PROGRESS */}
        <div style={{
          marginTop: 14, padding: '16px 18px', borderRadius: 22,
          background: 'rgba(242,238,255,0.04)',
          border: '1px solid rgba(242,238,255,0.10)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 10,
          }}>
            <div className="eyebrow" style={{ letterSpacing: 0.6 }}>уровень</div>
            <span style={{ fontSize: 10.5, color: 'var(--on-night-3)', fontVariantNumeric: 'tabular-nums' }}>
              {stars} / {next.min}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>{cur.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                height: 8, borderRadius: 4,
                background: 'rgba(8,5,22,0.40)', overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  width: pct + '%', height: '100%',
                  background: 'linear-gradient(90deg, #BFB2F0, #F4D58A)',
                  borderRadius: 4,
                  boxShadow: '0 0 8px rgba(244,213,138,0.50)',
                  transition: 'width 0.6s cubic-bezier(0.2,0.7,0.2,1)',
                }}/>
              </div>
              <div style={{
                marginTop: 5, fontSize: 11, color: 'var(--on-night-2)', lineHeight: 1.3,
              }}>
                {cur.label} <span style={{ color: 'var(--on-night-3)' }}>→</span>{' '}
                <span className="serif-it" style={{ color: '#FFE7A8' }}>{next.label}</span>
              </div>
            </div>
            <span style={{ fontSize: 22, opacity: 0.4 }}>{next.icon}</span>
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        <ProfileSection title="Открытия" hint={'4 из ' + ACHIEVEMENTS.length} marginTop={20}/>
        <div style={{
          display: 'flex', gap: 10,
          marginLeft: -20, paddingLeft: 20, marginRight: -20, paddingRight: 20,
          overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4,
        }}>
          {ACHIEVEMENTS.map(a => (
            <AchievementCard key={a.id} a={a}/>
          ))}
        </div>

        {/* WAYS TO EARN */}
        <ProfileSection title="Как получать звёзды" eyebrow="накапливаются за заботу о себе" marginTop={22}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SOURCES.map((s, i) => <EarnRow key={i} s={s}/>)}
        </div>

        {/* HISTORY */}
        <ProfileSection title="Последние начисления" marginTop={22}/>
        <div style={{
          padding: '6px 14px', borderRadius: 18,
          background: 'rgba(242,238,255,0.04)',
          border: '1px solid rgba(242,238,255,0.10)',
        }}>
          {HISTORY.map((h, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0',
              borderBottom: i < HISTORY.length - 1 ? '1px solid rgba(242,238,255,0.06)' : 'none',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                background: 'rgba(244,213,138,0.14)',
                border: '1px solid rgba(244,213,138,0.30)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFE7A8', fontSize: 13,
              }}>★</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: 'var(--on-night)' }}>{h.label}</div>
                <div style={{ fontSize: 10, color: 'var(--on-night-3)', marginTop: 2 }}>{h.when}</div>
              </div>
              <span style={{
                fontSize: 13, color: '#FFE7A8', fontWeight: 700,
                fontVariantNumeric: 'tabular-nums', letterSpacing: 0.2,
              }}>+{h.amount}</span>
            </div>
          ))}
        </div>

        {/* INVITE FRIEND */}
        <div style={{
          marginTop: 22, padding: '18px 18px', borderRadius: 22, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(160deg, rgba(232,155,176,0.22) 0%, rgba(244,213,138,0.18) 100%)',
          border: '1px solid rgba(232,155,176,0.30)',
        }}>
          <div style={{
            position: 'absolute', right: -10, top: -10, width: 100, height: 100, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,155,176,0.40) 0%, transparent 65%)',
            filter: 'blur(8px)',
          }}/>
          <div style={{ position: 'relative' }}>
            <div className="eyebrow" style={{ color: '#F0B6C6', letterSpacing: 0.6 }}>пригласить подругу</div>
            <div className="serif" style={{
              fontSize: 19, lineHeight: 1.2, marginTop: 8, letterSpacing: '-0.005em',
              color: 'var(--on-night)', fontWeight: 500, maxWidth: '78%',
            }}>
              Поделитесь с тем,<br/>
              <span className="serif-it" style={{ color: '#F0B6C6' }}>кому это сейчас важно</span>.
            </div>
            <div style={{ fontSize: 11, color: 'var(--on-night-2)', marginTop: 8, lineHeight: 1.5, maxWidth: '85%' }}>
              Ей — 30 дней premium бесплатно. Вам — <span style={{ color: '#FFE7A8', fontWeight: 700 }}>★ 100</span>.
            </div>
            <button style={{
              marginTop: 14, padding: '10px 18px', borderRadius: 99,
              background: '#FFF9E0', color: '#2A1F5C', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: '0 6px 14px rgba(20,14,50,0.30)',
            }}>
              <IconShare size={11} color="#2A1F5C"/> Поделиться
            </button>
          </div>
        </div>

        {/* SUBSCRIPTION */}
        <div style={{
          marginTop: 14, padding: '14px 16px', borderRadius: 18,
          background: 'rgba(242,238,255,0.04)',
          border: '1px solid rgba(242,238,255,0.10)',
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background: 'rgba(244,213,138,0.18)',
            border: '1px solid rgba(244,213,138,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>⭐</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: 'var(--on-night)', fontWeight: 500 }}>Бесплатный план</div>
            <div style={{ fontSize: 10.5, color: 'var(--on-night-3)', marginTop: 2, lineHeight: 1.4 }}>
              7 дней триал premium — без автосписаний
            </div>
          </div>
          <IconChevron size={12} color="var(--on-night-3)"/>
        </div>

        {/* SETTINGS */}
        <div style={{
          marginTop: 14, padding: 0, borderRadius: 18, overflow: 'hidden',
          background: 'rgba(242,238,255,0.04)',
          border: '1px solid rgba(242,238,255,0.10)',
        }}>
          {[
            { icon: '🔔', label: 'Уведомления',     val: 'утро · 07:30' },
            { icon: '🔒', label: 'Приватность',     val: 'Face ID' },
            { icon: '🌙', label: 'Внешний вид',     val: 'ночная' },
            { icon: '🎙',  label: 'Голос диктора',  val: 'женский 1' },
            { icon: '✉️', label: 'Связь с командой' },
          ].map((s, i, arr) => (
            <div key={i} style={{
              padding: '12px 14px',
              borderTop: i ? '1px solid rgba(242,238,255,0.06)' : 'none',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            }}>
              <span style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                background: 'rgba(242,238,255,0.06)',
                border: '1px solid rgba(242,238,255,0.10)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>{s.icon}</span>
              <div style={{ flex: 1, fontSize: 12.5, color: 'var(--on-night)' }}>{s.label}</div>
              {s.val && <div style={{ fontSize: 11, color: 'var(--on-night-3)' }}>{s.val}</div>}
              <IconChevron size={12} color="var(--on-night-3)"/>
            </div>
          ))}
        </div>

        <button onClick={onReplayOnboarding} style={{
          marginTop: 16, width: '100%', padding: 12,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--on-night-3)', fontSize: 11.5, fontFamily: 'var(--sans)',
        }}>
          Пройти онбординг заново →
        </button>
      </div>

      {/* Star shop / prizes modal */}
      {shopOpen && <StarShop stars={stars} onClose={() => setShopOpen(false)} award={award}/>}
    </div>
  );
}

export function StarsHero({ stars, onAwardDemo }) {
  return (
    <div style={{
      marginTop: 18, padding: '20px 20px', borderRadius: 24,
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, rgba(244,213,138,0.32) 0%, rgba(232,155,176,0.18) 50%, rgba(20,14,50,0.55) 100%)',
      border: '1px solid rgba(244,213,138,0.35)',
      boxShadow: '0 16px 36px -16px rgba(20,14,50,0.55)',
    }}>
      {/* sparkle deco */}
      <div style={{ position: 'absolute', right: -12, top: -10, opacity: 0.55, pointerEvents: 'none' }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {[[60,30],[90,60],[34,72],[78,90],[44,40],[100,30]].map(([x,y], i) => (
            <path key={i}
              d={`M${x} ${y} l3 -6 l-6 -3 l6 -3 l3 -6 l3 6 l6 3 l-6 3 z`}
              fill="#FFE7A8" opacity={0.7 - i * 0.08}/>
          ))}
        </svg>
      </div>

      <div style={{ position: 'relative' }}>
        <div className="eyebrow" style={{ color: '#FFE7A8', letterSpacing: 0.6 }}>· баланс</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
          <span style={{ fontSize: 36, color: '#FFE7A8', textShadow: '0 0 18px rgba(244,213,138,0.7)' }}>★</span>
          <span className="serif" style={{
            fontSize: 48, lineHeight: 1, letterSpacing: '-0.03em',
            color: '#FFF9E0', fontWeight: 500,
            fontVariantNumeric: 'tabular-nums',
          }}>{stars.toLocaleString('ru-RU').replace(/,/g, ' ')}</span>
          <span className="serif-it" style={{
            fontSize: 14, color: '#FFE7A8', alignSelf: 'flex-end', marginBottom: 6,
          }}>звёзд.</span>
        </div>
        <div style={{
          marginTop: 6, fontSize: 12, color: 'var(--on-night-2)', maxWidth: 280, lineHeight: 1.5,
        }}>
          Копятся за каждый шаг, который вы делаете для себя. Не для отчёта — для памяти.
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <button onClick={onAwardDemo} style={{
            padding: '10px 16px', borderRadius: 99,
            background: '#FFF9E0', color: '#2A1F5C', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            boxShadow: '0 6px 14px rgba(244,213,138,0.40)',
          }}>
            ★ Получить звёзды
          </button>
          <button style={{
            padding: '10px 14px', borderRadius: 99,
            background: 'rgba(242,238,255,0.10)', color: 'var(--on-night)',
            border: '1px solid rgba(242,238,255,0.18)', cursor: 'pointer',
            fontFamily: 'var(--sans)', fontSize: 11.5, fontWeight: 500,
          }}>
            История
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfileSection({ title, eyebrow, hint, marginTop = 20 }) {
  return (
    <div style={{ marginTop, marginBottom: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        {eyebrow && <div className="eyebrow" style={{ letterSpacing: 0.6 }}>{eyebrow}</div>}
        <div className="serif" style={{
          fontSize: 20, lineHeight: 1.1, letterSpacing: '-0.01em',
          color: 'var(--on-night)', fontWeight: 500,
        }}>{title}</div>
      </div>
      {hint && <span style={{ fontSize: 10.5, color: 'var(--on-night-3)' }}>{hint}</span>}
    </div>
  );
}

export function AchievementCard({ a }) {
  const got = a.got;
  return (
    <div style={{
      flexShrink: 0, width: 128, padding: '14px 12px', borderRadius: 16,
      background: got
        ? 'linear-gradient(160deg, rgba(244,213,138,0.20) 0%, rgba(20,14,50,0.40) 100%)'
        : 'rgba(8,5,22,0.40)',
      border: got
        ? '1px solid rgba(244,213,138,0.35)'
        : '1px dashed rgba(242,238,255,0.12)',
      opacity: got ? 1 : 0.55,
      color: 'var(--on-night)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ fontSize: 28, lineHeight: 1, filter: got ? 'none' : 'grayscale(0.8)' }}>{a.icon}</div>
      <div className="serif" style={{
        fontSize: 13.5, marginTop: 10, letterSpacing: '-0.005em',
        color: 'var(--on-night)', fontWeight: 500,
      }}>{a.label}</div>
      {a.desc && (
        <div style={{
          fontSize: 9.5, color: 'var(--on-night-3)', marginTop: 4, lineHeight: 1.4,
        }}>{a.desc}</div>
      )}
      {got && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          fontSize: 10, color: '#FFE7A8',
        }}>★</div>
      )}
    </div>
  );
}

export function EarnRow({ s }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 14,
      background: 'rgba(242,238,255,0.04)',
      border: '1px solid rgba(242,238,255,0.10)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: 'rgba(244,213,138,0.14)',
        border: '1px solid rgba(244,213,138,0.28)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
      }}>{s.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--on-night)', lineHeight: 1.3 }}>{s.label}</div>
        <div style={{ fontSize: 10.5, color: 'var(--on-night-3)', marginTop: 2, lineHeight: 1.3 }}>{s.sub}</div>
      </div>
      <span style={{
        padding: '4px 10px', borderRadius: 99,
        background: 'rgba(244,213,138,0.16)',
        border: '1px solid rgba(244,213,138,0.30)',
        color: '#FFE7A8',
        fontSize: 11, fontWeight: 700, letterSpacing: 0.2,
        fontVariantNumeric: 'tabular-nums',
        flexShrink: 0,
      }}>★ {s.value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STAR SHOP — Призы и подарки
// ═══════════════════════════════════════════════════════════════

export const SHOP_CATEGORIES = [
  { id: 'app',     label: 'В приложении',  icon: '✨' },
  { id: 'partner', label: 'От партнёров',  icon: '🎁' },
  { id: 'care',    label: 'Забота о себе', icon: '🌿' },
  { id: 'social',  label: 'Поделиться',    icon: '💌' },
];

export const SHOP_ITEMS = {
  app: [
    { id: 's1', icon: '🌙', title: 'Premium · 7 дней',           desc: 'все материалы без лимитов',     price: 500, color: '#BFB2F0' },
    { id: 's2', icon: '✨', title: 'Premium · 30 дней',          desc: 'месяц без подписки',            price: 1800, color: '#BFB2F0', popular: true },
    { id: 's3', icon: '🎧', title: 'Голос — мужской диктор',     desc: 'разблокировать на месяц',       price: 200, color: '#9CB2F0' },
    { id: 's4', icon: '🌌', title: 'Тема «Млечный путь»',        desc: 'визуальная тема для приложения',price: 300, color: '#9CA9E0' },
    { id: 's5', icon: '🪞', title: 'Карта эмоций · расширенная', desc: '6 месяцев истории сразу',       price: 250, color: '#E89BB0' },
    { id: 's6', icon: '🎯', title: 'Курс «Достаточно»',          desc: '14 дней про самокритику',       price: 600, color: '#F0B6C6' },
  ],
  partner: [
    { id: 'p1', icon: '☕', title: 'Кофе · −20%',                desc: 'сеть Surf · промокод на сегодня',  price: 250, color: '#B89967', partner: 'Surf Coffee' },
    { id: 'p2', icon: '📚', title: 'Книга в Bookmate',          desc: 'любая бесплатно · 1 шт.',           price: 400, color: '#9CCEAF', partner: 'Bookmate' },
    { id: 'p3', icon: '🌸', title: 'Цветы · −500₽',              desc: 'на доставку Flowwow',              price: 350, color: '#E89BB0', partner: 'Flowwow' },
    { id: 'p4', icon: '🥗', title: 'Доставка еды · −300₽',       desc: 'первый заказ Yandex Eda',           price: 200, color: '#F4D58A', partner: 'Yandex Eda' },
    { id: 'p5', icon: '🧘‍♀️', title: 'Йога-класс · 1 урок',        desc: 'студия Yoga Class · оффлайн',       price: 500, color: '#9CCEAF', partner: 'Yoga Class' },
    { id: 'p6', icon: '💆‍♀️', title: 'Массаж · −15%',                desc: 'сеть SO Spa',                       price: 700, color: '#F0B6C6', partner: 'SO Spa' },
  ],
  care: [
    { id: 'c1', icon: '🍃', title: 'Витамин D 2000 ME',          desc: 'консультация и подбор · −20%',     price: 300, color: '#9CCEAF' },
    { id: 'c2', icon: '🌊', title: 'Магний B6 · курс',           desc: 'для нервной системы · −25%',       price: 350, color: '#9CB2F0' },
    { id: 'c3', icon: '🌿', title: 'Адаптогены · сбор',          desc: 'против хронической усталости',     price: 400, color: '#9CCEAF' },
    { id: 'c4', icon: '🍵', title: 'Чай-набор «Тишина»',         desc: 'липа, ромашка, мята · 30 дней',    price: 280, color: '#F4D58A' },
    { id: 'c5', icon: '💧', title: 'Бутылка-напоминание',        desc: 'красивая, 750мл · с гравировкой',  price: 500, color: '#9CA9E0' },
    { id: 'c6', icon: '🛏', title: 'Шёлковая маска для сна',     desc: 'тёплый персик',                    price: 400, color: '#F5A88E' },
  ],
  social: [
    { id: 'so1', icon: '💌', title: 'Пригласить подругу',         desc: 'ей — 30 дней premium · вам — ★100',price: 0,   color: '#F0B6C6', action: 'invite' },
    { id: 'so2', icon: '🎁', title: 'Подарить premium · 7 дней',  desc: 'любому контакту',                   price: 350, color: '#BFB2F0' },
    { id: 'so3', icon: '✉️', title: 'Открытка с поддержкой',      desc: 'красивая · на e-mail или Telegram', price: 80,  color: '#F4D58A' },
    { id: 'so4', icon: '🌟', title: 'Поделиться инсайтом',        desc: 'оформленная карточка с цитатой',   price: 0,   color: '#FFE7A8', action: 'share' },
  ],
};

export function StarShop({ stars, onClose, award }) {
  const [cat, setCat] = React.useState('app');
  const items = SHOP_ITEMS[cat] || [];
  const [bought, setBought] = React.useState(() => getState('shop_bought', {})); // id -> true

  const handleBuy = (item, e) => {
    if (item.action === 'invite' || item.action === 'share' || item.price === 0) {
      // Give a small gift in return
      if (window.__awardStars) window.__awardStars(20, e.currentTarget, 'спасибо');
      return;
    }
    if (stars < item.price || bought[item.id]) return;
    setBought(b => {
      const nextMap = { ...b, [item.id]: true };
      setState('shop_bought', nextMap);
      return nextMap;
    });
    if (window.__awardStars) {
      // Deduct by giving negative + show "обменено" — but simpler: just deduct via negative award
      window.__awardStars(-item.price, e.currentTarget, 'обмен');
    }
  };

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 92,
      background: 'rgba(8,5,22,0.70)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'fade-in 0.25s ease both',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxHeight: '92%', overflowY: 'auto',
        background: 'linear-gradient(180deg, #221A4C 0%, #110A36 100%)',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        border: '1px solid rgba(244,213,138,0.22)',
        borderBottom: 'none',
        padding: '12px 0 28px',
        animation: 'fade-up 0.3s cubic-bezier(.2,.7,.2,1) both',
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: 'rgba(242,238,255,0.20)',
          margin: '0 auto 16px',
        }}/>

        {/* Header */}
        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="eyebrow" style={{ color: '#FFE7A8', letterSpacing: 0.6 }}>магазин звёзд</div>
              <div className="serif" style={{
                fontSize: 24, lineHeight: 1.1, marginTop: 4, letterSpacing: '-0.01em',
                color: 'var(--on-night)', fontWeight: 500,
              }}>
                Призы и подарки
              </div>
            </div>
            <div style={{
              padding: '8px 14px', borderRadius: 99, flexShrink: 0,
              background: 'rgba(244,213,138,0.16)',
              border: '1px solid rgba(244,213,138,0.32)',
              color: '#FFE7A8',
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700,
              fontVariantNumeric: 'tabular-nums', letterSpacing: 0.2,
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{ fontSize: 12 }}>★</span>
              {stars.toLocaleString('ru-RU').replace(/,/g, ' ')}
            </div>
            <button onClick={onClose} aria-label="закрыть" style={{
              width: 32, height: 32, borderRadius: 16, flexShrink: 0,
              background: 'rgba(242,238,255,0.10)',
              border: '1px solid rgba(242,238,255,0.16)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--on-night)',
            }}>
              <IconClose size={12} color="var(--on-night)"/>
            </button>
          </div>
          <div style={{
            fontSize: 11.5, color: 'var(--on-night-2)', marginTop: 8, lineHeight: 1.5,
          }}>
            Награды за заботу о себе. Меняйте звёзды на материалы, забоду о теле или подарки близким.
          </div>
        </div>

        {/* Category tabs */}
        <div style={{
          padding: '0 20px 14px', display: 'flex', gap: 6,
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {SHOP_CATEGORIES.map(c => {
            const on = cat === c.id;
            return (
              <button key={c.id} onClick={() => setCat(c.id)} style={{
                flexShrink: 0, padding: '7px 13px', borderRadius: 99, cursor: 'pointer',
                background: on
                  ? 'linear-gradient(180deg, #9A87E5, #5C4BC0)'
                  : 'rgba(242,238,255,0.06)',
                border: 'none',
                color: on ? '#FFF9E0' : 'var(--on-night-2)',
                fontFamily: 'var(--sans)', fontSize: 11.5, fontWeight: on ? 600 : 500,
                display: 'inline-flex', alignItems: 'center', gap: 5,
                boxShadow: on ? '0 4px 10px rgba(92,75,192,0.40)' : 'none',
              }}>
                <span>{c.icon}</span> {c.label}
              </button>
            );
          })}
        </div>

        {/* Items */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => (
            <ShopItemCard
              key={item.id}
              item={item}
              stars={stars}
              bought={!!bought[item.id]}
              onBuy={(e) => handleBuy(item, e)}/>
          ))}
        </div>

        {/* Fine print */}
        <div style={{
          margin: '18px 20px 0', padding: '12px 14px', borderRadius: 14,
          background: 'rgba(8,5,22,0.50)',
          border: '1px solid rgba(242,238,255,0.08)',
          fontSize: 10.5, color: 'var(--on-night-3)', lineHeight: 1.5,
        }}>
          Звёзды — внутренняя валюта. Не подлежат обмену на деньги. Промокоды действуют 7 дней с момента активации. Партнёры могут меняться.
        </div>
      </div>
    </div>
  );
}

export function ShopItemCard({ item, stars, bought, onBuy }) {
  const canAfford = stars >= item.price || item.price === 0;
  const isFree = item.price === 0;
  return (
    <div style={{
      padding: '14px 14px', borderRadius: 18,
      background: `linear-gradient(155deg, ${item.color}1F 0%, rgba(8,5,22,0.50) 80%)`,
      border: `1px solid ${item.color}38`,
      position: 'relative', overflow: 'hidden',
    }}>
      {item.popular && (
        <span style={{
          position: 'absolute', top: 10, right: 10,
          padding: '2px 8px', borderRadius: 99,
          background: 'rgba(244,213,138,0.20)',
          border: '1px solid rgba(244,213,138,0.40)',
          color: '#FFE7A8',
          fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
        }}>хит</span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          width: 44, height: 44, borderRadius: 13, flexShrink: 0,
          background: `${item.color}28`,
          border: `1px solid ${item.color}55`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
          boxShadow: `0 0 14px ${item.color}30`,
        }}>{item.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="serif" style={{
            fontSize: 15, color: 'var(--on-night)', fontWeight: 500, letterSpacing: '-0.005em', lineHeight: 1.2,
          }}>{item.title}</div>
          <div style={{ fontSize: 10.5, color: 'var(--on-night-3)', marginTop: 3, lineHeight: 1.4 }}>
            {item.desc}{item.partner ? ` · ${item.partner}` : ''}
          </div>
        </div>
      </div>
      <div style={{
        marginTop: 12,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {!isFree && (
          <div style={{
            padding: '6px 11px', borderRadius: 99,
            background: 'rgba(244,213,138,0.16)',
            border: '1px solid rgba(244,213,138,0.30)',
            color: '#FFE7A8',
            fontSize: 12, fontWeight: 700, letterSpacing: 0.2,
            fontVariantNumeric: 'tabular-nums',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ fontSize: 11 }}>★</span>
            {item.price.toLocaleString('ru-RU').replace(/,/g, ' ')}
          </div>
        )}
        <button
          onClick={onBuy}
          disabled={bought || (!isFree && !canAfford)}
          style={{
            marginLeft: 'auto',
            padding: '8px 16px', borderRadius: 99,
            background: bought
              ? 'rgba(156,221,183,0.20)'
              : !canAfford && !isFree
                ? 'rgba(242,238,255,0.06)'
                : isFree
                  ? `${item.color}28`
                  : '#FFF9E0',
            border: bought
              ? '1px solid rgba(156,221,183,0.40)'
              : !canAfford && !isFree
                ? '1px solid rgba(242,238,255,0.10)'
                : isFree
                  ? `1px solid ${item.color}55`
                  : 'none',
            color: bought ? '#9CDDB7'
                  : !canAfford && !isFree ? 'var(--on-night-3)'
                  : isFree ? item.color : '#2A1F5C',
            cursor: bought || (!isFree && !canAfford) ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--sans)', fontSize: 11.5, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 5,
            boxShadow: bought || !canAfford || isFree ? 'none' : '0 4px 10px rgba(244,213,138,0.35)',
          }}>
          {bought ? <><IconCheckSmall size={10} color="#9CDDB7"/> получено</>
            : !canAfford && !isFree ? `нужно ещё ${item.price - stars} ★`
            : item.action === 'invite' ? 'Пригласить →'
            : item.action === 'share' ? 'Поделиться →'
            : isFree ? 'Получить'
            : 'Обменять'}
        </button>
      </div>
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════
// SUNDAY CHECKUP + REPORT
// ═══════════════════════════════════════════════════════════════
export function SundayModal({ user, onClose }) {
  const [phase, setPhase] = React.useState('intro');
  const _saved = getState('weekly_last', null);
  const [overall, setOverall] = React.useState(_saved && _saved.overall != null ? _saved.overall : 7);
  const [vsLast, setVsLast]   = React.useState(_saved && _saved.vsLast != null ? _saved.vsLast : null);

  const saveWeekly = (next) => {
    setState('weekly_last', { overall, vsLast, at: Date.now(), ...next });
  };

  return (
    <div className="bg-dawn" style={{
      position: 'absolute', inset: 0, zIndex: 95, overflow: 'hidden',
      animation: 'fade-up 0.45s cubic-bezier(.2,.7,.2,1) both',
    }}>
      <StarrySky density={0.6} includeShootingStar={false}/>
      <Particles count={8} palette="gold"/>

      <div className="fade-in" key={phase} style={{
        position: 'relative', height: '100%', overflowY: 'auto', padding: '54px 22px 28px',
      }}>
        <HeaderBar title={phase === 'report' ? 'Ваша неделя' : 'Воскресный чек-ап'} onBack={onClose}/>

        {phase === 'intro' && (
          <div className="stagger" style={{ marginTop: 22 }}>
            <div className="eyebrow">3 минуты</div>
            <div className="serif" style={{
              fontSize: 36, lineHeight: 1.05, marginTop: 12, letterSpacing: '-0.015em', color: 'var(--on-night)',
            }}>
              Привет.<br/>
              <span className="serif-it" style={{ color: '#FFF9E0' }}>Воскресенье</span>.
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--on-night-2)', marginTop: 16, maxWidth: 320 }}>
              Давайте вместе посмотрим на эту неделю — без оценок, просто чтобы увидеть.
            </div>

            <div style={{
              marginTop: 28, padding: 20, borderRadius: 24,
              background: 'rgba(255, 249, 224, 0.10)', border: '1px solid rgba(255, 249, 224, 0.16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', height: 220,
            }}>
              <MeditatingFox size={170} mood="rose"/>
            </div>

            <div style={{ marginTop: 22 }}>
              <PrimaryButton variant="cream" onClick={() => setPhase('q1')}>
                Начать <IconArrow size={14} color="#2A1F5C"/>
              </PrimaryButton>
              <button style={{
                width: '100%', marginTop: 10, padding: 10,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--on-night-3)', fontSize: 12,
              }}>пропустить эту неделю</button>
            </div>
          </div>
        )}

        {phase === 'q1' && (
          <div className="stagger" style={{ marginTop: 22 }}>
            <div className="eyebrow">Вопрос 1 из 5</div>
            <div className="serif" style={{
              fontSize: 30, lineHeight: 1.1, marginTop: 10, letterSpacing: '-0.015em', color: 'var(--on-night)',
            }}>
              Как прошла<br/>
              <span className="serif-it" style={{ color: '#FFF9E0' }}>эта неделя?</span>
            </div>

            <div className="card" style={{ marginTop: 22, padding: 24 }}>
              <div className="serif" style={{ fontSize: 56, textAlign: 'center', color: 'var(--lav-500)' }}>{overall}</div>
              <div style={{ fontSize: 11, textAlign: 'center', color: 'var(--text-3)', marginTop: 2 }}>из 10</div>
              <input type="range" min={1} max={10} value={overall}
                onChange={e => { setOverall(+e.target.value); saveWeekly({ overall: +e.target.value }); }}
                style={{ width: '100%', marginTop: 18, accentColor: 'var(--lav-400)' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-3)', marginTop: 8 }}>
                <span>очень тяжело</span><span>нейтрально</span><span>очень хорошо</span>
              </div>
            </div>

            <div style={{ marginTop: 22 }}>
              <PrimaryButton variant="cream" onClick={() => setPhase('q2')}>
                Дальше <IconArrow size={14} color="#2A1F5C"/>
              </PrimaryButton>
            </div>
          </div>
        )}

        {phase === 'q2' && (
          <div className="stagger" style={{ marginTop: 22 }}>
            <div className="eyebrow">Вопрос 2 из 5</div>
            <div className="serif" style={{
              fontSize: 28, lineHeight: 1.1, marginTop: 10, letterSpacing: '-0.015em', color: 'var(--on-night)',
            }}>
              По сравнению с<br/>
              <span className="serif-it" style={{ color: '#FFF9E0' }}>предыдущей…</span>
            </div>

            <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Заметно лучше', 'Немного лучше', 'Так же', 'Немного хуже', 'Заметно хуже', 'Не помню, как было'].map(o => {
                const on = vsLast === o;
                return (
                  <button key={o} onClick={() => { setVsLast(o); saveWeekly({ vsLast: o }); }} style={{
                    padding: '14px 16px', borderRadius: 14,
                    background: on ? 'var(--cream-2)' : 'rgba(242,238,255,0.10)',
                    color: on ? 'var(--ink)' : 'var(--on-night)',
                    border: '1px solid ' + (on ? 'transparent' : 'rgba(242,238,255,0.14)'),
                    fontFamily: 'var(--sans)', fontSize: 14,
                    cursor: 'pointer', textAlign: 'left',
                    boxShadow: on ? '0 6px 18px rgba(20,14,50,0.18)' : 'none',
                  }}>{o}</button>
                );
              })}
            </div>

            <div style={{ marginTop: 22 }}>
              <PrimaryButton variant={vsLast ? 'cream' : 'outline'} onClick={vsLast ? () => setPhase('report') : undefined}>
                {vsLast ? 'К отчёту' : 'Выберите вариант'}
                {vsLast && <IconArrow size={14} color="#2A1F5C"/>}
              </PrimaryButton>
              <button onClick={() => setPhase('report')} style={{
                width: '100%', marginTop: 10, padding: 10,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--on-night-3)', fontSize: 12,
              }}>сразу к отчёту →</button>
            </div>
          </div>
        )}

        {phase === 'report' && <WeeklyReport user={user} onClose={onClose}/>}
      </div>
    </div>
  );
}

export function WeeklyReport({ user, onClose }) {
  const moodLine   = [4, 6, 5, 5, 3, 7, 6];
  const stressLine = [7, 5, 5, 6, 8, 4, 5];
  const energyLine = [3, 5, 5, 4, 3, 6, 7];

  return (
    <div className="stagger" style={{ marginTop: 18 }}>
      <div className="eyebrow">7–13 апреля</div>

      <div className="serif" style={{
        fontSize: 42, lineHeight: 1.0, marginTop: 10, letterSpacing: '-0.02em', color: 'var(--on-night)',
      }}>
        Слово недели —<br/>
        <span className="serif-it" style={{ color: '#FFF9E0' }}>возвращение</span>.
      </div>

      <div className="card" style={{
        marginTop: 22, padding: 22, textAlign: 'center',
        background: 'linear-gradient(135deg, #BFB2F0, #F4D58A)',
      }}>
        <div className="eyebrow on-card" style={{ color: 'rgba(42,31,92,0.7)' }}>стресс</div>
        <div className="serif" style={{ fontSize: 64, marginTop: 8, color: '#2A1F5C', letterSpacing: '-0.02em' }}>−1.5</div>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.5 }}>
          Снизился по сравнению с прошлой неделей.<br/>Это работает.
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <ReportChart label="Настроение" color="var(--pink-300)" data={moodLine}/>
        <ReportChart label="Стресс"     color="var(--lav-400)"  data={stressLine}/>
        <ReportChart label="Энергия"    color="var(--dawn-peach)" data={energyLine}/>
      </div>

      <div className="card" style={{ marginTop: 12, padding: 18 }}>
        <div className="eyebrow on-card">эмоции этой недели</div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { l: 'Усталость',    pct: 32, c: '#8C8268' },
            { l: 'Тревога',      pct: 24, c: '#5C4BC0' },
            { l: 'Обида',        pct: 14, c: '#E89BB0' },
            { l: 'Благодарность',pct: 11, c: '#F4D58A' },
            { l: 'Нежность',     pct:  8, c: '#C49B97' },
          ].map(e => (
            <div key={e.l} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)', width: 100 }}>{e.l}</span>
              <div style={{ flex: 1, height: 6, background: 'var(--sand)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${e.pct * 2.2}%`, height: '100%', background: e.c, borderRadius: 3 }}/>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-3)', width: 32, textAlign: 'right' }}>{e.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <StatCell label="Утренних"   value="5/7"  hint="практик"     gradient="peach"    emoji="🌅"/>
        <StatCell label="Вечерних"   value="4/7"  hint="практик"     gradient="lavender" emoji="🌙"/>
        <StatCell label="Записей"    value="9"    hint="в дневнике"  gradient="pink"     emoji="📝"/>
        <StatCell label="Эмоций"     value="3"    hint="открыто"     gradient="rose"     emoji="🗺"/>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>· Инсайты</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SAMPLE_INSIGHTS.map((s, i) => (
            <div key={i} className="card" style={{
              padding: 14, borderRadius: 14,
              background: i === 0 ? 'linear-gradient(135deg, #BFB2F033, #F4D58A22)' : undefined,
              fontSize: 13, lineHeight: 1.5, color: 'var(--ink-soft)',
            }}>{s}</div>
          ))}
        </div>
      </div>

      <div className="card" style={{
        marginTop: 16, padding: 18,
        background: 'linear-gradient(135deg, #F4C0CE 0%, #F5B889 100%)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <Icon3D size={48} gradient="rose" emoji="🎁"/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="eyebrow on-card" style={{ color: 'rgba(42,31,92,0.6)' }}>· подарок недели</div>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 5, color: 'var(--ink)' }}>Голос для вас · 2 минуты</div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.45 }}>
            Персональное сообщение от диктора по теме вашей недели
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PrimaryButton variant="cream" onClick={onClose}>
          Открыть новую неделю <IconArrow size={14} color="#2A1F5C"/>
        </PrimaryButton>
        <button style={{
          width: '100%', padding: 12, borderRadius: 99,
          background: 'transparent', border: '1px solid rgba(242,238,255,0.30)',
          fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--on-night)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <IconShare size={12}/> Сохранить как PDF
        </button>
      </div>

      <div style={{ height: 12 }}/>
    </div>
  );
}

export function ReportChart({ label, color, data }) {
  return (
    <div className="card" style={{ padding: '14px 16px', borderRadius: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div className="eyebrow on-card">{label}</div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>пн → вс</span>
      </div>
      <AreaChart data={data} width={300} height={64} color={color}/>
    </div>
  );
}
