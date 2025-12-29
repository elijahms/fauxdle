"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  onShare: () => void;
}

export function GameDialog({
  open,
  onOpenChange,
  title,
  content,
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
          <Button onClick={onShare} className="w-full" size="lg">
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
