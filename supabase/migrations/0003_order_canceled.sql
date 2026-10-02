-- 환불(전액 취소)된 주문을 canceled로 표시할 수 있게 한다.

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check check (status in ('pending', 'paid', 'canceled'));
