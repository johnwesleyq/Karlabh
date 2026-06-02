import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { inr } from "@/lib/utils";

// Illustrative quotes for layout — replace with real customer testimonials.
const testimonials = [
  {
    quote:
      "Two weeks before the deadline used to mean two phones ringing all day. Now the board tells me who's behind and the reminders handle the rest.",
    name: "CA Lakshmi Venkatesh",
    firm: "Venkatesh & Co., Chennai",
  },
  {
    quote:
      "My clients love that they don't need yet another login. They tap the WhatsApp link, upload, done. Our document chase went from days to hours.",
    name: "CA Arjun Reddy",
    firm: "Reddy Associates, Hyderabad",
  },
  {
    quote:
      "I run a three-person firm. Karlabh effectively replaced the follow-up work of a full-time junior during filing season.",
    name: "CA Priya Sharma",
    firm: "Sharma & Partners, Bengaluru",
  },
];

export function SocialProof() {
  return (
    <section id="proof" className="scroll-mt-20 py-20 md:py-28">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Why firms switch</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
              One subscription, instead of one more junior.
            </h2>
          </div>
        </Reveal>

        {/* savings callout */}
        <Reveal>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 overflow-hidden rounded-xl border border-border sm:grid-cols-3">
            <div className="bg-card p-6 text-center">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Junior chasing docs
              </div>
              <div className="num mt-2 text-2xl font-semibold text-muted-foreground line-through">
                {inr(15000)}
                <span className="text-sm font-normal">/mo</span>
              </div>
            </div>
            <div className="bg-primary p-6 text-center text-primary-foreground">
              <div className="text-xs uppercase tracking-wide opacity-80">
                Karlabh
              </div>
              <div className="num mt-2 text-2xl font-semibold">
                {inr(1999)}
                <span className="text-sm font-normal">/mo</span>
              </div>
            </div>
            <div className="bg-accent/10 p-6 text-center">
              <div className="text-xs uppercase tracking-wide text-accent">
                You keep
              </div>
              <div className="num mt-2 text-2xl font-semibold text-accent">
                {inr(13001)}
                <span className="text-sm font-normal">/mo</span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal i={i} key={t.name}>
              <figure className="ledger-card flex h-full flex-col p-6">
                <Quote className="h-6 w-6 text-primary/30" />
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <div className="text-sm font-semibold text-ink">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.firm}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
