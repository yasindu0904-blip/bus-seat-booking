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