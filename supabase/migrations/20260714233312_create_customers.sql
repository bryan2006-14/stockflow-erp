create table if not exists customers (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null
    references companies(id)
    on delete cascade,

  document_type text not null default 'DNI'
    check (document_type in ('DNI', 'RUC', 'CE', 'OTRO')),

  document_number text,
  first_name text not null,
  last_name text,
  business_name text,

  email text,
  phone text,
  address text,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists customers_company_document_unique
on customers(company_id, document_number)
where document_number is not null;

create index if not exists customers_company_id_idx
on customers(company_id);

create index if not exists customers_name_idx
on customers(first_name, last_name);

alter table customers enable row level security;

create policy "Users can view own company customers"
on customers
for select
using (
  company_id in (
    select company_id
    from profiles
    where id = auth.uid()
  )
);

create policy "Users can manage own company customers"
on customers
for all
using (
  company_id in (
    select company_id
    from profiles
    where id = auth.uid()
  )
)
with check (
  company_id in (
    select company_id
    from profiles
    where id = auth.uid()
  )
);