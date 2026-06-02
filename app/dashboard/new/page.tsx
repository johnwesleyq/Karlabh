import Link from "next/link";
import { createClientAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/app/(auth)/auth-ui";
import { CLIENT_TYPE_LABELS } from "@/lib/checklists";

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-lg">
      <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-ink">
        ← Back to board
      </Link>
      <div className="mt-4 rounded-2xl border border-border bg-card p-7 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tightest text-ink">
          Add a client
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Karlabh auto-generates their document checklist and a secure upload link.
        </p>
        <form action={createClientAction} className="mt-6 space-y-4">
          <Field label="Full name" name="full_name" required placeholder="Ramesh Kumar" />
          <Field label="WhatsApp number" name="phone" required placeholder="+91 98765 43210" />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Client type</span>
            <select
              name="client_type"
              defaultValue="salaried"
              className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {Object.entries(CLIENT_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Field label="PAN (optional)" name="pan" placeholder="ABCPK1234L" />
            <Field label="Filing deadline" name="deadline" type="date" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email (optional)" name="email" type="email" placeholder="ramesh@email.com" />
            <Field label="Your fee ₹ (optional)" name="fee_amount" type="number" placeholder="2500" />
          </div>
          {error && (
            <p className="rounded-lg bg-primary-soft px-3 py-2 text-sm text-primary">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" className="w-full">
            Create client & send link
          </Button>
        </form>
      </div>
    </div>
  );
}
