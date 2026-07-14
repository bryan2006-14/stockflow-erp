create extension if not exists "pgcrypto";

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ruc varchar(11),
  email text,
  phone text,
  address text,
  logo_url text,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  full_name text not null,
  role text not null default 'owner',
  avatar_url text,
  created_at timestamptz not null default now()
);