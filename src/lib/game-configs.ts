import { WORDS } from "./wordlist";
import { ARABIC_WORDS, ArabicWord } from "./arabic-words";

export type GameConfigId = "daily" | "unlimited" | "arabic";

export interface GameConfig {
  id: GameConfigId;
  /** Daily games persist board state and sync the answer to the calendar day */
  daily: boolean;
  words: string[];
  /** Reject guesses that aren't in the word list */
  validateGuesses: boolean;
  letterPattern: RegExp;
  keyboardRows: string[][];
  dir: "ltr" | "rtl";
  /** Prefix for localStorage keys; daily uses "" for backward compatibility */
  storagePrefix: string;
  shareTag: string;
  /** Small label shown under the header logo */
  badge?: string;
  /** Speak each letter aloud as it's typed (language-practice modes) */
  speakLetters?: boolean;
  /** Vocabulary details keyed by word — presence turns on lesson features */
  lesson?: Record<string, ArabicWord>;
}

const ENGLISH_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["ENT", "z", "x", "c", "v", "b", "n", "m", "⬅"],
];

// Standard Arabic keyboard order; rows render right-to-left
const ARABIC_ROWS = [
  ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج"],
  ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط"],
  ["ENT", "ذ", "د", "ز", "ر", "و", "ة", "ظ", "⬅"],
];

const ARABIC_LESSON = Object.fromEntries(
  ARABIC_WORDS.map((entry) => [entry.word, entry])
);

export const GAME_CONFIGS: Record<GameConfigId, GameConfig> = {
  daily: {
    id: "daily",
    daily: true,
    words: WORDS,
    validateGuesses: true,
    letterPattern: /^[a-zA-Z]$/,
    keyboardRows: ENGLISH_ROWS,
    dir: "ltr",
    storagePrefix: "",
    shareTag: "Fauxdle",
  },
  unlimited: {
    id: "unlimited",
    daily: false,
    words: WORDS,
    validateGuesses: true,
    letterPattern: /^[a-zA-Z]$/,
    keyboardRows: ENGLISH_ROWS,
    dir: "ltr",
    storagePrefix: "unlimited-",
    shareTag: "Fauxdle Unlimited",
    badge: "Unlimited",
  },
  arabic: {
    id: "arabic",
    daily: false,
    words: ARABIC_WORDS.map((entry) => entry.word),
    // The list is a small curated vocabulary, so any 5 letters may be guessed
    validateGuesses: false,
    letterPattern: /^[ء-ي]$/,
    keyboardRows: ARABIC_ROWS,
    dir: "rtl",
    storagePrefix: "arabic-",
    shareTag: "Fauxdle عربي",
    badge: "عربي · Arabic practice",
    speakLetters: true,
    lesson: ARABIC_LESSON,
  },
};
