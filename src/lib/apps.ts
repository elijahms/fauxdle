import { Grid3x3, Infinity as InfinityIcon, Hexagon, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface WordApp {
  id: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  href?: string;
  status: "live" | "soon";
}

export const APPS: WordApp[] = [
  {
    id: "fauxdle",
    name: "Fauxdle",
    tagline: "The daily 5-letter classic",
    icon: Grid3x3,
    href: "/",
    status: "live",
  },
  {
    id: "unlimited",
    name: "Fauxdle Unlimited",
    tagline: "A new word every round, no waiting",
    icon: InfinityIcon,
    status: "soon",
  },
  {
    id: "sixle",
    name: "Sixle",
    tagline: "One more letter, one less mercy",
    icon: Hexagon,
    status: "soon",
  },
  {
    id: "speedle",
    name: "Speedle",
    tagline: "Same rules, against the clock",
    icon: Timer,
    status: "soon",
  },
];
