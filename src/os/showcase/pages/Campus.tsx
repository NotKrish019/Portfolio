import { extracurricular } from '../../../data/portfolio';
import { PageHeader } from '../Common';

export function Campus() {
  return (
    <>
      <PageHeader title="Campus" sub="Missions" />
      <p className="mb-14">
        Outside of my own projects, I contribute to student-led product teams and volunteer at technical and career events at SRM
        University, Delhi NCR.
      </p>
      {extracurricular.map((x) => (
        <article key={x.org} className="entry !mb-14">
          <div className="entry-head">
            <div className="min-w-0">
              <h1 className="!text-[clamp(32px,4vw,48px)]">{x.org}</h1>
              <h3 className="mt-1">{x.role}</h3>
            </div>
            {x.date && (
              <div className="right">
                <p>{x.date}</p>
              </div>
            )}
          </div>
          <p className="mt-4">{x.description}</p>
        </article>
      ))}
    </>
  );
}
