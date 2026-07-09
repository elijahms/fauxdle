"use client";

import { useState } from "react";
import { useGame } from "@/hooks/use-game";
import { Board } from "@/components/game/board";
import { Keyboard } from "@/components/game/keyboard";
import { Tile } from "@/components/game/tile";
import { Header } from "@/components/header";
import { StatsDialog } from "@/components/stats-dialog";
import { HelpDialog } from "@/components/help-dialog";
import { GameDialog } from "@/components/game-dialog";

export default function Home() {
  const {
    word,
    guess,
    boxes,
    currentRow,
    wonGame,
    cellColor,
    answer,
    userStats,
    showDialog,
    dialogTitle,
    dialogContent,
    isInitialized,
    justSubmittedRow,
    shakeNonce,
    enterWord,
    handleShare,
    setShowDialog,
  } = useGame();

  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);

  if (!isInitialized) {
    return (
      <main className="flex h-dvh items-center justify-center">
        <div className="flex animate-pulse gap-1" aria-label="Loading">
          {["f", "a", "u", "x", "d", "l", "e"].map((letter, i) => (
            <Tile
              key={i}
              letter={letter}
              size="sm"
              tone={letter === "x" ? "accent" : "empty"}
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-dvh max-w-lg flex-col overflow-hidden px-2">
      <Header
        onHelpClick={() => setShowHelp(true)}
        onStatsClick={() => setShowStats(true)}
      />

      <div className="flex min-h-0 flex-1 items-center justify-center py-2">
        <Board
          guess={guess}
          boxes={boxes}
          currentRow={currentRow}
          currentWord={word}
          justSubmittedRow={justSubmittedRow}
          shakeNonce={shakeNonce}
        />
      </div>

      <div className="pb-[max(env(safe-area-inset-bottom),0.5rem)] sm:pb-4">
        <Keyboard
          onKeyPress={enterWord}
          cellColor={cellColor}
          delayReveal={justSubmittedRow !== null}
        />
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
        answer={answer}
        won={wonGame}
        onShare={handleShare}
      />
    </main>
  );
}
