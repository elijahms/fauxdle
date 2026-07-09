"use client";

import { Key } from "./key";
import { CellColor, REVEAL_DURATION_MS } from "@/hooks/use-game";
import { useEffect, useCallback, useState } from "react";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  cellColor: [string, CellColor][][];
  /** True once a guess has been submitted this session — delays key colors until the flip finishes */
  delayReveal: boolean;
}

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["ENT", "z", "x", "c", "v", "b", "n", "m", "⬅"],
];

export function Keyboard({ onKeyPress, cellColor, delayReveal }: KeyboardProps) {
  // Key colors update after the cell flip completes (or instantly on restore)
  const [displayedCellColor, setDisplayedCellColor] = useState(cellColor);

  useEffect(() => {
    const delay = delayReveal ? REVEAL_DURATION_MS : 0;
    const timer = setTimeout(() => setDisplayedCellColor(cellColor), delay);
    return () => clearTimeout(timer);
  }, [cellColor, delayReveal]);

  // Handle physical keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onKeyPress("Enter");
      } else if (e.key === "Backspace") {
        onKeyPress("Backspace");
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        onKeyPress(e.key.toLowerCase());
      }
    },
    [onKeyPress]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-1.5 px-1 sm:px-2">
      {ROWS.map((row, i) => (
        <div
          key={i}
          className={i === 1 ? "flex gap-1 px-[4.5%] sm:gap-1.5" : "flex gap-1 sm:gap-1.5"}
        >
          {row.map((letter) => (
            <Key
              key={letter}
              letter={letter}
              onClick={onKeyPress}
              cellColor={displayedCellColor}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
