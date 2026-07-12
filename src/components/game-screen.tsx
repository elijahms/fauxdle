"use client";

import { useCallback, useEffect, useState } from "react";
import { useGame } from "@/hooks/use-game";
import { GameConfigId } from "@/lib/game-configs";
import {
  isSpeechSupported,
  primeArabicVoice,
  speakArabicLetter,
} from "@/lib/arabic-audio";
import { Board } from "@/components/game/board";
import { Keyboard } from "@/components/game/keyboard";
import { Tile } from "@/components/game/tile";
import { Header } from "@/components/header";
import { StatsDialog } from "@/components/stats-dialog";
import { HelpDialog } from "@/components/help-dialog";
import { GameDialog } from "@/components/game-dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameScreenProps {
  configId: GameConfigId;
  className?: string;
}

export function GameScreen({ configId, className }: GameScreenProps) {
  const {
    config,
    word,
    guess,
    boxes,
    currentRow,
    wonGame,
    cellColor,
    answer,
    lessonEntry,
    userStats,
    showDialog,
    dialogTitle,
    dialogContent,
    isInitialized,
    justSubmittedRow,
    shakeNonce,
    enterWord,
    handleShare,
    newGame,
    setShowDialog,
  } = useGame(configId);

  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  // Hint is per-word: comparing against the answer resets it on a new game
  const [hintShownFor, setHintShownFor] = useState<string | null>(null);
  const hintShown = hintShownFor === answer;

  // Letter audio (Arabic practice): load the voice and any saved mute preference
  const [soundMuted, setSoundMuted] = useState(false);
  const mutedKey = `${config.storagePrefix}muted`;

  useEffect(() => {
    if (!config.speakLetters) return;
    primeArabicVoice();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the saved preference must run post-hydration to stay SSR-safe
    if (localStorage.getItem(mutedKey) === "true") setSoundMuted(true);
  }, [config.speakLetters, mutedKey]);

  const toggleSound = useCallback(() => {
    setSoundMuted((prev) => {
      const next = !prev;
      localStorage.setItem(mutedKey, String(next));
      if (next && isSpeechSupported()) window.speechSynthesis.cancel();
      return next;
    });
  }, [mutedKey]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (config.speakLetters && !soundMuted) speakArabicLetter(key);
      enterWord(key);
    },
    [config.speakLetters, soundMuted, enterWord]
  );

  if (!isInitialized) {
    return (
      <main className={cn("flex h-dvh items-center justify-center", className)}>
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
    <main
      className={cn(
        "mx-auto flex h-dvh max-w-lg flex-col overflow-hidden px-2",
        className
      )}
    >
      <Header
        badge={config.badge}
        soundOn={config.speakLetters ? !soundMuted : undefined}
        onToggleSound={config.speakLetters ? toggleSound : undefined}
        onHelpClick={() => setShowHelp(true)}
        onStatsClick={() => setShowStats(true)}
      />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 py-2">
        {lessonEntry &&
          (hintShown ? (
            <p className="text-sm text-muted-foreground">
              Hint: it means{" "}
              <span className="font-semibold text-foreground">
                {lessonEntry.meaning}
              </span>
            </p>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setHintShownFor(answer)}
            >
              <Lightbulb data-icon="inline-start" />
              Show meaning
            </Button>
          ))}
        <Board
          guess={guess}
          boxes={boxes}
          currentRow={currentRow}
          currentWord={word}
          justSubmittedRow={justSubmittedRow}
          shakeNonce={shakeNonce}
          dir={config.dir}
        />
      </div>

      <div className="pb-[max(env(safe-area-inset-bottom),0.5rem)] sm:pb-4">
        <Keyboard
          onKeyPress={handleKeyPress}
          cellColor={cellColor}
          delayReveal={justSubmittedRow !== null}
          rows={config.keyboardRows}
          letterPattern={config.letterPattern}
          dir={config.dir}
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
        dir={config.dir}
        lesson={lessonEntry}
        onShare={handleShare}
        onNewGame={config.daily ? undefined : newGame}
      />
    </main>
  );
}
