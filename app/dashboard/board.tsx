"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { updateClientStatus } from "./actions";
import { cn } from "@/lib/utils";

export interface BoardClient {
  id: string;
  full_name: string;
  pan: string | null;
  status: string;
  deadline: string | null;
  client_type: string;
  done: number;
  total: number;
}

const COLUMNS = [
  { key: "pending", label: "Docs Pending", dot: "bg-status-pending" },
  { key: "partial", label: "Partial", dot: "bg-status-partial" },
  { key: "review", label: "Under Review", dot: "bg-status-review" },
  { key: "filed", label: "Filed", dot: "bg-status-filed" },
  { key: "closed", label: "Closed", dot: "bg-status-closed" },
];

function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / 86_400_000,
  );
  return diff;
}

export function Board({ clients: initial }: { clients: BoardClient[] }) {
  const [clients, setClients] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function move(id: string, status: string) {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
    startTransition(() => updateClientStatus(id, status));
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {COLUMNS.map((col) => {
        const cards = clients.filter((c) => c.status === col.key);
        return (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setOverCol(col.key);
            }}
            onDragLeave={() => setOverCol((c) => (c === col.key ? null : c))}
            onDrop={() => {
              if (dragId) move(dragId, col.key);
              setDragId(null);
              setOverCol(null);
            }}
            className={cn(
              "flex flex-col gap-2.5 rounded-xl border p-2.5 transition-colors",
              overCol === col.key
                ? "border-primary/40 bg-primary-soft/50"
                : "border-border bg-card/60",
            )}
          >
            <div className="flex items-center gap-2 px-1 py-1">
              <span className={cn("h-2 w-2 rounded-full", col.dot)} />
              <span className="text-xs font-semibold text-ink">{col.label}</span>
              <span className="num ml-auto text-[11px] text-muted-foreground">
                {cards.length}
              </span>
            </div>

            {cards.map((c) => {
              const d = daysLeft(c.deadline);
              return (
                <Link
                  key={c.id}
                  href={`/dashboard/clients/${c.id}`}
                  draggable
                  onDragStart={() => setDragId(c.id)}
                  onDragEnd={() => setDragId(null)}
                  className="ledger-card cursor-grab p-3 transition-shadow hover:shadow-md active:cursor-grabbing"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-ink">
                      {c.full_name}
                    </span>
                    {d !== null &&
                      (d <= 0 ? null : (
                        <span
                          className={cn(
                            "num rounded px-1.5 py-0.5 text-[10px] font-medium",
                            d <= 4
                              ? "bg-accent/15 text-accent"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {d}d
                        </span>
                      ))}
                  </div>
                  {c.pan && (
                    <div className="num mt-1 text-[11px] text-muted-foreground">
                      {c.pan}
                    </div>
                  )}
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: c.total
                            ? `${(c.done / c.total) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="num text-[10px] text-muted-foreground">
                      {c.done}/{c.total}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
