-- Add org_id to invoices and items; update RLS to org-scoped
alter table invoices add column if not exists organization_id uuid references organizations(id) on delete cascade;
alter table invoice_items add column if not exists organization_id uuid;

-- Backfill invoice_items.organization_id from parent invoice on write
create or replace function set_invoice_item_org_id()
returns trigger as $$
begin
  if new.organization_id is null then
    select organization_id into new.organization_id from invoices where id = new.invoice_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_invoice_item_org on invoice_items;
create trigger trg_set_invoice_item_org
before insert or update on invoice_items
for each row execute function set_invoice_item_org_id();

-- Strengthen RLS: a user must be member of the invoice's org (or owner/admin for write)
drop policy if exists "Users can view their own invoices" on invoices;
drop policy if exists "Users can insert their own invoices" on invoices;
drop policy if exists "Users can update their own invoices" on invoices;
drop policy if exists "Users can delete their own invoices" on invoices;

drop policy if exists "Users can view their own invoice items" on invoice_items;
drop policy if exists "Users can insert their own invoice items" on invoice_items;
drop policy if exists "Users can update their own invoice items" on invoice_items;
drop policy if exists "Users can delete their own invoice items" on invoice_items;

-- Read invoices if member of org
create policy invoices_select_org_member on invoices
for select using (
  organization_id is not null and exists (
    select 1 from organization_members m
    where m.organization_id = invoices.organization_id
      and m.user_id = auth.uid()
  )
);

-- Insert invoices if member of org; set user_id automatically for legacy checks
create policy invoices_insert_org_member on invoices
for insert with check (
  organization_id is not null and exists (
    select 1 from organization_members m
    where m.organization_id = invoices.organization_id
      and m.user_id = auth.uid()
  )
);

-- Update/Delete invoices if admin/owner of org
create policy invoices_update_org_admin on invoices
for update using (
  exists (
    select 1 from organization_members m
    where m.organization_id = invoices.organization_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
) with check (
  exists (
    select 1 from organization_members m
    where m.organization_id = invoices.organization_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
);

create policy invoices_delete_org_admin on invoices
for delete using (
  exists (
    select 1 from organization_members m
    where m.organization_id = invoices.organization_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
);

-- Items policies follow parent org membership
create policy invoice_items_select_org_member on invoice_items
for select using (
  exists (
    select 1 from invoices inv
    where inv.id = invoice_items.invoice_id
      and exists (
        select 1 from organization_members m
        where m.organization_id = inv.organization_id
          and m.user_id = auth.uid()
      )
  )
);

create policy invoice_items_insert_org_member on invoice_items
for insert with check (
  exists (
    select 1 from invoices inv
    where inv.id = invoice_items.invoice_id
      and exists (
        select 1 from organization_members m
        where m.organization_id = inv.organization_id
          and m.user_id = auth.uid()
      )
  )
);

create policy invoice_items_update_org_admin on invoice_items
for update using (
  exists (
    select 1 from invoices inv
    where inv.id = invoice_items.invoice_id
      and exists (
        select 1 from organization_members m
        where m.organization_id = inv.organization_id
          and m.user_id = auth.uid()
          and m.role in ('owner','admin')
      )
  )
) with check (
  exists (
    select 1 from invoices inv
    where inv.id = invoice_items.invoice_id
      and exists (
        select 1 from organization_members m
        where m.organization_id = inv.organization_id
          and m.user_id = auth.uid()
          and m.role in ('owner','admin')
      )
  )
);

create policy invoice_items_delete_org_admin on invoice_items
for delete using (
  exists (
    select 1 from invoices inv
    where inv.id = invoice_items.invoice_id
      and exists (
        select 1 from organization_members m
        where m.organization_id = inv.organization_id
          and m.user_id = auth.uid()
          and m.role in ('owner','admin')
      )
  )
);

-- Convenience function to default organization_id from current user's last used org
-- (optional placeholder; can be implemented later)
