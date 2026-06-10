// @ts-nocheck
'use client';
import React from 'react';

// AuraSync — icons (line, 1.5 stroke)

export const Icon = ({ children, size = 20, color = 'currentColor', strokeWidth = 1.5, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}>
    {children}
  </svg>
);

export const IconHome = (p) => (<Icon {...p}><path d="M3 11L12 4l9 7v8a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-8z"/></Icon>);
export const IconLibrary = (p) => (<Icon {...p}><path d="M4 5h4v14H4zM10 5h4v14h-4zM17 6l3.5 13-1.4.4L15 6.4z"/></Icon>);
export const IconBook = (p) => (<Icon {...p}><path d="M4 4h7a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H4zM20 4h-2a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h3z"/></Icon>);
export const IconCompass = (p) => (<Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5L13 13l-3.5 1.5L11 11z" fill="currentColor" stroke="none"/></Icon>);
export const IconProfile = (p) => (<Icon {...p}><circle cx="12" cy="9" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></Icon>);
export const IconBreathe = (p) => (<Icon {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5" opacity="0.5"/></Icon>);
export const IconHelp = (p) => (<Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7v.5"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></Icon>);
export const IconPlay = (p) => (<Icon {...p} fill="currentColor"><path d="M7 5l13 7-13 7z"/></Icon>);
export const IconPause = (p) => (<Icon {...p} fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></Icon>);
export const IconBack15 = (p) => (<Icon {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 9V3"/><text x="12" y="15" fontSize="7" fontWeight="600" fill="currentColor" stroke="none" textAnchor="middle">15</text></Icon>);
export const IconFwd15 = (p) => (<Icon {...p}><path d="M21 12a9 9 0 1 1-3-6.7L21 9V3"/><text x="12" y="15" fontSize="7" fontWeight="600" fill="currentColor" stroke="none" textAnchor="middle">15</text></Icon>);
export const IconClose = (p) => (<Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>);
export const IconChevron = (p) => (<Icon {...p}><path d="M9 6l6 6-6 6"/></Icon>);
export const IconChevDown = (p) => (<Icon {...p}><path d="M6 9l6 6 6-6"/></Icon>);
export const IconCheck = (p) => (<Icon {...p}><path d="M4 12l5 5L20 7"/></Icon>);
export const IconCheckSmall = (p) => (<Icon {...p} strokeWidth={2}><path d="M5 12l4 4L19 8"/></Icon>);
export const IconSearch = (p) => (<Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Icon>);
export const IconSettings = (p) => (<Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></Icon>);
export const IconBookmark = (p) => (<Icon {...p}><path d="M6 4h12v18l-6-4-6 4z"/></Icon>);
export const IconShare = (p) => (<Icon {...p}><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 11l8-4M8 13l8 4"/></Icon>);
export const IconMic = (p) => (<Icon {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></Icon>);
export const IconEdit = (p) => (<Icon {...p}><path d="M4 20h4l11-11-4-4L4 16zM14 6l4 4"/></Icon>);
export const IconHeart = (p) => (<Icon {...p}><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6 5c2 0 3.5 1 6 3.5C14.5 6 16 5 18 5c3.5 0 5 4 3.5 7-2.5 4.5-9.5 9-9.5 9z"/></Icon>);
export const IconArrow = (p) => (<Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>);
export const IconLock = (p) => (<Icon {...p}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></Icon>);
export const IconSun = (p) => (<Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></Icon>);
export const IconMoon = (p) => (<Icon {...p}><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></Icon>);
export const IconLeaf = (p) => (<Icon {...p}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19c2-4 6-8 10-10"/></Icon>);
export const IconWave = (p) => (<Icon {...p}><path d="M3 12c2 0 2-4 4-4s2 8 4 8 2-8 4-8 2 4 4 4"/></Icon>);
export const IconClock = (p) => (<Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>);
export const IconFlame = (p) => (<Icon {...p}><path d="M12 2s4 4 4 9a4 4 0 0 1-8 0c0-2 1-3 1-3s-2 2-2 5a5 5 0 0 0 10 0c0-7-5-11-5-11z"/></Icon>);
export const IconSparkle = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2l1.5 7.5L21 11l-7.5 1.5L12 20l-1.5-7.5L3 11l7.5-1.5z"/></svg>
);
export const IconPlus = (p) => (<Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>);
export const IconWater = (p) => (<Icon {...p}><path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z"/></Icon>);
export const IconWind = (p) => (<Icon {...p}><path d="M3 9h12a3 3 0 1 0-3-3M3 15h16a3 3 0 1 1-3 3"/></Icon>);
export const IconCalendar = (p) => (<Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></Icon>);
export const IconBell = (p) => (<Icon {...p}><path d="M6 17v-5a6 6 0 1 1 12 0v5M4 17h16M10 21a2 2 0 0 0 4 0"/></Icon>);
export const IconStar = (p) => (<Icon {...p}><path d="M12 3l2.5 6 6.5.6-5 4.4 1.6 6.5L12 17l-5.6 3.5L8 14l-5-4.4 6.5-.6z"/></Icon>);
export const IconStats = (p) => (<Icon {...p}><path d="M4 19V11M9 19V5M14 19v-6M19 19v-9"/></Icon>);
export const IconNote = (p) => (<Icon {...p}><path d="M5 4h11l3 3v13H5z"/><path d="M9 12h6M9 16h4"/></Icon>);
