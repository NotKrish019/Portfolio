import { useEffect, useState } from 'react';
import { profile } from '../../../data/portfolio';
import type { Navigate, Route } from '../Showcase';

/** Types, holds, deletes and cycles through phrases. */
function useTypewriter(phrases: string[]) {
  const [text, setText] = useState('');
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setText(phrases[0]);
      return;
    }
    let i = 0;
    let n = 0;
    let deleting = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const p = phrases[i % phrases.length];
      n += deleting ? -1 : 1;
      setText(p.slice(0, n));
      let delay = deleting ? 28 : 55 + Math.random() * 60;
      if (!deleting && n === p.length) {
        deleting = true;
        delay = 2200;
      } else if (deleting && n === 0) {
        deleting = false;
        i++;
        delay = 400;
      }
      t = setTimeout(tick, delay);
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, [phrases]);
  return text;
}

const LINKS: { route: Route; label: string }[] = [
  { route: 'about', label: 'ABOUT' },
  { route: 'education', label: 'EDUCATION' },
  { route: 'projects', label: 'PROJECTS' },
  { route: 'contact', label: 'CONTACT' },
];

export function Home({ go }: { go: Navigate }) {
  const typed = useTypewriter(profile.terminalPhrases);
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="fade-in !text-[clamp(56px,7vw,80px)]">{profile.name}</h1>
      <h2 className="fade-in mt-3 [animation-delay:120ms] max-[760px]:!text-[22px]">{profile.headline}</h2>
      <p className="mt-8 !text-[24px] max-[760px]:!text-[20px]" style={{ fontFamily: 'var(--font-term)' }} aria-live="off">
        <span className="text-[#0d6b70]">C:\KRISH&gt;</span>
        <span className="ml-2">{typed}</span>
        <span className="cursor-blink" aria-hidden />
      </p>
      <nav aria-label="Primary" className="mt-24 flex flex-wrap justify-center gap-x-8 gap-y-4 max-[760px]:mt-14">
        {LINKS.map((l) => (
          <a
            key={l.route}
            href={`#/${l.route}`}
            onClick={(e) => {
              e.preventDefault();
              go(l.route);
            }}
            className="!text-[var(--link)]"
          >
            <h4 className="!text-[20px] underline">{l.label}</h4>
          </a>
        ))}
      </nav>
    </div>
  );
}
