import { DEFAULT_SQFT_PER_MARLA, MARLAS_PER_KANAL } from '../data/projects';

/** "7 Marla" → 7, "1 Kanal" → 20, "3.5 Marla (20×40)" → 3.5, "Studio" → null. */
export function sizeToMarla(size: string): number | null {
  const m = size.match(/^([\d.]+)\s*(Marla|Kanal)\b/i);
  if (!m) return null;
  const n = Number.parseFloat(m[1]);
  return m[2].toLowerCase() === 'kanal' ? n * MARLAS_PER_KANAL : n;
}

export function sizeToSqft(size: string, sqftPerMarla = DEFAULT_SQFT_PER_MARLA): number | null {
  const marla = sizeToMarla(size);
  return marla === null ? null : Math.round(marla * sqftPerMarla);
}
