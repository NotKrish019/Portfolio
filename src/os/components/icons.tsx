import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = { shapeRendering: 'crispEdges' as const, 'aria-hidden': true };

/** Program window with a K: used for "My Showcase". */
export const ShowcaseIcon = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <rect x="1" y="2" width="30" height="28" fill="#000" />
    <rect x="2" y="3" width="28" height="26" fill="#fff" />
    <rect x="2" y="3" width="28" height="5" fill="#0d4f57" />
    <rect x="22" y="4" width="2" height="2" fill="#fff" />
    <rect x="25" y="4" width="2" height="2" fill="#fff" />
    <rect x="3" y="4" width="2" height="2" fill="#f2c94c" />
    <path d="M9 11h4v6l5-6h5l-6 7 6 8h-5l-4-6-1 1v5H9z" fill="#000" />
  </svg>
);

export const ResumeIcon = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <path d="M6 2h14l6 6v22H6z" fill="#000" />
    <path d="M7 3h12v6h6v20H7z" fill="#fff" />
    <path d="M20 3l5 5h-5z" fill="#c0c0c0" />
    <rect x="9" y="6" width="8" height="2" fill="#0d4f57" />
    {[11, 14, 17, 20, 23, 26].map((y, i) => (
      <rect key={y} x="9" y={y} width={i % 2 ? 11 : 14} height="1" fill="#808080" />
    ))}
    <rect x="18" y="20" width="9" height="9" fill="#c0392b" />
    <text x="22.5" y="27.5" fontSize="6" fontFamily="Arial" fontWeight="700" textAnchor="middle" fill="#fff">PDF</text>
  </svg>
);

export const CreditsIcon = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <path d="M5 2h22v28H5z" fill="#000" />
    <path d="M6 3h20v26H6z" fill="#fff" />
    <rect x="12" y="5" width="8" height="2" fill="#000" />
    {[9, 12, 15, 18, 21, 24].map((y, i) => (
      <g key={y}>
        <rect x="8" y={y} width={i % 2 ? 6 : 8} height="2" fill="#000" />
        <rect x={i % 2 ? 17 : 19} y={y} width={i % 2 ? 7 : 5} height="2" fill="#555" />
      </g>
    ))}
  </svg>
);

export const GithubIcon = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <path
      fill="currentColor"
      d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
    />
  </svg>
);

export const LinkedinIcon = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <circle cx="12" cy="12" r="12" fill="#0a66c2" />
    <path fill="#fff" d="M7.2 9.7h2.2V17H7.2zM8.3 6.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM10.9 9.7H13v1c.3-.6 1.1-1.2 2.3-1.2 2.4 0 2.8 1.6 2.8 3.6V17h-2.2v-3.5c0-.9 0-2-1.2-2s-1.4.9-1.4 1.9V17h-2.2z" />
  </svg>
);

export const MailIcon = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <rect x="3" y="8" width="26" height="17" fill="#000" />
    <rect x="4" y="9" width="24" height="15" fill="#fff" />
    <path d="M4 9l12 9 12-9" fill="none" stroke="#000" strokeWidth="1.5" />
  </svg>
);

export const PhoneIcon = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <rect x="9" y="3" width="14" height="26" fill="#000" />
    <rect x="10" y="4" width="12" height="24" fill="#c0c0c0" />
    <rect x="11" y="6" width="10" height="13" fill="#0d4f57" />
    <rect x="14" y="23" width="4" height="3" fill="#000" />
  </svg>
);

/** Beige desktop computer: used for software projects & shut down. */
export const ComputerIcon = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <rect x="4" y="3" width="22" height="18" fill="#000" />
    <rect x="5" y="4" width="20" height="16" fill="#d8d4c8" />
    <rect x="7" y="6" width="16" height="11" fill="#000" />
    <rect x="8" y="7" width="14" height="9" fill="#2a8a8c" />
    <rect x="10" y="9" width="8" height="5" fill="#fff" />
    <rect x="10" y="9" width="8" height="1" fill="#0d4f57" />
    <rect x="12" y="21" width="6" height="2" fill="#000" />
    <rect x="3" y="23" width="26" height="6" fill="#000" />
    <rect x="4" y="24" width="24" height="4" fill="#d8d4c8" />
    <rect x="6" y="25" width="3" height="1" fill="#2ecc71" />
    <rect x="18" y="25" width="8" height="1" fill="#808080" />
  </svg>
);

export const TrophyIcon = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <path d="M9 3h14v9a7 7 0 0 1-14 0z" fill="#000" />
    <path d="M10 4h12v8a6 6 0 0 1-12 0z" fill="#f2c94c" />
    <rect x="12" y="5" width="2" height="7" fill="#fff3b0" />
    <path d="M4 5h5v2H6v2a4 4 0 0 0 3 3v2a6 6 0 0 1-5-5zM28 5h-5v2h3v2a4 4 0 0 1-3 3v2a6 6 0 0 0 5-5z" fill="#000" />
    <rect x="14" y="18" width="4" height="5" fill="#000" />
    <rect x="15" y="18" width="2" height="5" fill="#c9a227" />
    <rect x="9" y="23" width="14" height="6" fill="#000" />
    <rect x="10" y="24" width="12" height="4" fill="#7a4a1d" />
    <rect x="13" y="25" width="6" height="2" fill="#f2c94c" />
  </svg>
);

export const CampusIcon = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <path d="M16 2 2 10h28z" fill="#000" />
    <path d="M16 4 6 9h20z" fill="#a33a2c" />
    <rect x="3" y="10" width="26" height="2" fill="#000" />
    {[5, 11, 18, 24].map((x) => (
      <g key={x}>
        <rect x={x} y="12" width="3" height="13" fill="#000" />
        <rect x={x + 1} y="12" width="1" height="13" fill="#fff" />
      </g>
    ))}
    <rect x="2" y="25" width="28" height="5" fill="#000" />
    <rect x="3" y="26" width="26" height="3" fill="#c0c0c0" />
  </svg>
);

export const BookIcon = (p: P) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <path d="M4 5h11l1 1 1-1h11v22H17l-1 1-1-1H4z" fill="#000" />
    <path d="M5 6h10v20H5zM17 6h10v20H17z" fill="#fff" />
    {[9, 12, 15, 18, 21].map((y) => (
      <g key={y}>
        <rect x="7" y={y} width="6" height="1" fill="#808080" />
        <rect x="19" y={y} width="6" height="1" fill="#808080" />
      </g>
    ))}
    <rect x="15" y="6" width="2" height="21" fill="#0d4f57" />
  </svg>
);

/** Floppy + document stack, like the reference resume callout. */
export const FloppyIcon = (p: P) => (
  <svg viewBox="0 0 48 48" {...base} {...p}>
    <g transform="rotate(-18 24 24)">
      <rect x="18" y="6" width="22" height="24" fill="#000" />
      <rect x="19" y="7" width="20" height="22" fill="#808080" />
      <rect x="23" y="7" width="12" height="8" fill="#e0e0e0" />
      <rect x="31" y="8" width="3" height="6" fill="#000" />
      <rect x="21" y="18" width="16" height="10" fill="#fff" />
      <rect x="23" y="20" width="12" height="1" fill="#c0392b" />
      <rect x="23" y="23" width="9" height="1" fill="#000" />
    </g>
    <rect x="5" y="20" width="16" height="20" fill="#000" />
    <rect x="6" y="21" width="14" height="18" fill="#fff" />
    <rect x="8" y="24" width="10" height="1" fill="#000" />
    <rect x="8" y="27" width="8" height="1" fill="#000" />
    <rect x="8" y="30" width="10" height="1" fill="#000" />
    <rect x="8" y="33" width="6" height="1" fill="#000" />
  </svg>
);

/** Small "browser" glyph for the showcase title bar. */
export const BrowserGlyph = (p: P) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <rect x="0" y="1" width="16" height="14" fill="#fff" />
    <rect x="1" y="2" width="14" height="12" fill="#0d4f57" />
    <rect x="3" y="4" width="10" height="2" fill="#fff" />
    <rect x="3" y="4" width="2" height="8" fill="#fff" />
    <rect x="3" y="7" width="7" height="2" fill="#fff" />
    <rect x="3" y="10" width="10" height="2" fill="#fff" />
  </svg>
);

export const SpeakerIcon = (p: P) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M2 6h3l4-3v10L5 10H2z" fill="#000" />
    <path d="M3 7h2l3-2v6L5 9H3z" fill="#f2c94c" />
    <path d="M11 5c1 1 1 5 0 6M13 3c2 2 2 8 0 10" stroke="#000" fill="none" />
  </svg>
);

export const StartLogo = (p: P) => (
  <svg viewBox="0 0 22 16" {...base} {...p}>
    <rect x="0" y="0" width="22" height="16" fill="#0d4f57" />
    <rect x="1" y="1" width="20" height="14" fill="#1d6b70" />
    <text x="11" y="12" fontSize="10" fontFamily="Arial" fontWeight="900" textAnchor="middle" fill="#fff">KR</text>
  </svg>
);

/** Title-bar control glyphs. */
export const MinGlyph = () => (
  <svg width="8" height="7" {...base}>
    <rect x="0" y="5" width="6" height="2" fill="#000" />
  </svg>
);
export const MaxGlyph = () => (
  <svg width="9" height="9" {...base}>
    <rect x="0" y="0" width="9" height="9" fill="#000" />
    <rect x="1" y="2" width="7" height="6" fill="#c0c0c0" />
  </svg>
);
export const CloseGlyph = () => (
  <svg width="8" height="7" viewBox="0 0 8 7" {...base}>
    <path d="M0 0h2l2 2 2-2h2L5 3.5 8 7H6L4 5 2 7H0l3-3.5z" fill="#000" />
  </svg>
);
