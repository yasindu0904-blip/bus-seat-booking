create table public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text,
  last_name text,
  mobile_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_customers_updated_at
before update on public.customers
for each row
execute function public.set_updated_at();


create policy "Customers can view their own profile"
on public.customers
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Customers can insert their own profile"
on public.customers
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Customers can update their own profile"
on public.customers
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  created_at timestamptz not null default now()
);

create table public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  is_active boolean not null default true
);

alter table public.customer_profiles
add column if not exists phone_number text,
add column if not exists profile_completed boolean not null default false;

alter table public.customer_profiles
drop column if exists mobile_number;

drop trigger if exists set_customers_updated_at on public.customers;
drop policy if exists "Customers can view their own profile" on public.customers;
drop policy if exists "Customers can insert their own profile" on public.customers;
drop policy if exists "Customers can update their own profile" on public.customers;

create trigger set_customer_profiles_updated_at
before update on public.customer_profiles
for each row
execute function public.set_updated_at();

create policy "Customers can view their own profile"
on public.customer_profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Customers can insert their own profile"
on public.customer_profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Customers can update their own profile"
on public.customer_profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create table public.routes (
  id uuid primary key default gen_random_uuid(),
  route_name text not null,
  start_location text not null,
  end_location text not null,
  created_at timestamptz not null default now()
);

create table public.buses (
  id uuid primary key default gen_random_uuid(),
  bus_number text not null unique,
  seat_count integer,
  created_at timestamptz not null default now()
);

alter table public.routes enable row level security;

create policy "Admins can insert routes"
on public.routes
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

alter table public.buses enable row level security;

create policy "Admins can insert buses"
on public.buses
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

create policy "Admins can view buses"
on public.buses
for select
to authenticated
using (
  exists (
    select 1
    from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);
alter table public.buses
add column if not exists now_location text,
add column if not exists booked boolean not null default false;

create policy "Admins can update buses"
on public.buses
for update
to authenticated
using (
  exists (
    select 1
    from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);