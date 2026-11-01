import { projects } from '../../../data/portfolio';
import { Chips, External, PageHeader, ResumeCallout } from '../Common';
import { ProjectArt } from '../ProjectArt';

const pretty = (url: string) => url.replace(/^https?:\/\/(www\.)?(github\.com\/)?/, '').replace(/\/$/, '');

export function Software() {
  return (
    <>
      <PageHeader title="Software" sub="Projects" />
      <p>
        Below are my three primary projects: AI systems spanning Computer Vision for heritage conservation, machine learning for network
        threat intelligence, and multimodal retrieval for a lost &amp; found platform.
      </p>
      <ResumeCallout />

      {projects.map((p) => (
        <article key={p.id} id={p.id} className="mb-20">
          <div className="entry-head">
            <h2 className="!text-[40px] max-[760px]:!text-[30px]">{p.title}</h2>
            <p>{p.duration}</p>
          </div>
          <h4 className="mt-3">{p.tags.join(' · ')}</h4>
          {p.award && (
            <p className="mt-3">
              <span className="chip !bg-[#fff6c4]">★ {p.award}</span>
            </p>
          )}
          <ProjectArt id={p.id} accent={p.accent} />
          <div className="text-block !mt-0">
            <p>
              <b>{p.subtitle}.</b>
            </p>
            <ul className="!m-0 pl-10 max-[760px]:pl-5">
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <h3 className="mb-3">Technologies:</h3>
          <Chips items={p.tech} />
          {(p.links.github || p.links.live) && (
            <>
              <h3 className="mb-2 mt-6">Links:</h3>
              <ul className="!m-0 pl-10 max-[760px]:pl-5">
                {p.links.live && (
                  <li>
                    <External href={p.links.live}>
                      <b>[Live]</b> - {pretty(p.links.live)}
                    </External>
                  </li>
                )}
                {p.links.github && (
                  <li>
                    <External href={p.links.github}>
                      <b>[GitHub]</b> - {pretty(p.links.github)}
                    </External>
                  </li>
                )}
              </ul>
            </>
          )}
        </article>
      ))}
    </>
  );
}
