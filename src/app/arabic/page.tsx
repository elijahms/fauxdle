import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { GameScreen } from "@/components/game-screen";

const cairo = Cairo({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "Fauxdle عربي — Arabic practice",
  description:
    "Learn Arabic one word at a time: guess the 5-letter word, use hints, and pick up vocabulary as you play.",
};

export default function ArabicPage() {
  return <GameScreen configId="arabic" className={cairo.className} />;
}
