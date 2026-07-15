create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null
    references companies(id)
    on delete cascade,

  supplier_id uuid
    references suppliers(id)
    on delete set null,

  user_id uuid
    references auth.users(id)
    on delete set null,

  purchase_number text not null,

  status text not null default 'completed'
    check (status in ('draft', 'completed', 'cancelled')),

  payment_method text not null default 'cash'
    check (
      payment_method in (
        'cash',
        'card',
        'transfer',
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

create table if not exists purchase_items (
  id uuid primary key default gen_random_uuid(),

  purchase_id uuid not null
    references purchases(id)
    on delete cascade,

  product_id uuid
    references products(id)
    on delete set null,

  product_name text not null,
  product_sku text not null,

  quantity numeric(12,2) not null
    check (quantity > 0),

  unit_cost numeric(12,2) not null
    check (unit_cost >= 0),

  discount numeric(12,2) not null default 0
    check (discount >= 0),

  subtotal numeric(12,2) not null
    check (subtotal >= 0),

  created_at timestamptz not null default now()
);

create unique index if not exists purchases_company_number_unique
on purchases(company_id, purchase_number);

create index if not exists purchases_company_id_idx
on purchases(company_id);

create index if not exists purchases_supplier_id_idx
on purchases(supplier_id);

create index if not exists purchases_created_at_idx
on purchases(created_at desc);

create index if not exists purchase_items_purchase_id_idx
on purchase_items(purchase_id);

create index if not exists purchase_items_product_id_idx
on purchase_items(product_id);

alter table purchases enable row level security;
alter table purchase_items enable row level security;

create policy "Users can view own company purchases"
on purchases
for select
to authenticated
using (
  company_id in (
    select company_id
    from profiles
    where id = auth.uid()
  )
);

create policy "Users can create own company purchases"
on purchases
for insert
to authenticated
with check (
  company_id in (
    select company_id
    from profiles
    where id = auth.uid()
  )
  and user_id = auth.uid()
);

create policy "Users can update own company purchases"
on purchases
for update
to authenticated
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

create policy "Users can view own company purchase items"
on purchase_items
for select
to authenticated
using (
  exists (
    select 1
    from purchases
    where purchases.id = purchase_items.purchase_id
      and purchases.company_id in (
        select company_id
        from profiles
        where id = auth.uid()
      )
  )
);

create policy "Users can create own company purchase items"
on purchase_items
for insert
to authenticated
with check (
  exists (
    select 1
    from purchases
    where purchases.id = purchase_items.purchase_id
      and purchases.user_id = auth.uid()
      and purchases.company_id in (
        select company_id
        from profiles
        where id = auth.uid()
      )
  )
);

create or replace function register_purchase(
  p_supplier_id uuid,
  p_payment_method text,
  p_discount numeric,
  p_tax numeric,
  p_notes text,
  p_items jsonb
)
returns purchases
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_profile profiles;
  v_purchase purchases;
  v_item jsonb;
  v_product products;

  v_subtotal numeric(12,2) := 0;
  v_total numeric(12,2) := 0;
  v_item_subtotal numeric(12,2);

  v_purchase_number text;
  v_quantity numeric(12,2);
  v_unit_cost numeric(12,2);
  v_previous_stock numeric(12,2);
  v_new_stock numeric(12,2);
begin
  select *
  into v_profile
  from profiles
  where id = auth.uid();

  if v_profile.id is null or v_profile.company_id is null then
    raise exception 'El usuario no tiene una empresa asociada';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'La compra debe contener productos';
  end if;

  if p_discount < 0 or p_tax < 0 then
    raise exception 'Los importes no pueden ser negativos';
  end if;

  if p_supplier_id is not null and not exists (
    select 1
    from suppliers
    where id = p_supplier_id
      and company_id = v_profile.company_id
      and is_active = true
  ) then
    raise exception 'Proveedor no válido';
  end if;

  v_purchase_number :=
    'C-' ||
    to_char(now(), 'YYYYMMDD') ||
    '-' ||
    upper(
      substr(
        replace(gen_random_uuid()::text, '-', ''),
        1,
        6
      )
    );

  for v_item in
    select *
    from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::numeric;
    v_unit_cost := (v_item->>'unit_cost')::numeric;

    if v_quantity <= 0 then
      raise exception 'Cantidad no válida';
    end if;

    if v_unit_cost < 0 then
      raise exception 'Costo no válido';
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

    v_item_subtotal := v_quantity * v_unit_cost;
    v_subtotal := v_subtotal + v_item_subtotal;
  end loop;

  v_total := greatest(
    v_subtotal - p_discount + p_tax,
    0
  );

  insert into purchases (
    company_id,
    supplier_id,
    user_id,
    purchase_number,
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
    p_supplier_id,
    auth.uid(),
    v_purchase_number,
    'completed',
    p_payment_method,
    v_subtotal,
    p_discount,
    p_tax,
    v_total,
    nullif(trim(p_notes), '')
  )
  returning *
  into v_purchase;

  for v_item in
    select *
    from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::numeric;
    v_unit_cost := (v_item->>'unit_cost')::numeric;

    select *
    into v_product
    from products
    where id = (v_item->>'product_id')::uuid
      and company_id = v_profile.company_id
    for update;

    v_previous_stock := v_product.stock;
    v_new_stock := v_previous_stock + v_quantity;
    v_item_subtotal := v_quantity * v_unit_cost;

    insert into purchase_items (
      purchase_id,
      product_id,
      product_name,
      product_sku,
      quantity,
      unit_cost,
      discount,
      subtotal
    )
    values (
      v_purchase.id,
      v_product.id,
      v_product.name,
      v_product.sku,
      v_quantity,
      v_unit_cost,
      0,
      v_item_subtotal
    );

    update products
    set
      stock = v_new_stock,
      purchase_price = v_unit_cost
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
      'purchase',
      v_quantity,
      v_previous_stock,
      v_new_stock,
      'Compra registrada',
      v_purchase.purchase_number
    );
  end loop;

  return v_purchase;
end;
$$;

grant execute on function register_purchase(
  uuid,
  text,
  numeric,
  numeric,
  text,
  jsonb
) to authenticated;