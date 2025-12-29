"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserStats } from "@/hooks/use-game";

interface StatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: UserStats;
  onShare: () => void;
}

export function StatsDialog({
  open,
  onOpenChange,
  stats,
  onShare,
}: StatsDialogProps) {
  const rowAvg = stats.rowWon.reduce((a, b) => a + b, 0);
  const timeAvg = stats.avgDuration.reduce((a, b) => a + b, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Your Stats</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-3xl font-bold text-green-500">{stats.wins}</p>
              <p className="text-sm text-muted-foreground">Won</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-3xl font-bold text-red-500">{stats.losses}</p>
              <p className="text-sm text-muted-foreground">Lost</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-2xl font-bold">
                {stats.wins > 0 ? Math.floor(rowAvg / stats.wins) : "-"}
              </p>
              <p className="text-sm text-muted-foreground">Avg Guesses</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-2xl font-bold">
                {stats.wins > 0 ? Math.floor(timeAvg / stats.wins) : "-"}s
              </p>
              <p className="text-sm text-muted-foreground">Avg Time</p>
            </div>
          </div>
          <Button onClick={onShare} className="w-full mt-4" size="lg">
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
