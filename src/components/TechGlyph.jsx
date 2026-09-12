/**
 * TechGlyph — a cohesive set of custom, abstract SVG marks (one per technology).
 * Deliberately not the official brand logos: they share one geometric language
 * so the stack reads as a single system, and they animate cleanly on hover.
 * All strokes inherit `currentColor`; filled nodes are called out explicitly.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};
const node = { fill: 'currentColor', stroke: 'none' };

const GLYPHS = {
  html: (
    <>
      <path d="M9 7l-4 5 4 5" {...stroke} />
      <path d="M15 7l4 5-4 5" {...stroke} />
      <circle cx="12" cy="12" r="1" {...node} />
    </>
  ),
  css: (
    <>
      <path d="M12 3l8 4-8 4-8-4 8-4z" {...stroke} />
      <path d="M4 12l8 4 8-4" {...stroke} />
      <path d="M4 16l8 4 8-4" {...stroke} />
    </>
  ),
  js: (
    <>
      <path d="M9 5c-2 0-2.4 2-2.4 3.4C6.6 10 6 12 4.4 12 6 12 6.6 14 6.6 15.6 6.6 17 7 19 9 19" {...stroke} />
      <path d="M15 5c2 0 2.4 2 2.4 3.4 0 1.6.6 3.6 2.2 3.6-1.6 0-2.2 2-2.2 3.6C19.4 17 19 19 17 19" {...stroke} />
    </>
  ),
  react: (
    <>
      <ellipse cx="12" cy="12" rx="10" ry="3.9" {...stroke} />
      <ellipse cx="12" cy="12" rx="10" ry="3.9" transform="rotate(60 12 12)" {...stroke} />
      <ellipse cx="12" cy="12" rx="10" ry="3.9" transform="rotate(120 12 12)" {...stroke} />
      <circle cx="12" cy="12" r="1.7" {...node} />
    </>
  ),
  node: (
    <>
      <path d="M12 2.6l8 4.6v9.6l-8 4.6-8-4.6V7.2l8-4.6z" {...stroke} />
      <path d="M12 8v5.5a1.6 1.6 0 0 1-3.2 0" {...stroke} />
    </>
  ),
  git: (
    <>
      <path d="M7 4v16" {...stroke} />
      <path d="M7 12h5a3.5 3.5 0 0 0 3.5-3.5V7.5" {...stroke} />
      <circle cx="7" cy="5.6" r="2" {...stroke} />
      <circle cx="7" cy="18.4" r="2" {...stroke} />
      <circle cx="15.5" cy="5.6" r="2" {...stroke} />
    </>
  ),
  solidity: (
    <>
      <path d="M6.5 3.5h7l4 4V20a.9.9 0 0 1-.9.9H6.5a.9.9 0 0 1-.9-.9V4.4a.9.9 0 0 1 .9-.9z" {...stroke} />
      <path d="M13.5 3.5V7.5h4" {...stroke} />
      <path d="M8.5 12.5h7M8.5 15.5h4.5" {...stroke} />
      <circle cx="12" cy="12" r="0.9" {...node} />
    </>
  ),
  ethereum: (
    <>
      <path d="M12 2.5l6 9.5-6 3.5-6-3.5 6-9.5z" {...stroke} />
      <path d="M6 13.4l6 8.1 6-8.1-6 3.5-6-3.5z" {...stroke} />
    </>
  ),
  python: (
    <>
      <path d="M5.5 19V5" {...stroke} />
      <path d="M5.5 19h14" {...stroke} />
      <path d="M8.5 15l3.5-3 3 2 3.5-5" {...stroke} />
      <circle cx="8.5" cy="15" r="1" {...node} />
      <circle cx="12" cy="12" r="1" {...node} />
      <circle cx="15" cy="14" r="1" {...node} />
      <circle cx="18.5" cy="9" r="1" {...node} />
    </>
  ),
  ml: (
    <>
      <path d="M7 6l10 6M7 12h10M7 18l10-6" {...stroke} />
      <circle cx="6.5" cy="6" r="2" {...stroke} />
      <circle cx="6.5" cy="12" r="2" {...stroke} />
      <circle cx="6.5" cy="18" r="2" {...stroke} />
      <circle cx="17.5" cy="12" r="2.2" {...stroke} />
    </>
  ),
  java: (
    <>
      <path d="M7 4h10M7 4v7a5 5 0 0 0 10 0V4" {...stroke} />
      <path d="M12 16v4" {...stroke} />
      <path d="M8.5 20h7" {...stroke} />
    </>
  ),
  tailwind: (
    <>
      <path d="M4 10c1.3-2.7 3-4 5.2-4 3.3 0 3.7 2.6 5.4 3 1.3.3 2.5-.3 3.4-2" {...stroke} />
      <path d="M4 17c1.3-2.7 3-4 5.2-4 3.3 0 3.7 2.6 5.4 3 1.3.3 2.5-.3 3.4-2" {...stroke} />
    </>
  ),
  nextjs: (
    <>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M9 8.5v7M9 8.5l7 9.5" {...stroke} />
      <path d="M15.5 8.5v6" {...stroke} />
    </>
  ),
  mysql: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.6" {...stroke} />
      <path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" {...stroke} />
      <path d="M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6" {...stroke} />
    </>
  ),
  mongodb: (
    <>
      <path d="M12 3c3 3.5 4.5 6.5 4.5 9.5 0 3.5-2 6-4.5 8.5-2.5-2.5-4.5-5-4.5-8.5C7.5 9.5 9 6.5 12 3z" {...stroke} />
      <path d="M12 6v15" {...stroke} />
    </>
  ),
  numpy: (
    <>
      <path d="M5 19V5l6 8V5" {...stroke} />
      <path d="M14 5v14" {...stroke} />
      <path d="M18 5v14" {...stroke} />
      <path d="M14 9l4-2M14 15l4 2" {...stroke} />
    </>
  ),
  pandas: (
    <>
      <rect x="4.5" y="4.5" width="6" height="6" rx="1" {...stroke} />
      <rect x="13.5" y="4.5" width="6" height="6" rx="1" {...stroke} />
      <rect x="4.5" y="13.5" width="6" height="6" rx="1" {...stroke} />
      <rect x="13.5" y="13.5" width="6" height="6" rx="1" {...node} />
    </>
  ),
  github: (
    <>
      <path d="M12 3a9 9 0 0 0-2.8 17.5c.4.1.6-.2.6-.5v-1.7c-2.5.5-3-1.2-3-1.2-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.2 1 2.7.8.1-.6.3-1 .6-1.3-2-.2-4.1-1-4.1-4.4 0-1 .3-1.8.9-2.4-.1-.2-.4-1.1.1-2.4 0 0 .8-.2 2.5.9a8.5 8.5 0 0 1 4.4 0c1.7-1.1 2.5-.9 2.5-.9.5 1.3.2 2.2.1 2.4.6.6.9 1.4.9 2.4 0 3.4-2.1 4.2-4.1 4.4.3.3.6.8.6 1.6v2.3c0 .3.2.6.6.5A9 9 0 0 0 12 3z" {...stroke} />
    </>
  ),
  gcolab: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.6" {...stroke} />
      <path d="M7 9.5l3 3-3 3" {...stroke} />
      <path d="M12.5 15.5h4.5" {...stroke} />
    </>
  ),
};

export default function TechGlyph({ id, size = 26, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[id] || <circle cx="12" cy="12" r="8" {...stroke} />}
    </svg>
  );
}
