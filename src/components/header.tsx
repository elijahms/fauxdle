"use client";

import {
  HelpCircle,
  BarChart2,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tile } from "@/components/game/tile";
import { AppDrawer } from "@/components/app-drawer";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

interface HeaderProps {
  badge?: string;
  /** When defined, renders a mute toggle (letter-audio modes) */
  soundOn?: boolean;
  onToggleSound?: () => void;
  onHelpClick: () => void;
  onStatsClick: () => void;
}

const emptySubscribe = () => () => {};

const LOGO = ["f", "a", "u", "x", "d", "l", "e"] as const;

export function Header({
  badge,
  soundOn,
  onToggleSound,
  onHelpClick,
  onStatsClick,
}: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();

  // Avoid hydration mismatch: false on the server, true after client mount
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <header className="mb-2 flex items-center justify-between border-b border-border px-1 py-3 sm:mb-4">
      <div className="flex gap-1">
        <AppDrawer />
        <Button
          variant="ghost"
          size="icon"
          onClick={onHelpClick}
          aria-label="How to play"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <h1 aria-label="Fauxdle" className="flex gap-1">
          {LOGO.map((letter, i) => (
            <Tile
              key={i}
              letter={letter}
              size="xs"
              tone={letter === "x" ? "accent" : "empty"}
            />
          ))}
        </h1>
        {badge && (
          <span className="text-[0.6rem] font-semibold tracking-widest text-teal-600 uppercase dark:text-teal-400">
            {badge}
          </span>
        )}
      </div>

      <div className="flex gap-1">
        {onToggleSound && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSound}
            aria-label={soundOn ? "Mute letter sounds" : "Unmute letter sounds"}
            aria-pressed={!soundOn}
          >
            {soundOn ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {mounted ? (
            resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )
          ) : (
            <div className="h-5 w-5" /> // Placeholder to prevent layout shift
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onStatsClick}
          aria-label="Statistics"
        >
          <BarChart2 className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
