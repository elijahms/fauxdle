"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { APPS } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";
import { usePathname } from "next/navigation";

export function AppDrawer() {
  // Normalize trailing slashes so "/arabic" and "/arabic/" match
  const pathname = usePathname().replace(/\/+$/, "") || "/";

  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="More games" />}
      >
        <LayoutGrid className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle className="text-xl font-extrabold tracking-wide">
            The Word Shelf
          </SheetTitle>
          <SheetDescription>
            Daily puzzles, endless practice, and Arabic lessons.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2">
          {APPS.map((app) => {
            const Icon = app.icon;
            const isLive = app.status === "live";
            const isCurrent = isLive && pathname === app.href;
            const row = (
              <>
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-md",
                    isLive
                      ? "bg-teal-600 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex min-w-0 flex-col text-left">
                  <span className="text-sm font-semibold">{app.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {app.tagline}
                  </span>
                </span>
                {(isCurrent || !isLive) && (
                  <span
                    className={cn(
                      "ml-auto rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
                      isCurrent
                        ? "bg-teal-600/15 text-teal-600 dark:text-teal-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCurrent ? "Playing" : "Soon"}
                  </span>
                )}
              </>
            );

            return isLive ? (
              <a
                key={app.id}
                href={app.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted",
                  isCurrent && "bg-muted/60"
                )}
              >
                {row}
              </a>
            ) : (
              <div
                key={app.id}
                aria-disabled
                className="flex items-center gap-3 rounded-lg px-2 py-2 opacity-70"
              >
                {row}
              </div>
            );
          })}
        </nav>
        <p className="mt-auto border-t px-4 py-3 text-xs text-muted-foreground">
          Have an idea for a word game? Tell Elijah.
        </p>
      </SheetContent>
    </Sheet>
  );
}
