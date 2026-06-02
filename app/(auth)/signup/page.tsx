import Link from "next/link";
import { signUp } from "../actions";
import { AuthShell, Field } from "../auth-ui";
import { Button } from "@/components/ui/button";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AuthShell
      title="Start your free trial"
      subtitle="14 days free. No card required."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form action={signUp} className="mt-6 space-y-4">
        <Field label="Firm name" name="firmName" required placeholder="Venkatesh & Co." />
        <Field label="Work email" name="email" type="email" required placeholder="you@firm.in" />
        <Field label="Password" name="password" type="password" required placeholder="At least 6 characters" />
        {error && (
          <p className="rounded-lg bg-primary-soft px-3 py-2 text-sm text-primary">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
