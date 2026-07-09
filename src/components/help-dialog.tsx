"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tile, TileTone } from "@/components/game/tile";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LEGEND: { letter: string; tone: TileTone; text: string }[] = [
  { letter: "g", tone: "green", text: "Right letter, right spot" },
  { letter: "o", tone: "orange", text: "Right letter, wrong spot" },
  { letter: "x", tone: "gray", text: "Not in the word" },
];

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">How to play</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Guess the 5-letter word in 6 tries. Literally the same* rules as{" "}
            <a
              href="https://www.nytimes.com/games/wordle/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 underline hover:text-teal-400"
            >
              Wordle
            </a>
            . After each guess, the tiles show how close you are:
          </p>

          <ul className="space-y-2">
            {LEGEND.map(({ letter, tone, text }) => (
              <li key={tone} className="flex items-center gap-3">
                <Tile letter={letter} tone={tone} size="sm" />
                <span className="text-sm text-foreground">{text}</span>
              </li>
            ))}
          </ul>

          <p className="text-xs">
            *If a guess repeats a letter, like the two L&apos;s in
            &apos;GRILL&apos; when the answer is &apos;LINEN&apos;, both show
            orange — unlike in Wordle.
          </p>

          <div className="border-t border-border pt-2">
            <p className="text-sm">
              Created by{" "}
              <a
                href="https://elijahsilverman.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 underline hover:text-teal-400"
              >
                Elijah Silverman
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
