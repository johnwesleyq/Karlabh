import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold tracking-tightest text-ink">
          Let&apos;s talk Enterprise
        </h1>
        <p className="mt-3 text-muted-foreground">
          Email <a className="text-primary hover:underline" href="mailto:sales@lekha.in">sales@lekha.in</a> and
          we&apos;ll set up your network, onboarding, and data-residency needs.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-muted-foreground hover:text-ink">
          ← Back home
        </Link>
      </div>
    </main>
  );
}
