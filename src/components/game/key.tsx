"use client";

import { cn } from "@/lib/utils";
import { CellColor } from "@/hooks/use-game";
import { Delete } from "lucide-react";
import { useMemo } from "react";

interface KeyProps {
  letter: string;
  onClick: (key: string) => void;
  cellColor: [string, CellColor][][];
}

export function Key({ letter, onClick, cellColor }: KeyProps) {
  const isSpecialKey = letter === "ENT" || letter === "⬅";

  const keyColor = useMemo(() => {
    if (isSpecialKey) {
      return "bg-teal-600 text-white hover:bg-teal-500";
    }

    const cellArr = cellColor.flat().filter((s) => s[0] === letter);
    if (cellArr.length > 0) {
      // Prioritize green over orange over gray
      if (cellArr.some(([, color]) => color === "green")) {
        return "bg-green-500 text-white hover:bg-green-400";
      }
      if (cellArr.some(([, color]) => color === "orange")) {
        return "bg-orange-500 text-white hover:bg-orange-400";
      }
      if (cellArr.some(([, color]) => color === "gray")) {
        return "bg-zinc-400 text-white dark:bg-zinc-800 dark:text-zinc-400";
      }
    }

    return "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-600 dark:text-zinc-50 dark:hover:bg-zinc-500";
  }, [letter, cellColor, isSpecialKey]);

  return (
    <button
      onClick={() => onClick(letter)}
      aria-label={
        letter === "ENT" ? "Enter" : letter === "⬅" ? "Backspace" : letter
      }
      className={cn(
        "flex items-center justify-center",
        "font-bold uppercase select-none",
        "rounded-md transition-all duration-150",
        "active:translate-y-px active:brightness-90",
        "h-[clamp(2.75rem,6.5dvh,3.5rem)]",
        isSpecialKey
          ? "flex-[1.5] text-[0.65rem] tracking-widest"
          : "flex-1 text-sm sm:text-base",
        keyColor
      )}
    >
      {letter === "⬅" ? (
        <Delete className="h-5 w-5" />
      ) : letter === "ENT" ? (
        "Enter"
      ) : (
        letter
      )}
    </button>
  );
}
