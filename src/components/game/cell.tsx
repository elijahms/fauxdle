"use client";

import { cn } from "@/lib/utils";
import { CellColor } from "@/hooks/use-game";
import { useState, useEffect } from "react";

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
  const [revealed, setRevealed] = useState(!animate);
  const [prevAnimate, setPrevAnimate] = useState(animate);

  // Hide the color when a flip animation starts, show it when animation ends
  if (animate !== prevAnimate) {
    setPrevAnimate(animate);
    setRevealed(!animate);
  }

  // Reveal the color partway through the flip animation
  useEffect(() => {
    if (!animate) return;
    const delayMs = animationDelay * 200 + 250;
    const timer = setTimeout(() => setRevealed(true), delayMs);
    return () => clearTimeout(timer);
  }, [animate, animationDelay]);

  const showColor = revealed && !!color;

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
        // Sized against the dynamic viewport so board + keyboard always fit on screen
        "size-[clamp(2.5rem,7.5dvh,4rem)]",
        "rounded-sm border-2 border-zinc-300 dark:border-zinc-700",
        "flex items-center justify-center",
        "text-[clamp(1.375rem,3.4dvh,2.25rem)] font-extrabold uppercase",
        "text-foreground transition-colors duration-150",
        getBackgroundColor(),
        showColor && "text-white",
        animate && "animate-flip",
        letter && isCurrentRow && "border-zinc-500 dark:border-zinc-400"
      )}
      style={{
        animationDelay: animate ? `${animationDelay * 0.2}s` : undefined,
      }}
    >
      {letter ? (
        <span key={letter} className={isCurrentRow ? "animate-pop" : undefined}>
          {letter}
        </span>
      ) : null}
    </div>
  );
}
