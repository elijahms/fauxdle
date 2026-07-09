import { cn } from "@/lib/utils";

export type TileTone = "empty" | "green" | "orange" | "gray" | "accent";

const toneClasses: Record<TileTone, string> = {
  empty: "border-2 border-zinc-400 text-foreground dark:border-zinc-600",
  green: "bg-green-500 text-white",
  orange: "bg-orange-500 text-white",
  gray: "bg-zinc-600 text-white",
  accent: "bg-teal-600 text-white",
};

const sizeClasses = {
  xs: "size-6 text-xs sm:size-7 sm:text-sm",
  sm: "size-8 text-base",
  md: "size-10 text-xl",
};

interface TileProps {
  letter?: string;
  tone?: TileTone;
  size?: keyof typeof sizeClasses;
  className?: string;
}

export function Tile({
  letter = "",
  tone = "empty",
  size = "sm",
  className,
}: TileProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center justify-center rounded-sm font-extrabold uppercase select-none",
        sizeClasses[size],
        toneClasses[tone],
        className
      )}
    >
      {letter}
    </span>
  );
}
