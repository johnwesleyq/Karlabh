# Lekha — the client OS for chartered accountants

Collect documents over WhatsApp, track every client's filing status on one
board, and get paid over UPI.

## What's built (and working)

**The full core loop runs end to end:**

1. **Auth** — CA signs up → a firm + owner record is created automatically.
2. **Add client** — auto-generates a document checklist by client type
   (salaried / business / professional / NRI) and a secure no-login upload link.
3. **Kanban board** — drag clients across Pending → Partial → Under Review →
   Filed → Closed; progress bars track docs received.
4. **Client mini-app** (`/c/[token]`) — no login; the client sees their
   checklist and uploads photos/PDFs straight to storage.
5. **Review** — CA opens each uploaded file (signed URLs), approves or
   re-requests; the client's board stage updates automatically.
6. **Landing page + Stripe Checkout** — 14-day trial subscription with webhook.

**Wired but env-gated** (they activate when you add keys, and safely log
instead of sending until then):

- **WhatsApp** (Interakt) — `lib/whatsapp.ts`. Needs an Interakt account **and
  Meta-approved message templates** (`doc_request`, `reminder`, `fee_request`).
- **Razorpay UPI** (`lib/razorpay.ts`) — needs completed KYC to create real
  payment links.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Supabase
(Postgres + Auth + Storage) · Stripe · Interakt (WhatsApp) · Razorpay.

## Run it

```bash
npm install
cp .env.example .env.local      # fill in keys (see below)
npm run dev                     # http://localhost:3000
```

### Supabase setup (5 minutes)

1. Create a project at supabase.com.
2. SQL Editor → paste and run all of `supabase/schema.sql`. This creates every
   table, the row-level-security policies, the signup trigger, and the private
   `documents` storage bucket.
3. **Auth → Providers → Email:** for quick local testing, turn **off** "Confirm
   email" so signup logs you straight in. (Turn it back on for production.)
4. Copy your keys into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` (same page — **server-only**, keep secret)

### Stripe (for the subscription)

- `STRIPE_SECRET_KEY`, then create two recurring Prices and set
  `NEXT_PUBLIC_STRIPE_PRICE_STARTER` / `NEXT_PUBLIC_STRIPE_PRICE_FIRM`.
- Webhook: point Stripe at `/api/stripe/webhook`, set `STRIPE_WEBHOOK_SECRET`.

You can test the entire app with **only the Supabase keys** — WhatsApp and
Razorpay calls will log to your terminal instead of sending, so nothing breaks.

## Try the loop locally

Sign up → Add client (use any phone number) → on the board, open the client →
**Copy upload link** → open that link in a new tab → upload a file → back on the
board the card moves to Partial/Under Review → Approve the doc. That's the whole
product working.

## Structure

```
app/
  page.tsx                landing page
  (auth)/                 login, signup, auth actions
  dashboard/              board, add-client, client review + actions
  c/[token]/              no-login client upload mini-app
  actions/checkout.ts     Stripe Checkout server action
  api/stripe/webhook/     subscription sync
lib/
  checklists.ts           auto-checklist rules by client type
  whatsapp.ts razorpay.ts env-gated integrations
  stripe.ts plans.ts      billing
  supabase/               server / client / admin clients
supabase/schema.sql       full schema + RLS + trigger + storage bucket
middleware.ts             session refresh + /dashboard guard
preview.html              static design preview (open in any browser)
```

## Still to build

Automated reminder scheduling (cron/edge function on the `reminders` table),
team-member invites, and the white-label client portal. The schema already
supports all three.
