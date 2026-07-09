"use client";

import { Cell } from "./cell";
import { CellColor } from "@/hooks/use-game";
import { cn } from "@/lib/utils";

interface BoardProps {
  guess: string[];
  boxes: CellColor[][];
  currentRow: number;
  currentWord: string;
  justSubmittedRow: number | null;
  shakeNonce: number;
  dir?: "ltr" | "rtl";
}

export function Board({
  guess,
  boxes,
  currentRow,
  currentWord,
  justSubmittedRow,
  shakeNonce,
  dir = "ltr",
}: BoardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5" dir={dir}>
      {[...Array(6)].map((_, rowIndex) => {
        const isCurrentRow = rowIndex === currentRow;
        const isPastRow = rowIndex < currentRow;
        const rowGuess = guess[rowIndex] || "";
        const rowBoxes = boxes[rowIndex] || [];

        return (
          <div
            // Remounting on each rejection restarts the shake animation
            key={isCurrentRow ? `${rowIndex}-${shakeNonce}` : rowIndex}
            className={cn(
              "flex gap-1.5",
              isCurrentRow && shakeNonce > 0 && "animate-shake"
            )}
          >
            {[...Array(5)].map((_, cellIndex) => {
              let letter = "";
              let color: CellColor = "";

              if (isCurrentRow) {
                letter = currentWord.charAt(cellIndex);
              } else if (isPastRow) {
                letter = rowGuess.charAt(cellIndex);
                color = rowBoxes[cellIndex] || "";
              }

              return (
                <Cell
                  key={cellIndex}
                  letter={letter}
                  color={color}
                  isCurrentRow={isCurrentRow}
                  animate={rowIndex === justSubmittedRow}
                  animationDelay={cellIndex}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
