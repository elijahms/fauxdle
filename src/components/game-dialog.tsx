"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tile } from "@/components/game/tile";

interface GameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  answer: string;
  won: boolean;
  onShare: () => void;
}

export function GameDialog({
  open,
  onOpenChange,
  title,
  content,
  answer,
  won,
  onShare,
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
          <Button onClick={onShare} className="w-full" size="lg">
            Share result
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
