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

function formatSeconds(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export function StatsDialog({
  open,
  onOpenChange,
  stats,
  onShare,
}: StatsDialogProps) {
  const rowSum = stats.rowWon.reduce((a, b) => a + b, 0);
  const timeSum = stats.avgDuration.reduce((a, b) => a + b, 0);

  // Guess distribution: how many wins ended on each row 1-6
  const distribution = [1, 2, 3, 4, 5, 6].map(
    (row) => stats.rowWon.filter((r) => r === row).length
  );
  const maxCount = Math.max(...distribution, 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Your stats</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-3xl font-bold text-green-500">{stats.wins}</p>
              <p className="text-sm text-muted-foreground">Won</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-3xl font-bold text-red-500">{stats.losses}</p>
              <p className="text-sm text-muted-foreground">Lost</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-2xl font-bold">
                {stats.wins > 0 ? (rowSum / stats.wins).toFixed(1) : "–"}
              </p>
              <p className="text-sm text-muted-foreground">Avg guesses</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-2xl font-bold">
                {stats.wins > 0
                  ? formatSeconds(Math.floor(timeSum / stats.wins))
                  : "–"}
              </p>
              <p className="text-sm text-muted-foreground">Avg time</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Guess distribution</p>
            {stats.wins > 0 ? (
              <div className="space-y-1">
                {distribution.map((count, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-3 font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div
                        className={
                          count > 0
                            ? "rounded-sm bg-teal-600 px-2 py-0.5 text-right font-bold text-white"
                            : "w-fit rounded-sm bg-muted px-2 py-0.5 text-right font-bold text-muted-foreground"
                        }
                        style={
                          count > 0
                            ? { width: `${(count / maxCount) * 100}%` }
                            : undefined
                        }
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Win a game and your guesses will show up here.
              </p>
            )}
          </div>

          <Button onClick={onShare} className="w-full" size="lg">
            Share result
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
