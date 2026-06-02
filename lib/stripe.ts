import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Fail loud in dev; in prod this surfaces at boot, not mid-checkout.
  console.warn("[lekha] STRIPE_SECRET_KEY is not set — checkout will fail.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
  appInfo: { name: "Lekha", version: "1.0.0" },
});
