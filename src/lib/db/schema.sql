create table public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
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

