import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    n: "01",
    title: "Create the client, get a checklist",
    body: "Pick the client type. Karlabh auto-builds the required-document list and a secure upload link in seconds.",
  },
  {
    n: "02",
    title: "WhatsApp goes out",
    body: "The client receives a friendly message with their link. No app to install — it opens right in their browser.",
  },
  {
    n: "03",
    title: "Documents arrive on their own",
    body: "Clients upload from their phone. Auto-reminders nudge the stragglers. You watch cards turn green.",
  },
  {
    n: "04",
    title: "File, confirm, collect",
    body: "Review, mark filed, and send the UPI fee link — the acknowledgment and payment request go out together.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-muted py-20 md:py-28">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">From profile to paid</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
              Four steps. Then it runs without you.
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal i={i} key={s.n}>
              <div className="relative h-full rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="num text-2xl font-semibold text-primary">
                  {s.n}
                </div>
                <h3 className="mt-3 text-base font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
                {i < steps.length - 1 && (
                  <span className="absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-border lg:block" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
