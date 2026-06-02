import Link from "next/link";
import { signIn } from "../actions";
import { AuthShell, Field } from "../auth-ui";
import { Button } from "@/components/ui/button";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your practice dashboard."
      footer={
        <>
          New to Karlabh?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form action={signIn} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={searchParams.next ?? "/dashboard"} />
        <Field label="Email" name="email" type="email" required placeholder="you@firm.in" />
        <Field label="Password" name="password" type="password" required placeholder="••••••••" />
        {searchParams.error && (
          <p className="rounded-lg bg-primary-soft px-3 py-2 text-sm text-primary">
            {searchParams.error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full">
          Log in
        </Button>
      </form>
    </AuthShell>
  );
}
