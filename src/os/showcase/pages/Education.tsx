import { education, learning } from '../../../data/portfolio';
import type { Navigate } from '../Showcase';
import { ResumeCallout } from '../Common';

export function Education({ go }: { go: Navigate }) {
  return (
    <>
      <ResumeCallout />

      <h2 className="mb-2">Education</h2>
      <div className="text-block !mt-2">
        <p>
          My academic path so far, from school in Sonepat to a B.Tech in Computer Science and Engineering with a specialization in
          Data Science and Artificial Intelligence. My hands-on work lives on the{' '}
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

      {education.map((e) => (
        <article key={e.school} className="entry">
          <div className="entry-head">
            <div className="min-w-0">
              <h1 className="!text-[clamp(36px,4.6vw,56px)]">{e.school}</h1>
              <h3 className="mt-1">{e.degree}</h3>
            </div>
            <div className="right">
              <h4>{e.location}</h4>
              <p>{e.duration}</p>
            </div>
          </div>
          <ul>
            <li>
              <b>{e.score.split(':')[0]}:</b>
              {e.score.split(':')[1]}
            </li>
          </ul>
        </article>
      ))}

      <h2 className="mb-6">Currently Learning</h2>
      {learning.map((l) => (
        <article key={l.title} className="entry !mb-10">
          <div className="entry-head">
            <div>
              <h1 className="!text-[clamp(32px,4vw,44px)]">{l.title}</h1>
              <h3 className="mt-1">{l.provider}</h3>
            </div>
            <div className="right">
              <p>
                <b>{l.status}</b>
              </p>
            </div>
          </div>
        </article>
      ))}
    </>
  );
}
