"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tile } from "@/components/game/tile";
import type { SolvedWordEntry } from "@/hooks/use-game";
import type { ArabicWord } from "@/lib/arabic-words";

interface VocabularyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  words: SolvedWordEntry[];
  dir?: "ltr" | "rtl";
  /** Vocabulary metadata keyed by word (Arabic practice) */
  lesson?: Record<string, ArabicWord>;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function VocabularyDialog({
  open,
  onOpenChange,
  words,
  dir = "ltr",
  lesson,
}: VocabularyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Words you&apos;ve solved
          </DialogTitle>
        </DialogHeader>

        {words.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Win a game and your words will show up here to review.
          </p>
        ) : (
          <div className="max-h-[min(60vh,28rem)] space-y-3 overflow-y-auto pe-1">
            <p className="text-sm text-muted-foreground">
              {words.length} word{words.length === 1 ? "" : "s"}
            </p>
            <ul className="space-y-3">
              {words.map((entry) => {
                const meta = lesson?.[entry.word];
                return (
                  <li
                    key={entry.word}
                    className="rounded-lg bg-muted/60 px-3 py-2.5"
                  >
                    <div
                      className="flex justify-center gap-1"
                      dir={dir}
                      aria-label={entry.word}
                    >
                      {entry.word.split("").map((letter, i) => (
                        <Tile
                          key={i}
                          letter={letter}
                          size="xs"
                          tone="green"
                        />
                      ))}
                    </div>
                    {meta ? (
                      <p className="mt-2 text-center text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {meta.translit}
                        </span>{" "}
                        — {meta.meaning}
                      </p>
                    ) : null}
                    <p className="mt-1.5 text-center text-xs text-muted-foreground">
                      {entry.guesses != null ? `${entry.guesses}/6` : null}
                      {entry.guesses != null && entry.date ? " · " : null}
                      {entry.date ? formatDate(entry.date) : null}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
