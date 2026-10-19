-- 在 Supabase SQL Editor 执行一次；service_role 密钥只能放服务端
create table if not exists public.access_codes (
 id uuid primary key default gen_random_uuid(),
 code_hash text unique not null,
 code_suffix text not null,
 status text not null default 'unused' check(status in ('unused','activated','disabled')),
 created_at timestamptz not null default now(),
 activated_at timestamptz,
 session_id uuid unique,
 report jsonb
);
create index if not exists access_codes_session_idx on public.access_codes(session_id);
alter table public.access_codes enable row level security;
-- 不创建 anon/authenticated 策略：仅服务端 service_role 访问
create or replace function public.activate_quiz_code(p_hash text,p_session uuid)
returns table(result text) language plpgsql security definer set search_path=public as $$
declare v_id uuid;
begin
 update public.access_codes set status='activated',activated_at=now(),session_id=p_session
 where code_hash=p_hash and status='unused' returning id into v_id;
 if v_id is not null then return query select 'ok'::text;
 elsif exists(select 1 from public.access_codes where code_hash=p_hash and status='activated') then return query select 'used'::text;
 else return query select 'invalid'::text; end if;
end $$;
revoke all on function public.activate_quiz_code(text,uuid) from public,anon,authenticated;
grant execute on function public.activate_quiz_code(text,uuid) to service_role;
