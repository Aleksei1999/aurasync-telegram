// @ts-nocheck
'use client';
import React from 'react';
import { IconChevron, IconCheckSmall, IconArrow } from './icons';
import { StarrySky, PineSilhouettes, Particles, BreathingCircle, ProgressDots, PrimaryButton, Sparkle, Icon3D } from './primitives';
import { MoonFox, FoxAvatar } from './mascot';
import { MAIN_PAINS, PAIN_PROGRAMS } from './data';
import { saveOnboarding } from '@/lib/store';

// AuraSync — Full onboarding (20 screens per spec 01.1)

export const LIFE_STAGES = [
  { id: 'study',     emoji: '📚', label: 'Учёба, экзамены, начало карьеры' },
  { id: 'career',    emoji: '💼', label: 'Активная карьера, много работы' },
  { id: 'relation',  emoji: '💑', label: 'Отношения, построение семьи' },
  { id: 'pregnant',  emoji: '🤰', label: 'Беременность или послеродовой' },
  { id: 'mother',    emoji: '👶', label: 'Материнство (маленькие дети)' },
  { id: 'breakup',   emoji: '💔', label: 'Расставание или развод' },
  { id: 'loss',      emoji: '🕊️', label: 'Потеря близкого' },
  { id: 'change',    emoji: '🔄', label: 'Переезд, смена жизни' },
  { id: 'stable',    emoji: '🏠', label: 'Стабильный период, рутина' },
  { id: 'unknown',   emoji: '❓', label: 'Не знаю, как назвать — непросто' },
];

export const EMO_BG = [
  { id: 'tired',    emoji: '😩', label: 'Усталость, нет сил' },
  { id: 'anxious',  emoji: '😰', label: 'Тревога, беспокойство' },
  { id: 'apathy',   emoji: '😶', label: 'Апатия, ничего не хочется' },
  { id: 'sad',      emoji: '😢', label: 'Грусть, подавленность' },
  { id: 'angry',    emoji: '😤', label: 'Раздражительность, злость' },
  { id: 'overload', emoji: '🫠', label: 'Перегрузка, «не тяну»' },
  { id: 'guilt',    emoji: '😔', label: 'Вина, самокритика' },
  { id: 'empty',    emoji: '🫥', label: 'Пустота, оторванность от себя' },
  { id: 'fear',     emoji: '😟', label: 'Страх, неуверенность в будущем' },
  { id: 'lonely',   emoji: '🥺', label: 'Одиночество' },
  { id: 'mood',     emoji: '🔄', label: 'Перепады настроения' },
  { id: 'flood',    emoji: '🌊', label: 'Эмоции захлёстывают' },
  { id: 'ok',       emoji: '✨', label: 'В целом нормально, хочу глубже' },
];

export const GOALS = [
  { id: 'relax',   emoji: '😌', label: 'Расслабляться, снижать напряжение' },
  { id: 'sleep',   emoji: '😴', label: 'Наладить сон' },
  { id: 'energy',  emoji: '⚡', label: 'Вернуть энергию и ресурс' },
  { id: 'understand', emoji: '🪞', label: 'Понимать свои эмоции и реакции' },
  { id: 'kinder', emoji: '🫶', label: 'Относиться к себе с добротой' },
  { id: 'focus',  emoji: '🎯', label: 'Улучшить фокус и продуктивность' },
  { id: 'ritual', emoji: '🧘', label: 'Создать ежедневный ритуал' },
  { id: 'cope',   emoji: '💪', label: 'Справляться с трудными эмоциями' },
  { id: 'growth', emoji: '🌱', label: 'Личностный рост, самопознание' },
];

export const EXCLUDES = [
  { id: 'hold',    emoji: '🫁', label: 'Дыхание с задержкой' },
  { id: 'lying',   emoji: '🛏', label: 'Практики лёжа' },
  { id: 'visual',  emoji: '🌌', label: 'Визуализации и воображение' },
  { id: 'active',  emoji: '💨', label: 'Активное дыхание' },
];

// Per-pain detail questions (spec 01.1, screen 12)
export function painDetailFor(painId) {
  return {
    anxiety:   { q: 'Как давно это с вами?', sub: 'Понимание длительности помогает определить, с каких техник начать.', options: ['Несколько недель', 'Несколько месяцев', 'Больше полугода', 'Сколько себя помню'] },
    burnout:   { q: 'Как это проявляется?', sub: 'Выгорание бывает разным. Важно понять, какой тип практик уместен.', options: ['Физическая усталость — тело не восстанавливается', 'Эмоциональная пустота — ничего не чувствую', 'Когнитивная перегрузка — голова не работает', 'Всё вместе'] },
    insomnia:  { q: 'Что именно мешает сну?', sub: '', options: ['Долго засыпаю', 'Просыпаюсь среди ночи', 'Просыпаюсь слишком рано', 'Сплю, но не высыпаюсь'] },
    breakup:   { q: 'Когда это произошло?', sub: 'Разные этапы требуют разного подхода.', options: ['Меньше месяца назад', '1–3 месяца', '3–6 месяцев', 'Больше полугода, но всё ещё тяжело'] },
    lost:      { q: 'Что ближе?', sub: '', options: ['Не понимаю, чего хочу', 'Знаю, чего хочу, но не могу начать', 'Раньше знала, сейчас потеряла', 'Никогда толком не понимала'] },
    mood:      { q: 'Как давно вы это замечаете?', sub: '', options: ['Несколько недель', 'Несколько месяцев', 'Больше полугода', 'Сколько себя помню'] },
    selfcrit:  { q: 'Когда внутренний критик громче всего?', sub: '', options: ['С утра', 'После рабочих ситуаций', 'Перед сном', 'Постоянно фоном'] },
    lonely:    { q: 'Что ближе?', sub: '', options: ['Нет близкого человека', 'Близкие есть, но без глубокой связи', 'Период перемен — старые ушли', 'Не могу быть собой с теми, кто рядом'] },
    pms:       { q: 'В какой фазе сложнее всего?', sub: '', options: ['Перед месячными (ПМС)', 'Во время', 'После, восстановление', 'Цикл нерегулярный'] },
    future:    { q: 'Чего боитесь сильнее?', sub: '', options: ['Финансовой нестабильности', 'Здоровья и старости', 'Глобальных событий', 'Не справиться, остаться одна'] },
    perfect:   { q: 'Где это сильнее всего?', sub: '', options: ['Работа и достижения', 'Внешность и тело', 'Отношения и быть «удобной»', 'Везде'] },
    numb:      { q: 'Как давно вы это замечаете?', sub: '', options: ['Несколько недель', 'Несколько месяцев', 'Больше полугода', 'Не помню, когда было иначе'] },
    calm:      { q: 'Что мешает выдохнуть прямо сейчас?', sub: '', options: ['Много задач', 'Тревожные мысли', 'Конфликт с близкими', 'Не могу понять что'] },
    understand:{ q: 'С чего хочется начать?', sub: '', options: ['Со словаря эмоций', 'С телесных ощущений', 'С повторяющихся паттернов', 'С детских реакций'] },
    feeling:   { q: 'Что для вас «чувствовать» сейчас?', sub: '', options: ['Замечать тело', 'Различать эмоции', 'Быть в моменте', 'Открываться людям'] },
  }[painId] || { q: 'Расскажите чуть больше', sub: '', options: ['Опция 1', 'Опция 2', 'Опция 3', 'Опция 4'] };
}

// ════════════════════════════════════════════════════════════
// Main OnboardingScreen
// ════════════════════════════════════════════════════════════
export function OnboardingScreen({ onDone, setUser, initialStep = 0, initialData = null, forcedGenerated = null }) {
  const [step, setStep] = React.useState(initialStep);
  const TOTAL = 20;

  // shared state
  const [data, setData] = React.useState(initialData || {
    name: 'Анна', tone: 'вы',
    age: null,
    lifeStage: [],
    bedtime: null, sleepHours: null, sleepQuality: null,
    rumination: null,
    activity: null, rhythm: null,
    stress: 5,
    anxiety: null,
    emoBg: [],
    pain: null,
    painDetail: null,
    goals: [],
    experience: null,
    duration: null,
    when: null, morningTime: null, eveningTime: null,
    exclude: [],
    pushes: null,
    camera: null, healthkit: null,
  });
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggle = (k, v, max = null) => setData(d => {
    const arr = d[k];
    if (arr.includes(v)) return { ...d, [k]: arr.filter(x => x !== v) };
    if (max && arr.length >= max) return d;
    return { ...d, [k]: [...arr, v] };
  });

  const [generated, setGenerated] = React.useState(forcedGenerated === true);

  // start generation timer as soon as we arrive at the final step
  React.useEffect(() => {
    if (forcedGenerated !== null) { setGenerated(forcedGenerated); return; }
    if (step === 19 && !generated) {
      const t = setTimeout(() => setGenerated(true), 3500);
      return () => clearTimeout(t);
    }
  }, [step, generated, forcedGenerated]);

  const finish = () => {
    try { saveOnboarding(data); } catch (e) {}
    setUser && setUser({ name: data.name, tone: data.tone, pain: data.pain?.id || 'anxiety' });
    onDone();
  };

  const goNext = () => {
    if (step < TOTAL - 1) setStep(s => s + 1);
    else if (step === TOTAL - 1 && generated) finish();
  };
  const goBack = () => { if (step > 0) setStep(s => s - 1); };
  const skip = () => finish();

  // Per-screen "can advance"
  const canAdv = (() => {
    switch (step) {
      case 0: return true;
      case 1: return data.name.trim().length > 0;
      case 2: return data.age != null;
      case 3: return data.lifeStage.length > 0;
      case 4: return data.bedtime != null && data.sleepHours != null && data.sleepQuality != null;
      case 5: return data.rumination != null;
      case 6: return data.activity != null && data.rhythm != null;
      case 7: return true; // stress slider always has value
      case 8: return data.anxiety != null;
      case 9: return data.emoBg.length > 0;
      case 10: return data.pain != null;
      case 11: return data.painDetail != null;
      case 12: return data.goals.length > 0;
      case 13: return data.experience != null;
      case 14: return data.duration != null;
      case 15: return data.when != null;
      case 16: return true; // exclude optional
      case 17: return data.pushes != null;
      case 18: return true; // access optional
      case 19: return generated;
      default: return false;
    }
  })();

  const ctaText = (() => {
    if (step === 0) return 'Начнём знакомство';
    if (step === 19) return generated ? 'Открыть мою неделю' : 'Подождите немного…';
    if (step === 17) return data.pushes === 'yes' ? 'Да, напоминай' : 'Дальше';
    return 'Дальше';
  })();

  // mascot on key screens
  const showMascotHero = step === 0 || step === 19;

  return (
    <div className="bg-night" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <StarrySky density={1.0}/>
      <PineSilhouettes/>
      <Particles count={8} palette="gold"/>

      {/* progress + skip */}
      <div style={{
        position: 'absolute', top: 56, left: 22, right: 22, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        {step > 0 ? (
          <button onClick={goBack} style={{
            width: 32, height: 32, borderRadius: 16,
            background: 'rgba(242,238,255,0.10)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconChevron size={14} color="var(--on-night)" style={{ transform: 'rotate(180deg)' }}/>
          </button>
        ) : <div style={{ width: 32 }}/>}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <ProgressDots step={Math.min(step, TOTAL - 1)} total={TOTAL}/>
          <div style={{ fontSize: 9, color: 'var(--on-night-3)', letterSpacing: 0.4, fontFamily: 'var(--sans)' }}>
            {step + 1} / {TOTAL}
          </div>
        </div>
        <button onClick={skip} style={{
          fontFamily: 'var(--sans)', fontSize: 12,
          color: 'var(--on-night-3)', background: 'transparent', border: 'none',
          cursor: 'pointer', letterSpacing: 0.2,
        }}>пропустить</button>
      </div>

      {/* per-step body */}
      <div className="fade-in" key={step} style={{
        position: 'absolute', inset: 0, paddingTop: 110, paddingBottom: 28,
        paddingLeft: 22, paddingRight: 22,
        display: 'flex', flexDirection: 'column',
      }}>
        {step === 0  && <Q0_Welcome/>}
        {step === 1  && <Q1_Name data={data} set={set}/>}
        {step === 2  && <Q2_Age data={data} set={set}/>}
        {step === 3  && <Q3_LifeStage data={data} toggle={toggle}/>}
        {step === 4  && <Q4_Sleep data={data} set={set}/>}
        {step === 5  && <Q5_Rumination data={data} set={set}/>}
        {step === 6  && <Q6_Activity data={data} set={set}/>}
        {step === 7  && <Q7_Stress data={data} set={set}/>}
        {step === 8  && <Q8_Anxiety data={data} set={set}/>}
        {step === 9  && <Q9_EmoBg data={data} toggle={toggle}/>}
        {step === 10 && <Q10_Pain data={data} set={set}/>}
        {step === 11 && <Q11_PainDetail data={data} set={set}/>}
        {step === 12 && <Q12_Goals data={data} toggle={toggle}/>}
        {step === 13 && <Q13_Experience data={data} set={set}/>}
        {step === 14 && <Q14_Duration data={data} set={set}/>}
        {step === 15 && <Q15_When data={data} set={set}/>}
        {step === 16 && <Q16_Exclude data={data} toggle={toggle}/>}
        {step === 17 && <Q17_Push data={data} set={set}/>}
        {step === 18 && <Q18_Access data={data} set={set}/>}
        {step === 19 && <Q19_Generating data={data} done={generated}/>}

        {/* CTA */}
        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          {step === 17 && data.pushes !== 'yes' && data.pushes !== 'no' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <PrimaryButton variant="lavender" onClick={() => { set('pushes', 'yes'); setStep(s => s + 1); }}>
                Да, напоминай <IconArrow size={16} color="#FFF9E0"/>
              </PrimaryButton>
              <PrimaryButton variant="outline" onClick={() => { set('pushes', 'no'); setStep(s => s + 1); }}>
                Не сейчас
              </PrimaryButton>
            </div>
          ) : (
            <PrimaryButton variant={canAdv ? 'lavender' : 'outline'} disabled={!canAdv} onClick={canAdv ? (step === 19 ? finish : goNext) : undefined}>
              {ctaText} {canAdv && <IconArrow size={16} color={step === 19 || canAdv ? '#FFF9E0' : 'var(--on-night)'}/>}
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step intro shared ───────────────────────────────────
export function StepIntro({ eyebrow, title, accent, sub, mascot = null }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div className="eyebrow">{eyebrow}</div>
      <div className="serif" style={{
        fontSize: 26, lineHeight: 1.1, marginTop: 10, letterSpacing: '-0.015em', color: 'var(--on-night)',
      }}>
        {title}
        {accent && <><br/><span className="serif-it" style={{ color: 'var(--dawn-peach)' }}>{accent}</span></>}
      </div>
      {sub && (
        <div style={{ fontSize: 12, lineHeight: 1.55, color: 'var(--on-night-2)', marginTop: 8 }}>
          {sub}
        </div>
      )}
      {mascot && <div style={{ marginTop: 8 }}>{mascot}</div>}
    </div>
  );
}

// ─── Generic single-select list ──────────────────────────
export function OptionList({ items, value, onPick, asGrid = false, multi = false, includes }) {
  return (
    <div style={{
      flex: 1, overflowY: 'auto', marginTop: 14,
      marginLeft: -22, marginRight: -22, padding: '4px 22px 8px',
    }}>
      <div style={{
        display: asGrid ? 'grid' : 'flex',
        gridTemplateColumns: asGrid ? '1fr 1fr' : undefined,
        flexDirection: asGrid ? undefined : 'column',
        gap: 8,
      }}>
        {items.map(item => {
          const id = typeof item === 'string' ? item : item.id || item.label;
          const label = typeof item === 'string' ? item : item.label;
          const emoji = typeof item === 'string' ? null : item.emoji;
          const on = multi ? (includes && includes(id)) : (typeof value === 'object' ? value?.id === id : value === id);
          return (
            <button key={id} onClick={() => onPick(item)} style={{
              background: on ? 'rgba(255, 249, 224, 0.96)' : 'rgba(242,238,255,0.08)',
              color: on ? 'var(--ink)' : 'var(--on-night)',
              border: `1px solid ${on ? 'transparent' : 'rgba(242,238,255,0.14)'}`,
              borderRadius: 14, padding: emoji ? '12px 14px' : '14px 16px',
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              textAlign: 'left', transition: 'all 0.2s',
              boxShadow: on ? '0 4px 16px rgba(20,14,50,0.22)' : 'none',
              fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.35,
            }}>
              {emoji && <span style={{ fontSize: 18, flexShrink: 0 }}>{emoji}</span>}
              <span style={{ flex: 1, fontWeight: 500 }}>{label}</span>
              {on && <IconCheckSmall size={14} color="var(--lav-500)"/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// QUESTIONS
// ════════════════════════════════════════════════════════════

// 1 — Welcome
export function Q0_Welcome() {
  return (
    <div className="stagger" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 240 }}>
        <MoonFox size={210} sleeping={true}/>
      </div>
      <div className="eyebrow" style={{ textAlign: 'center', marginTop: 6 }}>AuraSync</div>
      <div className="serif" style={{
        fontSize: 36, lineHeight: 1.08, textAlign: 'center',
        letterSpacing: '-0.015em', color: 'var(--on-night)', marginTop: 16,
      }}>
        Здравствуйте.<br/>
        <span className="serif-it" style={{ color: 'var(--dawn-peach)' }}>Это место,</span><br/>
        где вы учитесь<br/>
        слышать себя.
      </div>
      <div style={{
        textAlign: 'center', fontSize: 13, lineHeight: 1.55,
        color: 'var(--on-night-2)', maxWidth: 290, margin: '18px auto 0',
      }}>
        Не учить медитациям. Не убирать эмоции. А понимать, что с вами — каждый день.
      </div>
      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--on-night-3)', marginTop: 18 }}>
        Знакомство — 5–7 минут.
      </div>
    </div>
  );
}

// 2 — Name (только имя)
export function Q1_Name({ data, set }) {
  return (
    <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <StepIntro eyebrow="Знакомимся" title="Как к вам" accent="обращаться?"
        sub="Будем использовать имя в практиках и письмах. Можно изменить позже."/>
      <div className="card" style={{ padding: '16px 18px' }}>
        <div className="eyebrow on-card" style={{ fontSize: 10, marginBottom: 6 }}>Имя</div>
        <input value={data.name} onChange={e => set('name', e.target.value)} placeholder="Анна"
          style={{
            width: '100%', border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--serif)', fontSize: 28, color: 'var(--ink)',
            letterSpacing: '-0.01em',
          }}/>
      </div>
      <div style={{
        fontSize: 11, color: 'var(--on-night-3)', lineHeight: 1.55, letterSpacing: 0.1,
        padding: '0 4px',
      }}>
        Обращаемся на «вы» — нейтрально и с уважением. Тон можно изменить в настройках.
      </div>
    </div>
  );
}

// 3 — Age (точный возраст)
export function Q2_Age({ data, set }) {
  const value = typeof data.age === 'number' ? data.age : 28;
  const setAge = (v) => set('age', Math.min(80, Math.max(14, Math.round(v))));
  const inc = () => setAge(value + 1);
  const dec = () => setAge(value - 1);

  // initialise default on mount if null
  React.useEffect(() => {
    if (data.age == null) set('age', 28);
  }, []);

  // life-stage hint based on age
  const hint = (() => {
    if (value < 22) return 'учёба, ранняя карьера, поиск себя';
    if (value < 28) return 'старт карьеры, отношения, поиск ритма';
    if (value < 36) return 'активная карьера, семья, новые роли';
    if (value < 46) return 'зрелость, баланс, переосмысление';
    if (value < 56) return 'устойчивость, ценности, мудрость';
    return 'опыт, забота о себе, новые горизонты';
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Контекст" title="Сколько" accent="вам лет?"
        sub="Возраст влияет на гормональный фон, сон и эмоциональную регуляцию."/>

      <div className="card" style={{
        marginTop: 22, padding: '28px 22px 26px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <button onClick={dec} aria-label="меньше" style={ageStepBtn()}>−</button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 130 }}>
            <input
              type="number"
              inputMode="numeric"
              min={14}
              max={80}
              value={value}
              onChange={e => {
                const n = parseInt(e.target.value, 10);
                if (Number.isNaN(n)) return;
                setAge(n);
              }}
              style={{
                width: 130, textAlign: 'center', border: 'none', outline: 'none',
                background: 'transparent', color: 'var(--lav-500)',
                fontFamily: 'var(--serif)', fontSize: 88, lineHeight: 1,
                letterSpacing: '-0.04em', padding: 0,
                MozAppearance: 'textfield',
              }}
            />
            <div style={{
              fontSize: 11, color: 'var(--text-3)', marginTop: 4, letterSpacing: 0.4, textTransform: 'lowercase',
            }}>лет</div>
          </div>

          <button onClick={inc} aria-label="больше" style={ageStepBtn()}>+</button>
        </div>

        <input
          type="range"
          min={14}
          max={80}
          value={value}
          onChange={e => setAge(+e.target.value)}
          style={{ width: '100%', marginTop: 22, accentColor: 'var(--lav-400)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 10, color: 'var(--text-3)', marginTop: 6 }}>
          <span>14</span><span>30</span><span>50</span><span>80</span>
        </div>
      </div>

      <div style={{
        marginTop: 14, fontSize: 12, color: 'var(--on-night-2)', textAlign: 'center', lineHeight: 1.55, fontStyle: 'italic',
      }}>
        {hint}
      </div>
    </div>
  );
}

export function ageStepBtn() {
  return {
    width: 44, height: 44, borderRadius: 22,
    background: 'var(--sand)', color: 'var(--ink)',
    border: '1px solid var(--hairline-2)', cursor: 'pointer',
    fontFamily: 'var(--serif)', fontSize: 26, lineHeight: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    paddingBottom: 4,
  };
}

// 4 — Life stage (multi up to 3)
export function Q3_LifeStage({ data, toggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Контекст" title="Что сейчас" accent="происходит в жизни?"
        sub="Можно выбрать до 3. Контекст определяет, какие практики уместны."/>
      <OptionList
        items={LIFE_STAGES}
        multi
        includes={(id) => data.lifeStage.includes(id)}
        onPick={(item) => toggle('lifeStage', item.id, 3)}
      />
    </div>
  );
}

// 5 — Sleep (3 sub)
export function Q4_Sleep({ data, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Сон" title="Расскажите" accent="про свой сон"
        sub="Сон — фундамент эмоционального состояния."/>
      <div style={{ flex: 1, overflowY: 'auto', marginTop: 14, marginLeft: -22, marginRight: -22, padding: '4px 22px 8px' }}>
        <SubQ label="Во сколько обычно ложитесь?" options={['До 22:00', '22:00–23:00', '23:00–00:00', 'После полуночи']} value={data.bedtime} onPick={v => set('bedtime', v)}/>
        <SubQ label="Сколько часов обычно спите?" options={['Меньше 5', '5–6', '6–7', '7–8', 'Больше 8']} value={data.sleepHours} onPick={v => set('sleepHours', v)}/>
        <SubQ label="Как оцениваете качество сна?" options={[
          'Сплю хорошо, высыпаюсь', 'Бывает по-разному', 'Часто не высыпаюсь', 'Серьёзные проблемы со сном',
        ]} value={data.sleepQuality} onPick={v => set('sleepQuality', v)}/>
      </div>
    </div>
  );
}

export function SubQ({ label, options, value, onPick }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map(o => {
          const on = value === o;
          return (
            <button key={o} onClick={() => onPick(o)} style={{
              padding: '8px 12px', borderRadius: 12,
              background: on ? '#FFF9E0' : 'rgba(242,238,255,0.08)',
              color: on ? 'var(--ink)' : 'var(--on-night)',
              border: `1px solid ${on ? 'transparent' : 'rgba(242,238,255,0.14)'}`,
              fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}>{o}</button>
          );
        })}
      </div>
    </div>
  );
}

// 6 — Rumination
export function Q5_Rumination({ data, set }) {
  const opts = ['Нет, засыпаю легко', 'Иногда, раз в неделю', 'Часто, несколько раз в неделю', 'Почти каждую ночь'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Сон · мысли" title="Не можете уснуть" accent="из-за мыслей?"
        sub="Руминация — главная причина нарушения сна. С ней работают конкретные техники."/>
      <OptionList items={opts} value={data.rumination} onPick={v => set('rumination', v)}/>
    </div>
  );
}

// 7 — Activity + rhythm (2 sub)
export function Q6_Activity({ data, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Распорядок" title="Как выглядит" accent="ваш обычный день?"
        sub="Активность и ритм влияют на кортизол и способность расслабляться."/>
      <div style={{ flex: 1, overflowY: 'auto', marginTop: 14, marginLeft: -22, marginRight: -22, padding: '4px 22px 8px' }}>
        <SubQ label="Физическая активность" options={['Ежедневно', '2–3 раза в неделю', 'Редко, иногда пешком', 'Почти нет']} value={data.activity} onPick={v => set('activity', v)}/>
        <SubQ label="Ваш ритм" options={['Стабильный график', 'Плавающий, но предсказуемый', 'Хаотичный', 'Перегруженный']} value={data.rhythm} onPick={v => set('rhythm', v)}/>
      </div>
    </div>
  );
}

// 8 — Stress slider
export function Q7_Stress({ data, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Сейчас" title="Насколько вы" accent="напряжены?"
        sub="Честная оценка поможет подобрать правильную интенсивность. Выберите первое, что откликается."/>
      <div className="card" style={{ marginTop: 22, padding: 24 }}>
        <div className="serif" style={{
          fontSize: 72, textAlign: 'center', color: 'var(--lav-500)', lineHeight: 1, letterSpacing: '-0.02em',
        }}>{data.stress}</div>
        <div style={{ fontSize: 11, textAlign: 'center', color: 'var(--text-3)', marginTop: 4 }}>из 10</div>
        <input type="range" min={1} max={10} value={data.stress}
          onChange={e => set('stress', +e.target.value)}
          style={{ width: '100%', marginTop: 22, accentColor: 'var(--lav-400)' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-3)', marginTop: 10 }}>
          <span>спокойно</span><span>заметно</span><span>на пределе</span>
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 12, color: 'var(--on-night-2)', textAlign: 'center', lineHeight: 1.5 }}>
        {data.stress <= 2 && '1–2: спокойно, всё в порядке'}
        {data.stress >= 3 && data.stress <= 4 && '3–4: есть фоновое напряжение, но терпимо'}
        {data.stress >= 5 && data.stress <= 6 && '5–6: заметный стресс, сложно расслабиться'}
        {data.stress >= 7 && data.stress <= 8 && '7–8: сильное напряжение, влияет на жизнь'}
        {data.stress >= 9 && '9–10: на пределе. Мы будем мягко'}
      </div>
    </div>
  );
}

// 9 — Anxiety
export function Q8_Anxiety({ data, set }) {
  const opts = [
    'Редко или почти никогда',
    'Иногда — перед важными событиями',
    'Регулярно — фоновое «что-то не так»',
    'Постоянно, мешает нормально жить',
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Тревога" title="Как часто" accent="чувствуете тревогу?"
        sub="Тревога — не слабость. Это сигнал нервной системы, с ним можно работать."/>
      <OptionList items={opts} value={data.anxiety} onPick={v => set('anxiety', v)}/>
    </div>
  );
}

// 10 — Emo background (multi)
export function Q9_EmoBg({ data, toggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Состояние" title="Что чаще всего" accent="чувствуете?"
        sub="Выберите всё, что откликается."/>
      <OptionList
        items={EMO_BG}
        multi
        includes={(id) => data.emoBg.includes(id)}
        onPick={item => toggle('emoBg', item.id)}
      />
    </div>
  );
}

// 11 — Main pain ⭐
export function Q10_Pain({ data, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <div className="fade-up" style={{ flexShrink: 0 }}>
        <div className="eyebrow">
          <Sparkle size={9} color="var(--dawn-gold)"/> ключевой вопрос
        </div>
        <div className="serif" style={{
          fontSize: 26, lineHeight: 1.1, marginTop: 10, letterSpacing: '-0.015em', color: 'var(--on-night)',
        }}>
          Что сейчас<br/>
          <span className="serif-it" style={{ color: 'var(--dawn-peach)' }}>беспокоит сильнее?</span>
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--on-night-2)', marginTop: 8 }}>
          Программа строится вокруг вашего выбора. Сон, стресс, образ жизни — тоже учитываются.
        </div>
      </div>
      <OptionList
        items={MAIN_PAINS}
        value={data.pain}
        onPick={item => set('pain', item)}
      />
    </div>
  );
}

// 12 — Pain detail (conditional)
export function Q11_PainDetail({ data, set }) {
  const detail = painDetailFor(data.pain?.id || 'anxiety');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow={data.pain?.label || 'Подробнее'} title={detail.q.split('?')[0]} accent={detail.q.includes('?') ? detail.q.split(' ').slice(-2).join(' ').replace('?','?') : null}
        sub={detail.sub}/>
      <OptionList items={detail.options} value={data.painDetail} onPick={v => set('painDetail', v)}/>
    </div>
  );
}

// 13 — Goals (multi up to 3)
export function Q12_Goals({ data, toggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Цели" title="Чего хотите" accent="достичь?"
        sub="Можно выбрать до 3. Они дополнят основную программу."/>
      <OptionList
        items={GOALS}
        multi
        includes={(id) => data.goals.includes(id)}
        onPick={item => toggle('goals', item.id, 3)}
      />
    </div>
  );
}

// 14 — Experience
export function Q13_Experience({ data, set }) {
  const opts = [
    { emoji: '🌱', label: 'Никогда не пробовали' },
    { emoji: '🌿', label: 'Пробовали несколько раз' },
    { emoji: '🌳', label: 'Практикую регулярно' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Опыт" title="Был опыт с" accent="медитациями?"
        sub="Подберём уровень: новичкам — мягкие техники, опытным — глубже."/>
      <OptionList items={opts} value={data.experience} onPick={item => set('experience', item.label)}/>
    </div>
  );
}

// 15 — Duration
export function Q14_Duration({ data, set }) {
  const opts = [
    { emoji: '⏱', label: '5–7 минут', desc: 'быстрый ритуал, для загруженных дней' },
    { emoji: '⏱', label: '10 минут',  desc: 'золотая середина, рекомендуем' },
    { emoji: '⏱', label: '15–20 минут', desc: 'глубокое погружение' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Время" title="Сколько времени" accent="на практику?"
        sub="Утренняя и вечерняя — отдельно."/>
      <div style={{ flex: 1, overflowY: 'auto', marginTop: 14, marginLeft: -22, marginRight: -22, padding: '4px 22px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {opts.map(o => {
            const on = data.duration === o.label;
            return (
              <button key={o.label} onClick={() => set('duration', o.label)} style={{
                background: on ? 'rgba(255,249,224,0.96)' : 'rgba(242,238,255,0.08)',
                color: on ? 'var(--ink)' : 'var(--on-night)',
                border: `1px solid ${on ? 'transparent' : 'rgba(242,238,255,0.14)'}`,
                borderRadius: 16, padding: '16px 18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                boxShadow: on ? '0 4px 14px rgba(20,14,50,0.18)' : 'none',
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 22 }}>{o.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div className="serif" style={{ fontSize: 20, letterSpacing: '-0.005em' }}>{o.label}</div>
                  <div style={{ fontSize: 11, marginTop: 2, color: on ? 'var(--text-2)' : 'var(--on-night-3)' }}>{o.desc}</div>
                </div>
                {on && <IconCheckSmall size={14} color="var(--lav-500)"/>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 16 — When (with sub time)
export function Q15_When({ data, set }) {
  const opts = [
    { id: 'morning', emoji: '🌅', label: 'Утром' },
    { id: 'evening', emoji: '🌙', label: 'Вечером' },
    { id: 'both',    emoji: '🌅🌙', label: 'И утром, и вечером', rec: 'рекомендуем' },
  ];
  const showMorning = data.when === 'morning' || data.when === 'both';
  const showEvening = data.when === 'evening' || data.when === 'both';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Расписание" title="Когда вам" accent="удобнее?"
        sub="Подберём практики и время напоминаний."/>
      <div style={{ flex: 1, overflowY: 'auto', marginTop: 14, marginLeft: -22, marginRight: -22, padding: '4px 22px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {opts.map(o => {
            const on = data.when === o.id;
            return (
              <button key={o.id} onClick={() => set('when', o.id)} style={{
                background: on ? 'rgba(255,249,224,0.96)' : 'rgba(242,238,255,0.08)',
                color: on ? 'var(--ink)' : 'var(--on-night)',
                border: `1px solid ${on ? 'transparent' : 'rgba(242,238,255,0.14)'}`,
                borderRadius: 16, padding: '14px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 20 }}>{o.emoji}</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span className="serif" style={{ fontSize: 18, letterSpacing: '-0.005em' }}>{o.label}</span>
                  {o.rec && <span style={{ fontSize: 10, color: 'var(--dawn-peach)', fontStyle: 'italic' }}>{o.rec}</span>}
                </div>
                {on && <IconCheckSmall size={14} color="var(--lav-500)"/>}
              </button>
            );
          })}
        </div>

        {showMorning && (
          <div className="fade-up" style={{ marginTop: 16 }}>
            <SubQ label="Утреннее напоминание" options={['6:00–7:00', '7:00–8:00', '8:00–9:00', '9:00–10:00', 'Позже']} value={data.morningTime} onPick={v => set('morningTime', v)}/>
          </div>
        )}
        {showEvening && (
          <div className="fade-up">
            <SubQ label="Вечернее напоминание" options={['20:00', '21:00', '22:00', '23:00']} value={data.eveningTime} onPick={v => set('eveningTime', v)}/>
          </div>
        )}
      </div>
    </div>
  );
}

// 17 — Exclude formats (multi optional)
export function Q16_Exclude({ data, toggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <StepIntro eyebrow="Предпочтения" title="Есть форматы," accent="которые не подходят?"
        sub="Исключим их. Если всё ок — ничего не выбирай."/>
      <OptionList
        items={EXCLUDES}
        multi
        includes={(id) => data.exclude.includes(id)}
        onPick={item => toggle('exclude', item.id)}
      />
      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--on-night-3)', textAlign: 'center', fontStyle: 'italic' }}>
        можно ничего не выбирать
      </div>
    </div>
  );
}

// 18 — Push permissions
export function Q17_Push({ data, set }) {
  return (
    <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <StepIntro eyebrow="Доступы" title="Можно вам" accent="напоминать?"
        sub="Практика работает, когда становится привычкой. Напомним ненавязчиво."/>

      {/* Preview push */}
      <div className="card" style={{ padding: 14, borderRadius: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Icon3D size={36} gradient="peach" emoji="🌅" radius={9} lift={false}/>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)' }}>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>AuraSync</span>
              <span>сейчас</span>
            </div>
            <div style={{ fontSize: 12, marginTop: 4, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
              {data.name}, ваша утренняя практика готова — 10 минут.
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 14, borderRadius: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Icon3D size={36} gradient="lavender" emoji="🌙" radius={9} lift={false}/>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)' }}>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>AuraSync</span>
              <span>21:30</span>
            </div>
            <div style={{ fontSize: 12, marginTop: 4, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
              Пора замедлиться. Вечерняя практика ждёт.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 19 — Access (camera + healthkit)
export function Q18_Access({ data, set }) {
  return (
    <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <StepIntro eyebrow="Ещё пара вещей" title="Поможем отслеживать" accent="прогресс"
        sub="Необязательно. Можно подключить позже в настройках."/>

      <div className="card" style={{ padding: 18, borderRadius: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Icon3D size={44} gradient="rose" emoji="📷" radius={12}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Фото для сравнения</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4, lineHeight: 1.5 }}>
              Каждое воскресенье — фото, чтобы видеть, как меняется состояние со временем.
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
          <button onClick={() => set('camera', true)} style={btnSmall(data.camera === true)}>Разрешить</button>
          <button onClick={() => set('camera', false)} style={btnSmall(data.camera === false, 'ghost')}>Не сейчас</button>
        </div>
      </div>

      <div className="card" style={{ padding: 18, borderRadius: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Icon3D size={44} gradient="teal" emoji="❤️" radius={12}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>HealthKit · сон и активность</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4, lineHeight: 1.5 }}>
              Будем учитывать сон и активность при подборе практик. Всё остаётся на устройстве.
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
          <button onClick={() => set('healthkit', true)} style={btnSmall(data.healthkit === true)}>Подключить</button>
          <button onClick={() => set('healthkit', false)} style={btnSmall(data.healthkit === false, 'ghost')}>Не сейчас</button>
        </div>
      </div>
    </div>
  );
}

export function btnSmall(on, variant = 'solid') {
  if (variant === 'ghost') {
    return {
      flex: 1, padding: '10px 12px', borderRadius: 99,
      background: on ? 'var(--sand)' : 'transparent',
      border: '1px solid var(--hairline-2)',
      color: 'var(--ink-soft)', fontFamily: 'var(--sans)', fontSize: 12,
      fontWeight: 500, cursor: 'pointer',
    };
  }
  return {
    flex: 1, padding: '10px 12px', borderRadius: 99,
    background: on ? 'linear-gradient(180deg, #9A87E5, #5C4BC0)' : 'var(--cream-2)',
    border: '1px solid ' + (on ? 'transparent' : 'var(--hairline-2)'),
    color: on ? '#FFF9E0' : 'var(--ink)',
    fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
    boxShadow: on ? '0 4px 12px rgba(92,75,192,0.35)' : 'none',
  };
}

// ════════════════════════════════════════════════════════════
// 20 — Generating + wow moment (science-backed personalized result)
// ════════════════════════════════════════════════════════════

// Science methods per pain — each cites a source
export const SCIENCE_METHODS = {
  anxiety: [
    { emoji: '🫁', title: 'Удлинённый выдох',     source: 'Stanford School of Medicine, 2023',
      body: 'Выдох длиннее вдоха активирует блуждающий нерв — кортизол снижается за 5 минут.' },
    { emoji: '🌬️', title: 'Физиологический вздох', source: 'Huberman Lab · Cell Reports Medicine',
      body: 'Двойной вдох + длинный выдох. Самый быстрый способ снизить тревогу в моменте.' },
    { emoji: '🌳', title: 'Заземление 5-4-3-2-1',  source: 'Cognitive Behavioral Therapy · APA',
      body: 'Возвращает в «здесь и сейчас» через 5 органов чувств. Базовый инструмент при панике.' },
  ],
  burnout: [
    { emoji: '🛌', title: 'Body scan',            source: 'MBSR · Jon Kabat-Zinn, UMass Medical',
      body: '8-недельная MBSR-программа снижает кортизол и улучшает восстановление сна.' },
    { emoji: '🌿', title: 'Дыхание без усилия',    source: 'Polyvagal Theory · Stephen Porges',
      body: 'Активация вентрального вагуса возвращает «безопасный» режим парасимпатики.' },
    { emoji: '💧', title: 'Микро-восстановление', source: 'Recovery Research · Bonn University',
      body: '15-минутные паузы 3 раза в день предотвращают накопление эмоциональной усталости.' },
  ],
  insomnia: [
    { emoji: '🌙', title: 'Дыхание 4-7-8',         source: 'Dr. Andrew Weil · University of Arizona',
      body: 'Вдох 4 · удержание 7 · выдох 8. Засыпание ускоряется в среднем на 15 минут.' },
    { emoji: '🌊', title: 'Прогрессивная релакс.', source: 'Jacobson · AASM clinical guideline',
      body: 'Поочерёдное напряжение и расслабление мышц убирает соматическое возбуждение.' },
    { emoji: '🪷', title: 'Йога-нидра',             source: 'Bihar School of Yoga · NIH study 2022',
      body: '22 минуты йога-нидры эквивалентны 2 часам глубокого сна по EEG.' },
  ],
  breakup: [
    { emoji: '✍️', title: 'Экспрессивное письмо', source: 'James Pennebaker · UT Austin',
      body: '15 минут письма о тяжёлых эмоциях 4 дня подряд — клинически значимое улучшение.' },
    { emoji: '💛', title: 'Self-compassion',       source: 'Kristin Neff · University of Texas',
      body: 'Сочувствие к себе снижает руминацию и стыд эффективнее самооценки.' },
    { emoji: '🤲', title: 'Метта-медитация',       source: 'Fredrickson et al. · APA 2008',
      body: 'Практика любящей доброты повышает позитивные эмоции и социальную связь.' },
  ],
};

export function getScienceMethods(painId) {
  return SCIENCE_METHODS[painId] || SCIENCE_METHODS.anxiety;
}

// Build a personalized narrative paragraph based on user data
export function buildNarrative(data) {
  const parts = [];
  const stressDesc = data.stress >= 7 ? 'высокий стресс' : data.stress >= 5 ? 'заметный стресс' : 'фоновое напряжение';
  parts.push(`У вас сейчас ${stressDesc} (${data.stress}/10)`);
  if (data.sleepHours === 'Меньше 5' || data.sleepHours === '5–6') {
    parts.push(`сон короче нормы (${data.sleepHours || '6–7'} ч)`);
  } else if (data.sleepHours) {
    parts.push(`сон ${data.sleepHours} часов`);
  }
  if (data.anxiety && data.anxiety.includes('Регулярно')) parts.push('тревога приходит регулярно');
  else if (data.anxiety && data.anxiety.includes('Постоянно')) parts.push('тревога фоном постоянно');
  if (data.rumination && data.rumination.includes('Часто')) parts.push('мысли крутятся ночью');
  return parts.join(', ') + '.';
}

export function yearsWord(n) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'лет';
  if (mod10 === 1) return 'год';
  if (mod10 >= 2 && mod10 <= 4) return 'года';
  return 'лет';
}

// Summarize the data into chips
export function buildChips(data) {
  const out = [];
  if (data.age) out.push({ icon: '👤', label: `${data.age} ${yearsWord(data.age)}` });
  out.push({ icon: '⚡', label: `стресс ${data.stress}/10` });
  if (data.sleepHours) out.push({ icon: '😴', label: `сон ${data.sleepHours} ч` });
  if (data.experience) {
    const map = { 'Никогда не пробовали': 'новичок', 'Пробовали несколько раз': 'базовый опыт', 'Практикую регулярно': 'опытная' };
    out.push({ icon: '🌱', label: map[data.experience] || data.experience });
  }
  if (data.duration) out.push({ icon: '⏱', label: data.duration });
  if (data.goals && data.goals.length) out.push({ icon: '🎯', label: `${data.goals.length} ${data.goals.length === 1 ? 'цель' : 'цели'}` });
  return out;
}

export function Q19_Generating({ data, done }) {
  const program = PAIN_PROGRAMS[data.pain?.id] || PAIN_PROGRAMS.anxiety;
  const science = getScienceMethods(data.pain?.id);
  const narrative = buildNarrative(data);
  const chips = buildChips(data);

  const lines = [
    'Читаю ваши ответы…',
    `Подбираю практики под «${data.pain?.label?.toLowerCase() || 'тревогу'}»…`,
    `Учитываю стресс (${data.stress}/10), сон и образ жизни…`,
    'Сверяю с научными исследованиями…',
    'Собираю недельную программу.',
  ];
  const [shown, setShown] = React.useState(0);
  React.useEffect(() => {
    if (done) return;
    const t = setInterval(() => setShown(s => Math.min(s + 1, lines.length)), 700);
    return () => clearInterval(t);
  }, [done]);

  if (!done) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <BreathingCircle size={160} mood="lavender" cycleSec={4}/>
        <div className="serif-it" style={{ fontSize: 22, marginTop: 28, color: 'var(--on-night-2)' }}>
          подождите…
        </div>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
          {lines.map((l, i) => (
            <div key={i} style={{
              fontSize: 13, color: i < shown ? 'var(--on-night)' : 'rgba(242,238,255,0.25)',
              transition: 'all 0.4s', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {i < shown ? <IconCheckSmall size={12} color="var(--dawn-peach)"/> : <span style={{ width: 12 }}/>}
              {l}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up" style={{ flex: 1, overflowY: 'auto', marginLeft: -22, marginRight: -22, padding: '0 22px' }}>
      {/* ── HEADER ── */}
      <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Sparkle size={10} color="var(--dawn-gold)"/> программа готова
      </div>
      <div className="serif" style={{
        fontSize: 30, lineHeight: 1.08, marginTop: 8, letterSpacing: '-0.015em', color: 'var(--on-night)',
      }}>
        {data.name}, я<br/>
        <span className="serif-it" style={{ color: 'var(--dawn-peach)' }}>вас слышу</span>.
      </div>

      {/* ── PERSONAL NARRATIVE — voice from app ── */}
      <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, paddingTop: 2 }}>
          <FoxAvatar size={36}/>
        </div>
        <div className="serif-it" style={{
          fontSize: 16, lineHeight: 1.5, color: 'var(--on-night-2)', letterSpacing: '-0.003em',
        }}>
          {narrative}
        </div>
      </div>

      {/* ── DATA CHIPS — что мы услышали ── */}
      <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {chips.map((c, i) => (
          <div key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 10px', borderRadius: 99,
            background: 'rgba(242,238,255,0.08)',
            border: '1px solid rgba(242,238,255,0.12)',
            fontSize: 11, color: 'var(--on-night-2)',
          }}>
            <span style={{ fontSize: 11 }}>{c.icon}</span>{c.label}
          </div>
        ))}
      </div>

      {/* ── SECTION: НАД ЧЕМ РАБОТАЕМ ── */}
      <SectionEyebrow marginTop={26}>над чем работаем</SectionEyebrow>
      <div className="card" style={{
        padding: 0, position: 'relative', overflow: 'hidden', borderRadius: 26,
        boxShadow: 'var(--shadow-lift)',
      }}>
        <div style={{
          padding: '22px 22px 20px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #9A87E5 0%, #E89BB0 100%)',
        }}>
          <div style={{ position: 'absolute', right: -8, top: -8 }}>
            <Icon3D size={64} gradient="lavender" emoji={data.pain?.emoji}/>
          </div>
          <div style={{ position: 'relative', maxWidth: '74%' }}>
            <div className="eyebrow on-card" style={{ color: 'rgba(42,31,92,0.65)' }}>фокус</div>
            <div className="serif" style={{
              fontSize: 22, lineHeight: 1.15, marginTop: 6, letterSpacing: '-0.01em', color: 'var(--ink)',
            }}>
              {data.pain?.label}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.45 }}>
              {data.pain?.desc}
            </div>
          </div>
        </div>
        <div style={{ padding: '18px 22px' }}>
          <div className="eyebrow on-card">тема недели</div>
          <div className="serif-it" style={{
            fontSize: 24, marginTop: 6, color: 'var(--lav-500)', letterSpacing: '-0.005em',
          }}>
            «{program.theme}»
          </div>
          <div className="serif" style={{
            fontSize: 14, lineHeight: 1.55, color: 'var(--ink-soft)', marginTop: 10,
            letterSpacing: '-0.003em',
          }}>
            {program.rationale}
          </div>
        </div>
      </div>

      {/* ── SECTION: НАУЧНАЯ ОСНОВА ── */}
      <SectionEyebrow marginTop={24}>научная основа</SectionEyebrow>
      <div style={{
        padding: 16, borderRadius: 18,
        background: 'rgba(242,238,255,0.08)', border: '1px solid rgba(242,238,255,0.12)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Icon3D size={42} gradient="teal" emoji="🔬" radius={12}/>
        <div style={{ flex: 1, fontSize: 12, lineHeight: 1.5, color: 'var(--on-night-2)' }}>
          Программу под вас собрала наша система на основе клинических исследований.
          Никакой эзотерики — только техники с доказанной эффективностью.
        </div>
      </div>

      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {science.map((m, i) => (
          <div key={i} className="card" style={{ padding: 14, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon3D size={40} gradient={['teal','lavender','rose','gold'][i % 4]} emoji={m.emoji} radius={11} lift={false}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.005em' }}>
                  {m.title}
                </div>
                <div style={{ fontSize: 10, color: 'var(--lav-500)', marginTop: 3, fontWeight: 500, letterSpacing: 0.1 }}>
                  {m.source}
                </div>
              </div>
            </div>
            <div style={{
              marginTop: 10, fontSize: 12, lineHeight: 1.5, color: 'var(--ink-soft)',
              paddingLeft: 0,
            }}>
              {m.body}
            </div>
          </div>
        ))}
      </div>

      {/* ── SECTION: ВАША НЕДЕЛЯ ── */}
      <SectionEyebrow marginTop={24}>ваша неделя</SectionEyebrow>
      <div className="card" style={{ padding: 16, borderRadius: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="eyebrow on-card">7 дней · {data.duration || '10 минут'}</div>
          <div style={{ fontSize: 10, color: 'var(--text-3)' }}>утро + вечер</div>
        </div>
        {program.week.map((row, i) => {
          const days = ['пн','вт','ср','чт','пт','сб','вс'];
          return (
            <div key={i} style={{
              display: 'flex', gap: 10, alignItems: 'center',
              padding: '10px 0',
              borderTop: i ? '1px solid var(--hairline)' : 'none',
              fontSize: 12, color: 'var(--ink-soft)',
            }}>
              <span style={{ width: 22, color: 'var(--text-3)', textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.12, fontWeight: 500 }}>{days[i]}</span>
              <span style={{ fontSize: 11 }}>🌅</span>
              <span style={{ flex: 1 }}>{row[0]}</span>
              <span style={{ fontSize: 11 }}>🌙</span>
              <span style={{ flex: 1 }}>{row[1]}</span>
            </div>
          );
        })}
      </div>

      {/* ── SECTION: ЧТО ДАЛЬШЕ ── */}
      <SectionEyebrow marginTop={24}>что дальше</SectionEyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ResultMiniCard
          gradient="gold" emoji="📅"
          title="Каждое воскресенье — чек-ап"
          body="5 коротких вопросов о неделе. Программа пересоберётся точнее под ваше состояние."
        />
        <ResultMiniCard
          gradient="rose" emoji="🗺"
          title="Карта эмоций и дневник"
          body="Откроются по ходу. Это словарь для того, что вы чувствуете, и место, где можно записать."
        />
        <ResultMiniCard
          gradient="lavender" emoji="🌙"
          title="Без давления, без вины"
          body="Пропустили день — это нормально. Серия не «обнуляется». Я рядом, когда вы готовы."
        />
      </div>

      <div style={{ height: 16 }}/>
    </div>
  );
}

export function SectionEyebrow({ children, marginTop = 24 }) {
  return (
    <div style={{
      marginTop, marginBottom: 12,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <div style={{ flex: '0 0 18px', height: 1, background: 'rgba(242,238,255,0.20)' }}/>
      <div className="eyebrow" style={{ letterSpacing: 0.16 }}>{children}</div>
      <div style={{ flex: 1, height: 1, background: 'rgba(242,238,255,0.10)' }}/>
    </div>
  );
}

export function ResultMiniCard({ gradient, emoji, title, body }) {
  return (
    <div className="card" style={{
      padding: 14, borderRadius: 16,
      display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <Icon3D size={36} gradient={gradient} emoji={emoji} radius={10} lift={false}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.005em' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4, lineHeight: 1.5 }}>{body}</div>
      </div>
    </div>
  );
}
