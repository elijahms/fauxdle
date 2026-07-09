"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { WORDS } from "@/lib/wordlist";

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

export function useGame() {
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

  // Save state to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    if (word !== "" || currentRow !== 0) {
      localStorage.setItem("guess", JSON.stringify(guess));
      localStorage.setItem("boxes", JSON.stringify(boxes));
      localStorage.setItem("word", JSON.stringify(word));
      localStorage.setItem("currentRow", JSON.stringify(currentRow));
      localStorage.setItem("letterColor", JSON.stringify(cellColor));
      localStorage.setItem("stats", JSON.stringify(userStats));
    }
  }, [word, currentRow, guess, boxes, cellColor, userStats, isInitialized]);

  // Initialize game state
  useEffect(() => {
    const savedCookie = Cookies.get("word");
    const noLimitMode = localStorage.getItem("nolimitmode");

    if (!savedCookie || noLimitMode) {
      // New game - clear storage and set new word
      localStorage.removeItem("guess");
      localStorage.removeItem("boxes");
      localStorage.removeItem("word");
      localStorage.removeItem("currentRow");
      localStorage.removeItem("letterColor");
      localStorage.removeItem("gameWon");
      localStorage.removeItem("gameLost");

      localStorage.setItem("guess", JSON.stringify([]));
      localStorage.setItem("boxes", JSON.stringify([]));
      localStorage.setItem("word", JSON.stringify(""));
      localStorage.setItem("currentRow", JSON.stringify(0));
      localStorage.setItem("letterColor", JSON.stringify([]));
      localStorage.setItem("gameWon", "false");
      localStorage.setItem("gameLost", "false");

      // Pick the answer: random in no-limit mode, otherwise synced to the day
      let syncedAnswer: string;
      if (noLimitMode) {
        syncedAnswer = WORDS[Math.floor(Math.random() * WORDS.length)];
      } else {
        syncedAnswer = WORDS[dayOfYear(new Date()) % WORDS.length];
      }

      // Set cookie to expire at end of day
      const expiration = new Date();
      expiration.setHours(23, 59, 59, 999);
      Cookies.set("word", syncedAnswer, {
        expires: expiration,
        sameSite: "strict",
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client init from cookies/localStorage; must run post-hydration to stay SSR-safe
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

    // Load stats
    const savedStats = localStorage.getItem("stats");
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    } else {
      localStorage.setItem("stats", JSON.stringify(initialStats));
    }

    setGameStart(new Date());
    setIsInitialized(true);
  }, []);

  const rejectGuess = useCallback((message: string) => {
    toast(message);
    setShakeNonce((n) => n + 1);
  }, []);

  const gameWon = useCallback(
    (currRow: number) => {
      localStorage.setItem("gameWon", JSON.stringify(true));
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
    [gameStart]
  );

  const gameLost = useCallback(() => {
    localStorage.setItem("gameLost", JSON.stringify(true));
    setLostGame(true);
    setDialogTitle("Tomorrow's the charm");
    setDialogContent("The word was:");

    setUserStats((prev) => ({
      ...prev,
      losses: prev.losses + 1,
      gamesPlayed: prev.gamesPlayed + 1,
    }));

    setTimeout(() => setShowDialog(true), REVEAL_DURATION_MS + 200);
  }, []);

  const checkAnswer = useCallback(() => {
    // Easter egg for unlimited mode
    if (guess[0] === "noxxx" && word === "limit") {
      localStorage.setItem("nolimitmode", "true");
    }

    if (!WORDS.includes(word) && word !== "noxxx") {
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
  }, [word, answer, currentRow, guess, gameWon, gameLost, rejectGuess]);

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
      } else if (/^[a-zA-Z]$/.test(key)) {
        if (word.length < 5) {
          setWord((prev) => prev + key.toLowerCase());
        }
      }
    },
    [wonGame, lostGame, word, checkAnswer, rejectGuess]
  );

  const shareWin = useCallback(() => {
    const shareableEmojis = boxes.flat().map((c) => {
      if (c === "green") return "🟩";
      if (c === "orange") return "🟧";
      return "⬛";
    });

    const dPlusX = Math.floor(
      (new Date().getTime() - new Date(2022, 1, 22).getTime()) /
        (1000 * 3600 * 24)
    );

    const rows = [];
    for (let i = 0; i < shareableEmojis.length; i += 5) {
      rows.push(shareableEmojis.slice(i, i + 5).join(""));
    }

    const score = wonGame ? currentRow : "X";
    return `Fauxdle #${dPlusX} | ${score}/6\n${rows.join("\n")}`;
  }, [boxes, currentRow, wonGame]);

  const handleShare = useCallback(() => {
    const text = shareWin();
    if (navigator.share) {
      navigator.share({
        title: "Fauxdle",
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast("Copied to clipboard");
    }
  }, [shareWin]);

  return {
    word,
    guess,
    boxes,
    currentRow,
    wonGame,
    lostGame,
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
  };
}
