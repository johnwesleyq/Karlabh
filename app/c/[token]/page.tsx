import { notFound } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { LekhaMark } from "@/components/landing/logo";
import { UploadRow } from "./upload";

export const dynamic = "force-dynamic";

export default async function ClientUploadPage({
  params,
}: {
  params: { token: string };
}) {
  const admin = createAdminSupabase();

  const { data: link } = await admin
    .from("share_links")
    .select("client_id, expires_at")
    .eq("token", params.token)
    .single();

  if (!link || (link.expires_at && new Date(link.expires_at) < new Date())) {
    notFound();
  }

  const { data: client } = await admin
    .from("clients")
    .select(
      "full_name, filing_year, deadline, documents(id, label, status, req_key), ca_firms:firm_id(name)",
    )
    .eq("id", link.client_id)
    .single();

  if (!client) notFound();

  const docs =
    (client.documents as {
      id: string;
      label: string;
      status: string;
      req_key: string;
    }[]) ?? [];
  docs.sort((a, b) => a.label.localeCompare(b.label));
  const firmRel = client.ca_firms as
    | { name?: string }
    | { name?: string }[]
    | null;
  const firm =
    (Array.isArray(firmRel) ? firmRel[0]?.name : firmRel?.name) ?? "Your CA";
  const done = docs.filter(
    (d) => d.status === "uploaded" || d.status === "approved",
  ).length;

  return (
    <main className="min-h-screen bg-muted px-4 py-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center gap-2.5">
          <LekhaMark className="h-7 w-7" />
          <span className="font-semibold tracking-tightest text-ink">Lekha</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tightest text-ink">
            Hi {client.full_name.split(" ")[0]},
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-ink">{firm}</span> needs these
            documents for FY {client.filing_year}
            {client.deadline
              ? ` · due ${new Date(client.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
              : ""}
            .
          </p>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: docs.length ? `${(done / docs.length) * 100}%` : "0%" }}
              />
            </div>
            <span className="num text-xs text-muted-foreground">
              {done}/{docs.length}
            </span>
          </div>

          <ul className="mt-6 space-y-2.5">
            {docs.map((d) => (
              <UploadRow
                key={d.id}
                token={params.token}
                documentId={d.id}
                label={d.label}
                status={d.status}
              />
            ))}
          </ul>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Secure upload · your documents go straight to your CA. No account needed.
          </p>
        </div>
      </div>
    </main>
  );
}
