"use client";

import { cn } from "@/lib/utils";
import { CellColor } from "@/hooks/use-game";
import { useState, useEffect, useRef } from "react";

interface CellProps {
  letter: string;
  color: CellColor;
  isCurrentRow: boolean;
  animate: boolean;
  animationDelay: number;
}

export function Cell({
  letter,
  color,
  isCurrentRow,
  animate,
  animationDelay,
}: CellProps) {
  const [showColor, setShowColor] = useState(!animate && !!color);
  const prevAnimateRef = useRef(animate);

  // Reset showColor when animate changes from false to true (new row submitted)
  useEffect(() => {
    if (animate && !prevAnimateRef.current) {
      // Animation just started
      setShowColor(false);
      const delayMs = animationDelay * 200 + 250;
      const timer = setTimeout(() => setShowColor(true), delayMs);
      return () => clearTimeout(timer);
    } else if (!animate && color) {
      // Already revealed (e.g., on page load or after animation completed)
      setShowColor(true);
    }
    prevAnimateRef.current = animate;
  }, [animate, color, animationDelay]);

  const getBackgroundColor = () => {
    if (isCurrentRow || !showColor) return "";
    switch (color) {
      case "green":
        return "bg-green-500 border-green-500";
      case "orange":
        return "bg-orange-500 border-orange-500";
      case "gray":
        return "bg-zinc-600 border-zinc-600";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "w-14 h-14 sm:w-16 sm:h-16 border-2 border-zinc-400 dark:border-zinc-600",
        "flex items-center justify-center",
        "text-3xl sm:text-4xl font-extrabold uppercase",
        "text-foreground",
        getBackgroundColor(),
        showColor && "text-white",
        animate && "animate-flip",
        letter && isCurrentRow && "border-zinc-500 dark:border-zinc-400"
      )}
      style={{
        animationDelay: animate ? `${animationDelay * 0.2}s` : undefined,
      }}
    >
      {letter}
    </div>
  );
}
