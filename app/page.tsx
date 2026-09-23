"use client";

import { useEffect, useMemo, useState } from "react";

type Tab = "Today" | "Breathe" | "Move" | "Meals";

const navItems: { label: Tab; icon: string }[] = [
  { label: "Today", icon: "⌂" },
  { label: "Breathe", icon: "◌" },
  { label: "Move", icon: "✦" },
  { label: "Meals", icon: "◒" },
];

const meals = [
  { time: "Breakfast · 8:00 AM", name: "Berry oat bowl", detail: "Oats, Greek yogurt, blueberries & chia", icon: "☀️", color: "peach" },
  { time: "Lunch · 12:30 PM", name: "Rainbow grain bowl", detail: "Quinoa, roasted vegetables & tahini", icon: "🥗", color: "green" },
  { time: "Snack · 3:30 PM", name: "Apple & almond butter", detail: "A naturally sweet energy boost", icon: "🍎", color: "yellow" },
  { time: "Dinner · 7:00 PM", name: "Lemon herb salmon", detail: "Salmon, greens & roasted potatoes", icon: "🐟", color: "blue" },
];

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="nav-icon" aria-hidden="true">{children}</span>;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Today");
  const [breathing, setBreathing] = useState(false);
  const [meditating, setMeditating] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Ready");
  const [breathSeconds, setBreathSeconds] = useState(60);
  const [meditationSeconds, setMeditationSeconds] = useState(600);
  const [completed, setCompleted] = useState<string[]>(["water"]);

  useEffect(() => {
    if (!breathing) return;
    const timer = window.setInterval(() => {
      setBreathSeconds((seconds) => (seconds <= 1 ? 60 : seconds - 1));
      setBreathPhase((phase) => phase === "Inhale" ? "Hold" : phase === "Hold" ? "Exhale" : "Inhale");
    }, 4000);
    return () => window.clearInterval(timer);
  }, [breathing]);

  useEffect(() => {
    if (!meditating) return;
    const timer = window.setInterval(() => {
      setMeditationSeconds((seconds) => {
        if (seconds <= 1) { setMeditating(false); return 0; }
        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [meditating]);

  const timeString = useMemo(() => `${String(Math.floor(meditationSeconds / 60)).padStart(2, "0")}:${String(meditationSeconds % 60).padStart(2, "0")}`, [meditationSeconds]);
  const toggleTask = (task: string) => setCompleted((items) => items.includes(task) ? items.filter((item) => item !== task) : [...items, task]);

  const renderTab = () => {
    if (activeTab === "Breathe") return <BreathingCard expanded breathing={breathing} phase={breathPhase} seconds={breathSeconds} onToggle={() => setBreathing(!breathing)} />;
    if (activeTab === "Meals") return <Meals />;
    if (activeTab === "Move") return <Move />;
    return <Today completed={completed} toggleTask={toggleTask} setActiveTab={setActiveTab} />;
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✳</span><span>Nourish</span></div>
        <p className="sidebar-tagline">Small steps. Better days.</p>
        <nav>{navItems.map((item) => <button key={item.label} className={activeTab === item.label ? "nav-item active" : "nav-item"} onClick={() => setActiveTab(item.label)}><Icon>{item.icon}</Icon>{item.label}</button>)}</nav>
        <div className="sidebar-bottom"><div className="avatar">R</div><div><strong>Ron</strong><span>Keep growing ✨</span></div><button className="more">•••</button></div>
      </aside>

      <section className="content">
        <header className="topbar"><div><p className="eyebrow">WEDNESDAY, SEPTEMBER 23</p><h1>{activeTab === "Today" ? "Good morning, Ron" : activeTab}</h1></div><button className="profile-button" aria-label="Open profile">R</button></header>
        {renderTab()}
      </section>

      <div className="mobile-nav">{navItems.map((item) => <button key={item.label} className={activeTab === item.label ? "mobile-item active" : "mobile-item"} onClick={() => setActiveTab(item.label)}><Icon>{item.icon}</Icon><span>{item.label}</span></button>)}</div>
    </main>
  );
}

function Today({ completed, toggleTask, setActiveTab }: { completed: string[]; toggleTask: (task: string) => void; setActiveTab: (tab: Tab) => void }) {
  const tasks = [
    { id: "breathe", icon: "◌", title: "Morning breathing", detail: "2 min · Box breathing", action: () => setActiveTab("Breathe") },
    { id: "move", icon: "✦", title: "Wake-up movement", detail: "5 min · Full body flow", action: () => setActiveTab("Move") },
    { id: "water", icon: "♢", title: "Drink some water", detail: "One tall glass to start", action: undefined },
  ];
  return <>
    <section className="hero-card"><div><span className="hero-kicker">YOUR DAILY RHYTHM</span><h2>A little care<br /><em>goes a long way.</em></h2><p>Take a moment for yourself today. You’re doing better than you think.</p></div><div className="sun-art"><span>☼</span></div></section>
    <div className="section-heading"><div><span className="eyebrow">WEDNESDAY’S PLAN</span><h2>Make space for you</h2></div><span className="progress-label">{completed.length}/3 done</span></div>
    <div className="progress-track"><span style={{ width: `${(completed.length / 3) * 100}%` }} /></div>
    <div className="task-list">{tasks.map((task) => <button key={task.id} className={completed.includes(task.id) ? "task completed" : "task"} onClick={() => { toggleTask(task.id); task.action?.(); }}><span className="task-icon">{task.icon}</span><span className="task-copy"><strong>{task.title}</strong><small>{task.detail}</small></span><span className="check">{completed.includes(task.id) ? "✓" : "→"}</span></button>)}</div>
    <div className="two-column"><BreathingCard /><MeditationCard /></div>
    <div className="section-heading lower"><div><span className="eyebrow">NOURISH YOURSELF</span><h2>Today’s meal plan</h2></div><button className="text-button" onClick={() => setActiveTab("Meals")}>See all <span>→</span></button></div>
    <MealPreview />
    <Tip />
  </>;
}

function BreathingCard({ expanded = false, breathing = false, phase = "Ready", seconds = 60, onToggle }: { expanded?: boolean; breathing?: boolean; phase?: string; seconds?: number; onToggle?: () => void }) {
  return <section className={expanded ? "breath-panel expanded" : "wellness-card breath-card"}><div className="card-top"><span className="eyebrow">BREATHING</span><span className="card-symbol">◌</span></div><h3>{expanded ? "Box breathing" : "Find your calm"}</h3><p>{expanded ? "A simple rhythm to settle your mind and body." : "A 2-minute reset for a clearer mind."}</p>{expanded ? <div className="breathing-stage"><div className={breathing ? "breath-orb pulsing" : "breath-orb"}><span>{breathing ? phase : "Breathe"}</span><small>{breathing ? `0:${String(seconds).padStart(2, "0")}` : "4 · 4 · 4 · 4"}</small></div></div> : <div className="mini-orb" />}{onToggle && <button className="primary-button" onClick={onToggle}>{breathing ? "Pause session" : "Begin breathing"}<span>→</span></button>}{!expanded && <button className="card-link" onClick={onToggle}>Start exercise <span>→</span></button>}</section>;
}

function MeditationCard() {
  const [running, setRunning] = useState(false);
  return <section className="wellness-card meditation-card"><div className="card-top"><span className="eyebrow">MINDFULNESS</span><span className="card-symbol">☽</span></div><h3>10-minute meditation</h3><p>A quiet pause to reconnect with yourself.</p><div className="meditation-visual"><span>☽</span></div><button className="card-link" onClick={() => setRunning(!running)}>{running ? "Meditation in progress" : "Begin meditation"} <span>→</span></button></section>;
}

function Meals() { return <div className="full-page"><div className="intro-block"><span className="eyebrow">EAT WITH INTENTION</span><h2>A nourishing day,<br /><em>made simple.</em></h2><p>Flexible ideas to fuel your body without overthinking it.</p></div><div className="meal-list">{meals.map((meal) => <div className="meal-row" key={meal.name}><div className={`meal-icon ${meal.color}`}>{meal.icon}</div><div><span className="meal-time">{meal.time}</span><h3>{meal.name}</h3><p>{meal.detail}</p></div><button className="round-arrow">→</button></div>)}</div><Tip /></div>; }

function MealPreview() { return <div className="meal-preview"><div className="meal-icon peach">☀️</div><div><span className="meal-time">BREAKFAST · 8:00 AM</span><h3>Berry oat bowl</h3><p>Oats, Greek yogurt, blueberries & chia</p></div><span className="round-arrow">→</span></div>; }
function Tip() { return <section className="tip-card"><div className="tip-icon">✦</div><div><span className="eyebrow">A NOTE FOR TODAY</span><h3>Progress is not always visible.</h3><p>Rest, consistency, and tiny choices count too. Give yourself credit for showing up.</p></div></section>; }
function Move() { return <div className="full-page"><div className="intro-block"><span className="eyebrow">MOVE GENTLY</span><h2>Five minutes<br /><em>is enough.</em></h2><p>Wake up your body with this low-impact morning flow.</p></div><div className="move-grid"><div className="move-card large"><span className="move-number">01</span><div><h3>Shoulder rolls</h3><p>30 seconds · Release tension</p></div><span>→</span></div><div className="move-card"><span className="move-number">02</span><h3>Standing side stretch</h3><p>1 minute · Open your sides</p><span>→</span></div><div className="move-card"><span className="move-number">03</span><h3>Bodyweight squats</h3><p>2 minutes · Build energy</p><span>→</span></div></div><Tip /></div>; }
