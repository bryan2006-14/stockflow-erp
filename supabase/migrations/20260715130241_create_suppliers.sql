create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null
    references companies(id)
    on delete cascade,

  document_type text not null default 'RUC'
    check (document_type in ('RUC', 'DNI', 'CE', 'OTRO')),

  document_number text,
  business_name text not null,
  contact_name text,

  email text,
  phone text,
  address text,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists suppliers_company_document_unique
on suppliers(company_id, document_number)
where document_number is not null;

create index if not exists suppliers_company_id_idx
on suppliers(company_id);

create index if not exists suppliers_business_name_idx
on suppliers(business_name);

alter table suppliers enable row level security;

create policy "Users can view own company suppliers"
on suppliers
for select
using (
  company_id in (
    select company_id
    from profiles
    where id = auth.uid()
  )
);

create policy "Users can create own company suppliers"
on suppliers
for insert
with check (
  company_id in (
    select company_id
    from profiles
    where id = auth.uid()
  )
);

create policy "Users can update own company suppliers"
on suppliers
for update
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

create policy "Users can delete own company suppliers"
on suppliers
for delete
using (
  company_id in (
    select company_id
    from profiles
    where id = auth.uid()
  )
);