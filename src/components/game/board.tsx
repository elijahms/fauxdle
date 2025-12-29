"use client";

import { Cell } from "./cell";
import { CellColor } from "@/hooks/use-game";

interface BoardProps {
  guess: string[];
  boxes: CellColor[][];
  currentRow: number;
  currentWord: string;
}

export function Board({ guess, boxes, currentRow, currentWord }: BoardProps) {
  return (
    <div className="flex flex-col gap-1.5 items-center">
      {[...Array(6)].map((_, rowIndex) => {
        const isCurrentRow = rowIndex === currentRow;
        const isPastRow = rowIndex < currentRow;
        const rowGuess = guess[rowIndex] || "";
        const rowBoxes = boxes[rowIndex] || [];

        return (
          <div key={rowIndex} className="flex gap-1.5">
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
                  animate={isPastRow && rowIndex === currentRow - 1}
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
