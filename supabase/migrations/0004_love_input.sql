-- 입력 단계를 연애 중심으로 바꾼다.
-- 직업 대신 연애 상태를 받고, 고민은 선택 사항이 되며, 이메일은 결제 직전에 받는다.
-- 예전 분석 기록이 남아 있으므로 occupation 칸은 지우지 않고 비워둘 수 있게만 한다.

alter table public.analyses add column if not exists relationship_status text;
alter table public.analyses alter column email drop not null;
alter table public.analyses alter column occupation_status drop not null;
alter table public.analyses alter column concern drop not null;
