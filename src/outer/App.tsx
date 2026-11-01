import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/portfolio';
import { World, type Mode } from './scene/World';
import { sounds } from './sounds';

type Phase = 'boot' | 'ready' | 'scene';

const isTouch = () => matchMedia('(pointer: coarse)').matches;

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Types `text` out one char at a time once `start` is true. */
function useTyped(text: string, start: boolean, speed = 45) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(text.length);
    setN(0);
    const t = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(t), v) : v + 1)), speed);
    return () => clearInterval(t);
  }, [text, start, speed]);
  return text.slice(0, n);
}

function BootScreen({ lines, done, phase, onStart }: { lines: string[]; done: boolean; phase: Phase; onStart: () => void }) {
  const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (phase === 'ready') btn.current?.focus();
  }, [phase]);
  return (
    <div className={`boot ${phase === 'scene' ? 'boot-hide' : ''}`} aria-hidden={phase === 'scene'}>
      {phase === 'boot' && (
        <div className="bios">
          <div className="bios-head">
            <div>
              <p>{profile.name},</p>
              <p>KR Inc.</p>
              <br />
              <p>Released: 01/13/2006</p>
              <p>KRBIOS (C){profile.year} {profile.name} Inc.,</p>
            </div>
            <div className="bios-logo" aria-hidden>
              <span>{profile.monogram}</span>
              <small>SHOWCASE</small>
            </div>
          </div>
          <p>KRP S13 2024-{profile.year} Special UC131S</p>
          <br />
          <p>KRP Showcase(tm) XX 113</p>
          <p>Checking RAM : 14000 OK</p>
          <br />
          {done && <p>FINISHED LOADING RESOURCES</p>}
          {lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
          {done && (
            <>
              <br />
              <p>All Content Loaded, launching '{profile.name} Portfolio Showcase' V1.0</p>
            </>
          )}
          <div className="bios-foot">
            <p>Press DEL to enter SETUP , ESC to skip memory test</p>
            <p>{today}</p>
          </div>
        </div>
      )}
      {phase !== 'boot' && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <p id="modal-title">
            {profile.name} Portfolio Showcase {profile.year}
          </p>
          {isTouch() && (
            <p className="tip">
              TIP: tap the screen to use it, tap outside it to zoom out.
              <br />
              Best experienced on a desktop or laptop.
            </p>
          )}
          <p>
            Click start to begin <span className="blink">_</span>
          </p>
          <button ref={btn} className="start" onClick={onStart}>
            START
          </button>
        </div>
      )}
    </div>
  );
}

function Hud({ show, hidden, muted, onMute }: { show: boolean; hidden: boolean; muted: boolean; onMute: () => void }) {
  const name = useTyped(profile.name, show);
  const title = useTyped(profile.shortTitle, show && name.length === profile.name.length);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-GB'));
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB')), 1000);
    return () => clearInterval(t);
  }, []);
  if (!show) return null;
  const titleDone = title.length === profile.shortTitle.length;
  return (
    <div className={`hud ${hidden ? 'hud-hidden' : ''}`} aria-label="Info">
      <div className="hud-box">{name || ' '}</div>
      {title && <div className="hud-box">{title}</div>}
      {titleDone && (
        <div className="hud-row">
          <div className="hud-box">{time}</div>
          <button className="hud-box hud-btn" onClick={onMute} aria-label={muted ? 'Unmute sound' : 'Mute sound'} aria-pressed={muted}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
              <path d="M2 6h3l4-3v10L5 10H2z" fill="currentColor" />
              {muted ? <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.6" /> : <path d="M11 5.5c1 1 1 4 0 5M13 4c2 2 2 6 0 8" stroke="currentColor" strokeWidth="1.4" fill="none" />}
            </svg>
          </button>
          <a className="hud-box hud-btn" href="/os.html" aria-label="Open the site full screen" title="Open full screen">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
              <path d="M2 2h5v2H4v3H2zM14 2v5h-2V4H9V2zM2 14V9h2v3h3v2zM14 14H9v-2h3V9h2z" fill="currentColor" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

/** Keyboard / screen-reader alternatives to clicking the 3D binders. */
const DESK_LINKS = [
  { route: 'software', label: 'Projects' },
  { route: 'research', label: 'Research' },
  { route: 'certificates', label: 'Certificates' },
];

const RESOURCES = ['deskModel', 'monitorGlass', 'keyboardKeys', 'mouseDown', 'mouseUp', 'officeChair', 'plantLeaves', 'steamSprite', 'officeAmbience', 'krishOS'];

export function App() {
  const host = useRef<HTMLDivElement>(null);
  const world = useRef<World | null>(null);
  const [phase, setPhase] = useState<Phase>('boot');
  const [lines, setLines] = useState<string[]>([]);
  const [osLoaded, setOsLoaded] = useState(false);
  const [mode, setMode] = useState<Mode>('intro');
  const [muted, setMuted] = useState(false);

  // Fallback for browsers without WebGL: go straight to the OS site.
  useEffect(() => {
    if (!webglAvailable()) window.location.replace('/os.html');
  }, []);

  useEffect(() => {
    if (!host.current || !webglAvailable()) return;
    const w = new World({
      container: host.current,
      osUrl: '/os.html',
      brand: { mono: profile.monogram, name: profile.name },
      onMode: setMode,
      onIframeLoad: (iframe) => {
        setOsLoaded(true);
        // Same-origin iframe: play click/keyboard sounds for interactions inside the OS.
        const win = iframe.contentWindow;
        if (!win) return;
        win.addEventListener('pointerdown', sounds.mouseDown);
        win.addEventListener('pointerup', sounds.mouseUp);
        win.addEventListener('keydown', sounds.key);
      },
    });
    world.current = w;
    w.warmup();
    return () => {
      w.dispose();
      world.current = null;
    };
  }, []);

  // BIOS resource lines: the last one only completes once the OS iframe has loaded.
  useEffect(() => {
    if (phase !== 'boot') return;
    const total = RESOURCES.length;
    const shown = lines.length;
    if (shown >= total) {
      const t = setTimeout(() => setPhase('ready'), 700);
      return () => clearTimeout(t);
    }
    if (shown === total - 1 && !osLoaded) return;
    const t = setTimeout(
      () => setLines((l) => [...l, `Loaded ${RESOURCES[shown].padEnd(24, ' ')} ... ${Math.round(((shown + 1) / total) * 100)}%`]),
      matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 90 + Math.random() * 120,
    );
    return () => clearTimeout(t);
  }, [lines, osLoaded, phase]);

  useEffect(() => {
    if (phase !== 'scene') return;
    const down = () => sounds.mouseDown();
    const up = () => sounds.mouseUp();
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [phase]);

  const start = () => {
    sounds.startup();
    setPhase('scene');
  };

  const begin = () => {
    const w = world.current;
    if (phase === 'scene' && w?.getMode() === 'intro') w.setMode('desk');
  };

  return (
    <main className="stage" onClick={begin}>
      <div ref={host} className="world" />
      {phase === 'scene' && (
        <nav className="desk-shortcuts" aria-label="Desk binders">
          {DESK_LINKS.map((l) => (
            <button
              key={l.route}
              onClick={(e) => {
                e.stopPropagation();
                world.current?.openRoute(l.route);
              }}
            >
              Open {l.label}
            </button>
          ))}
          <a href="/os.html">Open the site without 3D</a>
        </nav>
      )}
      <h1 className="sr-only">
        {profile.name}: {profile.headline}
      </h1>
      {phase === 'scene' && mode === 'intro' && (
        <button className="begin" onClick={begin}>
          {isTouch() ? 'Tap' : 'Click'} anywhere to begin
        </button>
      )}
      <Hud
        show={phase === 'scene' && mode !== 'intro'}
        hidden={mode === 'monitor' && !isTouch()}
        muted={muted}
        onMute={() => {
          sounds.setMuted(!muted);
          setMuted(!muted);
        }}
      />
      <BootScreen lines={lines} done={lines.length >= RESOURCES.length} phase={phase} onStart={start} />
      <noscript>
        <a href="/os.html">Open {profile.name}'s portfolio</a>
      </noscript>
    </main>
  );
}
