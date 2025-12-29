"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
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

export interface GameState {
  word: string;
  guess: string[];
  boxes: CellColor[][];
  currentRow: number;
  wonGame: boolean;
  lostGame: boolean;
  cellColor: LetterColor[];
  answer: string;
  userStats: UserStats;
  snackMessage: string;
  showSnack: boolean;
  showDialog: boolean;
  dialogTitle: string;
  dialogContent: string;
}

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
  const [snackMessage, setSnackMessage] = useState("Not in Word List");
  const [showSnack, setShowSnack] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [gameStart, setGameStart] = useState<Date>(new Date());
  const [isInitialized, setIsInitialized] = useState(false);

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

      // Calculate synced answer based on day of year
      let syncedAnswer: string;
      if (noLimitMode) {
        syncedAnswer = WORDS[Math.floor(Math.random() * WORDS.length)];
      } else {
        const dayIndex = dayOfYear(new Date());
        syncedAnswer = WORDS[Math.floor((dayIndex / 365) * WORDS.length)];
      }

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

  const showToast = useCallback((message: string) => {
    setSnackMessage(message);
    setShowSnack(true);
    setTimeout(() => setShowSnack(false), 1500);
  }, []);

  const gameWon = useCallback(
    (currRow: number) => {
      localStorage.setItem("gameWon", JSON.stringify(true));
      setWonGame(true);
      setDialogTitle("You Won!");
      setDialogContent("Woohoo you got it! Keep it up!");
      setShowDialog(true);

      const now = new Date();
      const timeFromStart = Math.floor(
        (now.getTime() - gameStart.getTime()) / 100
      );
      setUserStats((prev) => ({
        ...prev,
        wins: prev.wins + 1,
        gamesPlayed: prev.gamesPlayed + 1,
        rowWon: [...prev.rowWon, currRow],
        avgDuration: [...prev.avgDuration, timeFromStart],
      }));
    },
    [gameStart]
  );

  const gameLost = useCallback(() => {
    localStorage.setItem("gameLost", JSON.stringify(true));
    setLostGame(true);
    setDialogTitle("Tomorrow's the charm!");
    setDialogContent("Better luck next time...");
    setShowDialog(true);

    setUserStats((prev) => ({
      ...prev,
      losses: prev.losses + 1,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
  }, []);

  const checkAnswer = useCallback(() => {
    // Easter egg for unlimited mode
    if (guess[0] === "noxxx" && word === "limit") {
      localStorage.setItem("nolimitmode", "true");
    }

    if (!WORDS.includes(word) && word !== "noxxx") {
      showToast("Not in Word List");
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

    setCurrentRow(newRow);
    setCellColor((prev) => [...prev, currCellColor]);
    setGuess((prev) => [...prev, word]);
    setBoxes((prev) => [...prev, currentBoxes]);
    setWord("");
  }, [word, answer, currentRow, guess, gameWon, gameLost, showToast]);

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
          showToast("Not Long Enough");
        }
      } else if (/^[a-zA-Z]$/.test(key)) {
        if (word.length <= 4) {
          setWord((prev) => prev + key.toLowerCase());
        }
      }
    },
    [wonGame, lostGame, word, checkAnswer, showToast]
  );

  const shareWin = useCallback(() => {
    const shareableEmojis = boxes.flat().map((c) => {
      if (c === "green") return "🟩";
      if (c === "orange") return "🟧";
      return "⬛";
    });

    const dPlusX = Math.floor(
      (new Date().getTime() - new Date("02/22/2022").getTime()) /
        (1000 * 3600 * 24)
    );

    const rows = [];
    for (let i = 0; i < shareableEmojis.length; i += 5) {
      rows.push(shareableEmojis.slice(i, i + 5).join(""));
    }

    return `Fauxdle #${dPlusX} | ${currentRow}/6\n${rows.join("\n")}`;
  }, [boxes, currentRow]);

  const handleShare = useCallback(() => {
    const text = shareWin();
    if (navigator.share) {
      navigator.share({
        title: "Fauxdle",
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    }
  }, [shareWin, showToast]);

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
    snackMessage,
    showSnack,
    showDialog,
    dialogTitle,
    dialogContent,
    isInitialized,
    enterWord,
    shareWin,
    handleShare,
    setShowDialog,
    setShowSnack,
  };
}
