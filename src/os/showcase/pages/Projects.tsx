import type { ReactNode } from 'react';
import type { Navigate, Route } from '../Showcase';
import { PageHeader } from '../Common';
import { BookIcon, CampusIcon, ComputerIcon, TrophyIcon } from '../../components/icons';

const CARDS: { route: Route; title: string; sub: string; icon: ReactNode }[] = [
  { route: 'software', title: 'Software', sub: 'PROJECTS', icon: <ComputerIcon /> },
  { route: 'research', title: 'Research', sub: 'INTERESTS & EXPLORATIONS', icon: <BookIcon /> },
  { route: 'campus', title: 'Campus', sub: 'MISSIONS', icon: <CampusIcon /> },
  { route: 'awards', title: 'Awards', sub: '& CERTIFICATIONS', icon: <TrophyIcon /> },
];

export function Projects({ go }: { go: Navigate }) {
  return (
    <>
      <PageHeader title="Projects" sub="& Missions" />
      <p className="mb-6">
        Click on one of the areas below to check out some of my favorite work in that field, from AI/ML and Computer Vision software
        projects, to the campus teams and events I contribute to, to the awards and certifications I've earned along the way. Enjoy!
      </p>
      {CARDS.map((c) => (
        <button key={c.route} className="big-button" onClick={() => go(c.route)}>
          {c.icon}
          <span className="flex flex-col">
            <h1 className="!text-[clamp(40px,5vw,56px)]">{c.title}</h1>
            <h3 className="mt-1">{c.sub}</h3>
          </span>
        </button>
      ))}
    </>
  );
}
