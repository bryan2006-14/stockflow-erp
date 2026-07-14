create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  abbreviation text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;
alter table brands enable row level security;
alter table units enable row level security;

create policy "Users can view own company categories"
on categories for select
using (
  company_id in (
    select company_id from profiles where id = auth.uid()
  )
);

create policy "Users can manage own company categories"
on categories for all
using (
  company_id in (
    select company_id from profiles where id = auth.uid()
  )
)
with check (
  company_id in (
    select company_id from profiles where id = auth.uid()
  )
);

create policy "Users can view own company brands"
on brands for select
using (
  company_id in (
    select company_id from profiles where id = auth.uid()
  )
);

create policy "Users can manage own company brands"
on brands for all
using (
  company_id in (
    select company_id from profiles where id = auth.uid()
  )
)
with check (
  company_id in (
    select company_id from profiles where id = auth.uid()
  )
);

create policy "Users can view own company units"
on units for select
using (
  company_id in (
    select company_id from profiles where id = auth.uid()
  )
);

create policy "Users can manage own company units"
on units for all
using (
  company_id in (
    select company_id from profiles where id = auth.uid()
  )
)
with check (
  company_id in (
    select company_id from profiles where id = auth.uid()
  )
);