/**
 * Single source of truth for pricing.
 * The landing page renders from this, and the Stripe checkout action validates
 * the requested planId against it — so the UI and billing can never drift.
 *
 * `priceId` values come from your Stripe Dashboard (set them in env).
 */

export type BillingInterval = "month" | "year";

export interface Plan {
  id: "starter" | "firm" | "enterprise";
  name: string;
  tagline: string;
  /** Amount in INR (display only). null => "talk to us". */
  amount: number | null;
  interval: BillingInterval | null;
  /** Stripe Price ID. null for the contact-sales tier. */
  priceId: string | null;
  highlighted?: boolean;
  cta: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Solo Practice",
    tagline: "For independent CAs and small practices.",
    amount: 1999,
    interval: "month",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? null,
    cta: "Start 14-day free trial",
    features: [
      "Up to 50 active clients",
      "Unlimited document checklists",
      "WhatsApp reminders & auto-follow-ups",
      "Client upload mini-app (no login)",
      "Kanban filing dashboard",
    ],
  },
  {
    id: "firm",
    name: "Growing Firm",
    tagline: "For multi-partner firms that file at scale.",
    amount: 19999,
    interval: "year",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FIRM ?? null,
    highlighted: true,
    cta: "Start 14-day free trial",
    features: [
      "Unlimited clients",
      "White-label client portal",
      "Team access & role permissions",
      "UPI fee collection (Razorpay)",
      "GST, TDS & advance-tax checklists",
      "Priority WhatsApp support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For networks, franchises & large practices.",
    amount: null,
    interval: null,
    priceId: null,
    cta: "Talk to sales",
    features: [
      "Everything in Growing Firm",
      "Dedicated onboarding",
      "Custom integrations & SSO",
      "SLA & data-residency options",
    ],
  },
];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
