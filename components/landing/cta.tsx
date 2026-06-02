import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function CTA() {
  return (
    <section className="pb-24">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.5rem] border border-primary/20 bg-primary-soft px-6 py-14 text-center md:py-20">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(50% 80% at 50% 0%, hsl(359 78% 52% / 0.10), transparent)",
              }}
            />
            <div className="relative mx-auto max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
                Get this filing season off the phone.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Set up your first ten clients in an afternoon. The reminders
                start working tonight.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="#pricing">
                  <Button size="lg" className="group">
                    Start your free trial
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
