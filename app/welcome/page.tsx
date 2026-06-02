import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold tracking-tightest text-ink">
          You&apos;re all set 🎉
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your 14-day trial has started. Add your first client and Lekha will
          generate their checklist and a secure upload link.
        </p>
        <Link href="/dashboard" className="mt-6 inline-block">
          <Button size="lg">Go to your dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
