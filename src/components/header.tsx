"use client";

import { HelpCircle, BarChart2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface HeaderProps {
  onHelpClick: () => void;
  onStatsClick: () => void;
}

export function Header({ onHelpClick, onStatsClick }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex items-center justify-between py-4 px-2 border-b border-border mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onHelpClick}
        aria-label="Help"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider">
        FAUXDLE
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
          <BarChart2 className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
