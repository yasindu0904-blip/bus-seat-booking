create table public.admin_profiles (
  id uuid not null,
  first_name text null,
  last_name text null,
  created_at timestamp with time zone not null default now(),
  email text not null default ''::text,
  constraint admin_profiles_pkey primary key (id),
  constraint admin_profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.admin_sessions (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  started_at timestamp with time zone not null default now(),
  expires_at timestamp with time zone not null,
  is_active boolean not null default true,
  constraint admin_sessions_pkey primary key (id),
  constraint admin_sessions_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.buses (
  bus_number text not null,
  seat_count integer null,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid (),
  routes_id uuid not null,
  constraint buses_pkey primary key (id),
  constraint buses_bus_number_key unique (bus_number),
  constraint buses_routes_id_fkey foreign KEY (routes_id) references routes (id)
) TABLESPACE pg_default;

create table public.customer_profiles (
  id uuid not null,
  email text null,
  first_name text null,
  phone_number text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  profile_completed boolean null,
  last_name text null,
  constraint customer_profiles_pkey primary key (id),
  constraint customer_profiles_email_key unique (email),
  constraint customer_profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger set_customer_profiles_updated_at BEFORE
update on customer_profiles for EACH row
execute FUNCTION set_updated_at ();

create table public.routes (
  id uuid not null default gen_random_uuid (),
  route_name text not null,
  start_location text not null,
  created_at timestamp with time zone not null default now(),
  constraint routes_pkey primary key (id)
) TABLESPACE pg_default;

create table public.user_roles (
  user_id uuid not null,
  role text not null,
  created_at timestamp with time zone not null default now(),
  created_by uuid null,
  constraint user_roles_pkey primary key (user_id),
  constraint user_roles_created_by_fkey foreign KEY (created_by) references auth.users (id),
  constraint user_roles_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint user_roles_role_check check (
    (
      role = any (array['customer'::text, 'admin'::text])
    )
  )
) TABLESPACE pg_default;

create table public.routes_bus (
  routes_id uuid not null,
  shift integer not null,
  trip_date date not null,
  bus_number text not null,
  done boolean null default false,
  constraint routes_bus_pkey primary key (trip_date, shift, routes_id),
  constraint routes_bus_bus_number_fkey foreign KEY (bus_number) references buses (bus_number) on update CASCADE on delete RESTRICT,
  constraint routes_bus_routes_id_fkey foreign KEY (routes_id) references routes (id) on update CASCADE on delete RESTRICT,
  constraint routes_bus_shift_check check ((shift = any (array[1, 2, 3, 4])))
) TABLESPACE pg_default;

create index IF not exists idx_routes_bus_routes_id on public.routes_bus using btree (routes_id) TABLESPACE pg_default;

create index IF not exists idx_routes_bus_routes_id_trip_date on public.routes_bus using btree (routes_id, trip_date) TABLESPACE pg_default;

create table public.bus_seats (
  routes_id uuid not null,
  shift integer not null,
  trip_date date not null,
  seat_number integer not null,
  bus_seats_customer_id uuid null,
  end_location text null,
  constraint bus_seats_pkey primary key (trip_date, shift, routes_id, seat_number),
  constraint bus_seats_customer_id_fkey foreign KEY (bus_seats_customer_id) references customer_profiles (id) on update CASCADE on delete RESTRICT,
  constraint bus_seats_routes_bus_fkey foreign KEY (trip_date, shift, routes_id) references routes_bus (trip_date, shift, routes_id) on update CASCADE on delete RESTRICT,
  constraint bus_seats_seat_number_check check ((seat_number >= 1)),
  constraint bus_seats_shift_check check ((shift = any (array[1, 2, 3, 4])))
) TABLESPACE pg_default;

create index IF not exists idx_bus_seats_trip_date_shift_routes_id on public.bus_seats using btree (trip_date, shift, routes_id) TABLESPACE pg_default;