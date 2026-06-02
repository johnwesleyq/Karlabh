"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { checklistFor, type ClientType } from "@/lib/checklists";
import { sendWhatsApp } from "@/lib/whatsapp";
import { createPaymentLink } from "@/lib/razorpay";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function requireFirmId() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("ca_members")
    .select("firm_id")
    .eq("user_id", user.id)
    .single();

  if (!member) throw new Error("No firm found for this user.");
  return { supabase, firmId: member.firm_id as string };
}

export async function createClientAction(formData: FormData) {
  const { supabase, firmId } = await requireFirmId();

  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const client_type = String(formData.get("client_type") ?? "salaried") as ClientType;
  const pan = String(formData.get("pan") ?? "").trim().toUpperCase() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const deadline = String(formData.get("deadline") ?? "") || null;
  const feeRaw = String(formData.get("fee_amount") ?? "").trim();
  const fee_amount = feeRaw ? parseInt(feeRaw, 10) : null;

  if (!full_name || !phone) {
    redirect("/dashboard/new?error=Name+and+phone+are+required");
  }

  const { data: client, error } = await supabase
    .from("clients")
    .insert({
      firm_id: firmId,
      full_name,
      phone,
      client_type,
      pan,
      email,
      deadline,
      fee_amount,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !client) {
    redirect(`/dashboard/new?error=${encodeURIComponent(error?.message ?? "Could not create client")}`);
  }

  // Auto-generate the document checklist.
  const items = checklistFor(client_type).map((it) => ({
    client_id: client.id,
    req_key: it.req_key,
    label: it.label,
    status: "pending" as const,
  }));
  await supabase.from("documents").insert(items);

  // Create the secure no-login share link.
  const { data: link } = await supabase
    .from("share_links")
    .insert({ client_id: client.id })
    .select("token")
    .single();

  // Fire the first WhatsApp message (stubbed until WhatsApp keys are set).
  if (link?.token) {
    await sendWhatsApp({
      to: phone,
      template: "doc_request",
      bodyValues: [full_name, `${APP_URL}/c/${link.token}`],
    });
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateClientStatus(clientId: string, status: string) {
  const { supabase } = await requireFirmId();
  await supabase.from("clients").update({ status }).eq("id", clientId);
  revalidatePath("/dashboard");
}

export async function reviewDocument(
  documentId: string,
  action: "approve" | "reject",
  clientId: string,
) {
  const { supabase } = await requireFirmId();
  await supabase
    .from("documents")
    .update({
      status: action === "approve" ? "approved" : "rejected",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", documentId);
  revalidatePath(`/dashboard/clients/${clientId}`);
}

export async function sendReminder(clientId: string) {
  const { supabase } = await requireFirmId();

  const { data: client } = await supabase
    .from("clients")
    .select("full_name, phone, documents(status), share_links(token)")
    .eq("id", clientId)
    .single();

  if (!client) return;
  const pending =
    (client.documents as { status: string }[] | null)?.filter(
      (d) => d.status === "pending" || d.status === "rejected",
    ).length ?? 0;
  const token = (client.share_links as { token: string }[] | null)?.[0]?.token;

  await sendWhatsApp({
    to: client.phone,
    template: "reminder",
    bodyValues: [client.full_name, String(pending), `${APP_URL}/c/${token}`],
  });

  await supabase.from("reminders").insert({
    client_id: clientId,
    channel: "whatsapp",
    body: `${pending} docs pending`,
  });
  revalidatePath(`/dashboard/clients/${clientId}`);
}

export async function requestPayment(clientId: string) {
  const { supabase, firmId } = await requireFirmId();

  const { data: client } = await supabase
    .from("clients")
    .select("full_name, phone, email, fee_amount")
    .eq("id", clientId)
    .single();

  if (!client?.fee_amount) {
    redirect(`/dashboard/clients/${clientId}?error=Set+a+fee+amount+first`);
  }

  const link = await createPaymentLink({
    amountInr: client.fee_amount,
    description: `CA fee — ${client.full_name}`,
    customer: {
      name: client.full_name,
      contact: client.phone,
      email: client.email ?? undefined,
    },
    notes: { client_id: clientId },
  });

  await supabase.from("payments").insert({
    firm_id: firmId,
    client_id: clientId,
    kind: "ca_fee",
    amount: client.fee_amount,
    provider: "razorpay",
    provider_ref: "short_url" in link ? link.short_url : null,
    status: "created",
  });

  if ("short_url" in link && link.short_url) {
    await sendWhatsApp({
      to: client.phone,
      template: "fee_request",
      bodyValues: [client.full_name, String(client.fee_amount), link.short_url],
    });
  }
  revalidatePath(`/dashboard/clients/${clientId}`);
}
