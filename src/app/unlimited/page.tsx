import type { Metadata } from "next";
import { GameScreen } from "@/components/game-screen";

export const metadata: Metadata = {
  title: "Fauxdle Unlimited",
  description: "Fauxdle without the wait — a new 5-letter word every round.",
};

export default function UnlimitedPage() {
  return <GameScreen configId="unlimited" />;
}
