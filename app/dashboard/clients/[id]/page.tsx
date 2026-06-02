import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { reviewDocument, sendReminder, requestPayment } from "../../actions";
import { CLIENT_TYPE_LABELS, type ClientType } from "@/lib/checklists";
import { CopyLink } from "./copy-link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  uploaded: "bg-status-review/15 text-status-review",
  approved: "bg-status-filed/15 text-status-filed",
  rejected: "bg-primary-soft text-primary",
};

export default async function ClientDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createServerSupabase();

  const { data: client } = await supabase
    .from("clients")
    .select(
      "id, full_name, pan, email, phone, client_type, deadline, fee_amount, status, documents(id, label, status, storage_path, uploaded_at), share_links(token)",
    )
    .eq("id", id)
    .single();

  if (!client) notFound();

  const docs =
    (client.documents as {
      id: string;
      label: string;
      status: string;
      storage_path: string | null;
      uploaded_at: string | null;
    }[]) ?? [];
  const token = (client.share_links as { token: string }[] | null)?.[0]?.token;
  const uploadUrl = token ? `${APP_URL}/c/${token}` : "";

  const admin = createAdminSupabase();
  const links: Record<string, string> = {};
  for (const d of docs) {
    if (d.storage_path && (d.status === "uploaded" || d.status === "approved")) {
      const { data } = await admin.storage
        .from("documents")
        .createSignedUrl(d.storage_path, 60 * 30);
      if (data?.signedUrl) links[d.id] = data.signedUrl;
    }
  }

  const done = docs.filter(
    (d) => d.status === "uploaded" || d.status === "approved",
  ).length;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-ink">
        ← Back to board
      </Link>
      <div className="mt-4 rounded-2xl border border-border bg-card p-7 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tightest text-ink">
              {client.full_name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {CLIENT_TYPE_LABELS[client.client_type as ClientType]} ·{" "}
              <span className="num">{client.pan ?? "PAN not set"}</span> ·{" "}
              {client.phone}
            </p>
          </div>
          <span className="num rounded-full bg-primary-soft px-3 py-1 text-sm font-medium text-primary">
            {done}/{docs.length} received
          </span>
        </div>
        {error && (
          <p className="mt-4 rounded-lg bg-primary-soft px-3 py-2 text-sm text-primary">
            {error}
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <CopyLink url={uploadUrl} />
          <form action={sendReminder.bind(null, client.id)}>
            <button className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-muted">
              Send WhatsApp reminder
            </button>
          </form>
          <form action={requestPayment.bind(null, client.id)}>
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
              Request fee{client.fee_amount ? ` (₹${client.fee_amount})` : ""}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-ink">Document checklist</h2>
        </div>
        <ul className="divide-y divide-border">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center gap-3 px-6 py-3.5">
              <span className="flex-1 text-sm text-ink">{d.label}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[d.status] ?? STATUS_STYLE.pending}`}>
                {d.status}
              </span>
              {links[d.id] && (
                <a href={links[d.id]} target="_blank" rel="noreferrer"
                  className="text-xs font-medium text-primary hover:underline">
                  View
                </a>
              )}
              {(d.status === "uploaded" || d.status === "rejected") && (
                <form action={reviewDocument.bind(null, d.id, "approve", client.id)}>
                  <button className="text-xs font-medium text-status-filed hover:underline">Approve</button>
                </form>
              )}
              {d.status === "uploaded" && (
                <form action={reviewDocument.bind(null, d.id, "reject", client.id)}>
                  <button className="text-xs font-medium text-primary hover:underline">Re-request</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
