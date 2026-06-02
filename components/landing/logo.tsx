import { cn } from "@/lib/utils";

/** A ledger column with a filed checkmark — the brand mark. */
export function KarlabhMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-[7px] bg-primary text-primary-foreground sheen",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[60%] w-[60%]"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 4v16" opacity={0.55} />
        <path d="M9.5 13.5l2.5 2.5L19 8.5" />
      </svg>
    </span>
  );
}
