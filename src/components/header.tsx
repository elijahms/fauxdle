"use client";

import { HelpCircle, BarChart2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tile } from "@/components/game/tile";
import { AppDrawer } from "@/components/app-drawer";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

interface HeaderProps {
  onHelpClick: () => void;
  onStatsClick: () => void;
}

const emptySubscribe = () => () => {};

const LOGO = ["f", "a", "u", "x", "d", "l", "e"] as const;

export function Header({ onHelpClick, onStatsClick }: HeaderProps) {
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

      <div className="flex gap-1">
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
