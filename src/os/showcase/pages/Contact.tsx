import { useState, type FormEvent } from 'react';
import { profile, socials } from '../../../data/portfolio';
import { GithubIcon, LinkedinIcon } from '../../components/icons';
import { PageHeader, ResumeCallout } from '../Common';

/** No backend: the form composes an email in the visitor's mail client. */
export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sent, setSent] = useState(false);
  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.message.trim();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const subject = `Portfolio contact from ${form.name}${form.company ? ` (${form.company})` : ''}`;
    const body = `${form.message}\n\n— ${form.name}\n${form.email}${form.company ? `\n${form.company}` : ''}`;
    window.open(`mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_top');
    setSent(true);
  };

  const field = (key: keyof typeof form, label: string, required: boolean, textarea = false) => (
    <label className="mb-6 block">
      <h4 className="mb-1">
        {required && <span className="mr-1 text-red-600">*</span>}
        {label}
      </h4>
      {textarea ? (
        <textarea required={required} placeholder={label.replace(/[:(].*$/, '').replace('Your ', '')} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
      ) : (
        <input
          type={key === 'email' ? 'email' : 'text'}
          required={required}
          autoComplete={key === 'name' ? 'name' : key === 'email' ? 'email' : 'organization'}
          placeholder={label.replace(/[:(].*$/, '').replace('Your n', 'N').trim()}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </label>
  );

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Contact" sub="" />
        <div className="flex gap-2">
          {socials.github && (
            <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="bevel-raised grid h-[52px] w-[52px] place-items-center !text-black hover:!bg-[var(--surface-hover)]">
              <GithubIcon width={34} height={34} />
            </a>
          )}
          {socials.linkedin && (
            <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="bevel-raised grid h-[52px] w-[52px] place-items-center hover:!bg-[var(--surface-hover)]">
              <LinkedinIcon width={34} height={34} />
            </a>
          )}
        </div>
      </div>
      <div className="text-block !mt-0">
        <p>
          I'm always open to new opportunities, internships, collaborations, and interesting problems, especially in AI/ML, Computer
          Vision, and data-driven systems. Feel free to reach out via my personal email, give me a call, or fill out the form below!
        </p>
      </div>
      <p>
        <b>Email:</b> <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <br />
        <b>Phone:</b> <a href={profile.phoneHref}>{profile.phone}</a>
        <br />
        <b>Location:</b> {profile.location}
      </p>

      <form className="mt-8" onSubmit={submit} noValidate>
        {field('name', 'Your name:', true)}
        {field('email', 'Email:', true)}
        {field('company', 'Company (optional):', false)}
        {field('message', 'Message:', true, true)}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <button type="submit" className="site-button min-w-[184px] !py-3 disabled:cursor-not-allowed disabled:opacity-60" disabled={!valid}>
            Send Message
          </button>
          <div className="text-right max-[760px]:text-left">
            <p className="!text-[15px]">{sent ? 'Your mail app should now be open, just press send!' : 'Opens a pre-filled email to me'}</p>
            <p className="!text-[15px]">
              <span className="text-red-600">*</span> = required
            </p>
          </div>
        </div>
      </form>

      <ResumeCallout label="Need a copy of my Resume?" />
    </>
  );
}
