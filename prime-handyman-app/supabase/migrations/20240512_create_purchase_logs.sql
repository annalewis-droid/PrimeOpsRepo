create table if not exists material_purchase_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  job_number text not null,
  property_address text,
  vendor text,
  category text,
  purchaser text,
  purchase_date date,
  net_cost numeric(10, 2),
  total_client_bill numeric(10, 2),
  notes text,
  user_id uuid references auth.users(id)
);

-- Enable Row Level Security
alter table material_purchase_logs enable row level security;

-- Create policy to allow authenticated users to insert their own logs
create policy "Users can insert their own material logs"
  on material_purchase_logs for insert
  with check (auth.uid() = user_id);

-- Create policy to allow users to view their own logs
create policy "Users can view their own material logs"
  on material_purchase_logs for select
  using (auth.uid() = user_id);
