import { awards, certifications, type Certification } from '../../../data/portfolio';
import { PageHeader } from '../Common';

const GROUPS: { kind: Certification['kind']; title: string }[] = [
  { kind: 'program', title: 'Certifications & Simulations' },
  { kind: 'workshop', title: 'Workshops' },
  { kind: 'competition', title: 'Competitions' },
];

export function Certificates() {
  return (
    <>
      <PageHeader title="Certificates" sub="& Workshops" />
      <p>
        The certifications, virtual experience programs, workshops, and hackathon recognitions I've earned so far. Where a genuine
        certificate document is available, you can open it below.
      </p>

      <h2 className="mb-6 mt-12">Hackathon Certificates</h2>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(320px,100%),1fr))]">
        {awards.map((a) => (
          <article key={a.title} className="bevel-raised !bg-[var(--surface-hover)] p-4">
            <h4 className="!text-[18px]">{a.title}</h4>
            <p className="mt-2 !text-[15px]">
              {a.org} · {a.date} · Project: <b>{a.project}</b>
            </p>
            <p className="mt-3 !text-[15px]">
              <a href={a.certificate} target="_blank" rel="noreferrer">
                [Certificate] View (Google Drive)
              </a>
            </p>
          </article>
        ))}
      </div>

      {GROUPS.map((g) => {
        const items = certifications.filter((c) => c.kind === g.kind);
        if (!items.length) return null;
        return (
          <section key={g.kind}>
            <h2 className="mb-6 mt-14">{g.title}</h2>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(280px,100%),1fr))]">
              {items.map((c) => (
                <article key={c.title} className="bevel-raised !bg-[var(--surface-hover)] p-4">
                  <h4 className="!text-[17px]">{c.title}</h4>
                  <p className="mt-2 !text-[15px]">
                    {c.issuer} · {c.date}
                  </p>
                  {c.note && (
                    <p className="mt-2 !text-[15px]">
                      <b>{c.note}</b>
                    </p>
                  )}
                  {c.file && (
                    <p className="mt-2 !text-[15px]">
                      <a href={c.file} target="_blank" rel="noreferrer">
                        [Certificate] View
                      </a>
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        );
      })}
      <p className="mt-12 !text-[15px] italic text-[#555]">Certificate files for the programs and workshops above aren't published yet.</p>
    </>
  );
}
