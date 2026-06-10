// @ts-nocheck
'use client';
import React from 'react';
// AuraSync — Mascot character (soft moon-fox companion)

// Sleeping / curled fox — used in hero, player, sleep contexts
export function MoonFox({ size = 180, breath = true, sleeping = true, glow = true }) {
  const state = breath ? 'running' : 'paused';
  return (
    <div style={{
      width: size, height: size * 0.95, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {glow && (
        <div style={{
          position: 'absolute', inset: -size * 0.15,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,213,138,0.45) 0%, rgba(124,107,217,0.18) 40%, transparent 70%)',
          filter: 'blur(28px)',
          animation: 'breathe-glow 6s ease-in-out infinite',
          animationPlayState: state,
        }}/>
      )}
      <svg width={size} height={size * 0.95} viewBox="0 0 200 190" style={{
        animation: 'breathe 6s ease-in-out infinite',
        animationPlayState: state,
        position: 'relative',
        transformOrigin: 'center 70%',
      }}>
        <defs>
          <radialGradient id={`mfBody`} cx="40%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#E2D5F5"/>
            <stop offset="55%" stopColor="#B9A6E8"/>
            <stop offset="100%" stopColor="#6E55B3"/>
          </radialGradient>
          <radialGradient id={`mfBelly`} cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#FFF9E0"/>
            <stop offset="100%" stopColor="#F0DCA8"/>
          </radialGradient>
          <radialGradient id={`mfEar`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F4C0CE"/>
            <stop offset="100%" stopColor="#C97990"/>
          </radialGradient>
          <radialGradient id={`mfMoon`} cx="40%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#FFF1B8"/>
            <stop offset="100%" stopColor="#D4A356"/>
          </radialGradient>
          <filter id="mfShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* moon crescent under fox */}
        <g transform="translate(0, 0)">
          <ellipse cx="100" cy="155" rx="78" ry="22" fill="#1A1438" opacity="0.45" filter="url(#mfShadow)"/>
          <path d="M 30 130 Q 30 90 80 80 Q 130 75 175 90 Q 165 165 100 170 Q 35 170 30 130 Z"
            fill="url(#mfMoon)"/>
          <path d="M 35 135 Q 35 100 80 95 Q 120 90 150 100" stroke="#FFF9E0" strokeWidth="1.5" fill="none" opacity="0.5"/>
          {/* moon craters */}
          <ellipse cx="155" cy="135" rx="6" ry="4" fill="#C28A40" opacity="0.5"/>
          <ellipse cx="60" cy="155" rx="4" ry="3" fill="#C28A40" opacity="0.5"/>
        </g>

        {/* tail (wraps around) */}
        <g>
          <path d="M 45 110 Q 25 115 30 140 Q 35 155 55 150 Q 70 145 65 125 Q 60 105 45 110 Z"
            fill="url(#mfBody)"/>
          <ellipse cx="38" cy="135" rx="8" ry="10" fill="#FFF9E0" opacity="0.85"/>
        </g>

        {/* body (curled) */}
        <g>
          <ellipse cx="105" cy="125" rx="58" ry="40" fill="url(#mfBody)"/>
          <ellipse cx="110" cy="138" rx="36" ry="22" fill="url(#mfBelly)"/>
          {/* paw tucked */}
          <ellipse cx="135" cy="148" rx="14" ry="10" fill="url(#mfBody)"/>
        </g>

        {/* head */}
        <g>
          {/* ears */}
          <path d="M 73 70 L 64 35 Q 60 30 70 35 Q 85 45 90 60 Z" fill="url(#mfBody)"/>
          <path d="M 73 65 L 70 47 Q 72 44 76 52 Q 80 58 83 62 Z" fill="url(#mfEar)"/>
          <path d="M 130 72 L 140 38 Q 145 32 138 40 Q 122 50 117 65 Z" fill="url(#mfBody)"/>
          <path d="M 132 67 L 135 50 Q 134 46 130 54 Q 126 60 122 64 Z" fill="url(#mfEar)"/>

          {/* head body */}
          <ellipse cx="102" cy="85" rx="42" ry="38" fill="url(#mfBody)"/>

          {/* face cream */}
          <path d="M 80 88 Q 80 75 102 75 Q 124 75 124 88 Q 124 110 102 110 Q 80 110 80 88 Z" fill="url(#mfBelly)"/>

          {/* blush */}
          <ellipse cx="80" cy="98" rx="7" ry="4" fill="#E89BB0" opacity="0.55"/>
          <ellipse cx="124" cy="98" rx="7" ry="4" fill="#E89BB0" opacity="0.55"/>

          {/* eyes (closed serene) */}
          {sleeping ? (
            <>
              <path d="M 85 88 Q 91 84 97 88" stroke="#2A1F5C" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
              <path d="M 107 88 Q 113 84 119 88" stroke="#2A1F5C" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            </>
          ) : (
            <>
              <ellipse cx="91" cy="87" rx="2.6" ry="3.4" fill="#2A1F5C"/>
              <ellipse cx="113" cy="87" rx="2.6" ry="3.4" fill="#2A1F5C"/>
              <ellipse cx="92" cy="86" rx="0.8" ry="1" fill="#FFFFFF"/>
              <ellipse cx="114" cy="86" rx="0.8" ry="1" fill="#FFFFFF"/>
            </>
          )}

          {/* nose */}
          <ellipse cx="102" cy="100" rx="3.5" ry="2.5" fill="#2A1F5C"/>
          {/* mouth */}
          <path d="M 102 103 L 102 106 Q 102 109 99 109 M 102 106 Q 102 109 105 109" stroke="#2A1F5C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>

        {/* nightcap (sleeping mode) */}
        {sleeping && (
          <g>
            <path d="M 70 55 Q 75 30 100 30 Q 125 30 135 55 Z" fill="#7C6BD9"/>
            <path d="M 100 30 Q 105 22 115 18 Q 125 18 128 26 Q 130 32 120 32 Q 110 32 105 30" fill="#9A87E5"/>
            <circle cx="125" cy="22" r="6" fill="#FFF9E0"/>
            <path d="M 75 56 Q 100 60 135 56" stroke="#F4C0CE" strokeWidth="2.5" fill="none"/>
          </g>
        )}
      </svg>

      {/* Z z z sleep marks */}
      {sleeping && (
        <>
          {[
            { x: 70, y: -10, size: 14, delay: 0 },
            { x: 88, y: -28, size: 11, delay: 1.5 },
            { x: 100, y: -42, size: 9, delay: 3 },
          ].map((z, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${z.x}%`, top: `${z.y}%`,
              fontFamily: 'var(--serif)', fontStyle: 'italic',
              fontSize: z.size, fontWeight: 500,
              color: '#FFF9E0',
              animation: `zzz-float 4s ease-in-out infinite`,
              animationDelay: `${z.delay}s`,
              textShadow: '0 0 8px rgba(255,217,147,0.5)',
            }}>z</div>
          ))}
        </>
      )}
    </div>
  );
}

// Sitting / meditating fox (without moon)
export function MeditatingFox({ size = 180, breath = true, mood = 'lavender' }) {
  const state = breath ? 'running' : 'paused';
  const palette = {
    lavender: { body1: '#E2D5F5', body2: '#B9A6E8', body3: '#6E55B3' },
    peach:    { body1: '#FFE0CC', body2: '#F5B889', body3: '#C97550' },
    rose:     { body1: '#F4D1D8', body2: '#E89BB0', body3: '#B85F75' },
  }[mood] || { body1: '#E2D5F5', body2: '#B9A6E8', body3: '#6E55B3' };

  return (
    <div style={{
      width: size, height: size * 1.05, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', width: size * 0.9, height: size * 0.9,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,213,138,0.4) 0%, transparent 60%)',
        filter: 'blur(20px)',
        animation: 'breathe-glow 6s ease-in-out infinite',
        animationPlayState: state,
      }}/>

      <svg width={size} height={size * 1.05} viewBox="0 0 200 210" style={{
        animation: 'breathe 6s ease-in-out infinite',
        animationPlayState: state,
        position: 'relative',
        transformOrigin: 'center 65%',
      }}>
        <defs>
          <radialGradient id="mfsBody" cx="40%" cy="30%" r="80%">
            <stop offset="0%" stopColor={palette.body1}/>
            <stop offset="55%" stopColor={palette.body2}/>
            <stop offset="100%" stopColor={palette.body3}/>
          </radialGradient>
          <radialGradient id="mfsBelly" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#FFF9E0"/>
            <stop offset="100%" stopColor="#F0DCA8"/>
          </radialGradient>
          <radialGradient id="mfsEar" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F4C0CE"/>
            <stop offset="100%" stopColor="#C97990"/>
          </radialGradient>
        </defs>

        {/* tail behind */}
        <ellipse cx="55" cy="160" rx="32" ry="18" fill="url(#mfsBody)" transform="rotate(-20 55 160)"/>
        <ellipse cx="40" cy="155" rx="14" ry="10" fill="#FFF9E0" opacity="0.9" transform="rotate(-20 40 155)"/>

        {/* legs/paws (crossed sitting) */}
        <ellipse cx="70" cy="170" rx="20" ry="14" fill="url(#mfsBody)"/>
        <ellipse cx="130" cy="170" rx="20" ry="14" fill="url(#mfsBody)"/>

        {/* body */}
        <ellipse cx="100" cy="135" rx="50" ry="42" fill="url(#mfsBody)"/>
        <ellipse cx="100" cy="145" rx="34" ry="28" fill="url(#mfsBelly)"/>

        {/* hands at center (meditation) */}
        <ellipse cx="100" cy="160" rx="18" ry="10" fill="url(#mfsBelly)"/>

        {/* head */}
        {/* ears */}
        <path d="M 75 75 L 65 35 Q 60 28 72 38 Q 88 50 92 65 Z" fill="url(#mfsBody)"/>
        <path d="M 75 70 L 72 48 Q 74 42 78 52 Q 82 60 86 65 Z" fill="url(#mfsEar)"/>
        <path d="M 128 75 L 138 35 Q 143 28 132 38 Q 116 50 112 65 Z" fill="url(#mfsBody)"/>
        <path d="M 128 70 L 131 48 Q 130 42 126 52 Q 122 60 118 65 Z" fill="url(#mfsEar)"/>

        {/* head body */}
        <ellipse cx="102" cy="90" rx="44" ry="40" fill="url(#mfsBody)"/>

        {/* face cream patch */}
        <path d="M 78 92 Q 78 78 102 78 Q 126 78 126 92 Q 126 116 102 116 Q 78 116 78 92 Z" fill="url(#mfsBelly)"/>

        {/* blush */}
        <ellipse cx="78" cy="102" rx="7" ry="4.5" fill="#E89BB0" opacity="0.55"/>
        <ellipse cx="126" cy="102" rx="7" ry="4.5" fill="#E89BB0" opacity="0.55"/>

        {/* eyes closed */}
        <g style={{ animation: 'blink-eye 6s ease-in-out infinite', transformOrigin: '91px 92px' }}>
          <path d="M 85 93 Q 91 89 97 93" stroke="#2A1F5C" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        </g>
        <g style={{ animation: 'blink-eye 6s ease-in-out infinite', transformOrigin: '113px 92px' }}>
          <path d="M 107 93 Q 113 89 119 93" stroke="#2A1F5C" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        </g>

        {/* eyelashes hint */}
        <path d="M 86 92 L 84 89" stroke="#2A1F5C" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M 118 92 L 120 89" stroke="#2A1F5C" strokeWidth="1.2" strokeLinecap="round"/>

        {/* nose + mouth */}
        <ellipse cx="102" cy="105" rx="3.5" ry="2.5" fill="#2A1F5C"/>
        <path d="M 102 107 L 102 110 Q 102 113 99 113 M 102 110 Q 102 113 105 113" stroke="#2A1F5C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// Small mascot avatar for tabs / profile / category cards
export function FoxAvatar({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="faBody" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#E2D5F5"/>
          <stop offset="100%" stopColor="#7C6BD9"/>
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="28" fill="url(#faBody)"/>
      <path d="M 18 18 L 13 8 Q 14 6 18 12 Q 22 15 24 22 Z" fill="url(#faBody)"/>
      <path d="M 42 18 L 47 8 Q 46 6 42 12 Q 38 15 36 22 Z" fill="url(#faBody)"/>
      <ellipse cx="30" cy="35" rx="13" ry="11" fill="#FFF9E0"/>
      <path d="M 24 32 Q 27 30 30 32" stroke="#2A1F5C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 30 32 Q 33 30 36 32" stroke="#2A1F5C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="30" cy="39" rx="2" ry="1.5" fill="#2A1F5C"/>
    </svg>
  );
}
