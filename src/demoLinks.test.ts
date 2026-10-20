import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEMO_MODE } from './config';

/** Same patterns the build check (scripts/check-links.mjs) applies to dist/. */
const FORBIDDEN_HREF = /href\s*=\s*\{?\s*["'`]https?:\/\/(www\.)?(mapleriseestates|rbsland)\.com/i;
const HREF_FROM_DATA = /href=\{[^}]*\b(sourceUrl|siteUrl)\b[^}]*\}/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'assets' ? [] : sourceFiles(p);
    return /\.tsx?$/.test(name) && !name.endsWith('.test.ts') ? [p] : [];
  });
}

describe('demo mode: nothing links away to the live sites', () => {
  const files = sourceFiles(resolve('src'));

  it('DEMO_MODE is on', () => {
    expect(DEMO_MODE).toBe(true);
  });

  it('no component hard-codes an href to mapleriseestates.com or rbsland.com', () => {
    const hits = files.filter((f) => FORBIDDEN_HREF.test(readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
  });

  it('links built from sourceUrl/siteUrl only exist behind a !DEMO_MODE branch', () => {
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      if (HREF_FROM_DATA.test(src)) expect(src.includes('DEMO_MODE'), f).toBe(true);
    }
  });
});
