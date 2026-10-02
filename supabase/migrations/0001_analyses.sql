-- 분석 1건(무료 결과 + 유료 리포트 전문)을 보관한다.
-- 서버가 Secret key로만 접근한다. 브라우저용(publishable/anon) 키로는 읽거나 쓸 수 없다.

create table if not exists public.analyses (
  token             text primary key check (token ~ '^[A-Za-z0-9_-]{22}$'),
  status            text not null check (status in ('generating', 'ready', 'failed')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  name              text not null,
  email             text not null,
  occupation_status text not null,
  occupation        text,
  concern           text not null,
  profile           jsonb not null,
  report            jsonb,
  paid_at           timestamptz
);

create index if not exists analyses_created_at_idx on public.analyses (created_at);

-- 정책(policy)을 하나도 만들지 않고 RLS를 켜 두면, Secret key 외의 모든 접근이 막힌다.
alter table public.analyses enable row level security;
revoke all on table public.analyses from anon, authenticated;
