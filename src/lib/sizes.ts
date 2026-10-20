/** Words that appear in size strings, mapped to `units.*` translation keys. Longest first. */
const WORDS: [RegExp, string][] = [
  [/\bsq ft\b/g, 'sqft'],
  [/\bsq yd\b/g, 'sqyd'],
  [/\bMarla\b/g, 'marla'],
  [/\bKanal\b/g, 'kanal'],
  [/\bStudio\b/g, 'studio'],
  [/\bBed\b/g, 'bed'],
  [/\bDuplex\b/g, 'duplex'],
  [/\bShops\b/g, 'shops'],
  [/\bOffices\b/g, 'offices'],
];

/** "7 Marla" → "7 مرلہ" in Urdu. Numbers stay as written. */
export function formatSize(size: string, word: (key: string) => string): string {
  return WORDS.reduce((s, [re, key]) => s.replace(re, () => word(key)), size);
}
