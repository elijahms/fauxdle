import {
  Languages,
  Grid3x3,
  Infinity as InfinityIcon,
  Hexagon,
  Timer,
} from "lucide-react";
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
    id: "arabic",
    name: "Fauxdle عربي",
    tagline: "Learn Arabic, one word at a time",
    icon: Languages,
    href: "/arabic",
    status: "live",
  },
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
    href: "/unlimited",
    status: "live",
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
