export type ButtonVariant = 'primary' | 'outline' | 'outlineLight' | 'gold' | 'quiet';

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-11';

/** Shared by ButtonLink and plain <button>s. Small radius, no shadows. */
export const buttonStyles: Record<ButtonVariant, string> = {
  primary: `${base} bg-brand-800 text-white hover:bg-brand-700`,
  outline: `${base} border border-brand-800 text-brand-800 hover:bg-brand-50`,
  outlineLight: `${base} border border-white/70 text-white hover:bg-white/10`,
  gold: `${base} bg-gold-300 text-brand-950 hover:bg-gold-100`,
  quiet: `${base} px-0 text-brand-800 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-brand-600`,
};
