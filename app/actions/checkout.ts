"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getPlan } from "@/lib/plans";

/**
 * Primary conversion action: a CA picks a plan and we open a Stripe Checkout
 * subscription session, then redirect to it. Errors redirect back to the
 * pricing section with a flag (so this stays a valid <form action>).
 *
 * Bind it to a form:
 *   <form action={createCheckoutSession}>
 *     <input type="hidden" name="planId" value="firm" />
 *   </form>
 */
export async function createCheckoutSession(formData: FormData): Promise<void> {
  const planId = String(formData.get("planId") ?? "");
  const email = String(formData.get("email") ?? "").trim();

  const plan = getPlan(planId);
  if (!plan) redirect("/?checkout_error=plan#pricing");

  // Enterprise is sales-led, not self-serve checkout.
  if (!plan.priceId) redirect("/contact?plan=enterprise");
  const priceId: string = plan.priceId;

  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    redirect("/?checkout_error=email#pricing");
  }

  const origin =
    headers().get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  let checkoutUrl: string | null = null;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      subscription_data: {
        trial_period_days: 14,
        metadata: { plan_id: plan.id },
      },
      tax_id_collection: { enabled: true }, // GST invoicing
      metadata: { plan_id: plan.id },
      success_url: `${origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
    });
    checkoutUrl = session.url;
  } catch (err) {
    console.error("[karlabh] checkout error", err);
  }

  // redirect() throws, so it must live outside the try/catch.
  if (!checkoutUrl) redirect("/?checkout_error=stripe#pricing");
  redirect(checkoutUrl);
}
