-- Organizations core schema
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  billing_email text,
  address text,
  tax_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists organization_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  role text not null check (role in ('owner','admin','member')),
  token uuid not null unique default gen_random_uuid(),
  invited_by uuid not null references auth.users(id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now()
);

-- org updated_at trigger
create or replace function update_timestamp() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_organizations_updated_at on organizations;
create trigger trg_organizations_updated_at
before update on organizations
for each row execute function update_timestamp();

-- RLS
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table organization_invites enable row level security;

-- Policies: members can see orgs they belong to
create policy org_select on organizations
for select using (
  exists (
    select 1 from organization_members m
    where m.organization_id = organizations.id
      and m.user_id = auth.uid()
  )
);

-- Owners/admins can update org
create policy org_update on organizations
for update using (
  exists (
    select 1 from organization_members m
    where m.organization_id = organizations.id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
) with check (
  exists (
    select 1 from organization_members m
    where m.organization_id = organizations.id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
);

-- Anyone can insert an org as themselves as owner (authenticated)
create policy org_insert on organizations
for insert with check (auth.role() = 'authenticated');

-- Members table policies
create policy org_members_select on organization_members
for select using (
  exists (
    select 1 from organization_members m2
    where m2.organization_id = organization_members.organization_id
      and m2.user_id = auth.uid()
  )
);

create policy org_members_insert on organization_members
for insert with check (
  -- only owners/admins of the org can add members
  exists (
    select 1 from organization_members m
    where m.organization_id = organization_members.organization_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
);

create policy org_members_update on organization_members
for update using (
  exists (
    select 1 from organization_members m
    where m.organization_id = organization_members.organization_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
) with check (
  exists (
    select 1 from organization_members m
    where m.organization_id = organization_members.organization_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
);

create policy org_members_delete on organization_members
for delete using (
  exists (
    select 1 from organization_members m
    where m.organization_id = organization_members.organization_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
);

-- Invites policies: view within org; create by admin/owner; accept by email + token
create policy org_invites_select on organization_invites
for select using (
  exists (
    select 1 from organization_members m
    where m.organization_id = organization_invites.organization_id
      and m.user_id = auth.uid()
  )
);

create policy org_invites_insert on organization_invites
for insert with check (
  exists (
    select 1 from organization_members m
    where m.organization_id = organization_invites.organization_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
);

-- Create an RPC to create an organization and add current user as owner
create or replace function create_organization(
  p_name text,
  p_slug text,
  p_billing_email text default null,
  p_address text default null,
  p_tax_id text default null
) returns uuid
language plpgsql
security definer
as $$
declare
  v_org_id uuid;
begin
  insert into organizations (name, slug, billing_email, address, tax_id)
  values (p_name, p_slug, p_billing_email, p_address, p_tax_id)
  returning id into v_org_id;

  insert into organization_members (organization_id, user_id, role)
  values (v_org_id, auth.uid(), 'owner');

  return v_org_id;
end;
$$;

-- A helper function to accept invite
create or replace function accept_organization_invite(p_token uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  v_invite organization_invites%rowtype;
  v_member_id uuid;
begin
  select * into v_invite
  from organization_invites
  where token = p_token
    and accepted_at is null
    and expires_at > now()
  limit 1;

  if not found then
    raise exception 'Invite invalid or expired';
  end if;

  -- Ensure the authed user email matches invite email
  if lower(v_invite.email) <> lower(coalesce(auth.email(), '')) then
    raise exception 'Invite email does not match current user email';
  end if;

  -- Upsert membership
  insert into organization_members (organization_id, user_id, role)
  values (v_invite.organization_id, auth.uid(), v_invite.role)
  on conflict (organization_id, user_id)
  do update set role = excluded.role
  returning id into v_member_id;

  update organization_invites set accepted_at = now()
  where id = v_invite.id;

  return v_member_id;
end;
$$;

-- Indexes
create index if not exists idx_org_members_org on organization_members(organization_id);
create index if not exists idx_org_members_user on organization_members(user_id);
create index if not exists idx_org_invites_org on organization_invites(organization_id);
create index if not exists idx_org_invites_token on organization_invites(token);

