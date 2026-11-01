import { awards, certifications } from '../../../data/portfolio';
import { PageHeader } from '../Common';

function CertThumb({ rank }: { rank: string }) {
  return (
    <svg viewBox="0 0 220 140" width="100%" height="100%" shapeRendering="crispEdges" aria-hidden>
      <rect width="220" height="140" fill="#f7f3e8" />
      <rect x="8" y="8" width="204" height="124" fill="none" stroke="#0d4f57" strokeWidth="3" />
      <rect x="14" y="14" width="192" height="112" fill="none" stroke="#c9a227" />
      <rect x="60" y="26" width="100" height="6" fill="#0d4f57" />
      <rect x="40" y="44" width="140" height="3" fill="#999" />
      <rect x="54" y="54" width="112" height="3" fill="#999" />
      <rect x="70" y="64" width="80" height="3" fill="#999" />
      <circle cx="110" cy="96" r="18" fill="#c9a227" stroke="#7a5c10" strokeWidth="2" />
      <path d="M98 110 l-6 20 l10 -5 l6 8 l2 -20z M122 110 l6 20 l-10 -5 l-6 8 l-2 -20z" fill="#a33a2c" />
      <text x="110" y="101" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="900" fontSize="16" fill="#3d2d05">
        {rank}
      </text>
    </svg>
  );
}

export function Awards() {
  return (
    <>
      <PageHeader title="Awards" sub="& Certifications" />
      <p>
        A collection of the achievements, certifications, and workshops I've earned through hackathons, virtual experience programs, and
        technical workshops along my journey. Click a certificate to view it.
      </p>

      <h2 className="mb-6 mt-12">Hackathons &amp; Competitions</h2>
      <div className="grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))]">
        {awards.map((a, i) => (
          <article key={a.title}>
            <a href={a.certificate} target="_blank" rel="noreferrer" className="group block border-2 border-black p-1" aria-label={`View certificate: ${a.title}`}>
              <div className="aspect-[11/7] transition-transform duration-150 group-hover:scale-[1.02]">
                <CertThumb rank={i === 0 ? '1st' : 'Top 8'} />
              </div>
            </a>
            <h3 className="mt-3">{a.title}</h3>
            <h4 className="mt-1">{a.org}</h4>
            <p className="mt-2 !text-[16px] !leading-[1.6]">
              {a.detail.join(' · ')} · Project: <b>{a.project}</b> · {a.date}
            </p>
            <p className="mt-1 !text-[16px]">
              <a href={a.certificate} target="_blank" rel="noreferrer">
                [Certificate] View (Google Drive)
              </a>
            </p>
          </article>
        ))}
      </div>

      <h2 className="mb-6 mt-16">Certifications &amp; Workshops</h2>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {certifications.map((c) => (
          <article key={c.title} className="bevel-raised !bg-[var(--surface-hover)] p-4">
            <h4 className="!text-[17px]">{c.title}</h4>
            <p className="mt-2 !text-[15px]">
              {c.issuer}
              {c.note ? ` · ${c.note}` : ''} · {c.date}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
