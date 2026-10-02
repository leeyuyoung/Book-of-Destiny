-- 결제 시도 1건. 금액은 서버가 정하고, 토스 승인 결과로만 paid가 된다.

create table if not exists public.orders (
  order_id     text primary key check (order_id ~ '^[A-Za-z0-9_-]{6,64}$'),
  token        text not null references public.analyses (token) on delete cascade,
  amount       integer not null check (amount > 0),
  status       text not null check (status in ('pending', 'paid')),
  payment_key  text unique,
  method       text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  approved_at  timestamptz
);

create index if not exists orders_token_idx on public.orders (token);

alter table public.orders enable row level security;
revoke all on table public.orders from anon, authenticated;
