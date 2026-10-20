import type { ReactNode } from 'react';

interface Props {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  /** `split`: title left, intro right on large screens (editorial); `stack`: one column. */
  layout?: 'stack' | 'split';
  tone?: 'light' | 'dark';
  className?: string;
}

/** Left-aligned section title. `id` goes on the h2 so sections can use aria-labelledby. */
export function SectionHeading({ id, eyebrow, title, intro, layout = 'stack', tone = 'light', className = '' }: Props) {
  const dark = tone === 'dark';
  const heading = (
    <div>
      {eyebrow && <p className={`eyebrow ${dark ? 'text-gold-300' : ''}`}>{eyebrow}</p>}
      <h2 id={id} tabIndex={-1} className={`h-section mt-3 outline-none ${dark ? 'text-white' : ''}`}>
        {title}
      </h2>
    </div>
  );
  const body = intro && <p className={`max-w-xl text-lg ${dark ? 'text-brand-100' : 'text-ink-soft'}`}>{intro}</p>;

  return layout === 'split' ? (
    <div className={`mb-10 grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16 ${className}`}>
      {heading}
      {body}
    </div>
  ) : (
    <div className={`mb-10 max-w-3xl space-y-4 ${className}`}>
      {heading}
      {body}
    </div>
  );
}
