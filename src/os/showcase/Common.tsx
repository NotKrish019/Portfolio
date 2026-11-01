import type { ReactNode } from 'react';
import { profile } from '../../data/portfolio';
import { FloppyIcon } from '../components/icons';

export function PageHeader({ title, sub }: { title: string; sub: ReactNode }) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      <h3>{sub}</h3>
    </header>
  );
}

export function ResumeCallout({ label = 'Looking for my resume?' }: { label?: string }) {
  return (
    <div className="rule-box">
      <FloppyIcon width={56} height={56} />
      <div>
        <h3>{label}</h3>
        <p>
          <a href={profile.resume} target="_blank" rel="noreferrer">
            Click here to view it!
          </a>
          <span className="mx-3 text-[#808080]">|</span>
          <a href={profile.resume} download={profile.resumeDownloadName}>
            Download PDF
          </a>
        </p>
      </div>
    </div>
  );
}

export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
      {items.map((s) => (
        <li key={s} className="!m-0 !text-[14px]">
          <span className="chip">{s}</span>
        </li>
      ))}
    </ul>
  );
}

export function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
