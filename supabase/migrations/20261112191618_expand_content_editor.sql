create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table public.admin_fields (content_key text primary key references public.site_content(content_key), page text not null, field_type text not null);
alter table public.admin_fields enable row level security;
grant select on public.admin_fields to authenticated;
create policy editor_fields on public.admin_fields for select to authenticated using (exists(select 1 from public.cms_editors where user_id=(select auth.uid())));
insert into public.site_content(content_key,page,label,content_value) values ('insights.la-voting-rights-election-disruption.url','Insights','Los Angeles Times: link','https://www.latimes.com/california/story/2026-09-27/la-voting-rights-groups-mobilize-to-counter-possible-november-election-disruption') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.red-state-direct-democracy.url','Insights','WhoWhatWhy: link','https://whowhatwhy.org/politics/elections/red-state-legislators-work-to-throttle-direct-democracy/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.becerra-steyer-legal-threats.url','Insights','The Sacramento Bee: link','https://www.sacbee.com/news/politics-government/capitol-alert/article315956919.html') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.florida-ballot-measures.url','Insights','Common Dreams: link','https://www.commondreams.org/opinion/florida-ballot-measures') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.california-redistricting.url','Insights','Alliance for Justice: link','https://afj.org/article/rules-of-the-game-california-redistricting-and-ballot-measures/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.piraeus-point.url','Insights','The Coast News Group: link','https://thecoastnews.com/former-encinitas-officials-votes-on-piraeus-point-likely-a-conflict-experts-say/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.evan-low-campaign-finance.url','Insights','CalMatters: link','https://calmatters.org/politics/2025/02/california-campaign-finance-violations-evan-low/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.lawson-remer-campaign-money.url','Insights','Voice of San Diego: link','https://voiceofsandiego.org/2024/10/23/supervisor-lawson-remer-paid-child-care-bills-with-campaign-money/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.direct-democracy-ballot.url','Insights','The Hill: link','https://thehill.com/opinion/campaign/4794335-conservative-attacks-direct-democracy/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.together-sf.url','Insights','Mission Local: link','https://missionlocal.org/2024/05/mark-farrell-consultant-texts-that-togethersf-head-is-guiding-the-ship/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.red-state-attorneys-general.url','Insights','Bolts: link','https://boltsmag.org/attorneys-general-stall-ballot-measures/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.sb-county-tax-measure.url','Insights','Follow Our Courts: link','https://followourcourts.com/2024/02/sb-county-tax-measure-ruled-invalid-in-appeal/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.ballot-measure-insights.url','Insights','Alliance for Justice: link','https://afj.org/article/ballot-measure-insights-with-emma-olson-sharkey/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.ballot-measure-wars.url','Insights','Democracy Docket: link','https://www.democracydocket.com/opinion/the-ballot-measure-wars/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.weaken-ballot-process.url','Insights','Salon: link','https://www.salon.com/2023/03/15/aim-to-weaken-ballot-measure-process-after-progressive-victories/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.democrats-voting-strength.url','Insights','The Washington Post: link','https://www.washingtonpost.com/opinions/2022/12/08/truth-about-democrats-voting-strength/') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.ballot-itself.url','Insights','The New York Times: link','https://www.nytimes.com/2022/10/07/us/politics/ballot-measures-midterms.html') on conflict do nothing;
insert into public.site_content(content_key,page,label,content_value) values ('insights.donor-network.url','Insights','CalMatters: link','https://calmatters.org/politics/2022/08/california-campaign-finance-donor-network/') on conflict do nothing;
insert into public.admin_fields values ('people.heading.main','People','text'),
('people.heading.emphasis','People','text'),
('people.lede','People','textarea'),
('people.nonattorney.note','People','text'),
('people.nicholas.name','Nicholas Sanders','text'),
('people.nicholas.role','Nicholas Sanders','text'),
('people.nicholas.intro','Nicholas Sanders','textarea'),
('people.nicholas.bio.1','Nicholas Sanders','textarea'),
('people.nicholas.bio.2','Nicholas Sanders','textarea'),
('people.nicholas.bio.3','Nicholas Sanders','textarea'),
('people.nicholas.education','Nicholas Sanders','textarea'),
('people.nicholas.admissions','Nicholas Sanders','textarea'),
('people.nicholas.email','Nicholas Sanders','email'),
('people.tracey.name','Tracey Frazier Wigglesworth','text'),
('people.tracey.role','Tracey Frazier Wigglesworth','text'),
('people.tracey.intro','Tracey Frazier Wigglesworth','textarea'),
('people.tracey.bio.1','Tracey Frazier Wigglesworth','textarea'),
('people.tracey.bio.2','Tracey Frazier Wigglesworth','textarea'),
('people.tracey.bio.3','Tracey Frazier Wigglesworth','textarea'),
('people.tracey.education','Tracey Frazier Wigglesworth','textarea'),
('people.tracey.admissions','Tracey Frazier Wigglesworth','textarea'),
('people.tracey.email','Tracey Frazier Wigglesworth','email'),
('people.emma.name','Emma Olson Sharkey','text'),
('people.emma.role','Emma Olson Sharkey','text'),
('people.emma.intro','Emma Olson Sharkey','textarea'),
('people.emma.bio.1','Emma Olson Sharkey','textarea'),
('people.emma.bio.2','Emma Olson Sharkey','textarea'),
('people.emma.bio.3','Emma Olson Sharkey','textarea'),
('people.emma.education','Emma Olson Sharkey','textarea'),
('people.emma.admissions','Emma Olson Sharkey','textarea'),
('people.emma.email','Emma Olson Sharkey','email'),
('people.buddy.name','Buddy Norton','text'),
('people.buddy.role','Buddy Norton','text'),
('people.buddy.intro','Buddy Norton','textarea'),
('people.buddy.bio.1','Buddy Norton','textarea'),
('people.buddy.bio.2','Buddy Norton','textarea'),
('people.buddy.bio.3','Buddy Norton','textarea'),
('people.buddy.education','Buddy Norton','textarea'),
('people.buddy.admissions','Buddy Norton','textarea'),
('people.buddy.email','Buddy Norton','email'),
('people.kristen.name','Kristen Lippstreu','text'),
('people.kristen.role','Kristen Lippstreu','text'),
('people.kristen.intro','Kristen Lippstreu','textarea'),
('people.kristen.bio.1','Kristen Lippstreu','textarea'),
('people.kristen.bio.2','Kristen Lippstreu','textarea'),
('people.kristen.education','Kristen Lippstreu','textarea'),
('people.kristen.email','Kristen Lippstreu','email'),
('people.lauren.name','Lauren Deutsch','text'),
('people.lauren.role','Lauren Deutsch','text'),
('people.lauren.intro','Lauren Deutsch','textarea'),
('people.lauren.bio.1','Lauren Deutsch','textarea'),
('people.lauren.education','Lauren Deutsch','textarea'),
('people.lauren.email','Lauren Deutsch','email'),
('people.sara.name','Sara Michels','text'),
('people.sara.role','Sara Michels','text'),
('people.sara.intro','Sara Michels','textarea'),
('people.sara.bio.1','Sara Michels','textarea'),
('people.sara.education','Sara Michels','textarea'),
('people.sara.email','Sara Michels','email'),
('people.katie.name','Katie Clyde','text'),
('people.katie.role','Katie Clyde','text'),
('people.katie.intro','Katie Clyde','textarea'),
('people.katie.bio.1','Katie Clyde','textarea'),
('people.katie.education','Katie Clyde','textarea'),
('people.katie.email','Katie Clyde','email'),
('why.heading.main','Firm','textarea'),
('why.heading.emphasis','Firm','text'),
('why.body.1','Firm','textarea'),
('why.body.2','Firm','textarea'),
('why.body.3','Firm','textarea'),
('practice.campaign-finance.name','Practice','text'),
('practice.campaign-finance.description','Practice','textarea'),
('practice.elections.name','Practice','text'),
('practice.elections.description','Practice','textarea'),
('practice.advocacy.name','Practice','text'),
('practice.advocacy.description','Practice','textarea'),
('practice.nonprofits.name','Practice','text'),
('practice.nonprofits.description','Practice','textarea'),
('practice.ethics.name','Practice','text'),
('practice.ethics.description','Practice','textarea'),
('practice.enforcement.name','Practice','text'),
('practice.enforcement.description','Practice','textarea'),
('practice.campaign-finance.body.1','Campaign Finance details','textarea'),
('practice.campaign-finance.body.2','Campaign Finance details','textarea'),
('practice.campaign-finance.body.3','Campaign Finance details','textarea'),
('practice.elections.body.1','Elections details','textarea'),
('practice.elections.body.2','Elections details','textarea'),
('practice.elections.body.3','Elections details','textarea'),
('practice.advocacy.body.1','Advocacy details','textarea'),
('practice.advocacy.body.2','Advocacy details','textarea'),
('practice.advocacy.body.3','Advocacy details','textarea'),
('practice.nonprofits.body.1','Nonprofits details','textarea'),
('practice.nonprofits.body.2','Nonprofits details','textarea'),
('practice.nonprofits.body.3','Nonprofits details','textarea'),
('practice.ethics.body.1','Ethics details','textarea'),
('practice.ethics.body.2','Ethics details','textarea'),
('practice.ethics.body.3','Ethics details','textarea'),
('practice.enforcement.body.1','Enforcement details','textarea'),
('practice.enforcement.body.2','Enforcement details','textarea'),
('practice.enforcement.body.3','Enforcement details','textarea'),
('insights.heading.main','Insights','text'),
('insights.heading.emphasis','Insights','text'),
('insights.lede','Insights','textarea'),
('insights.la-voting-rights-election-disruption.title','Insights','textarea'),
('insights.la-voting-rights-election-disruption.publication','Insights','text'),
('insights.la-voting-rights-election-disruption.date','Insights','text'),
('insights.la-voting-rights-election-disruption.credit','Insights','text'),
('insights.la-voting-rights-election-disruption.url','Insights','url'),
('insights.red-state-direct-democracy.title','Insights','textarea'),
('insights.red-state-direct-democracy.publication','Insights','text'),
('insights.red-state-direct-democracy.date','Insights','text'),
('insights.red-state-direct-democracy.credit','Insights','text'),
('insights.red-state-direct-democracy.url','Insights','url'),
('insights.becerra-steyer-legal-threats.title','Insights','textarea'),
('insights.becerra-steyer-legal-threats.publication','Insights','text'),
('insights.becerra-steyer-legal-threats.date','Insights','text'),
('insights.becerra-steyer-legal-threats.credit','Insights','text'),
('insights.becerra-steyer-legal-threats.url','Insights','url'),
('insights.florida-ballot-measures.title','Insights','textarea'),
('insights.florida-ballot-measures.publication','Insights','text'),
('insights.florida-ballot-measures.date','Insights','text'),
('insights.florida-ballot-measures.credit','Insights','text'),
('insights.florida-ballot-measures.url','Insights','url'),
('insights.california-redistricting.title','Insights','textarea'),
('insights.california-redistricting.publication','Insights','text'),
('insights.california-redistricting.date','Insights','text'),
('insights.california-redistricting.credit','Insights','text'),
('insights.california-redistricting.url','Insights','url'),
('insights.piraeus-point.title','Insights','textarea'),
('insights.piraeus-point.publication','Insights','text'),
('insights.piraeus-point.date','Insights','text'),
('insights.piraeus-point.credit','Insights','text'),
('insights.piraeus-point.url','Insights','url'),
('insights.evan-low-campaign-finance.title','Insights','textarea'),
('insights.evan-low-campaign-finance.publication','Insights','text'),
('insights.evan-low-campaign-finance.date','Insights','text'),
('insights.evan-low-campaign-finance.credit','Insights','text'),
('insights.evan-low-campaign-finance.url','Insights','url'),
('insights.lawson-remer-campaign-money.title','Insights','textarea'),
('insights.lawson-remer-campaign-money.publication','Insights','text'),
('insights.lawson-remer-campaign-money.date','Insights','text'),
('insights.lawson-remer-campaign-money.credit','Insights','text'),
('insights.lawson-remer-campaign-money.url','Insights','url'),
('insights.direct-democracy-ballot.title','Insights','textarea'),
('insights.direct-democracy-ballot.publication','Insights','text'),
('insights.direct-democracy-ballot.date','Insights','text'),
('insights.direct-democracy-ballot.credit','Insights','text'),
('insights.direct-democracy-ballot.url','Insights','url'),
('insights.together-sf.title','Insights','textarea'),
('insights.together-sf.publication','Insights','text'),
('insights.together-sf.date','Insights','text'),
('insights.together-sf.credit','Insights','text'),
('insights.together-sf.url','Insights','url'),
('insights.red-state-attorneys-general.title','Insights','textarea'),
('insights.red-state-attorneys-general.publication','Insights','text'),
('insights.red-state-attorneys-general.date','Insights','text'),
('insights.red-state-attorneys-general.credit','Insights','text'),
('insights.red-state-attorneys-general.url','Insights','url'),
('insights.sb-county-tax-measure.title','Insights','textarea'),
('insights.sb-county-tax-measure.publication','Insights','text'),
('insights.sb-county-tax-measure.date','Insights','text'),
('insights.sb-county-tax-measure.credit','Insights','text'),
('insights.sb-county-tax-measure.url','Insights','url'),
('insights.ballot-measure-insights.title','Insights','textarea'),
('insights.ballot-measure-insights.publication','Insights','text'),
('insights.ballot-measure-insights.date','Insights','text'),
('insights.ballot-measure-insights.credit','Insights','text'),
('insights.ballot-measure-insights.url','Insights','url'),
('insights.ballot-measure-wars.title','Insights','textarea'),
('insights.ballot-measure-wars.publication','Insights','text'),
('insights.ballot-measure-wars.date','Insights','text'),
('insights.ballot-measure-wars.credit','Insights','text'),
('insights.ballot-measure-wars.url','Insights','url'),
('insights.weaken-ballot-process.title','Insights','textarea'),
('insights.weaken-ballot-process.publication','Insights','text'),
('insights.weaken-ballot-process.date','Insights','text'),
('insights.weaken-ballot-process.credit','Insights','text'),
('insights.weaken-ballot-process.url','Insights','url'),
('insights.democrats-voting-strength.title','Insights','textarea'),
('insights.democrats-voting-strength.publication','Insights','text'),
('insights.democrats-voting-strength.date','Insights','text'),
('insights.democrats-voting-strength.credit','Insights','text'),
('insights.democrats-voting-strength.url','Insights','url'),
('insights.ballot-itself.title','Insights','textarea'),
('insights.ballot-itself.publication','Insights','text'),
('insights.ballot-itself.date','Insights','text'),
('insights.ballot-itself.credit','Insights','text'),
('insights.ballot-itself.url','Insights','url'),
('insights.donor-network.title','Insights','textarea'),
('insights.donor-network.publication','Insights','text'),
('insights.donor-network.date','Insights','text'),
('insights.donor-network.credit','Insights','text'),
('insights.donor-network.url','Insights','url'),
('contact.heading.main','Contact','text'),
('contact.heading.emphasis','Contact','text'),
('contact.lede','Contact','text'),
('contact.address.street','Contact','text'),
('contact.address.locality','Contact','text'),
('contact.email','Contact','email'),
('contact.phone','Contact','text'),
('global.footer.tagline','Global','text');
alter table public.site_content add column version integer not null default 1, add column updated_at timestamptz not null default now(), add column updated_by uuid;
create table public.site_media (
 media_key text primary key, page text not null, object_path text, width integer, height integer,
 version integer not null default 1, updated_at timestamptz not null default now(), updated_by uuid,
 check(object_path is null or object_path ~ ('^people/' || media_key || '/[a-f0-9-]+\.(jpg|png|webp)$')),
 check(object_path is null or (width>=600 and height>=600))
);
alter table public.site_media enable row level security;
revoke all on public.site_media from anon,authenticated;
grant select on public.site_media to anon,authenticated;
grant update(object_path,width,height) on public.site_media to authenticated;
create policy media_read on public.site_media for select to anon,authenticated using(true);
create policy media_edit on public.site_media for update to authenticated using(exists(select 1 from public.cms_editors where user_id=(select auth.uid()))) with check(exists(select 1 from public.cms_editors where user_id=(select auth.uid())));
insert into public.site_media(media_key,page) values ('nicholas','Nicholas Sanders'),('tracey','Tracey Frazier Wigglesworth'),('emma','Emma Olson Sharkey'),('buddy','Buddy Norton'),('kristen','Kristen Lippstreu'),('lauren','Lauren Deutsch'),('sara','Sara Michels'),('katie','Katie Clyde');
create table private.content_history (id bigint generated always as identity primary key, table_name text not null, old_row jsonb not null, new_row jsonb not null, editor uuid, changed_at timestamptz not null default now());
alter table private.content_history enable row level security;
-- Privileged trigger is private, not executable by clients; required to append an immutable audit record.
create function private.audit_content() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is not null and not exists(select 1 from public.cms_editors where user_id=auth.uid()) then raise exception 'Not authorized'; end if;
 new.version := old.version+1; new.updated_at := now(); new.updated_by := auth.uid();
 insert into private.content_history(table_name,old_row,new_row,editor) values(TG_TABLE_NAME,to_jsonb(old),to_jsonb(new),auth.uid());
 return new;
end $$;
revoke all on function private.audit_content() from public,anon,authenticated;
create trigger audit_content before update on public.site_content for each row execute function private.audit_content();
create trigger audit_media before update on public.site_media for each row execute function private.audit_content();
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('site-media','site-media',true,5242880,array['image/jpeg','image/png','image/webp']);
create policy portrait_upload on storage.objects for insert to authenticated with check (
 bucket_id='site-media' and exists(select 1 from public.cms_editors where user_id=(select auth.uid()))
 and exists(select 1 from public.site_media m where name ~ ('^people/'||m.media_key||'/[a-f0-9-]+\.(jpg|png|webp)$'))
);
create policy portrait_editor_read on storage.objects for select to authenticated using(bucket_id='site-media' and exists(select 1 from public.cms_editors where user_id=(select auth.uid())));
create function public.save_admin_page(page_name text, expected_versions jsonb, changes jsonb, photo jsonb default null)
returns void language plpgsql security invoker set search_path='' as $$
declare r record; item record; p public.site_media; n integer;
begin
 if not exists(select 1 from public.cms_editors where user_id=auth.uid()) then raise exception 'Not authorized'; end if;
 if jsonb_typeof(changes)<>'object' or jsonb_typeof(expected_versions)<>'object' then raise exception 'Invalid request'; end if;
 select count(*) into n from public.admin_fields where page=page_name;
 if n=0 or (select count(*) from jsonb_object_keys(expected_versions))<>n then raise exception 'Reload this page before saving'; end if;
 for r in select c.content_key,c.version from public.site_content c join public.admin_fields a using(content_key) where a.page=page_name order by c.content_key for update of c loop
  if (expected_versions->>r.content_key)::integer is distinct from r.version then raise exception 'This page changed in another session. Reload before saving.'; end if;
 end loop;
 for item in select key,value from jsonb_each_text(changes) loop
  select * into r from public.admin_fields where content_key=item.key and page=page_name;
  if not found or item.value is null or length(item.value)>8000 then raise exception 'Invalid content field'; end if;
  if r.field_type='url' and item.value !~* '^https://[^[:space:]]+$' then raise exception 'Links must use https://'; end if;
  if r.field_type='email' and item.value !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Enter a valid email'; end if;
  update public.site_content set content_value=item.value where content_key=item.key;
 end loop;
 if photo is not null and photo<>'null'::jsonb then
  select * into p from public.site_media where media_key=photo->>'key' and page=page_name for update;
  if not found or p.version is distinct from (photo->>'version')::integer then raise exception 'Portrait changed. Reload before saving.'; end if;
  if not exists(select 1 from storage.objects where bucket_id='site-media' and name=photo->>'path') then raise exception 'Portrait upload missing'; end if;
  update public.site_media set object_path=photo->>'path',width=(photo->>'width')::integer,height=(photo->>'height')::integer where media_key=p.media_key;
 end if;
end $$;
revoke all on function public.save_admin_page(text,jsonb,jsonb,jsonb) from public,anon;
grant execute on function public.save_admin_page(text,jsonb,jsonb,jsonb) to authenticated;
