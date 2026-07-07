import {
  Users,
  BadgeCheck,
  GraduationCap,
  Trophy,
  Sparkles,
  Target,
  HeartHandshake,
  Medal,
  MapPin,
  type LucideIcon,
} from "lucide-react";

/** Maps the icon names used in siteConfig to their lucide components. */
export const iconMap = {
  Users,
  BadgeCheck,
  GraduationCap,
  Trophy,
  Sparkles,
  Target,
  HeartHandshake,
  Medal,
  MapPin,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;
