create table if not exists stock_movements (
  id uuid primary key default gen_random_uuid(),

  company_id uuid not null
    references companies(id)
    on delete cascade,

  product_id uuid not null
    references products(id)
    on delete cascade,

  user_id uuid
    references auth.users(id)
    on delete set null,

  movement_type text not null
    check (
      movement_type in (
        'initial',
        'purchase',
        'sale',
        'entry',
        'exit',
        'adjustment'
      )
    ),

  quantity numeric(12,2) not null
    check (quantity > 0),

  previous_stock numeric(12,2) not null default 0,
  new_stock numeric(12,2) not null default 0,

  reason text,
  reference text,

  created_at timestamptz not null default now()
);

create index if not exists stock_movements_company_id_idx
on stock_movements(company_id);

create index if not exists stock_movements_product_id_idx
on stock_movements(product_id);

create index if not exists stock_movements_created_at_idx
on stock_movements(created_at desc);

alter table stock_movements enable row level security;

create policy "Users can view own company stock movements"
on stock_movements
for select
using (
  company_id in (
    select company_id
    from profiles
    where id = auth.uid()
  )
);

create policy "Users can create own company stock movements"
on stock_movements
for insert
with check (
  company_id in (
    select company_id
    from profiles
    where id = auth.uid()
  )
  and user_id = auth.uid()
);

create or replace function register_stock_movement(
  p_product_id uuid,
  p_movement_type text,
  p_quantity numeric,
  p_reason text default null,
  p_reference text default null
)
returns stock_movements
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_product products;
  v_profile profiles;
  v_previous_stock numeric;
  v_new_stock numeric;
  v_movement stock_movements;
begin
  if p_quantity <= 0 then
    raise exception 'La cantidad debe ser mayor que cero';
  end if;

  if p_movement_type not in (
    'initial',
    'purchase',
    'sale',
    'entry',
    'exit',
    'adjustment'
  ) then
    raise exception 'Tipo de movimiento no válido';
  end if;

  select *
  into v_profile
  from profiles
  where id = auth.uid();

  if v_profile.id is null or v_profile.company_id is null then
    raise exception 'El usuario no tiene una empresa asociada';
  end if;

  select *
  into v_product
  from products
  where id = p_product_id
    and company_id = v_profile.company_id
  for update;

  if v_product.id is null then
    raise exception 'Producto no encontrado';
  end if;

  v_previous_stock := v_product.stock;

  if p_movement_type in ('sale', 'exit') then
    v_new_stock := v_previous_stock - p_quantity;

    if v_new_stock < 0 then
      raise exception 'Stock insuficiente';
    end if;
  else
    v_new_stock := v_previous_stock + p_quantity;
  end if;

  update products
  set stock = v_new_stock
  where id = p_product_id;

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
    p_product_id,
    auth.uid(),
    p_movement_type,
    p_quantity,
    v_previous_stock,
    v_new_stock,
    nullif(trim(p_reason), ''),
    nullif(trim(p_reference), '')
  )
  returning *
  into v_movement;

  return v_movement;
end;
$$;

grant execute on function register_stock_movement(
  uuid,
  text,
  numeric,
  text,
  text
) to authenticated;