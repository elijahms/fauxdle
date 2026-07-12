// Speak Arabic letters aloud as they're typed, so players hear each letter
// while they learn it. Uses the browser's built-in SpeechSynthesis — no audio
// files to bundle, and it reads the letter's name in an Arabic voice when one
// is installed (e.g. "Majed" on macOS, Google's Arabic TTS on Chrome/Android).

// Each keyboard letter mapped to how it's said when reciting the alphabet.
const LETTER_NAMES: Record<string, string> = {
  ا: "ألف",
  ب: "باء",
  ت: "تاء",
  ث: "ثاء",
  ج: "جيم",
  ح: "حاء",
  خ: "خاء",
  د: "دال",
  ذ: "ذال",
  ر: "راء",
  ز: "زاي",
  س: "سين",
  ش: "شين",
  ص: "صاد",
  ض: "ضاد",
  ط: "طاء",
  ظ: "ظاء",
  ع: "عين",
  غ: "غين",
  ف: "فاء",
  ق: "قاف",
  ك: "كاف",
  ل: "لام",
  م: "ميم",
  ن: "نون",
  ه: "هاء",
  و: "واو",
  ي: "ياء",
  ة: "تاء مربوطة",
};

let arabicVoice: SpeechSynthesisVoice | null = null;

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function refreshVoice(): void {
  const voices = window.speechSynthesis.getVoices();
  arabicVoice =
    voices.find((v) => v.lang.toLowerCase().startsWith("ar")) ?? null;
}

/** Pick the best available Arabic voice; re-checks as voices load (late on iOS). */
export function primeArabicVoice(): void {
  if (!isSpeechSupported()) return;
  refreshVoice();
  window.speechSynthesis.addEventListener("voiceschanged", refreshVoice);
}

/** Speak a single Arabic letter's name. No-ops for Enter/Backspace or non-letters. */
export function speakArabicLetter(letter: string): void {
  if (!isSpeechSupported()) return;
  const name = LETTER_NAMES[letter];
  if (!name) return;

  const synth = window.speechSynthesis;

  // iOS Safari populates voices late — grab one now if priming missed it
  if (!arabicVoice) refreshVoice();

  // iOS can leave synthesis in a paused state between utterances
  if (synth.paused) synth.resume();

  const utterance = new SpeechSynthesisUtterance(name);
  if (arabicVoice) {
    utterance.voice = arabicVoice;
    utterance.lang = arabicVoice.lang;
  } else {
    utterance.lang = "ar-SA";
  }
  utterance.rate = 0.9;

  // Deliberately no synth.cancel() before speak(): on iOS Safari, cancelling
  // and speaking within the same gesture drops the new utterance and nothing
  // plays. Letter names are short, so letting them queue is fine — it even
  // spells the word out as you type.
  synth.speak(utterance);
}
