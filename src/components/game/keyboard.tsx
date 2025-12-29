"use client";

import { Key } from "./key";
import { CellColor } from "@/hooks/use-game";
import { useEffect, useCallback, useState, useRef } from "react";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  cellColor: [string, CellColor][][];
}

const FIRST_ROW = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const SECOND_ROW = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const THIRD_ROW = ["ENT", "z", "x", "c", "v", "b", "n", "m", "⬅"];

// Total animation time: 5 cells * 200ms delay each + 500ms flip duration
const ANIMATION_COMPLETE_DELAY = 1200;

export function Keyboard({ onKeyPress, cellColor }: KeyboardProps) {
  // Delay keyboard color updates until cell animations complete
  const [displayedCellColor, setDisplayedCellColor] = useState(cellColor);
  const prevLengthRef = useRef(cellColor.length);

  useEffect(() => {
    if (cellColor.length > prevLengthRef.current) {
      // New row was added - delay the update
      const timer = setTimeout(() => {
        setDisplayedCellColor(cellColor);
      }, ANIMATION_COMPLETE_DELAY);
      prevLengthRef.current = cellColor.length;
      return () => clearTimeout(timer);
    } else {
      // Initial load or same length - update immediately
      setDisplayedCellColor(cellColor);
      prevLengthRef.current = cellColor.length;
    }
  }, [cellColor]);

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
    <div className="w-full max-w-lg mx-auto px-1 sm:px-2">
      {/* First row */}
      <div className="flex justify-center gap-1 sm:gap-1.5 mb-1.5">
        {FIRST_ROW.map((letter) => (
          <Key
            key={letter}
            letter={letter}
            onClick={onKeyPress}
            cellColor={displayedCellColor}
          />
        ))}
      </div>

      {/* Second row */}
      <div className="flex justify-center gap-1 sm:gap-1.5 mb-1.5">
        {SECOND_ROW.map((letter) => (
          <Key
            key={letter}
            letter={letter}
            onClick={onKeyPress}
            cellColor={displayedCellColor}
          />
        ))}
      </div>

      {/* Third row */}
      <div className="flex justify-center gap-1 sm:gap-1.5">
        {THIRD_ROW.map((letter) => (
          <Key
            key={letter}
            letter={letter}
            onClick={onKeyPress}
            cellColor={displayedCellColor}
          />
        ))}
      </div>
    </div>
  );
}
