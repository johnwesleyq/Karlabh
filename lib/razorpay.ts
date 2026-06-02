/**
 * Razorpay Payment Links for collecting the CA's fee from the client over UPI.
 * Env-gated: without keys it returns a fake link so the flow is testable.
 * With RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET (and completed KYC) it creates a
 * real, shareable UPI payment link.
 */
export interface PaymentLinkInput {
  amountInr: number;
  description: string;
  customer: { name: string; contact?: string; email?: string };
  notes?: Record<string, string>;
}

export async function createPaymentLink(input: PaymentLinkInput) {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!id || !secret) {
    console.log("[lekha:razorpay:stub]", JSON.stringify(input));
    return {
      stubbed: true as const,
      short_url: `https://rzp.example/stub/${Date.now()}`,
    };
  }

  const auth = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/payment_links", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountInr * 100, // paise
      currency: "INR",
      accept_partial: false,
      description: input.description,
      customer: input.customer,
      notify: { sms: true, email: !!input.customer.email },
      notes: input.notes ?? {},
      upi_link: true,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("[lekha:razorpay] link failed", res.status, data);
    return { ok: false as const, status: res.status };
  }
  return { ok: true as const, short_url: data.short_url as string, id: data.id };
}
