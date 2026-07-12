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

/** Pick the best available Arabic voice; retries once voices finish loading. */
export function primeArabicVoice(): void {
  if (!isSpeechSupported()) return;
  const pick = () => {
    const voices = window.speechSynthesis.getVoices();
    arabicVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith("ar")) ?? null;
  };
  pick();
  if (!arabicVoice) {
    // Voices load asynchronously in most browsers
    window.speechSynthesis.addEventListener("voiceschanged", pick, {
      once: true,
    });
  }
}

/** Speak a single Arabic letter's name. No-ops for Enter/Backspace or non-letters. */
export function speakArabicLetter(letter: string): void {
  if (!isSpeechSupported()) return;
  const name = LETTER_NAMES[letter];
  if (!name) return;

  const synth = window.speechSynthesis;
  // Cancel any pending utterance so fast typing stays responsive
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(name);
  utterance.lang = arabicVoice?.lang ?? "ar-SA";
  if (arabicVoice) utterance.voice = arabicVoice;
  utterance.rate = 0.9;
  synth.speak(utterance);
}
