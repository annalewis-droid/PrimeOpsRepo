-- Vendors Table
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text not null,
  website text,
  category text,
  contact_person text,
  phone text,
  email text,
  account_number text,
  notes text,
  user_id uuid references auth.users(id)
);

-- Secure Vendor Credentials Table
create table if not exists vendor_credentials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  vendor_id uuid references vendors(id) on delete cascade,
  login_url text,
  username text,
  password text, -- In a production app, we would use a vault, but RLS will protect this
  notes text,
  user_id uuid references auth.users(id)
);

-- Enable RLS
alter table vendors enable row level security;
alter table vendor_credentials enable row level security;

-- Policies for Vendors (Employees can see/add)
create policy "Employees can view vendors" on vendors for select using (true);
create policy "Employees can insert vendors" on vendors for insert with check (auth.uid() is not null);

-- Policies for Credentials (ONLY the creator or an Admin can see)
-- Note: We'll start with "Creator only" and can expand to Admin roles later
create policy "Users can view their own vendor credentials"
  on vendor_credentials for select
  using (auth.uid() = user_id);

create policy "Users can insert their own vendor credentials"
  on vendor_credentials for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own vendor credentials"
  on vendor_credentials for update
  using (auth.uid() = user_id);
