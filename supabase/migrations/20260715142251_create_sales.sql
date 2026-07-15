create table if not exists sales (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null
    references companies(id)
    on delete cascade,

  customer_id uuid
    references customers(id)
    on delete set null,

  user_id uuid
    references auth.users(id)
    on delete set null,

  sale_number text not null,

  status text not null default 'completed'
    check (status in ('draft', 'completed', 'cancelled')),

  payment_method text not null default 'cash'
    check (
      payment_method in (
        'cash',
        'card',
        'transfer',
        'yape',
        'plin',
        'credit'
      )
    ),

  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sale_items (
  id uuid primary key default gen_random_uuid(),

  sale_id uuid not null
    references sales(id)
    on delete cascade,

  product_id uuid
    references products(id)
    on delete set null,

  product_name text not null,
  product_sku text not null,

  quantity numeric(12,2) not null
    check (quantity > 0),

  unit_price numeric(12,2) not null
    check (unit_price >= 0),

  discount numeric(12,2) not null default 0
    check (discount >= 0),

  subtotal numeric(12,2) not null
    check (subtotal >= 0),

  created_at timestamptz not null default now()
);

create unique index if not exists sales_company_number_unique
on sales(company_id, sale_number);

create index if not exists sales_company_id_idx
on sales(company_id);

create index if not exists sales_customer_id_idx
on sales(customer_id);

create index if not exists sales_created_at_idx
on sales(created_at desc);

create index if not exists sale_items_sale_id_idx
on sale_items(sale_id);

create index if not exists sale_items_product_id_idx
on sale_items(product_id);

alter table sales enable row level security;
alter table sale_items enable row level security;

create policy "Users can view own company sales"
on sales
for select
using (
  company_id in (
    select company_id
    from profiles
    where id = auth.uid()
  )
);

create policy "Users can create own company sales"
on sales
for insert
with check (
  company_id in (
    select company_id
    from profiles
    where id = auth.uid()
  )
  and user_id = auth.uid()
);

create policy "Users can update own company sales"
on sales
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

create policy "Users can view own company sale items"
on sale_items
for select
using (
  exists (
    select 1
    from sales
    where sales.id = sale_items.sale_id
      and sales.company_id in (
        select company_id
        from profiles
        where id = auth.uid()
      )
  )
);

create or replace function register_sale(
  p_customer_id uuid,
  p_payment_method text,
  p_discount numeric,
  p_tax numeric,
  p_notes text,
  p_items jsonb
)
returns sales
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_profile profiles;
  v_sale sales;
  v_item jsonb;
  v_product products;

  v_subtotal numeric(12,2) := 0;
  v_total numeric(12,2) := 0;
  v_item_subtotal numeric(12,2);
  v_sale_number text;
  v_quantity numeric(12,2);
  v_unit_price numeric(12,2);
begin
  select *
  into v_profile
  from profiles
  where id = auth.uid();

  if v_profile.id is null or v_profile.company_id is null then
    raise exception 'El usuario no tiene una empresa asociada';
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'La venta debe contener productos';
  end if;

  if p_discount < 0 or p_tax < 0 then
    raise exception 'Los importes no pueden ser negativos';
  end if;

  v_sale_number :=
    'V-' ||
    to_char(now(), 'YYYYMMDD') ||
    '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  for v_item in
    select * from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::numeric;
    v_unit_price := (v_item->>'unit_price')::numeric;

    if v_quantity <= 0 then
      raise exception 'Cantidad no válida';
    end if;

    select *
    into v_product
    from products
    where id = (v_item->>'product_id')::uuid
      and company_id = v_profile.company_id
      and is_active = true
    for update;

    if v_product.id is null then
      raise exception 'Producto no encontrado';
    end if;

    if v_product.stock < v_quantity then
      raise exception 'Stock insuficiente para %', v_product.name;
    end if;

    v_item_subtotal := v_quantity * v_unit_price;
    v_subtotal := v_subtotal + v_item_subtotal;
  end loop;

  v_total := greatest(v_subtotal - p_discount + p_tax, 0);

  insert into sales (
    company_id,
    customer_id,
    user_id,
    sale_number,
    status,
    payment_method,
    subtotal,
    discount,
    tax,
    total,
    notes
  )
  values (
    v_profile.company_id,
    p_customer_id,
    auth.uid(),
    v_sale_number,
    'completed',
    p_payment_method,
    v_subtotal,
    p_discount,
    p_tax,
    v_total,
    nullif(trim(p_notes), '')
  )
  returning *
  into v_sale;

  for v_item in
    select * from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::numeric;
    v_unit_price := (v_item->>'unit_price')::numeric;

    select *
    into v_product
    from products
    where id = (v_item->>'product_id')::uuid
      and company_id = v_profile.company_id
    for update;

    v_item_subtotal := v_quantity * v_unit_price;

    insert into sale_items (
      sale_id,
      product_id,
      product_name,
      product_sku,
      quantity,
      unit_price,
      discount,
      subtotal
    )
    values (
      v_sale.id,
      v_product.id,
      v_product.name,
      v_product.sku,
      v_quantity,
      v_unit_price,
      0,
      v_item_subtotal
    );

    update products
    set stock = stock - v_quantity
    where id = v_product.id;

    insert into stock_movements (
      company_id,
      product_id,
      user_id,
      movement_type,
      quantity,
      previous_stock,
      new_stock,
      reason,
      reference
    )
    values (
      v_profile.company_id,
      v_product.id,
      auth.uid(),
      'sale',
      v_quantity,
      v_product.stock,
      v_product.stock - v_quantity,
      'Venta registrada',
      v_sale.sale_number
    );
  end loop;

  return v_sale;
end;
$$;

grant execute on function register_sale(
  uuid,
  text,
  numeric,
  numeric,
  text,
  jsonb
) to authenticated;