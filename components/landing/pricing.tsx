import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { inr, cn } from "@/lib/utils";
import { createCheckoutSession } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 py-20 md:py-28">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Pricing</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
              The CA pays. The client never does.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every plan starts with a 14-day free trial. No card to begin, and
              your clients upload and receive reminders for free, forever.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl items-start gap-5 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal i={i} key={plan.id}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-xl border bg-card p-7 transition-all duration-300",
                  plan.highlighted
                    ? "border-primary/40 shadow-glow lg:-mt-4 lg:mb-4"
                    : "border-border shadow-sm hover:shadow-md",
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
                    Most popular
                  </span>
                )}

                <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.tagline}
                </p>

                <div className="mt-6 flex items-end gap-1.5">
                  {plan.amount === null ? (
                    <span className="text-3xl font-semibold tracking-tightest text-ink">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="num text-4xl font-semibold tracking-tightest text-ink">
                        {inr(plan.amount)}
                      </span>
                      <span className="mb-1 text-sm text-muted-foreground">
                        /{plan.interval}
                      </span>
                    </>
                  )}
                </div>

                <form action={createCheckoutSession} className="mt-6">
                  <input type="hidden" name="planId" value={plan.id} />
                  <Button
                    type="submit"
                    variant={plan.highlighted ? "primary" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </form>

                <ul className="mt-7 space-y-3 border-t border-border pt-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        strokeWidth={2.5}
                      />
                      <span className="text-ink/80">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
