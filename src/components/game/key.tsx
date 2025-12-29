"use client";

import { cn } from "@/lib/utils";
import { CellColor } from "@/hooks/use-game";
import { useMemo } from "react";

interface KeyProps {
  letter: string;
  onClick: (key: string) => void;
  cellColor: [string, CellColor][][];
}

export function Key({ letter, onClick, cellColor }: KeyProps) {
  const isSpecialKey = letter === "ENT" || letter === "⬅";

  // Memoize the color calculation to avoid recalculating on every render
  const keyColor = useMemo(() => {
    if (isSpecialKey) {
      return "bg-teal-600 hover:bg-teal-700 text-white";
    }

    const cellArr = cellColor.flat().filter((s) => s[0] === letter);
    if (cellArr.length > 0) {
      // Prioritize green over orange over gray
      if (cellArr.some(([, color]) => color === "green")) {
        return "bg-green-500 hover:bg-green-600 text-white";
      }
      if (cellArr.some(([, color]) => color === "orange")) {
        return "bg-orange-500 hover:bg-orange-600 text-white";
      }
      if (cellArr.some(([, color]) => color === "gray")) {
        return "bg-zinc-600 hover:bg-zinc-700 text-white";
      }
    }

    return "bg-zinc-300 dark:bg-zinc-500 hover:bg-zinc-400 dark:hover:bg-zinc-400 text-foreground";
  }, [letter, cellColor, isSpecialKey]);

  return (
    <button
      onClick={() => onClick(letter)}
      className={cn(
        "flex items-center justify-center",
        "font-bold uppercase rounded-md",
        "transition-colors duration-150",
        "h-12 sm:h-14",
        isSpecialKey
          ? "w-12 sm:w-16 text-xs sm:text-sm"
          : "w-8 sm:w-10 text-sm sm:text-base",
        keyColor
      )}
    >
      {letter}
    </button>
  );
}
