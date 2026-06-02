-- ════════════════════════════════════════════════════════════════
--  LEKHA — schema  (Supabase / PostgreSQL)
--  Two portals, one product. Auth is handled by Supabase Auth;
--  everything below hangs off a CA firm and is protected by RLS.
-- ════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Enums ───────────────────────────────────────────────────────
create type client_type   as enum ('salaried', 'business', 'nri', 'professional');
create type kanban_status  as enum ('pending', 'partial', 'review', 'filed', 'closed');
create type doc_status     as enum ('pending', 'uploaded', 'approved', 'rejected');
create type member_role    as enum ('owner', 'admin', 'staff');
create type reminder_channel as enum ('whatsapp', 'sms', 'call');
create type payment_kind   as enum ('subscription', 'ca_fee');

-- ── Firms (the paying customer) ─────────────────────────────────
create table ca_firms (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  billing_email        text unique not null,
  whatsapp_from        text,                         -- the firm's WA business number
  plan                 text,                         -- starter | firm | enterprise
  stripe_customer_id   text,
  stripe_subscription_id text,
  subscription_status  text default 'inactive',      -- trialing | active | past_due | canceled
  created_at           timestamptz default now()
);

-- ── Team members (maps Supabase auth users to a firm) ───────────
create table ca_members (
  id          uuid primary key default gen_random_uuid(),
  firm_id     uuid not null references ca_firms(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        member_role not null default 'staff',
  created_at  timestamptz default now(),
  unique (firm_id, user_id)
);

-- ── Clients (the cards on the board) ────────────────────────────
create table clients (
  id            uuid primary key default gen_random_uuid(),
  firm_id       uuid not null references ca_firms(id) on delete cascade,
  full_name     text not null,
  pan           text,                          -- store encrypted at rest; mask in UI
  email         text,
  phone         text not null,                 -- E.164, used for WhatsApp
  client_type   client_type not null,
  filing_year   text not null default '2025-26',
  deadline      date,
  status        kanban_status not null default 'pending',
  board_order   double precision not null default 0, -- fractional index for drag-drop
  fee_amount    integer,                       -- CA fee in INR (paise if you prefer)
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create index on clients (firm_id, status, board_order);

-- ── Document requirements / uploads (checklist items) ───────────
create table documents (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references clients(id) on delete cascade,
  req_key       text not null,                 -- e.g. 'form16', 'pan', 'rent_receipts'
  label         text not null,
  status        doc_status not null default 'pending',
  storage_path  text,                          -- Supabase Storage object path
  uploaded_at   timestamptz,
  reviewed_at   timestamptz,
  note          text,                          -- re-upload reason, etc.
  unique (client_id, req_key)
);
create index on documents (client_id, status);

-- ── Secure share links for the no-login client mini-app ─────────
create table share_links (
  token       text primary key default encode(gen_random_bytes(12), 'hex'),
  client_id   uuid not null references clients(id) on delete cascade,
  expires_at  timestamptz not null default (now() + interval '60 days'),
  created_at  timestamptz default now()
);

-- ── Reminder log (what we sent, when) ───────────────────────────
create table reminders (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references clients(id) on delete cascade,
  channel     reminder_channel not null default 'whatsapp',
  body        text,
  sent_at     timestamptz default now(),
  delivered   boolean default false
);

-- ── Payments (subscription + CA fee via UPI) ────────────────────
create table payments (
  id            uuid primary key default gen_random_uuid(),
  firm_id       uuid not null references ca_firms(id) on delete cascade,
  client_id     uuid references clients(id) on delete set null,
  kind          payment_kind not null,
  amount        integer not null,              -- INR
  provider      text,                          -- stripe | razorpay
  provider_ref  text,
  status        text not null default 'created',
  created_at    timestamptz default now()
);

-- ── Auto-update updated_at ──────────────────────────────────────
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger clients_touch before update on clients
  for each row execute function touch_updated_at();

-- ════════════════════════════════════════════════════════════════
--  Row Level Security — a firm only ever sees its own data.
-- ════════════════════════════════════════════════════════════════
alter table ca_firms  enable row level security;
alter table ca_members enable row level security;
alter table clients   enable row level security;
alter table documents enable row level security;
alter table reminders enable row level security;
alter table payments  enable row level security;

-- Helper: firms the current user belongs to
create or replace function my_firm_ids() returns setof uuid as $$
  select firm_id from ca_members where user_id = auth.uid();
$$ language sql security definer stable;

create policy "members read their firm" on ca_firms
  for select using (id in (select my_firm_ids()));

create policy "members manage their clients" on clients
  for all using (firm_id in (select my_firm_ids()))
  with check (firm_id in (select my_firm_ids()));

create policy "members manage their documents" on documents
  for all using (
    client_id in (select id from clients where firm_id in (select my_firm_ids()))
  );

create policy "members read their reminders" on reminders
  for all using (
    client_id in (select id from clients where firm_id in (select my_firm_ids()))
  );

create policy "members read their payments" on payments
  for all using (firm_id in (select my_firm_ids()));

-- NOTE: the client mini-app reaches documents through a share token via a
-- SECURITY DEFINER RPC (resolve_share_link), not direct table access — so no
-- public RLS policy is exposed on `documents`.

-- ════════════════════════════════════════════════════════════════
--  Onboarding: when a CA signs up, create their firm + owner record.
--  signUp() passes firm_name in user metadata; this reads it.
-- ════════════════════════════════════════════════════════════════
create or replace function handle_new_user() returns trigger as $$
declare new_firm uuid;
begin
  insert into ca_firms (name, billing_email)
  values (coalesce(new.raw_user_meta_data->>'firm_name', 'My Firm'), new.email)
  returning id into new_firm;

  insert into ca_members (firm_id, user_id, role)
  values (new_firm, new.id, 'owner');

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── share_links RLS: CA members manage; the public mini-app reads via
--    the service-role key on the server (token is the secret). ─────
alter table share_links enable row level security;
create policy "members manage share links" on share_links
  for all using (
    client_id in (select id from clients where firm_id in (select my_firm_ids()))
  )
  with check (
    client_id in (select id from clients where firm_id in (select my_firm_ids()))
  );

-- ── Private storage bucket for uploaded documents. Access is server-only
--    (service role) + short-lived signed URLs, so no public policy. ──
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;
