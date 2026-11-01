import { useCallback, useEffect, useRef, useState } from 'react';
import { profile } from '../../data/portfolio';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Education } from './pages/Education';
import { Projects } from './pages/Projects';
import { Software } from './pages/Software';
import { Campus } from './pages/Campus';
import { Awards } from './pages/Awards';
import { Contact } from './pages/Contact';
import { Research } from './pages/Research';
import { Certificates } from './pages/Certificates';

export type Route = 'home' | 'about' | 'education' | 'projects' | 'software' | 'research' | 'campus' | 'awards' | 'certificates' | 'contact';
export type Navigate = (r: Route) => void;

const ROUTES: Route[] = ['home', 'about', 'education', 'projects', 'software', 'research', 'campus', 'awards', 'certificates', 'contact'];
const PROJECT_ROUTES: Route[] = ['projects', 'software', 'research', 'campus', 'awards', 'certificates'];

const readHash = (): Route => {
  const r = window.location.hash.replace(/^#\/?/, '') as Route;
  return ROUTES.includes(r) ? r : 'home';
};

const NAV: { route: Route; label: string; sub?: { route: Route; label: string }[] }[] = [
  { route: 'home', label: 'HOME' },
  { route: 'about', label: 'ABOUT' },
  { route: 'education', label: 'EDUCATION' },
  {
    route: 'projects',
    label: 'PROJECTS',
    sub: [
      { route: 'software', label: 'SOFTWARE' },
      { route: 'research', label: 'RESEARCH' },
      { route: 'campus', label: 'CAMPUS' },
      { route: 'awards', label: 'AWARDS' },
      { route: 'certificates', label: 'CERTIFICATES' },
    ],
  },
  { route: 'contact', label: 'CONTACT' },
];

function NavLink({ route, label, current, go, small }: { route: Route; label: string; current: Route; go: Navigate; small?: boolean }) {
  const active = current === route;
  return (
    <a
      href={`#/${route}`}
      onClick={(e) => {
        e.preventDefault();
        go(route);
      }}
      aria-current={active ? 'page' : undefined}
      className="relative inline-flex items-center !text-[var(--link)] visited:!text-[var(--link)]"
    >
      {active && <span className="mr-2 inline-block h-[9px] w-[9px] rounded-full border-[2.5px] border-[var(--visited)]" aria-hidden />}
      <h4 className={small ? '!text-[18px] underline' : '!text-[20px] underline'}>{label}</h4>
    </a>
  );
}

function Sidebar({ route, go }: { route: Route; go: Navigate }) {
  const showSub = PROJECT_ROUTES.includes(route);
  return (
    <aside className="sidebar">
      <a
        href="#/home"
        onClick={(e) => {
          e.preventDefault();
          go('home');
        }}
        className="!text-black no-underline"
      >
        <h1 className="!text-[44px] !leading-[0.95]">{profile.name}</h1>
        <h3 className="mt-3">Showcase '26</h3>
      </a>
      <nav aria-label="Site" className="nav">
        {NAV.map((n) => (
          <div key={n.route}>
            <NavLink route={n.route} label={n.label} current={route} go={go} />
            {n.sub && showSub && (
              <div className="subnav">
                {n.sub.map((s) => (
                  <NavLink key={s.route} route={s.route} label={s.label} current={route} go={go} small />
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export function Showcase() {
  const [route, setRoute] = useState<Route>(readHash);
  const scroller = useRef<HTMLDivElement>(null);

  const go = useCallback<Navigate>((r) => {
    setRoute(r);
    if (window.location.hash !== `#/${r}`) history.pushState(null, '', `#/${r}`);
  }, []);

  useEffect(() => {
    const onPop = () => setRoute(readHash());
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (el) {
      el.style.scrollBehavior = 'auto';
      el.scrollTop = 0;
      el.style.scrollBehavior = '';
    }
  }, [route]);

  const page = (() => {
    switch (route) {
      case 'about':
        return <About go={go} />;
      case 'education':
        return <Education go={go} />;
      case 'projects':
        return <Projects go={go} />;
      case 'software':
        return <Software />;
      case 'research':
        return <Research go={go} />;
      case 'campus':
        return <Campus />;
      case 'certificates':
        return <Certificates />;
      case 'awards':
        return <Awards />;
      case 'contact':
        return <Contact />;
      default:
        return null;
    }
  })();

  return (
    <div className="site">
      <div className="site-scroll" ref={scroller}>
        {route === 'home' ? (
          <Home go={go} />
        ) : (
          <div className="site-layout">
            <Sidebar route={route} go={go} />
            <main key={route} className="content fade-in">
              {page}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
