import {
  LayoutGrid,
  MessageCircle,
  Link2,
  ListChecks,
  FileCheck2,
  Wallet,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: LayoutGrid,
    tint: "text-violet-300 bg-violet-500/10 ring-1 ring-violet-500/20",
    title: "One board for every client",
    body: "Drag clients across Pending → Partial → Under Review → Filed → Closed. See the whole practice at a glance, not one mailbox at a time.",
  },
  {
    icon: MessageCircle,
    tint: "text-emerald-300 bg-emerald-500/10 ring-1 ring-emerald-500/20",
    title: "WhatsApp that follows up itself",
    body: "Reminders fire on a schedule — 3 days out, 1 day out, the morning of. Your juniors stop dialing; the messages do the chasing.",
  },
  {
    icon: Link2,
    tint: "text-sky-300 bg-sky-500/10 ring-1 ring-sky-500/20",
    title: "No-login client mini-app",
    body: "Clients open a secure link, see exactly what's missing, and upload from their phone. No accounts, no passwords, no friction.",
  },
  {
    icon: ListChecks,
    tint: "text-fuchsia-300 bg-fuchsia-500/10 ring-1 ring-fuchsia-500/20",
    title: "Checklists that build themselves",
    body: "Pick salaried, business, or NRI and Karlabh generates the required-document list. Add GST, TDS and advance-tax sets as you grow.",
  },
  {
    icon: FileCheck2,
    tint: "text-amber-300 bg-amber-500/10 ring-1 ring-amber-500/20",
    title: "Review without the clutter",
    body: "Open every uploaded PDF in one place. Approve or request a re-upload in a click — the client is notified instantly.",
  },
  {
    icon: Wallet,
    tint: "text-teal-300 bg-teal-500/10 ring-1 ring-teal-500/20",
    title: "Get paid on filing",
    body: "Send a UPI link the moment you mark a return filed. Fee collection and acknowledgment go out in the same WhatsApp message.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20 md:py-28">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">The practice, organised</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
              Everything between &ldquo;send your docs&rdquo; and
              &ldquo;return filed.&rdquo;
            </h2>
            <p className="mt-4 text-muted-foreground">
              Karlabh doesn&apos;t touch your filing software. It fixes the part
              that actually eats your week — collecting documents and keeping
              clients moving.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal i={i % 3} key={f.title}>
              <div className="group ledger-card h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-xl",
                    f.tint,
                  )}
                >
                  <f.icon className="h-5 w-5" strokeWidth={1.9} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
