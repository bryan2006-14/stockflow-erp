drop policy if exists "Users can create own company sale items"
on sale_items;

create policy "Users can create own company sale items"
on sale_items
for insert
to authenticated
with check (
  exists (
    select 1
    from sales
    where sales.id = sale_items.sale_id
      and sales.user_id = auth.uid()
      and sales.company_id in (
        select profiles.company_id
        from profiles
        where profiles.id = auth.uid()
      )
  )
);