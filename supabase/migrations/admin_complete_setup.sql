begin;

create table if not exists public.admin_whitelist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admin_whitelist enable row level security;
drop policy if exists "admin_whitelist_deny_all" on public.admin_whitelist;
create policy "admin_whitelist_deny_all"
on public.admin_whitelist
for all
using (false)
with check (false);

create or replace function public.is_admin_whitelisted(check_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_whitelist
    where email = lower(check_email)
  );
$$;

revoke all on function public.is_admin_whitelisted(text) from public;
grant execute on function public.is_admin_whitelisted(text) to authenticated;

create or replace function public.get_admin_whitelist()
returns table(id uuid, email text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select aw.id, aw.email, aw.created_at
  from public.admin_whitelist aw
  where public.is_admin_whitelisted(coalesce(auth.jwt()->>'email',''));
$$;

revoke all on function public.get_admin_whitelist() from public;
grant execute on function public.get_admin_whitelist() to authenticated;

create or replace function public.add_admin_whitelist(target_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin_whitelisted(coalesce(auth.jwt()->>'email','')) then
    raise exception 'not authorized';
  end if;

  insert into public.admin_whitelist(email) values (lower(target_email))
  on conflict (email) do nothing;
end;
$$;

revoke all on function public.add_admin_whitelist(text) from public;
grant execute on function public.add_admin_whitelist(text) to authenticated;

create or replace function public.remove_admin_whitelist(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_email text := lower(coalesce(auth.jwt()->>'email',''));
begin
  if not public.is_admin_whitelisted(caller_email) then
    raise exception 'not authorized';
  end if;

  delete from public.admin_whitelist
  where id = target_id
    and email <> caller_email;
end;
$$;

revoke all on function public.remove_admin_whitelist(uuid) from public;
grant execute on function public.remove_admin_whitelist(uuid) to authenticated;

insert into public.admin_whitelist (email)
values ('vikash07052008@gmail.com')
on conflict (email) do nothing;

create table if not exists public.login_logs (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  login_time timestamptz not null default now(),
  device_type text,
  browser text,
  os text,
  session_id text,
  created_at timestamptz not null default now()
);

alter table public.login_logs enable row level security;
drop policy if exists "login_logs_insert_authenticated" on public.login_logs;
create policy "login_logs_insert_authenticated"
on public.login_logs
for insert
to authenticated
with check (true);

drop policy if exists "login_logs_select_admin" on public.login_logs;
create policy "login_logs_select_admin"
on public.login_logs
for select
to authenticated
using (public.is_admin_whitelisted(coalesce(auth.jwt()->>'email','')));

do $$
declare
  t text;
begin
  foreach t in array array['schools','teachers','students','test_sessions','test_results','referrals'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "%s_select_admin" on public.%I', t, t);
    execute format('create policy "%s_select_admin" on public.%I for select to authenticated using (public.is_admin_whitelisted(coalesce(auth.jwt()->>''email'','''')))', t, t);
  end loop;
end $$;

commit;
