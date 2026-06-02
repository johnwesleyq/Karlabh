"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";

async function resolveToken(token: string) {
  const admin = createAdminSupabase();
  const { data: link } = await admin
    .from("share_links")
    .select("client_id, expires_at")
    .eq("token", token)
    .single();
  if (!link) return null;
  if (link.expires_at && new Date(link.expires_at) < new Date()) return null;
  return { admin, clientId: link.client_id as string };
}

export async function uploadDocument(
  token: string,
  documentId: string,
  formData: FormData,
) {
  const ctx = await resolveToken(token);
  if (!ctx) return { ok: false, error: "This link has expired." };
  const { admin, clientId } = ctx;

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { ok: false, error: "No file selected." };
  if (file.size > 15 * 1024 * 1024)
    return { ok: false, error: "File too large (15 MB max)." };

  // Ensure the document belongs to this client.
  const { data: doc } = await admin
    .from("documents")
    .select("id, req_key")
    .eq("id", documentId)
    .eq("client_id", clientId)
    .single();
  if (!doc) return { ok: false, error: "Invalid document." };

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${clientId}/${doc.req_key}-${Date.now()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await admin.storage
    .from("documents")
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (upErr) return { ok: false, error: "Upload failed. Try again." };

  await admin
    .from("documents")
    .update({
      status: "uploaded",
      storage_path: path,
      uploaded_at: new Date().toISOString(),
    })
    .eq("id", documentId);

  // Recompute the client's board stage.
  const { data: all } = await admin
    .from("documents")
    .select("status")
    .eq("client_id", clientId);
  const list = all ?? [];
  const received = list.filter(
    (d) => d.status === "uploaded" || d.status === "approved",
  ).length;
  const stage =
    received === 0 ? "pending" : received === list.length ? "review" : "partial";
  await admin.from("clients").update({ status: stage }).eq("id", clientId);

  revalidatePath(`/c/${token}`);
  return { ok: true };
}
