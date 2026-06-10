// @ts-nocheck
'use client';
import React from 'react';
import { IconChevron } from './icons';

// AuraSync — Night sky scenery, trees, stars, particles, 3D icon containers

// ─── Twinkling starry background ────────────────────────────
export function StarrySky({ density = 1, includeMoon = false, includeShootingStar = true }) {
  const stars = React.useMemo(() => {
    return Array.from({ length: Math.floor(40 * density) }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 70,
      size: 0.6 + Math.random() * 2,
      delay: -Math.random() * 6,
      bright: Math.random() > 0.7,
    }));
  }, [density]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: '50%',
          background: s.bright ? '#FFF9E0' : '#E2D5F5',
          boxShadow: s.bright ? `0 0 ${s.size * 3}px #FFD993` : `0 0 ${s.size * 2}px #C5BCE3`,
          animation: `twinkle 3s ease-in-out infinite`,
          animationDelay: `${s.delay}s`,
        }}/>
      ))}
      {includeMoon && (
        <div style={{
          position: 'absolute', right: '8%', top: '6%',
          width: 50, height: 50, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #FFF9E0 0%, #F4D58A 80%, #D4A356 100%)',
          boxShadow: '0 0 30px rgba(244, 213, 138, 0.6), 0 0 60px rgba(244, 213, 138, 0.3)',
        }}>
          <div style={{
            position: 'absolute', right: '8px', top: '12px',
            width: 36, height: 36, borderRadius: '50%',
            background: 'transparent',
            boxShadow: 'inset -8px -4px 0 0 rgba(46,34,102,0.25)',
          }}/>
        </div>
      )}
      {includeShootingStar && (
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
          <defs>
            <linearGradient id="shoot" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#FFD993" stopOpacity="0"/>
              <stop offset="100%" stopColor="#FFF9E0" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <path d="M 320 30 Q 330 50 360 80" stroke="url(#shoot)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <circle cx="362" cy="82" r="2" fill="#FFF9E0"/>
        </svg>
      )}
    </div>
  );
}

// ─── Pine tree silhouettes (decorative, sides) ──────────────
export function PineSilhouettes() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 402 874" preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* far hills */}
      <path d="M 0 700 Q 100 670 200 690 Q 300 700 402 670 L 402 874 L 0 874 Z"
        fill="rgba(20, 14, 50, 0.45)"/>
      <path d="M 0 760 Q 80 740 200 755 Q 320 765 402 740 L 402 874 L 0 874 Z"
        fill="rgba(20, 14, 50, 0.6)"/>

      {/* left pines */}
      <g opacity="0.65">
        <path d="M -10 620 L 10 580 L 5 580 L 25 540 L 20 540 L 40 500 L 60 540 L 55 540 L 75 580 L 70 580 L 90 620 Z"
          fill="rgba(20, 14, 50, 0.85)"/>
      </g>
      {/* right pines */}
      <g opacity="0.65">
        <path d="M 310 670 L 340 620 L 333 620 L 360 580 L 354 580 L 380 545 L 408 580 L 401 580 L 425 620 L 418 620 L 442 670 Z"
          fill="rgba(20, 14, 50, 0.85)"/>
      </g>
    </svg>
  );
}

// ─── Floating particles (sparkles) ──────────────────────────
export function Particles({ count = 14, palette = 'gold' }) {
  const items = React.useMemo(() => Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    bottom: Math.random() * 70,
    size: 1.2 + Math.random() * 2,
    delay: -Math.random() * 14,
    duration: 12 + Math.random() * 10,
  })), [count]);
  const color = palette === 'gold' ? 'rgba(255, 217, 147, 0.9)' : 'rgba(220, 211, 250, 0.9)';
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${p.left}%`, bottom: `${p.bottom}%`,
          width: p.size, height: p.size, borderRadius: '50%',
          background: color, boxShadow: `0 0 ${p.size * 4}px ${color}`,
          animation: `drift-up ${p.duration}s linear infinite`,
          animationDelay: `${p.delay}s`,
        }}/>
      ))}
    </div>
  );
}

// ─── Big crescent moon (centerpiece for sleep screens) ──────
export function CrescentMoon({ size = 200, color = '#F4D58A', tilt = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{
      display: 'block', transform: `rotate(${tilt}deg)`,
    }}>
      <defs>
        <radialGradient id="cmGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="cmMoon" cx="40%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FFF9E0"/>
          <stop offset="100%" stopColor={color}/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="98" fill="url(#cmGlow)"/>
      <circle cx="100" cy="100" r="70" fill="url(#cmMoon)"/>
      <circle cx="120" cy="90" r="60" fill="#3B2A78"/>
      <circle cx="65" cy="125" r="3" fill="#D4A356" opacity="0.6"/>
      <circle cx="55" cy="95" r="2" fill="#D4A356" opacity="0.5"/>
      <circle cx="80" cy="80" r="2.5" fill="#D4A356" opacity="0.5"/>
    </svg>
  );
}

// ─── 3D icon container (gradient pill + icon) ───────────────
// Used for category cards / advice / nav highlights
export function Icon3D({ size = 56, gradient = 'lavender', emoji = null, children = null, radius = 16, lift = true }) {
  const grads = {
    lavender: ['#BFB2F0', '#7C6BD9', '#5236A2'],
    peach:    ['#FFD0A8', '#F5A88E', '#D4748A'],
    pink:     ['#F4C0CE', '#E89BB0', '#C97990'],
    gold:     ['#FFE9BD', '#F4D58A', '#D4A356'],
    teal:     ['#B8E0D4', '#7CC8AE', '#4A9982'],
    sky:      ['#C5DEF0', '#7CB8E0', '#4F8FB8'],
    rose:     ['#F4D1D8', '#E89BB0', '#B85F75'],
    plum:     ['#C5A8E0', '#8B6BB3', '#56407E'],
  };
  const g = grads[gradient] || grads.lavender;
  const gid = `i3d-${gradient}-${size}`;
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      filter: lift ? `drop-shadow(0 6px 12px ${g[2]}66)` : 'none',
    }}>
      <svg width={size} height={size} viewBox="0 0 56 56" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={g[0]}/>
            <stop offset="50%" stopColor={g[1]}/>
            <stop offset="100%" stopColor={g[2]}/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="52" height="52" rx={radius} fill={`url(#${gid})`}/>
        {/* highlight */}
        <ellipse cx="20" cy="14" rx="14" ry="6" fill="rgba(255,255,255,0.35)"/>
        <ellipse cx="14" cy="10" rx="6" ry="2.5" fill="rgba(255,255,255,0.7)"/>
        {/* inner shadow ring */}
        <rect x="2" y="2" width="52" height="52" rx={radius} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.5,
      }}>
        {emoji || children}
      </div>
    </div>
  );
}

// ─── Big BreathingCircle re-skinned (lavender glow) ─────────
export function BreathingCircle({ size = 240, running = true, cycleSec = 11, mood = 'lavender', label }) {
  const palettes = {
    lavender: { c1: '#FFF9E0', c2: '#BFB2F0', c3: '#7C6BD9', halo: '#7C6BD9' },
    peach:    { c1: '#FFF1E0', c2: '#FFD0A8', c3: '#F5A88E', halo: '#F5A88E' },
    rose:     { c1: '#FFF0F2', c2: '#F4C0CE', c3: '#E89BB0', halo: '#E89BB0' },
    gold:     { c1: '#FFF9E0', c2: '#F4D58A', c3: '#D4A356', halo: '#F4D58A' },
    plum:     { c1: '#F2EEFF', c2: '#A685D4', c3: '#4534A6', halo: '#7C6BD9' },
  };
  const c = palettes[mood] || palettes.lavender;
  const state = running ? 'running' : 'paused';
  const dur = `${cycleSec}s`;
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* outer halo */}
      <div style={{
        position: 'absolute', inset: -size * 0.22, borderRadius: '50%',
        background: `radial-gradient(circle, ${c.halo}66 0%, ${c.halo}22 45%, transparent 75%)`,
        filter: 'blur(28px)',
        animation: `breathe-soft ${dur} ease-in-out infinite`,
        animationPlayState: state,
      }}/>
      {/* sphere */}
      <div style={{
        width: size * 0.8, height: size * 0.8,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, ${c.c1} 0%, ${c.c2} 55%, ${c.c3} 100%)`,
        boxShadow: `inset 14px 18px 36px ${c.c1}cc, inset -14px -18px 36px ${c.c3}88, 0 8px 40px ${c.halo}66`,
        animation: `breathe ${dur} ease-in-out infinite`,
        animationPlayState: state,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '14%', left: '22%',
          width: '38%', height: '32%', borderRadius: '50%',
          background: `radial-gradient(ellipse, ${c.c1}cc 0%, transparent 60%)`,
          filter: 'blur(8px)',
        }}/>
      </div>
      {[1, 1.16, 1.34].map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: size * s, height: size * s, borderRadius: '50%',
          border: `1px solid ${c.halo}55`,
          opacity: 0.5 - i * 0.13,
          animation: `breathe ${dur} ease-in-out infinite`,
          animationDelay: `${i * 0.12}s`,
          animationPlayState: state,
        }}/>
      ))}
      {label && (
        <div style={{
          position: 'absolute', fontFamily: 'var(--serif)',
          fontStyle: 'italic', fontSize: 24, color: 'var(--ink)',
          letterSpacing: '-0.01em',
          textShadow: '0 0 12px rgba(255,255,255,0.4)',
        }}>{label}</div>
      )}
    </div>
  );
}

// ─── small breathing dot ────────────────────────────────────
export function MiniBreath({ size = 28, color = '#7C6BD9' }) {
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: size * 0.75, height: size * 0.75, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, #FFF 0%, ${color} 80%)`,
        boxShadow: `0 0 ${size * 0.4}px ${color}77`,
        animation: 'breathe 5s ease-in-out infinite',
      }}/>
    </div>
  );
}

// ─── Sparkle (replaces IconSparkle visually) ─────────────────
export function Sparkle({ size = 12, color = '#FFD993', spin = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{
      animation: spin ? 'sparkle-rot 6s linear infinite' : 'none',
    }}>
      <path d="M12 2l1.5 7.5L21 11l-7.5 1.5L12 20l-1.5-7.5L3 11l7.5-1.5z" fill={color}/>
    </svg>
  );
}

// ─── Charts ──────────────────────────────────────────────────
export function Sparkline({ data, width = 80, height = 28, color = '#7C6BD9' }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => ({ x: i * step, y: height - ((v - min) / range) * (height - 6) - 3 }));
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={color}/>
    </svg>
  );
}

export function AreaChart({ data, width = 280, height = 100, color = '#7C6BD9', labels }) {
  if (!data || data.length === 0) return null;
  const max = 10, min = 0, range = max - min;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => ({ x: i * step, y: height - ((v - min) / range) * (height - 24) - 14 }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const mx = (pts[i - 1].x + pts[i].x) / 2;
    const my = (pts[i - 1].y + pts[i].y) / 2;
    d += ` Q ${pts[i - 1].x} ${pts[i - 1].y} ${mx} ${my}`;
  }
  d += ` T ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  const areaPath = d + ` L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="acgrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1={height - 14} x2={width} y2={height - 14} stroke="var(--hairline)" strokeWidth="1"/>
      <path d={areaPath} fill="url(#acgrad)"/>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 3 : 2} fill={color}/>
      ))}
      {labels && pts.map((p, i) => (
        <text key={`l${i}`} x={p.x} y={height - 2} fontSize="10" fontFamily="Inter" fill="var(--text-3)" textAnchor="middle">{labels[i]}</text>
      ))}
    </svg>
  );
}

export function BarChart({ data, labels, highlightIdx = -1, width = 280, height = 90, color = '#7C6BD9' }) {
  const max = Math.max(...data, 1);
  const barW = width / data.length * 0.55;
  const gap = width / data.length;
  return (
    <svg width={width} height={height + 14} viewBox={`0 0 ${width} ${height + 14}`} style={{ display: 'block' }}>
      {data.map((v, i) => {
        const h = (v / max) * height;
        const x = i * gap + (gap - barW) / 2;
        const y = height - h;
        const fill = i === highlightIdx ? color : color + '55';
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx={barW / 2} fill={fill}/>
            {labels && (
              <text x={x + barW/2} y={height + 11} fontSize="9" fontFamily="Inter"
                fill="var(--text-3)" textAnchor="middle">{labels[i]}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Progress dots ───────────────────────────────────────────
export function ProgressDots({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === step ? 22 : 5, height: 5, borderRadius: 3,
          background: i <= step ? 'var(--lav-100)' : 'rgba(242,238,255,0.18)',
          transition: 'all 0.45s cubic-bezier(.3,.7,.3,1)',
        }}/>
      ))}
    </div>
  );
}

// ─── Buttons ────────────────────────────────────────────────
export function PrimaryButton({ children, onClick, variant = 'lavender', icon = null, full = true, size = 'lg', disabled = false }) {
  const v = {
    lavender: { bg: 'linear-gradient(180deg, #9A87E5 0%, #5C4BC0 100%)', fg: '#FFF9E0', shadow: '0 8px 20px rgba(92, 75, 192, 0.4)' },
    cream:    { bg: '#FFF9E0', fg: '#2A1F5C', shadow: '0 4px 14px rgba(20, 14, 50, 0.15)' },
    glass:    { bg: 'rgba(242,238,255,0.10)', fg: '#F2EEFF', border: '1px solid rgba(242,238,255,0.20)', shadow: 'none' },
    outline:  { bg: 'transparent', fg: '#F2EEFF', border: '1px solid rgba(242,238,255,0.30)', shadow: 'none' },
    inkOnLight: { bg: '#2A1F5C', fg: '#FFF9E0', shadow: '0 4px 14px rgba(20, 14, 50, 0.25)' },
  }[variant] || {};
  const sz = {
    lg: { h: 54, fs: 15, px: 28 },
    md: { h: 44, fs: 14, px: 20 },
    sm: { h: 36, fs: 13, px: 16 },
  }[size];
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{
      width: full ? '100%' : 'auto', height: sz.h, padding: `0 ${sz.px}px`,
      borderRadius: sz.h / 2,
      background: v.bg, color: v.fg, border: v.border || 'none',
      boxShadow: v.shadow,
      fontFamily: 'var(--sans)', fontSize: sz.fs, fontWeight: 500,
      letterSpacing: -0.1, cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'transform 0.15s ease, opacity 0.2s ease',
    }}
    onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
    onMouseUp={e => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
    onMouseLeave={e => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}{icon}
    </button>
  );
}

// ─── Header bar (back + title + action) ────────────────────
export function HeaderBar({ title, onBack, action, onLight = false }) {
  const fg = onLight ? 'var(--ink)' : 'var(--on-night)';
  const btnBg = onLight ? 'rgba(42,31,92,0.06)' : 'rgba(242,238,255,0.10)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0 4px' }}>
      {onBack && (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18,
          background: btnBg, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconChevron size={16} color={fg} style={{ transform: 'rotate(180deg)' }}/>
        </button>
      )}
      <div style={{ flex: 1, fontSize: 15, fontWeight: 500, color: fg, textAlign: onBack ? 'center' : 'left' }}>{title}</div>
      {action}
    </div>
  );
}

// ─── Plutchik wheel (re-skinned) ─────────────────────────────
export const BASE_EMOTIONS = [
  { id: 'joy',      label: 'Радость',       color: '#F4D58A', angle:  -90 },
  { id: 'trust',    label: 'Доверие',       color: '#7CC8AE', angle:  -45 },
  { id: 'fear',     label: 'Страх',         color: '#5C4BC0', angle:    0 },
  { id: 'surprise', label: 'Удивление',     color: '#A685D4', angle:   45 },
  { id: 'sadness',  label: 'Грусть',        color: '#7CB8E0', angle:   90 },
  { id: 'disgust',  label: 'Отвращение',    color: '#8C8268', angle:  135 },
  { id: 'anger',    label: 'Злость',        color: '#E89BB0', angle:  180 },
  { id: 'antic',    label: 'Предвкушение',  color: '#F5A88E', angle:  225 },
];

export function PlutchikWheel({ size = 290, onPick, opened = null }) {
  const cx = size / 2, cy = size / 2;
  const radius = size * 0.36;
  const cellSize = size * 0.22;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={radius} stroke="var(--hairline)" strokeWidth="1" fill="none"/>
      <circle cx={cx} cy={cy} r={radius * 0.4} stroke="var(--hairline)" strokeWidth="1" fill="none" strokeDasharray="2 3"/>
      <g>
        <circle cx={cx} cy={cy} r={size * 0.13} fill="var(--cream-2)" stroke="var(--hairline-2)" strokeWidth="1"/>
        <text x={cx} y={cy - 4} fontSize="11" fontFamily="Inter" fontWeight="500" textAnchor="middle" fill="var(--text-2)">8 эмоций</text>
        <text x={cx} y={cy + 11} fontSize="10" fontFamily="Inter" textAnchor="middle" fill="var(--text-3)">базовых</text>
      </g>
      {BASE_EMOTIONS.map(e => {
        const rad = (e.angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * radius;
        const y = cy + Math.sin(rad) * radius;
        const isOpened = opened === e.id;
        return (
          <g key={e.id} style={{ cursor: 'pointer' }} onClick={() => onPick && onPick(e)}>
            <defs>
              <radialGradient id={`em-${e.id}`} cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9"/>
                <stop offset="100%" stopColor={e.color}/>
              </radialGradient>
            </defs>
            <circle cx={x} cy={y} r={cellSize / 2 + (isOpened ? 6 : 0)} fill={e.color} opacity={isOpened ? 0.20 : 0}/>
            <circle cx={x} cy={y} r={cellSize / 2}
              fill={`url(#em-${e.id})`}
              style={{
                transition: 'transform 0.3s ease',
                transformOrigin: `${x}px ${y}px`,
                transform: isOpened ? 'scale(1.08)' : 'scale(1)',
                filter: `drop-shadow(0 6px 14px ${e.color}55)`,
              }}/>
            <text x={x} y={y + 4} fontSize="11" fontFamily="Inter" fontWeight="500"
              textAnchor="middle" fill="#2A1F5C" style={{ pointerEvents: 'none' }}>{e.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
