import { useEffect, useRef, useState, type ReactNode } from 'react';
import { profile, socials } from '../../data/portfolio';
import { ComputerIcon, GithubIcon, LinkedinIcon, MailIcon, ResumeIcon, ShowcaseIcon, SpeakerIcon, StartLogo } from './icons';

export type TaskItem = { id: string; title: string; icon: ReactNode; active: boolean };

type Props = {
  tasks: TaskItem[];
  onTask: (id: string) => void;
  onOpenShowcase: () => void;
  onShutdown: () => void;
};

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function Taskbar({ tasks, onTask, onOpenShowcase, onShutdown }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const clock = useClock();

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('pointerdown', close);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);

  const item = (label: ReactNode, icon: ReactNode, props: { href?: string; onClick?: () => void }) =>
    props.href ? (
      <a className="start-item" href={props.href} target={props.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" role="menuitem" onClick={() => setOpen(false)}>
        {icon}
        <span>{label}</span>
      </a>
    ) : (
      <button
        className="start-item"
        role="menuitem"
        onClick={() => {
          setOpen(false);
          props.onClick?.();
        }}
      >
        {icon}
        <span>{label}</span>
      </button>
    );

  return (
    <div ref={menuRef}>
      {open && (
        <div className="start-menu bevel-window" role="menu" aria-label="Start menu">
          <div className="rail">
            <span>
              <b>Krish</b>OS
            </span>
          </div>
          <div className="flex-1 py-1">
            {item(<><u>M</u>y Showcase</>, <ShowcaseIcon />, { onClick: onOpenShowcase })}
            {item('Résumé', <ResumeIcon />, { href: profile.resume })}
            {socials.github && item('GitHub', <GithubIcon />, { href: socials.github })}
            {socials.linkedin && item('LinkedIn', <LinkedinIcon />, { href: socials.linkedin })}
            {item('Email Me', <MailIcon />, { href: `mailto:${profile.email}` })}
            <div className="start-sep" />
            {item('Shut down...', <ComputerIcon />, { onClick: onShutdown })}
          </div>
        </div>
      )}
      <nav className="taskbar" aria-label="Taskbar">
        <button className="win-btn start-btn" aria-pressed={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
          <StartLogo width={22} height={16} />
          Start
        </button>
        <div className="mx-0.5 h-6 w-[2px] shadow-[inset_1px_0_#808080,inset_-1px_0_#fff]" />
        {tasks.map((t) => (
          <button key={t.id} className="win-btn task-btn" aria-pressed={t.active} onClick={() => onTask(t.id)}>
            <span className="h-4 w-4 shrink-0 [&>svg]:h-4 [&>svg]:w-4">{t.icon}</span>
            <span className="truncate">{t.title}</span>
          </button>
        ))}
        <div className="tray">
          <SpeakerIcon width={16} height={16} />
          <span className="whitespace-nowrap">{clock}</span>
        </div>
      </nav>
    </div>
  );
}
