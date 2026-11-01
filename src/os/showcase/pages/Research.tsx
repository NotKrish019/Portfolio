import { learning, research } from '../../../data/portfolio';
import type { Navigate } from '../Showcase';
import { Chips, PageHeader } from '../Common';

export function Research({ go }: { go: Navigate }) {
  return (
    <>
      <PageHeader title="Research" sub="Interests & Explorations" />
      <div className="text-block !mt-0">
        <p>
          These are the areas of AI/ML and data science I keep coming back to, each explored hands-on through a real project. I don't have
          formal publications yet, so this page documents the problems I've worked on and the methods I've used rather than papers. You
          can read the full project write-ups on my{' '}
          <a
            href="#/software"
            onClick={(e) => {
              e.preventDefault();
              go('software');
            }}
          >
            Software Projects
          </a>{' '}
          page.
        </p>
      </div>

      {research.map((r, i) => (
        <article key={r.area} className="entry !mb-16">
          <div className="entry-head">
            <div className="min-w-0">
              <h2 className="!text-[clamp(26px,3vw,34px)]">{r.area}</h2>
              <h4 className="mt-2">Explored in: {r.exploredIn}</h4>
            </div>
            <div className="right">
              <p>{String(i + 1).padStart(2, '0')}</p>
            </div>
          </div>
          <p className="mt-4">{r.summary}</p>
          <ul className="!mt-4">
            {r.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <h4 className="mb-3">Methods &amp; Tools:</h4>
          <Chips items={r.methods} />
        </article>
      ))}

      <h3>Currently Learning</h3>
      <div className="text-block">
        <ul className="!m-0 pl-10">
          {learning.map((l) => (
            <li key={l.title}>
              <b>{l.title}</b>, {l.provider}: <i>{l.status}</i>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
