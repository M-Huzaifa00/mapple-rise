import { IMAGES, type ImageKey } from '../../assets/images/manifest';

interface Props {
  image: ImageKey;
  alt: string;
  className?: string;
  /** Use the larger "full" variant where one exists (Quick View gallery). */
  large?: boolean;
  sizes?: string;
  eager?: boolean;
}

/**
 * Local WebP with fixed dimensions (no layout shift) and a tiny blurred preview painted underneath
 * until the real image arrives.
 */
export function Img({ image, alt, className = '', large, sizes, eager }: Props) {
  const entry = IMAGES[image];
  const card = 'card' in entry ? entry.card : undefined;
  const full = 'full' in entry ? entry.full : undefined;
  const main = (large && full) || card;
  if (!main) return null;
  const srcSet = large && card && full ? `${card.src} ${card.width}w, ${full.src} ${full.width}w` : undefined;
  const blur = 'blur' in entry ? entry.blur : undefined;
  return (
    <img
      src={main.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={main.width}
      height={main.height}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`bg-sand bg-cover bg-center object-cover ${className}`}
      style={blur ? { backgroundImage: `url(${blur})` } : undefined}
    />
  );
}
