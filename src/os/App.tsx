import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { profile, socials } from '../data/portfolio';
import { Window, type Rect } from './components/Window';
import { Taskbar } from './components/Taskbar';
import { BrowserGlyph, CreditsIcon, GithubIcon, LinkedinIcon, ResumeIcon, ShowcaseIcon } from './components/icons';
import { Showcase } from './showcase/Showcase';

type AppId = 'showcase' | 'credits';
type WinState = { rect: Rect; z: number; minimized: boolean; maximized: boolean };

const isNarrow = () => window.innerWidth < 760;

const initialRect = (id: AppId): Rect => {
  const W = window.innerWidth;
  const H = window.innerHeight - 32;
  if (id === 'showcase') return { x: 104, y: 24, w: Math.max(320, W - 130), h: Math.max(240, H - 46) };
  return { x: Math.max(16, W / 2 - 230), y: Math.max(16, H / 2 - 220), w: Math.min(460, W - 32), h: Math.min(440, H - 32) };
};

function Credits() {
  return (
    <div className="flex-1 overflow-auto bg-white p-6 text-center shadow-[var(--border-field)]" style={{ fontFamily: 'var(--font-ui)' }}>
      <h2 className="mb-1 text-[22px] font-bold">{profile.name} Showcase '26</h2>
      <p className="mb-6 text-[13px] text-[#555]">Credits</p>
      {[
        ['Engineering & Content', profile.name],
        ['Design reference', 'vinitgirdhar.xyz'],
        ['3D scene', 'Built in code with three.js'],
        ['UI font', 'MS Sans Serif webfont via 98.css (MIT)'],
        ['Display fonts', 'Fraunces, Bitter, Cutive, VT323 (Google Fonts)'],
      ].map(([k, v]) => (
        <div key={k} className="mb-4">
          <div className="text-[13px] font-bold">{k}</div>
          <div className="text-[13px]">{v}</div>
        </div>
      ))}
      <p className="mt-6 text-[12px] text-[#555]">© {profile.year} {profile.name}. All rights reserved.</p>
    </div>
  );
}

const APPS: Record<AppId, { title: string; icon: ReactNode; glyph: ReactNode }> = {
  showcase: { title: `${profile.name} - Showcase ${profile.year}`, icon: <ShowcaseIcon />, glyph: <BrowserGlyph width={16} height={16} /> },
  credits: { title: 'Credits', icon: <CreditsIcon />, glyph: <CreditsIcon width={16} height={16} /> },
};

type DeskItem = { label: string; icon: ReactNode; open: () => void };

export function App() {
  const [wins, setWins] = useState<Partial<Record<AppId, WinState>>>(() => ({
    showcase: { rect: initialRect('showcase'), z: 1, minimized: false, maximized: isNarrow() },
  }));
  const [focus, setFocus] = useState<AppId | null>('showcase');
  const [selected, setSelected] = useState<string | null>(null);
  const [shutdown, setShutdown] = useState(false);

  const topZ = () => Math.max(0, ...Object.values(wins).map((w) => w!.z));

  const open = useCallback(
    (id: AppId) => {
      setWins((ws) => {
        const z = Math.max(0, ...Object.values(ws).map((w) => w!.z)) + 1;
        const cur = ws[id];
        return { ...ws, [id]: cur ? { ...cur, minimized: false, z } : { rect: initialRect(id), z, minimized: false, maximized: isNarrow() && id === 'showcase' } };
      });
      setFocus(id);
    },
    [],
  );

  const update = (id: AppId, patch: Partial<WinState>) => setWins((ws) => ({ ...ws, [id]: { ...ws[id]!, ...patch } }));
  const close = (id: AppId) => {
    setWins((ws) => {
      const next = { ...ws };
      delete next[id];
      return next;
    });
    setFocus(null);
  };

  // Keep the showcase window inside the viewport on resize.
  useEffect(() => {
    const onResize = () =>
      setWins((ws) => (ws.showcase ? { ...ws, showcase: { ...ws.showcase, rect: initialRect('showcase'), maximized: ws.showcase.maximized || isNarrow() } } : ws));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Navigation requests from the 3D desk (e.g. clicking a binder): restore the showcase window and route it.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'krish:navigate' || typeof e.data.route !== 'string') return;
      setShutdown(false);
      window.location.hash = `#/${e.data.route}`;
      open('showcase');
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [open]);

  const ext = (url: string) => () => window.open(url, '_blank', 'noopener');
  const desk: DeskItem[] = [
    { label: 'My Showcase', icon: <ShowcaseIcon />, open: () => open('showcase') },
    { label: 'Résumé', icon: <ResumeIcon />, open: ext(profile.resume) },
    ...(socials.github ? [{ label: 'GitHub', icon: <GithubIcon className="text-white" />, open: ext(socials.github) }] : []),
    ...(socials.linkedin ? [{ label: 'LinkedIn', icon: <LinkedinIcon />, open: ext(socials.linkedin) }] : []),
    { label: 'Credits', icon: <CreditsIcon />, open: () => open('credits') },
  ];

  if (shutdown) {
    return (
      <div className="grid h-full place-items-center bg-black p-6 text-center">
        <div>
          <p className="text-[22px] text-[#f0a030]" style={{ fontFamily: 'var(--font-ui)' }}>
            It's now safe to turn off your computer.
          </p>
          <button className="win-btn mt-8 px-6 py-2 text-[14px]" onClick={() => setShutdown(false)}>
            Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden" onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
      <div className="wallpaper" onPointerDown={() => setSelected(null)} />
      <div className="watermark" aria-hidden>
        <span className="mono">{profile.monogram}</span>
        <span className="bar" />
        <span className="os">{profile.osName}</span>
      </div>

      <div className="absolute left-2 top-2 flex flex-col gap-3 max-[760px]:gap-2">
        {desk.map((d) => (
          <button
            key={d.label}
            className="desk-icon"
            data-selected={selected === d.label}
            onClick={(e) => {
              setSelected(d.label);
              // Single tap opens on touch devices; double-click on desktop.
              if (e.detail === 0 || matchMedia('(pointer: coarse)').matches) d.open();
            }}
            onDoubleClick={d.open}
            onKeyDown={(e) => e.key === 'Enter' && d.open()}
          >
            {d.icon}
            <span className="desk-icon-label">{d.label}</span>
          </button>
        ))}
      </div>

      {(Object.keys(wins) as AppId[]).map((id) => {
        const w = wins[id]!;
        return (
          <Window
            key={id}
            title={APPS[id].title}
            icon={<span className="grid h-4 w-4 place-items-center [&>svg]:h-4 [&>svg]:w-4">{APPS[id].glyph}</span>}
            rect={w.rect}
            z={w.z}
            active={focus === id}
            minimized={w.minimized}
            maximized={w.maximized}
            onFocus={() => {
              if (focus !== id || w.z !== topZ()) update(id, { z: topZ() + 1 });
              setFocus(id);
            }}
            onClose={() => close(id)}
            onMinimize={() => {
              update(id, { minimized: true });
              setFocus(null);
            }}
            onToggleMaximize={() => update(id, { maximized: !w.maximized })}
            onRect={(rect) => update(id, { rect })}
            status={
              id === 'showcase' ? (
                <>
                  <div className="flex-1">{`© Copyright ${profile.year} ${profile.name}`}</div>
                  <div className="w-6" />
                  <div className="w-6" />
                  <div className="w-[360px] max-[760px]:hidden" />
                </>
              ) : undefined
            }
          >
            {id === 'showcase' ? <Showcase /> : <Credits />}
          </Window>
        );
      })}

      <Taskbar
        tasks={(Object.keys(wins) as AppId[]).map((id) => ({ id, title: id === 'showcase' ? 'My Showcase' : APPS[id].title, icon: APPS[id].icon, active: focus === id && !wins[id]!.minimized }))}
        onTask={(id) => {
          const w = wins[id as AppId]!;
          if (focus === id && !w.minimized) {
            update(id as AppId, { minimized: true });
            setFocus(null);
          } else open(id as AppId);
        }}
        onOpenShowcase={() => open('showcase')}
        onShutdown={() => setShutdown(true)}
      />
    </div>
  );
}
