"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Fauxdle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Literally the same* rules as{" "}
            <a
              href="https://www.nytimes.com/games/wordle/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 hover:text-teal-400 underline"
            >
              Wordle
            </a>
            .
          </p>
          
          <div className="space-y-2">
            <p className="font-semibold text-foreground">How to play:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Guess the word in 6 tries</li>
              <li><span className="text-green-500 font-semibold">Green</span> = correct letter, correct position</li>
              <li><span className="text-orange-500 font-semibold">Orange</span> = correct letter, wrong position</li>
              <li><span className="text-zinc-500 font-semibold">Gray</span> = letter not in word</li>
            </ul>
          </div>

          <p className="text-xs">
            *If a user types a guess with two letters such as &apos;GRILL&apos; and the
            correct answer is &apos;LINEN&apos;, both the &apos;L&apos;s will appear orange unlike
            in Wordle.
          </p>

          <div className="pt-2 border-t border-border">
            <p className="text-sm">
              Created by{" "}
              <a
                href="https://elijahsilverman.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-400 underline"
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
