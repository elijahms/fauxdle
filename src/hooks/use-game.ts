"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { GAME_CONFIGS, GameConfigId } from "@/lib/game-configs";

export type CellColor = "green" | "orange" | "gray" | "";
export type LetterColor = [string, CellColor][];

export interface UserStats {
  wins: number;
  losses: number;
  rowWon: number[];
  avgDuration: number[];
  gamesPlayed: number;
}

// Matches the cell flip: 5 cells staggered 200ms + 500ms flip
export const REVEAL_DURATION_MS = 1300;

const dayOfYear = (date: Date): number =>
  Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      1000 /
      60 /
      60 /
      24
  );

const initialStats: UserStats = {
  wins: 0,
  losses: 0,
  rowWon: [],
  avgDuration: [],
  gamesPlayed: 0,
};

const randomWord = (words: string[]) =>
  words[Math.floor(Math.random() * words.length)];

export function useGame(configId: GameConfigId = "daily") {
  const config = GAME_CONFIGS[configId];
  const statsKey = `${config.storagePrefix}stats`;

  const [word, setWord] = useState("");
  const [guess, setGuess] = useState<string[]>([]);
  const [boxes, setBoxes] = useState<CellColor[][]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [wonGame, setWonGame] = useState(false);
  const [lostGame, setLostGame] = useState(false);
  const [cellColor, setCellColor] = useState<LetterColor[]>([]);
  const [answer, setAnswer] = useState("");
  const [userStats, setUserStats] = useState<UserStats>(initialStats);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [gameStart, setGameStart] = useState<Date>(new Date());
  const [isInitialized, setIsInitialized] = useState(false);
  // Row submitted this session — only that row plays the flip animation,
  // so restored games don't replay it on reload
  const [justSubmittedRow, setJustSubmittedRow] = useState<number | null>(null);
  // Bumped on rejected guesses so the board can shake the current row
  const [shakeNonce, setShakeNonce] = useState(0);

  // Persist in-progress board state (daily mode only)
  useEffect(() => {
    if (!isInitialized || !config.daily) return;
    if (word !== "" || currentRow !== 0) {
      localStorage.setItem("guess", JSON.stringify(guess));
      localStorage.setItem("boxes", JSON.stringify(boxes));
      localStorage.setItem("word", JSON.stringify(word));
      localStorage.setItem("currentRow", JSON.stringify(currentRow));
      localStorage.setItem("letterColor", JSON.stringify(cellColor));
    }
  }, [word, currentRow, guess, boxes, cellColor, isInitialized, config.daily]);

  // Persist stats (all modes)
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(statsKey, JSON.stringify(userStats));
  }, [userStats, isInitialized, statsKey]);

  // Initialize game state
  useEffect(() => {
    if (!config.daily) {
      // Practice modes: fresh random word every visit
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client init; must run post-hydration to stay SSR-safe
      setAnswer(randomWord(config.words));
    } else {
      localStorage.removeItem("nolimitmode"); // retired easter-egg flag
      const savedCookie = Cookies.get("word");

      if (!savedCookie) {
        // New day - clear storage and set new word
        localStorage.removeItem("guess");
        localStorage.removeItem("boxes");
        localStorage.removeItem("word");
        localStorage.removeItem("currentRow");
        localStorage.removeItem("letterColor");
        localStorage.removeItem("gameWon");
        localStorage.removeItem("gameLost");

        const syncedAnswer = config.words[dayOfYear(new Date()) % config.words.length];

        // Set cookie to expire at end of day
        const expiration = new Date();
        expiration.setHours(23, 59, 59, 999);
        Cookies.set("word", syncedAnswer, {
          expires: expiration,
          sameSite: "strict",
        });

         
        setAnswer(syncedAnswer);
      } else {
        // Restore game state
        setAnswer(savedCookie);

        const savedGuess = localStorage.getItem("guess");
        const savedBoxes = localStorage.getItem("boxes");
        const savedWord = localStorage.getItem("word");
        const savedCurrentRow = localStorage.getItem("currentRow");
        const savedLetterColor = localStorage.getItem("letterColor");
        const savedGameWon = localStorage.getItem("gameWon");
        const savedGameLost = localStorage.getItem("gameLost");

        if (savedGuess) setGuess(JSON.parse(savedGuess));
        if (savedBoxes) setBoxes(JSON.parse(savedBoxes));
        if (savedWord) setWord(JSON.parse(savedWord));
        if (savedLetterColor) setCellColor(JSON.parse(savedLetterColor));
        if (savedCurrentRow) setCurrentRow(JSON.parse(savedCurrentRow));
        if (savedGameWon) setWonGame(JSON.parse(savedGameWon));
        if (savedGameLost) setLostGame(JSON.parse(savedGameLost));
      }
    }

    // Load stats
    const savedStats = localStorage.getItem(statsKey);
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }

    setGameStart(new Date());
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- config values are constant per mounted route
  }, []);

  const rejectGuess = useCallback((message: string) => {
    toast(message);
    setShakeNonce((n) => n + 1);
  }, []);

  const gameWon = useCallback(
    (currRow: number) => {
      if (config.daily) localStorage.setItem("gameWon", JSON.stringify(true));
      setWonGame(true);
      setDialogTitle("You won!");
      setDialogContent(
        currRow <= 2 ? "Incredible. Are you psychic?" : "Woohoo, you got it!"
      );

      const now = new Date();
      const timeFromStart = Math.floor(
        (now.getTime() - gameStart.getTime()) / 1000
      );
      setUserStats((prev) => ({
        ...prev,
        wins: prev.wins + 1,
        gamesPlayed: prev.gamesPlayed + 1,
        rowWon: [...prev.rowWon, currRow],
        avgDuration: [...prev.avgDuration, timeFromStart],
      }));

      // Let the reveal flip finish before celebrating
      setTimeout(() => setShowDialog(true), REVEAL_DURATION_MS + 200);
    },
    [gameStart, config.daily]
  );

  const gameLost = useCallback(() => {
    if (config.daily) localStorage.setItem("gameLost", JSON.stringify(true));
    setLostGame(true);
    setDialogTitle(config.daily ? "Tomorrow's the charm" : "So close");
    setDialogContent("The word was:");

    setUserStats((prev) => ({
      ...prev,
      losses: prev.losses + 1,
      gamesPlayed: prev.gamesPlayed + 1,
    }));

    setTimeout(() => setShowDialog(true), REVEAL_DURATION_MS + 200);
  }, [config.daily]);

  const checkAnswer = useCallback(() => {
    if (config.validateGuesses && !config.words.includes(word)) {
      rejectGuess("Not in word list");
      return;
    }

    const currentBoxes: CellColor[] = [];
    let correctCount = 0;
    const currCellColor: LetterColor = [];

    word.split("").forEach((letter, i) => {
      if (answer.includes(letter)) {
        if (answer[i] === letter) {
          correctCount++;
          currentBoxes.push("green");
          currCellColor.push([letter, "green"]);
        } else {
          currentBoxes.push("orange");
          currCellColor.push([letter, "orange"]);
        }
      } else {
        currentBoxes.push("gray");
        currCellColor.push([letter, "gray"]);
      }
    });

    const newRow = currentRow + 1;

    if (correctCount === 5) {
      gameWon(newRow);
    } else if (newRow >= 6) {
      gameLost();
    }

    setJustSubmittedRow(currentRow);
    setCurrentRow(newRow);
    setCellColor((prev) => [...prev, currCellColor]);
    setGuess((prev) => [...prev, word]);
    setBoxes((prev) => [...prev, currentBoxes]);
    setWord("");
  }, [word, answer, currentRow, gameWon, gameLost, rejectGuess, config]);

  const enterWord = useCallback(
    (key: string) => {
      if (wonGame || lostGame) return;

      if (key === "⬅" || key === "Backspace") {
        if (word.length > 0) {
          setWord((prev) => prev.slice(0, -1));
        }
      } else if (key === "ENT" || key === "Enter") {
        if (word.length === 5) {
          checkAnswer();
        } else {
          rejectGuess("Not enough letters");
        }
      } else if (config.letterPattern.test(key)) {
        if (word.length < 5) {
          setWord((prev) => prev + key.toLowerCase());
        }
      }
    },
    [wonGame, lostGame, word, checkAnswer, rejectGuess, config.letterPattern]
  );

  /** Practice modes: reset the board and pick a fresh word */
  const newGame = useCallback(() => {
    if (config.daily) return;
    setWord("");
    setGuess([]);
    setBoxes([]);
    setCurrentRow(0);
    setWonGame(false);
    setLostGame(false);
    setCellColor([]);
    setShowDialog(false);
    setJustSubmittedRow(null);
    setShakeNonce(0);
    setGameStart(new Date());
    setAnswer(randomWord(config.words));
  }, [config]);

  const shareWin = useCallback(() => {
    const shareableEmojis = boxes.flat().map((c) => {
      if (c === "green") return "🟩";
      if (c === "orange") return "🟧";
      return "⬛";
    });

    const rows = [];
    for (let i = 0; i < shareableEmojis.length; i += 5) {
      rows.push(shareableEmojis.slice(i, i + 5).join(""));
    }

    const score = wonGame ? currentRow : "X";
    let header = `${config.shareTag} | ${score}/6`;
    if (config.daily) {
      const dPlusX = Math.floor(
        (new Date().getTime() - new Date(2022, 1, 22).getTime()) /
          (1000 * 3600 * 24)
      );
      header = `${config.shareTag} #${dPlusX} | ${score}/6`;
    }
    return `${header}\n${rows.join("\n")}`;
  }, [boxes, currentRow, wonGame, config]);

  const handleShare = useCallback(() => {
    const text = shareWin();
    if (navigator.share) {
      navigator.share({
        title: config.shareTag,
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast("Copied to clipboard");
    }
  }, [shareWin, config.shareTag]);

  // Lesson entry for the current answer, if this mode has vocabulary data
  const lessonEntry = useMemo(
    () => config.lesson?.[answer],
    [config.lesson, answer]
  );

  return {
    config,
    word,
    guess,
    boxes,
    currentRow,
    wonGame,
    lostGame,
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
  };
}
