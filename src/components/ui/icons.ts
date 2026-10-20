import {
  Building2,
  CircleCheck,
  FileCheck,
  Handshake,
  KeyRound,
  Megaphone,
  Plane,
  Ruler,
  Scale,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/** Icon names used in data files → components (keeps data free of React imports). */
const ICONS: Record<string, LucideIcon> = {
  Building2,
  FileCheck,
  Handshake,
  KeyRound,
  Megaphone,
  Plane,
  Ruler,
  Scale,
  TrendingUp,
  Wrench,
};

export const iconFor = (name: string): LucideIcon => ICONS[name] ?? CircleCheck;
