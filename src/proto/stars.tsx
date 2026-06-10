// @ts-nocheck
'use client';
import React from 'react';

// AuraSync — Stars system + flying-star animation
// Global stars state, award flow, and the animation layer.

export const StarsContext = React.createContext(null);

export function StarsProvider({ children, initial = 1365 }) {
  const [stars, setStars] = React.useState(initial);
  const [bursts, setBursts] = React.useState([]);   // {id, fromX, fromY, amount, label}
  const [pulse, setPulse] = React.useState(0);
  const pillRef = React.useRef(null);

  const award = React.useCallback((amount, fromEl, label) => {
    let from = { x: window.innerWidth - 90, y: 100 };
    if (fromEl && fromEl.getBoundingClientRect) {
      const r = fromEl.getBoundingClientRect();
      from = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    const id = Date.now() + Math.random();
    setBursts(b => [...b, { id, fromX: from.x, fromY: from.y, amount, label }]);

    // Update counter mid-flight so the number lands with the star
    setTimeout(() => {
      setStars(s => s + amount);
      setPulse(p => p + 1);
    }, 650);
    setTimeout(() => {
      setBursts(b => b.filter(x => x.id !== id));
    }, 1100);
  }, []);

  // Expose globally for cross-component awards
  React.useEffect(() => {
    window.__awardStars = (amount, fromEl, label) => award(amount, fromEl, label);
    return () => { try { delete window.__awardStars; } catch (e) {} };
  }, [award]);

  const ctx = { stars, award, pillRef, pulse };
  return (
    <StarsContext.Provider value={ctx}>
      {children}
      <StarsLayer bursts={bursts} pillRef={pillRef}/>
    </StarsContext.Provider>
  );
}

export function useStars() {
  return React.useContext(StarsContext) || { stars: 0, award: () => {}, pillRef: { current: null }, pulse: 0 };
}

export function StarsLayer({ bursts, pillRef }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999,
      overflow: 'hidden',
    }}>
      {bursts.map(b => (
        <FlyingStar key={b.id} burst={b} pillRef={pillRef}/>
      ))}
    </div>
  );
}

export function FlyingStar({ burst, pillRef }) {
  const [target] = React.useState(() => {
    const pill = pillRef.current;
    if (pill && pill.getBoundingClientRect) {
      const r = pill.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return { x: window.innerWidth - 90, y: 64 };
  });

  const dx = target.x - burst.fromX;
  const dy = target.y - burst.fromY;
  const animName = `fly-${Math.round(burst.id * 1000)}`;
  const labelAnim = `pop-${Math.round(burst.id * 1000)}`;

  // Subtle, quick: small star drifts to pill, soft label floats up
  const keyframes = `
    @keyframes ${animName} {
      0%   { transform: translate(0px, 0px) scale(0.5); opacity: 0; }
      20%  { transform: translate(0px, -2px) scale(1); opacity: 0.85; }
      100% { transform: translate(${dx}px, ${dy}px) scale(0.5); opacity: 0; }
    }
    @keyframes ${labelAnim} {
      0%   { transform: translate(-50%, 0) scale(0.85); opacity: 0; }
      25%  { transform: translate(-50%, -8px) scale(1); opacity: 0.9; }
      100% { transform: translate(-50%, -22px) scale(0.92); opacity: 0; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>

      {/* small flying star */}
      <div style={{
        position: 'absolute', left: burst.fromX, top: burst.fromY,
        animation: `${animName} 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
        pointerEvents: 'none', willChange: 'transform, opacity',
      }}>
        <span style={{
          display: 'block',
          fontSize: 13, lineHeight: 1, color: '#FFE7A8',
          filter: 'drop-shadow(0 0 5px rgba(244,213,138,0.6))',
        }}>★</span>
      </div>

      {/* tiny +N pop at source */}
      <div style={{
        position: 'absolute', left: burst.fromX, top: burst.fromY - 14,
        animation: `${labelAnim} 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) forwards`,
        pointerEvents: 'none', whiteSpace: 'nowrap',
        fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
        color: '#FFE7A8',
        textShadow: '0 1px 4px rgba(20,14,50,0.6)',
        letterSpacing: 0.2,
      }}>
        +{burst.amount}<span style={{ marginLeft: 3 }}>★</span>
      </div>
    </>
  );
}

// Helper hook to add pulse animation to receiving element when stars change
export function useStarsPulse() {
  const { pulse } = useStars();
  const [active, setActive] = React.useState(false);
  React.useEffect(() => {
    if (pulse === 0) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), 600);
    return () => clearTimeout(t);
  }, [pulse]);
  return active;
}
