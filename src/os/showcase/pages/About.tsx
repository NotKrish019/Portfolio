import { awards, learning, profile, skills } from '../../../data/portfolio';
import type { Navigate } from '../Showcase';
import { Chips, PageHeader, ResumeCallout } from '../Common';

export function About({ go }: { go: Navigate }) {
  const link = (r: Parameters<Navigate>[0], label: string) => (
    <a
      href={`#/${r}`}
      onClick={(e) => {
        e.preventDefault();
        go(r);
      }}
    >
      {label}
    </a>
  );

  return (
    <>
      <PageHeader title="Welcome" sub={`I'm ${profile.name}`} />
      <div className="text-block">
        <p>{profile.summary}</p>
      </div>

      <h3>Featured Work</h3>
      <div className="text-block">
        <p>
          My three primary projects are <b>Jaldrishti</b>, <b>DRISHTI</b>, and <b>BACK2U</b>. Jaldrishti won{' '}
          <b>1st Position at the Viksit Bharat Conclave 2026</b>, and DRISHTI took our team to the{' '}
          <b>IBM National Hackathon 2026</b> as one of <b>8 campus finalists</b>. You can read the full write-ups on my{' '}
          {link('software', 'Software Projects')} page and see every recognition on my {link('awards', 'Awards')} page.
        </p>
        <p>
          Thank you for taking the time to check out my portfolio. I really hope you enjoy exploring it. If you have any questions
          or comments, feel free to contact me using {link('contact', 'this form')} or shoot me an email at{' '}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </div>

      <ResumeCallout />

      <h3>About Me</h3>
      <div className="text-block">
        {profile.about.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      <h3>What I Work With</h3>
      <div className="mb-10 mt-6 grid gap-x-10 gap-y-7 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
        {skills.map((s) => (
          <section key={s.category}>
            <h4 className="mb-3">{s.category}</h4>
            <Chips items={s.items} />
          </section>
        ))}
      </div>

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

      <div className="text-block">
        <p>
          Thanks for reading about me! I hope that you enjoy exploring the rest of my portfolio, including my{' '}
          {awards.length} hackathon recognitions on the {link('awards', 'Awards')} page. If you have any questions or comments I would love to hear them. You can reach me through the{' '}
          {link('contact', 'contact page')} or shoot me an email at <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </div>
    </>
  );
}
