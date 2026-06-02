import { Reveal } from "@/components/ui/reveal";

const stats = [
  { value: "11 hrs", label: "saved per staff member, weekly" },
  { value: "3 taps", label: "for a client to upload — no login" },
  { value: "0 calls", label: "to chase a single document" },
  { value: "200+", label: "CA firms across India" },
];

const cities = ["Chennai", "Bengaluru", "Hyderabad", "Mumbai", "Pune", "Kochi"];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container py-14">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Trusted by practices in {cities.join(" · ")}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal i={i} key={s.label}>
              <div className="px-4 text-center">
                <div className="text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
                  {s.value}
                </div>
                <div className="mx-auto mt-2 max-w-[14rem] text-sm text-muted-foreground">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
