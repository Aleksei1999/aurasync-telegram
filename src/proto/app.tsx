// @ts-nocheck
'use client';
import React from 'react';
import { IconHome, IconLibrary, IconNote, IconStats, IconProfile } from './icons';
import { PrimaryButton } from './primitives';
import { StarsProvider } from './stars';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio } from './tweaks-panel';
import { OnboardingScreen } from './screen-onboarding';
import { TodayScreen, PlayerScreen } from './screen-today';
import { LibraryScreen, DiaryScreen, DiaryWriteModal, AnalysisScreen } from './screen-library-diary';
import { EmotionsScreen } from './screen-emotions';
import { ProfileScreen, SundayModal } from './screen-profile-sunday';
import { isOnboarded, setOnboardedFlag } from '@/lib/store';

// AuraSync — App shell, tabs, tweaks

const TABS = [
  { id: 'today',    label: 'Сегодня',    Icon: IconHome },
  { id: 'library',  label: 'Библиотека', Icon: IconLibrary },
  { id: 'diary',    label: 'Дневник',    Icon: IconNote },
  { id: 'analysis', label: 'Анализ',     Icon: IconStats },
  { id: 'profile',  label: 'Профиль',    Icon: IconProfile },
];

function TabBar({ active, onChange }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 26, paddingTop: 14, paddingLeft: 14, paddingRight: 14,
      zIndex: 60, pointerEvents: 'none',
    }}>
      <div style={{
        position: 'relative',
        background: 'rgba(255, 249, 224, 0.96)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: '1px solid rgba(42, 31, 92, 0.06)',
        borderRadius: 28, padding: 6,
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0,
        alignItems: 'center',
        pointerEvents: 'auto',
        boxShadow: '0 8px 24px rgba(20, 14, 50, 0.20)',
      }}>
        {TABS.map(t => <TabItem key={t.id} t={t} on={active === t.id} onClick={() => onChange(t.id)}/>)}
      </div>
    </div>
  );
}

function TabItem({ t, on, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 4px', borderRadius: 22,
      background: on
        ? 'linear-gradient(180deg, #9A87E5, #5C4BC0)'
        : 'transparent',
      border: 'none', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      transition: 'background 0.3s ease',
      boxShadow: on ? '0 4px 12px rgba(92, 75, 192, 0.35)' : 'none',
    }}>
      <t.Icon size={18} color={on ? '#FFF9E0' : '#5C4BC0'} strokeWidth={1.7}/>
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 9.5, fontWeight: 500, letterSpacing: 0.1,
        color: on ? '#FFF9E0' : '#756DA0',
      }}>{t.label}</span>
    </button>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "daypart": "evening"
}/*EDITMODE-END*/;

const IS_DEV = process.env.NODE_ENV === 'development';

export function App({ onModeChange, userName, userPhoto }) {
  return (
    <StarsProvider initial={0}>
      <AppInner onModeChange={onModeChange} userName={userName} userPhoto={userPhoto}/>
    </StarsProvider>
  );
}

function AppInner({ onModeChange, userName, userPhoto }) {
  const [onboarded, setOnboarded] = React.useState(true);
  const [user, setUser] = React.useState({ name: userName || 'Анна', tone: 'вы', pain: 'anxiety', photo: userPhoto || null });
  const [tab, setTab] = React.useState('today');
  const [player, setPlayer] = React.useState(null);
  const [diaryWrite, setDiaryWrite] = React.useState(false);
  const [sunday, setSunday] = React.useState(false);

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // First-run: show onboarding unless it was completed before
  React.useEffect(() => {
    try {
      setOnboarded(isOnboarded());
    } catch (e) {}
  }, []);

  // Keep the user's name + photo in sync with the Telegram profile
  React.useEffect(() => {
    if (userName) setUser(prev => ({ ...prev, name: userName }));
  }, [userName]);
  React.useEffect(() => {
    if (userPhoto) setUser(prev => ({ ...prev, photo: userPhoto }));
  }, [userPhoto]);

  // status bar always uses light text on the dark night/dawn backgrounds
  React.useEffect(() => {
    onModeChange && onModeChange(true);
  }, [onModeChange]);

  const finishOnboarding = () => {
    try { setOnboardedFlag(); } catch (e) {}
    setOnboarded(true);
  };

  const openPlayer = (practice) => setPlayer(practice);

  if (!onboarded) {
    return (
      <>
        <OnboardingScreen
          onDone={finishOnboarding}
          setUser={(u) => setUser(prev => ({ ...prev, ...u }))}
        />
        {IS_DEV && (
          <TweaksPanel title="Tweaks">
            <TweakSection title="Поток">
              <PrimaryButton variant="outline" size="sm" onClick={finishOnboarding}>
                Пропустить онбординг
              </PrimaryButton>
            </TweakSection>
          </TweaksPanel>
        )}
      </>
    );
  }

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} key={tab}>
        {tab === 'today' && (
          <TodayScreen
            user={user}
            daypart={t.daypart}
            onOpenPlayer={openPlayer}
            onOpenDiary={() => setTab('diary')}
            onOpenProfile={() => setTab('profile')}
            onOpenSunday={() => setSunday(true)}
          />
        )}
        {tab === 'library' && <LibraryScreen onOpenPlayer={openPlayer}/>}
        {tab === 'diary'   && <DiaryScreen onOpenWrite={() => setDiaryWrite(true)} onOpenMap={() => setTab('map')}/>}
        {tab === 'map'      && <EmotionsScreen onOpenCompass={() => {}} onClose={() => setTab('diary')}/>}
        {tab === 'analysis' && <AnalysisScreen/>}
        {tab === 'profile' && <ProfileScreen user={user} onReplayOnboarding={() => setOnboarded(false)} onAwardDemo={(e) => window.__awardStars && window.__awardStars(50, e.currentTarget, 'демо')}/>}
      </div>

      <TabBar active={tab} onChange={setTab}/>

      {player && <PlayerScreen practice={player} onClose={() => setPlayer(null)}/>}
      {diaryWrite && <DiaryWriteModal onClose={() => setDiaryWrite(false)} onSave={() => setDiaryWrite(false)}/>}
      {sunday && <SundayModal user={user} onClose={() => setSunday(false)}/>}

      {IS_DEV && (
        <TweaksPanel title="Tweaks">
          <TweakSection title="Время суток">
            <TweakRadio
              value={t.daypart}
              options={[
                { value: 'morning', label: 'утро' },
                { value: 'day',     label: 'день' },
                { value: 'evening', label: 'вечер' },
              ]}
              onChange={v => setTweak('daypart', v)}/>
            <div style={{ height: 6 }}/>
            <TweakRadio
              value={t.daypart}
              options={[
                { value: 'night',   label: 'ночь' },
                { value: 'sunday',  label: 'воскр' },
              ]}
              onChange={v => setTweak('daypart', v)}/>
          </TweakSection>
          <TweakSection title="Сценарии">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <PrimaryButton variant="outline" size="sm" onClick={() => setSunday(true)}>
                Воскресный отчёт
              </PrimaryButton>
              <PrimaryButton variant="outline" size="sm" onClick={() => setPlayer({
                id: 'demo', title: 'Удлинённый выдох',
                subtitle: 'вдох 3 · выдох 6', mins: 10,
                mood: 'lavender', tag: 'дыхание', gradient: 'lavender',
              })}>
                Открыть плеер
              </PrimaryButton>
              <PrimaryButton variant="outline" size="sm" onClick={() => setOnboarded(false)}>
                Пройти онбординг
              </PrimaryButton>
            </div>
          </TweakSection>
        </TweaksPanel>
      )}
    </>
  );
}

export { TabBar };
