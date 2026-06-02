import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Board, type BoardClient } from "./board";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("clients")
    .select(
      "id, full_name, pan, status, deadline, client_type, documents(status)",
    )
    .order("created_at", { ascending: false });

  const clients: BoardClient[] = (data ?? []).map((c) => {
    const docs = (c.documents as { status: string }[] | null) ?? [];
    const done = docs.filter(
      (d) => d.status === "uploaded" || d.status === "approved",
    ).length;
    return {
      id: c.id,
      full_name: c.full_name,
      pan: c.pan,
      status: c.status,
      deadline: c.deadline,
      client_type: c.client_type,
      done,
      total: docs.length,
    };
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tightest text-ink">
            Clients
          </h1>
          <p className="text-sm text-muted-foreground">
            {clients.length} total · drag a card to change its stage
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button>+ Add client</Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
          <p className="text-ink">No clients yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first client and Karlabh will generate their document
            checklist and a secure upload link.
          </p>
          <Link href="/dashboard/new" className="mt-5 inline-block">
            <Button>+ Add your first client</Button>
          </Link>
        </div>
      ) : (
        <Board clients={clients} />
      )}
    </>
  );
}
