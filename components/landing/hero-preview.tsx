"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Card = { name: string; pan: string; done: number; total: number; days: number };

const columns: { key: string; label: string; tint: string; cards: Card[] }[] = [
  {
    key: "pending",
    label: "Docs Pending",
    tint: "bg-status-pending",
    cards: [
      { name: "Anjali Iyer", pan: "A•••PI4521K", done: 0, total: 6, days: 11 },
      { name: "Karthik Rao", pan: "B•••KR7782L", done: 1, total: 8, days: 9 },
    ],
  },
  {
    key: "partial",
    label: "Partial",
    tint: "bg-status-partial",
    cards: [
      { name: "Ramesh Kumar", pan: "C•••RK3390M", done: 3, total: 5, days: 4 },
      { name: "Divya Menon", pan: "D•••DM1188N", done: 5, total: 7, days: 6 },
    ],
  },
  {
    key: "review",
    label: "Under Review",
    tint: "bg-status-review",
    cards: [
      { name: "Suresh Pillai", pan: "E•••SP6620P", done: 8, total: 8, days: 2 },
    ],
  },
  {
    key: "filed",
    label: "Filed",
    tint: "bg-status-filed",
    cards: [
      { name: "Meena Nair", pan: "F•••MN4407Q", done: 6, total: 6, days: 0 },
    ],
  },
];

export function HeroPreview() {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* glow under the window */}
      <div className="absolute inset-x-8 -bottom-6 -z-10 h-40 rounded-full bg-primary/15 blur-3xl" />

      <div className="ledger-card overflow-hidden shadow-lg">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <div className="ml-3 flex items-center gap-2 rounded-md bg-card px-3 py-1 text-xs text-muted-foreground shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-status-filed" />
            app.lekha.in/board · FY 2025-26
          </div>
          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <span className="rounded-md bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
              42 active clients
            </span>
          </div>
        </div>

        {/* kanban */}
        <div className="grid grid-cols-2 gap-3 bg-background/40 p-3 md:grid-cols-4 md:p-4">
          {columns.map((col, ci) => (
            <div key={col.key} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 px-1">
                <span className={cn("h-2 w-2 rounded-full", col.tint)} />
                <span className="text-xs font-semibold text-ink">
                  {col.label}
                </span>
                <span className="num ml-auto text-[11px] text-muted-foreground">
                  {col.cards.length}
                </span>
              </div>

              {col.cards.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.7 + ci * 0.12 + i * 0.08,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="ledger-card cursor-grab p-3 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-ink">
                      {c.name}
                    </span>
                    {c.days > 0 ? (
                      <span
                        className={cn(
                          "num rounded px-1.5 py-0.5 text-[10px] font-medium",
                          c.days <= 4
                            ? "bg-accent/15 text-accent"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {c.days}d left
                      </span>
                    ) : (
                      <span className="rounded bg-status-filed/15 px-1.5 py-0.5 text-[10px] font-medium text-status-filed">
                        Done
                      </span>
                    )}
                  </div>
                  <div className="num mt-1 text-[11px] text-muted-foreground">
                    {c.pan}
                  </div>
                  {/* progress */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.done / c.total) * 100}%` }}
                        transition={{
                          delay: 1 + ci * 0.12 + i * 0.08,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                    <span className="num text-[10px] text-muted-foreground">
                      {c.done}/{c.total}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
