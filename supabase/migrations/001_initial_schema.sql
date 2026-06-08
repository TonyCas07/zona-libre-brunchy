create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('super_admin','admin','staff','read_only','partner_future')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  contact_name text,
  contact_phone text,
  address text,
  zone text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.ally_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  organization_name text not null,
  contact_name text,
  contact_phone text,
  zone text,
  status text not null default 'active' check (status in ('active','inactive')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  member_code text unique,
  status text not null default 'pending' check (status in ('pending','validated','rejected','suspended','inactive')),
  full_name text not null,
  document_type text not null,
  document_number_hash text unique not null,
  document_number_last4 text,
  document_number_encrypted text,
  whatsapp text not null,
  whatsapp_normalized text not null unique,
  email text,
  birth_date date,
  instagram text,
  local_relationship text not null,
  zone text not null,
  local_reference text not null,
  organization_name text,
  role_or_activity text,
  ally_code_id uuid references public.ally_codes(id),
  origin_restaurant_id uuid references public.restaurants(id),
  validation_method text not null,
  declaration_truth boolean not null default false,
  preferred_contact_channel text,
  preferred_purchase_channel text,
  preferred_consumption_type text,
  purchase_frequency text,
  preferred_time_slot text,
  buys_for text,
  approximate_people text,
  preferred_payment_method text,
  wants_delivery_future boolean not null default false,
  delivery_address text,
  delivery_reference text,
  delivery_preferred_time text,
  delivery_notes text,
  data_consent boolean not null default false,
  data_consent_at timestamptz default now(),
  commercial_consent boolean not null default false,
  commercial_consent_at timestamptz,
  segmentation_consent boolean not null default false,
  allies_consent boolean not null default false,
  terms_accepted boolean not null default false,
  terms_accepted_at timestamptz default now(),
  source_channel text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  validated_at timestamptz,
  validated_by uuid references public.profiles(id),
  rejected_at timestamptz,
  rejected_by uuid references public.profiles(id),
  rejection_reason text,
  suspended_at timestamptz,
  suspended_by uuid references public.profiles(id),
  suspension_reason text,
  notes text
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  restaurant_id uuid references public.restaurants(id),
  sale_date timestamptz not null default now(),
  purchase_channel text not null,
  gross_amount numeric(12,2) not null check (gross_amount >= 0),
  discount_type text,
  discount_amount numeric(12,2) not null default 0 check (discount_amount >= 0),
  net_amount numeric(12,2) not null check (net_amount >= 0),
  product_category text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  objective text,
  segment_filters jsonb not null default '{}',
  message_template text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.campaign_exports (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id),
  exported_by uuid references public.profiles(id),
  export_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.member_notes (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  note text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  minimum_order_amount numeric(12,2),
  delivery_fee numeric(12,2),
  free_delivery_threshold numeric(12,2),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.benefits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  benefit_type text not null,
  discount_label text not null,
  discount_percentage numeric(5,2),
  active boolean not null default true,
  is_fiscal_exemption boolean not null default false,
  disclaimer text not null,
  created_at timestamptz not null default now()
);

create index if not exists members_status_idx on public.members(status);
create index if not exists members_zone_idx on public.members(zone);
create index if not exists sales_member_idx on public.sales(member_id);
create index if not exists sales_date_idx on public.sales(sale_date);

create or replace view public.members_with_stats as
select
  m.*,
  case when m.document_number_last4 is null then null else '***-****' || m.document_number_last4 end as document_masked,
  max(s.sale_date) as last_purchase_at,
  count(s.id)::integer as purchase_count,
  coalesce(avg(s.net_amount), 0)::numeric(12,2) as average_ticket,
  coalesce(sum(s.net_amount), 0)::numeric(12,2) as total_purchased
from public.members m
left join public.sales s on s.member_id = m.id
group by m.id;

alter view public.members_with_stats set (security_invoker = true);

create or replace view public.ally_codes_with_counts as
select
  a.*,
  count(m.id)::integer as associated_registrations
from public.ally_codes a
left join public.members m on m.ally_code_id = a.id
group by a.id;

alter view public.ally_codes_with_counts set (security_invoker = true);

create or replace function public.next_member_code_number()
returns integer
language sql
security definer
as $$
  select coalesce(max(nullif(regexp_replace(member_code, '\D', '', 'g'), '')::integer), 0) + 1
  from public.members
  where member_code is not null;
$$;

create or replace function public.current_role()
returns text
language sql
stable
security definer
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_internal_user()
returns boolean
language sql
stable
security definer
as $$
  select public.current_role() in ('super_admin','admin','staff','read_only');
$$;

alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.ally_codes enable row level security;
alter table public.sales enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_exports enable row level security;
alter table public.member_notes enable row level security;
alter table public.audit_logs enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.restaurants enable row level security;
alter table public.benefits enable row level security;

create policy "profiles self read" on public.profiles for select using (id = auth.uid() or public.current_role() = 'super_admin');
create policy "profiles super admin write" on public.profiles for all using (public.current_role() = 'super_admin') with check (public.current_role() = 'super_admin');

create policy "members internal read" on public.members for select using (public.is_internal_user());
create policy "members admin write" on public.members for all using (public.current_role() in ('super_admin','admin')) with check (public.current_role() in ('super_admin','admin'));

create policy "ally internal read" on public.ally_codes for select using (public.is_internal_user());
create policy "ally admin write" on public.ally_codes for all using (public.current_role() in ('super_admin','admin')) with check (public.current_role() in ('super_admin','admin'));

create policy "sales internal read" on public.sales for select using (public.is_internal_user());
create policy "sales staff write" on public.sales for insert with check (public.current_role() in ('super_admin','admin','staff'));

create policy "campaign admin read" on public.campaigns for select using (public.current_role() in ('super_admin','admin','read_only'));
create policy "campaign admin write" on public.campaigns for all using (public.current_role() in ('super_admin','admin')) with check (public.current_role() in ('super_admin','admin'));

create policy "exports admin" on public.campaign_exports for all using (public.current_role() in ('super_admin','admin')) with check (public.current_role() in ('super_admin','admin'));
create policy "notes internal read" on public.member_notes for select using (public.is_internal_user());
create policy "notes staff write" on public.member_notes for insert with check (public.current_role() in ('super_admin','admin','staff'));
create policy "audit internal read" on public.audit_logs for select using (public.is_internal_user());
create policy "audit admin insert" on public.audit_logs for insert with check (public.current_role() in ('super_admin','admin','staff'));
create policy "config internal read delivery" on public.delivery_zones for select using (public.is_internal_user());
create policy "restaurants internal read" on public.restaurants for select using (public.is_internal_user());
create policy "benefits internal read" on public.benefits for select using (public.is_internal_user());
