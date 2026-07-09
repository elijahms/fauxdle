"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tile } from "@/components/game/tile";
import type { ArabicWord } from "@/lib/arabic-words";

interface GameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  answer: string;
  won: boolean;
  dir?: "ltr" | "rtl";
  lesson?: ArabicWord;
  onShare: () => void;
  /** Present in practice modes — renders the primary "New word" action */
  onNewGame?: () => void;
}

export function GameDialog({
  open,
  onOpenChange,
  title,
  content,
  answer,
  won,
  dir = "ltr",
  lesson,
  onShare,
  onNewGame,
}: GameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">{content}</p>
          <div
            className="flex justify-center gap-1.5"
            dir={dir}
            aria-label={`The word was ${answer}`}
          >
            {answer.split("").map((letter, i) => (
              <Tile
                key={i}
                letter={letter}
                size="md"
                tone={won ? "green" : "empty"}
              />
            ))}
          </div>
          {lesson && (
            <p className="text-center text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {lesson.translit}
              </span>{" "}
              — {lesson.meaning}
            </p>
          )}
          <div className="flex flex-col gap-2">
            {onNewGame ? (
              <>
                <Button onClick={onNewGame} className="w-full" size="lg">
                  New word
                </Button>
                <Button
                  onClick={onShare}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Share result
                </Button>
              </>
            ) : (
              <Button onClick={onShare} className="w-full" size="lg">
                Share result
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
