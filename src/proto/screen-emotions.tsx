// @ts-nocheck
'use client';
import React from 'react';
import { IconCompass, IconChevron, IconArrow, IconBookmark, IconShare, IconHeart } from './icons';
import { StarrySky, Particles, PlutchikWheel, Icon3D, HeaderBar, PrimaryButton } from './primitives';
import { EMOTION_CARDS, RESENTMENT_CARD } from './data';
import { getState, setState } from '@/lib/store';

// AuraSync — Emotions Map + Emotion Card

export function EmotionsScreen({ onOpenCompass, onClose }) {
  const [openedBase, setOpenedBase] = React.useState(null);
  const [openCard, setOpenCard] = React.useState(null);

  if (openCard) return <EmotionCardView card={openCard} onClose={() => setOpenCard(null)}/>;

  return (
    <div className="bg-night" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <StarrySky density={1}/>
      <Particles count={10} palette="lavender"/>

      <div className="fade-in stagger" style={{
        position: 'relative', height: '100%', overflowY: 'auto', overflowX: 'hidden',
        padding: '54px 22px 116px',
      }}>
        {onClose && (
          <button onClick={onClose} style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14,
            padding: '7px 13px 7px 9px', borderRadius: 99,
            background: 'rgba(242,238,255,0.10)', border: '1px solid rgba(242,238,255,0.18)',
            fontSize: 12, color: 'var(--on-night)', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--sans)',
          }}>
            <IconChevron size={15} color="var(--on-night)" style={{ transform: 'rotate(180deg)' }}/>
            назад
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="eyebrow">· Карта эмоций</div>
            <div className="serif" style={{
              fontSize: 28, lineHeight: 1.08, marginTop: 8, letterSpacing: '-0.015em', color: 'var(--on-night)',
            }}>
              Найдите слово<br/>
              для того,<br/>
              <span className="serif-it" style={{ color: 'var(--lav-200)' }}>что чувствуете</span>.
            </div>
          </div>
          <button onClick={onOpenCompass} style={{
            padding: '8px 14px', borderRadius: 99,
            background: 'rgba(242,238,255,0.10)', border: '1px solid rgba(242,238,255,0.18)',
            fontSize: 11, color: 'var(--on-night)', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--sans)',
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginTop: 8,
          }}>
            <IconCompass size={12} color="var(--on-night)"/> компас
          </button>
        </div>

        {/* Wheel card */}
        <div className="card" style={{
          marginTop: 18, padding: 14, borderRadius: 24,
          display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',
        }}>
          <PlutchikWheel size={290} opened={openedBase} onPick={(e) => setOpenedBase(e.id)}/>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
            нажми на эмоцию — увидишь оттенки
          </div>
        </div>

        {/* Shades */}
        {openedBase && EMOTION_CARDS[openedBase] && (
          <div className="fade-up card" style={{ marginTop: 14, padding: 18, borderRadius: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <div className="eyebrow on-card">Оттенки</div>
                <div className="serif" style={{ fontSize: 22, marginTop: 4, letterSpacing: '-0.005em' }}>
                  {EMOTION_CARDS[openedBase].label}
                </div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                {EMOTION_CARDS[openedBase].shades.length} оттенков
              </span>
            </div>

            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {EMOTION_CARDS[openedBase].shades.map((s, i) => {
                const clickable = s.id === 'resentment' || s.id === 'anxiety';
                return (
                  <button key={s.id}
                    onClick={() => clickable && setOpenCard(RESENTMENT_CARD)}
                    style={{
                      padding: '10px 14px', borderRadius: 14,
                      background: i === 0 ? `${EMOTION_CARDS[openedBase].color}22` : 'var(--sand)',
                      border: '1px solid ' + (i === 0 ? `${EMOTION_CARDS[openedBase].color}55` : 'var(--hairline)'),
                      fontSize: 13, color: 'var(--ink)', cursor: clickable ? 'pointer' : 'default',
                      fontFamily: 'var(--sans)',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                    <span style={{ width: 6, height: 6, borderRadius: 3, background: EMOTION_CARDS[openedBase].color }}/>
                    {s.label}
                    {clickable && <IconChevron size={10} color="var(--text-3)"/>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Emotion of week */}
        <div className="card" style={{
          marginTop: 14, padding: 18, borderRadius: 22,
          background: 'linear-gradient(135deg, #E89BB033, #BFB2F033)',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
        }} onClick={() => setOpenCard(RESENTMENT_CARD)}>
          <div style={{ position: 'absolute', right: -8, top: -8 }}>
            <Icon3D size={64} gradient="pink" emoji="💔"/>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="eyebrow on-card" style={{ color: 'var(--pink-400)' }}>· эмоция недели</div>
            <div className="serif" style={{ fontSize: 22, marginTop: 8, letterSpacing: '-0.005em' }}>
              Обида
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 6, maxWidth: '78%', lineHeight: 1.5 }}>
              «Замороженный гнев, смешанный с болью от несправедливости.»
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--pink-400)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
              Открыть карточку <IconArrow size={12} color="var(--pink-400)"/>
            </div>
          </div>
        </div>

        {/* Mine */}
        <div style={{ marginTop: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>· часто навещаешь</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              { l: 'Усталость',   c: '#8C8268' },
              { l: 'Тревога',     c: '#5C4BC0' },
              { l: 'Обида',       c: '#E89BB0' },
              { l: 'Нежность',    c: '#C49B97' },
              { l: 'Благодарность', c: '#F4D58A' },
            ].map(em => (
              <span key={em.l} style={{
                padding: '8px 12px', borderRadius: 99,
                background: 'rgba(242,238,255,0.10)', border: '1px solid rgba(242,238,255,0.16)',
                fontSize: 12, color: 'var(--on-night)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: em.c }}/>
                {em.l}
              </span>
            ))}
          </div>
        </div>

        {/* Premium teaser */}
        <div className="card" style={{
          marginTop: 18, padding: 16, borderRadius: 18,
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'linear-gradient(135deg, #F4D58A33, #FFD09322)',
        }}>
          <Icon3D size={42} gradient="gold" emoji="🔓"/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>48 оттенков ждут</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3, lineHeight: 1.5 }}>
              Открыто 8 базовых. Премиум — все 56, компас, связи.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Emotion card view ───────────────────────────────────
export function EmotionCardView({ card, onClose }) {
  const emotionKey = card.id || card.label;

  const [bookmarked, setBookmarked] = React.useState(
    () => getState('emotion_bookmarks', []).includes(emotionKey)
  );
  const [felt, setFelt] = React.useState(false);

  const toggleBookmark = () => {
    const list = getState('emotion_bookmarks', []);
    const has = list.includes(emotionKey);
    const next = has ? list.filter((k) => k !== emotionKey) : [...list, emotionKey];
    setState('emotion_bookmarks', next);
    setBookmarked(!has);
  };

  const feelNow = (e) => {
    const log = getState('emotion_feel_log', []);
    const next = [...log, { id: emotionKey, at: Date.now() }].slice(-100);
    setState('emotion_feel_log', next);
    if (window.__awardStars) window.__awardStars(5, e.currentTarget, 'эмоция');
    setFelt(true);
  };

  return (
    <div className="bg-night" style={{
      position: 'absolute', inset: 0, zIndex: 90, overflow: 'hidden',
      animation: 'fade-up 0.4s cubic-bezier(.2,.7,.2,1) both',
    }}>
      <StarrySky density={0.6}/>
      <div style={{
        position: 'absolute', inset: 0, overflowY: 'auto',
        paddingTop: 54, paddingBottom: 28, paddingLeft: 22, paddingRight: 22,
      }}>
        <HeaderBar title="Карта эмоций" onBack={onClose}
          action={
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={toggleBookmark} style={{
                width: 36, height: 36, borderRadius: 18,
                background: 'rgba(242,238,255,0.10)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><IconBookmark size={14} color={bookmarked ? '#FFD993' : 'var(--on-night)'} fill={bookmarked ? '#FFD993' : 'none'}/></button>
              <button style={{
                width: 36, height: 36, borderRadius: 18,
                background: 'rgba(242,238,255,0.10)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><IconShare size={14} color="var(--on-night)"/></button>
            </div>
          }/>

        {/* Hero card */}
        <div className="card" style={{
          marginTop: 14, padding: '28px 24px', borderRadius: 26,
          background: `linear-gradient(150deg, ${card.color}55 0%, var(--cream) 60%)`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -10, top: -10 }}>
            <Icon3D size={80} gradient="pink" emoji="💔"/>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="eyebrow on-card" style={{ color: card.color }}>· {EMOTION_CARDS[card.base]?.label || ''}</div>
            <div className="serif" style={{
              fontSize: 44, lineHeight: 1.0, marginTop: 12, letterSpacing: '-0.015em',
            }}>
              {card.label}
            </div>
            <div className="serif-it" style={{
              fontSize: 15, lineHeight: 1.45, color: 'var(--ink-soft)', marginTop: 14,
              maxWidth: '88%',
            }}>
              {card.oneliner}.
            </div>
          </div>
        </div>

        <CardBlock title="Что это" body={card.what}/>
        <CardBlock title="Где живёт в теле" body={card.body} bodyMap/>
        <CardBlock title="О чём говорит" body={card.signal}/>

        {/* Triggers */}
        <div style={{ marginTop: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Что её вызывает</div>
          <div className="card" style={{ padding: 0, borderRadius: 16, overflow: 'hidden' }}>
            {card.triggers.map((t, i) => (
              <div key={i} style={{
                padding: '12px 14px',
                borderTop: i ? '1px solid var(--hairline)' : 'none',
                fontSize: 13, lineHeight: 1.5, color: 'var(--ink-soft)',
                display: 'flex', gap: 10,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: 3, background: card.color, marginTop: 8, flexShrink: 0 }}/>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Not like */}
        <div style={{ marginTop: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Не путай с</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {card.notLike.map((n, i) => (
              <div key={i} className="card-soft" style={{ padding: 14, borderRadius: 14 }}>
                <div className="serif" style={{ fontSize: 16 }}>{n.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4, lineHeight: 1.5 }}>{n.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Helps */}
        <div style={{ marginTop: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 8, color: '#7CC8AE' }}>Что помогает</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {card.helps.map((h, i) => (
              <div key={i} className="card" style={{
                padding: 14, borderRadius: 14,
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer',
              }}>
                <Icon3D size={38} gradient="teal" emoji="▶" radius={12}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{h.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3 }}>{h.sub}</div>
                </div>
                <IconChevron size={12} color="var(--text-3)"/>
              </div>
            ))}
          </div>
        </div>

        {/* Not helps */}
        <div style={{ marginTop: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Что НЕ помогает</div>
          <div className="card" style={{ padding: 0, borderRadius: 14, overflow: 'hidden' }}>
            {card.notHelps.map((t, i) => (
              <div key={i} style={{
                padding: '10px 14px',
                borderTop: i ? '1px solid var(--hairline)' : 'none',
                fontSize: 12, lineHeight: 1.5, color: 'var(--text-2)',
                textDecoration: 'line-through', textDecorationColor: 'var(--text-3)',
              }}>{t}</div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="card" style={{
          marginTop: 18, padding: '22px 20px', borderRadius: 22,
          background: 'var(--cream-2)', border: `1px dashed ${card.color}66`,
        }}>
          <div className="serif-it" style={{
            fontSize: 18, lineHeight: 1.4, color: 'var(--ink)', textAlign: 'center',
            letterSpacing: '-0.005em',
          }}>
            «{card.quote}»
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <PrimaryButton variant="inkOnLight" size="md" onClick={feelNow}>
            <IconHeart size={14} color="#FFF9E0"/> {felt ? 'Отмечено' : 'Я чувствую это сейчас'}
          </PrimaryButton>
        </div>

        <div style={{ height: 24 }}/>
      </div>
    </div>
  );
}

export function CardBlock({ title, body, bodyMap = false }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{title}</div>
      <div className="card" style={{ padding: 14, borderRadius: 16, display: 'flex', gap: 14 }}>
        {bodyMap && <BodyMap size={70}/>}
        <div className="serif" style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink-soft)', letterSpacing: '-0.003em', flex: 1 }}>
          {body}
        </div>
      </div>
    </div>
  );
}

export function BodyMap({ size = 60 }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 60 84" style={{ flexShrink: 0 }}>
      <circle cx="30" cy="10" r="8" fill="none" stroke="var(--text-3)" strokeWidth="1.5"/>
      <path d="M22 22 Q 22 18 30 18 Q 38 18 38 22 L 40 56 Q 40 60 36 60 L 24 60 Q 20 60 20 56 Z"
        fill="none" stroke="var(--text-3)" strokeWidth="1.5"/>
      <path d="M22 26 Q 14 32 12 50" fill="none" stroke="var(--text-3)" strokeWidth="1.5"/>
      <path d="M38 26 Q 46 32 48 50" fill="none" stroke="var(--text-3)" strokeWidth="1.5"/>
      <path d="M26 60 L 24 80" fill="none" stroke="var(--text-3)" strokeWidth="1.5"/>
      <path d="M34 60 L 36 80" fill="none" stroke="var(--text-3)" strokeWidth="1.5"/>
      <ellipse cx="30" cy="34" rx="8" ry="6" fill="#E89BB0" opacity="0.4"/>
    </svg>
  );
}
