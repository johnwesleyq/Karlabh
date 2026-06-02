import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { KarlabhMark } from "@/components/landing/logo";
import { signOut } from "../(auth)/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("ca_members")
    .select("ca_firms(name)")
    .eq("user_id", user.id)
    .single();

  const firmRel = member?.ca_firms as
    | { name?: string }
    | { name?: string }[]
    | null;
  const firmName =
    (Array.isArray(firmRel) ? firmRel[0]?.name : firmRel?.name) ?? "Your firm";

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <KarlabhMark className="h-7 w-7" />
            <span className="font-semibold tracking-tightest text-ink">Karlabh</span>
            <span className="ml-2 hidden text-sm text-muted-foreground sm:inline">
              · {firmName}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline">
              {user.email}
            </span>
            <form action={signOut}>
              <button className="rounded-full border border-border px-4 py-1.5 text-sm text-ink transition-colors hover:bg-muted">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1280px] px-6 py-8">{children}</div>
    </div>
  );
}
