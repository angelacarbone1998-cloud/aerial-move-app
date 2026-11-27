create table public.guest_profiles(
 id uuid primary key default gen_random_uuid(),full_name text not null,
 name_key text generated always as(lower(btrim(regexp_replace(replace(full_name,'’',''''),'[[:space:]]+',' ','g')))) stored unique,
 phone text not null default '' check(length(phone)<=60),notes text not null default '' check(length(notes)<=2000)
);
create table public.guest_profile_lessons(
 profile_id uuid not null references public.guest_profiles(id),lesson_date date not null,activity text not null,time_slot text not null,
 booking_id bigint references public.guest_pilates_bookings(id) on delete set null,booked_at timestamptz not null,
 primary key(profile_id,lesson_date,activity,time_slot)
);
create index guest_profile_lessons_booking_idx on public.guest_profile_lessons(booking_id) where booking_id is not null;
alter table public.guest_profiles enable row level security;
alter table public.guest_profile_lessons enable row level security;
revoke all on public.guest_profiles,public.guest_profile_lessons from public,anon,authenticated,service_role;
grant select,insert,update on public.guest_profiles,public.guest_profile_lessons to service_role;
create function public.am_record_guest_profile_lesson() returns trigger language plpgsql security invoker set search_path='' as $fn$
declare pid uuid;
begin
 insert into public.guest_profiles(full_name) values(btrim(new.first_name)||' '||btrim(new.last_name))
 on conflict(name_key) do update set full_name=excluded.full_name returning id into pid;
 insert into public.guest_profile_lessons(profile_id,lesson_date,activity,time_slot,booking_id,booked_at)
 select pid,s.session_date,s.activity,s.time_slot,new.id,new.created_at from public.pilates_sessions s where s.id=new.session_id
 on conflict(profile_id,lesson_date,activity,time_slot) do update set booking_id=excluded.booking_id,booked_at=least(guest_profile_lessons.booked_at,excluded.booked_at);
 return new;
end;$fn$;
revoke all on function public.am_record_guest_profile_lesson() from public,anon,authenticated;
grant execute on function public.am_record_guest_profile_lesson() to service_role;
create trigger am_record_guest_profile_lesson after insert on public.guest_pilates_bookings for each row execute function public.am_record_guest_profile_lesson();
create temporary table am_guest_import on commit drop as
with events as(
 select m[1] full_name,m[2] activity,m[3]::date lesson_date,m[4] time_slot,n.created_at booked_at,null::bigint booking_id
 from public.app_notifications n cross join lateral regexp_match(n.body,'^(.+) ha prenotato (.+) il ([0-9]{4}-[0-9]{2}-[0-9]{2}) · ([0-9]{2}:[0-9]{2}–[0-9]{2}:[0-9]{2})[.]$') as m
 where n.audience='istruttrici' and n.title='Nuova prenotazione ospite'
 union all select btrim(b.first_name)||' '||btrim(b.last_name),s.activity,s.session_date,s.time_slot,b.created_at,b.id
 from public.guest_pilates_bookings b join public.pilates_sessions s on s.id=b.session_id
) select *,lower(btrim(regexp_replace(replace(full_name,'’',''''),'[[:space:]]+',' ','g'))) name_key from events where full_name is not null;
insert into public.guest_profiles(full_name) select distinct on(name_key) full_name from am_guest_import order by name_key,booking_id desc nulls last,booked_at desc on conflict(name_key) do nothing;
insert into public.guest_profile_lessons(profile_id,lesson_date,activity,time_slot,booking_id,booked_at)
select p.id,e.lesson_date,e.activity,e.time_slot,max(e.booking_id),min(e.booked_at) from am_guest_import e join public.guest_profiles p using(name_key) group by p.id,e.lesson_date,e.activity,e.time_slot
on conflict(profile_id,lesson_date,activity,time_slot) do update set booking_id=coalesce(excluded.booking_id,guest_profile_lessons.booking_id),booked_at=least(excluded.booked_at,guest_profile_lessons.booked_at);