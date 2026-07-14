create table if not exists products (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null references companies(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  brand_id uuid references brands(id) on delete set null,
  unit_id uuid references units(id) on delete set null,

  sku text not null,
  name text not null,
  description text,

  image_url text,

  purchase_price numeric(10,2) not null default 0,
  sale_price numeric(10,2) not null default 0,

  stock numeric(10,2) not null default 0,
  min_stock numeric(10,2) not null default 0,

  is_active boolean not null default true,

  created_at timestamptz not null default now()
);

create unique index if not exists products_company_sku_unique
on products(company_id, sku);

alter table products enable row level security;

create policy "Users can view own company products"
on products for select
using (
  company_id in (
    select company_id from profiles where id = auth.uid()
  )
);

create policy "Users can manage own company products"
on products for all
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