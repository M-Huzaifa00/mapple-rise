
import { DEMO_MODE } from '../../config';

const GITHUB_URL = 'https://github.com/M-Huzaifa00';
const DEMO_AUTHOR = 'M-Huzaifa00';

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-[15px] shrink-0"
    >
      <path d="M12 .297a12 12 0 0 0-3.793 23.385c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.467-1.333-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23A11.52 11.52 0 0 1 12 6.123c1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.221 0 4.61-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.002 12.002 0 0 0 12 .297Z" />
    </svg>
  );
}

export function DemoBanner() {
  if (!DEMO_MODE) return null;

  return (
    <aside
      role="note"
      aria-label="Demo notice"
     className="
  fixed inset-x-0 top-0 z-[60]
  flex h-8 items-center justify-center
  overflow-hidden
  border-b border-gold-300/20
  bg-[#061A12]
  px-2
  text-[13px] leading-none
  text-[#F5F1E8]
  md:h-9
"
    >
      <div className="flex max-w-full items-center justify-center gap-1.5 whitespace-nowrap md:gap-2">

        {/* Mobile text */}
        <span className="md:hidden">
          Demo
        </span>

        {/* Desktop text */}
        <span className="hidden md:inline">
          Demo preview — not the official MapleRise Estates website
          {' · '}Design &amp; code
        </span>

        <span aria-hidden="true" className="opacity-50">
          ·
        </span>

        {/* Copyright and author */}
        <span className="whitespace-nowrap">
          <bdi>© 2026</bdi>{' '}
          <bdi className="font-medium">
            {DEMO_AUTHOR}
          </bdi>
        </span>

        <span aria-hidden="true" className="opacity-50">
          ·
        </span>

        {/* GitHub link */}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub (opens in new tab)"
          className="
            inline-flex shrink-0 items-center
            gap-1.5 whitespace-nowrap
            text-gold-300
            hover:underline
            focus-visible:rounded-sm
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-gold-300
          "
        >
          <GitHubIcon />

          <span className="md:hidden">
            <bdi>GitHub</bdi>
          </span>

          <span className="hidden md:inline">
            View on <bdi>GitHub</bdi>
          </span>
        </a>
      </div>
    </aside>
  );
}
