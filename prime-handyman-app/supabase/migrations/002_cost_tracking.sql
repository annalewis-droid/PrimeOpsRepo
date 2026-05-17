-- 002_cost_tracking.sql - Supabase migration to add customers and cost tracking tables

-- Create customers table
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text not null,
  email text not null unique,
  phone text,
  user_id uuid references auth.users(id) -- link to the authenticated user who created the customer
);

-- Enable Row Level Security on customers
alter table customers enable row level security;

create policy "Customers can insert their own records"
  on customers for insert
  with check (auth.uid() = user_id);

create policy "Customers can select their own records"
  on customers for select
  using (auth.uid() = user_id);

create policy "Customers can update their own records"
  on customers for update
  using (auth.uid() = user_id);

create policy "Customers can delete their own records"
  on customers for delete
  using (auth.uid() = user_id);

-- Create purchase_costs table to track cost per purchase (optional linkage to customers)
create table if not exists purchase_costs (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid references material_purchase_logs(id) on delete cascade,
  customer_id uuid references customers(id) on delete cascade,
  cost numeric(10,2) not null,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id)
);

-- Enable Row Level Security on purchase_costs
alter table purchase_costs enable row level security;

create policy "Costs can insert own records"
  on purchase_costs for insert
  with check (auth.uid() = user_id);

create policy "Costs can select own records"
  on purchase_costs for select
  using (auth.uid() = user_id);

create policy "Costs can update own records"
  on purchase_costs for update
  using (auth.uid() = user_id);

create policy "Costs can delete own records"
  on purchase_costs for delete
  using (auth.uid() = user_id);
