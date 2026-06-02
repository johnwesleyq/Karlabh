import Link from "next/link";
import { KarlabhMark } from "./logo";

const groups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how" },
      { label: "Pricing", href: "#pricing" },
      { label: "Client mini-app", href: "#" },
    ],
  },
  {
    title: "Firm",
    links: [
      { label: "For solo CAs", href: "#" },
      { label: "For firms", href: "#" },
      { label: "Security", href: "#" },
      { label: "Contact sales", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <KarlabhMark className="h-7 w-7" />
              <span className="text-lg font-semibold tracking-tightest text-ink">
                Karlabh
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The client OS for chartered accountants. Collect documents,
              chase nobody, file on time.
            </p>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="text-sm font-semibold text-ink">{g.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Karlabh. Made in India.</span>
          <span>WhatsApp reminders · No-login uploads · UPI fee collection</span>
        </div>
      </div>
    </footer>
  );
}
