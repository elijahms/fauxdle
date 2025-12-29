"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/hooks/use-game";
import { Board } from "@/components/game/board";
import { Keyboard } from "@/components/game/keyboard";
import { Header } from "@/components/header";
import { StatsDialog } from "@/components/stats-dialog";
import { HelpDialog } from "@/components/help-dialog";
import { GameDialog } from "@/components/game-dialog";
import { toast } from "sonner";

export default function Home() {
  const {
    word,
    guess,
    boxes,
    currentRow,
    cellColor,
    userStats,
    showDialog,
    dialogTitle,
    dialogContent,
    isInitialized,
    enterWord,
    handleShare,
    setShowDialog,
    showSnack,
    snackMessage,
  } = useGame();

  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Show toast in useEffect, not during render
  useEffect(() => {
    if (showSnack && snackMessage) {
      toast(snackMessage);
    }
  }, [showSnack, snackMessage]);

  if (!isInitialized) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl font-bold">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col max-w-lg mx-auto px-2">
      <Header
        onHelpClick={() => setShowHelp(true)}
        onStatsClick={() => setShowStats(true)}
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-4">
        <Board
          guess={guess}
          boxes={boxes}
          currentRow={currentRow}
          currentWord={word}
        />
      </div>

      <div className="pb-4 sm:pb-6">
        <Keyboard onKeyPress={enterWord} cellColor={cellColor} />
      </div>

      <HelpDialog open={showHelp} onOpenChange={setShowHelp} />
      <StatsDialog
        open={showStats}
        onOpenChange={setShowStats}
        stats={userStats}
        onShare={handleShare}
      />
      <GameDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title={dialogTitle}
        content={dialogContent}
        onShare={handleShare}
      />
    </main>
  );
}
