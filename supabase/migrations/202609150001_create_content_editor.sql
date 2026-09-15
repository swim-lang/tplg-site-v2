-- TPLG content editor: public copy with allowlisted shared-account editing.
create table public.cms_editors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.site_content (
  content_key text primary key,
  page text not null,
  label text not null,
  content_value text not null,
  sort_order integer not null default 0,
  constraint site_content_key_format
    check (content_key ~ '^[a-z0-9]+([._-][a-z0-9]+)*$'),
  constraint site_content_value_size
    check (char_length(content_value) <= 8000)
);

alter table public.cms_editors enable row level security;
alter table public.site_content enable row level security;

revoke all on table public.cms_editors from anon, authenticated;
revoke all on table public.site_content from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on table public.cms_editors to authenticated;
grant select on table public.site_content to anon, authenticated;
grant update (content_value) on table public.site_content to authenticated;

create policy "Editors can read their own authorization"
on public.cms_editors
for select
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

create policy "Public can read site content"
on public.site_content
for select
to anon, authenticated
using (true);

create policy "Allowlisted editors can update existing content"
on public.site_content
for update
to authenticated
using (
  exists (
    select 1
    from public.cms_editors editor
    where editor.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.cms_editors editor
    where editor.user_id = (select auth.uid())
  )
);

insert into public.site_content (content_key, page, label, content_value, sort_order)
values
  ('people.heading.main', 'People', 'Heading', 'Experienced political counsel,', 0),
  ('people.heading.emphasis', 'People', 'Heading emphasis', 'directly engaged.', 1),
  ('people.lede', 'People', 'Introduction', 'Clients work with people who know their organizations, understand their priorities and are accessible when decisions need to be made.', 2),
  ('people.nicholas.name', 'Nicholas Sanders', 'Name', 'Nicholas Sanders', 3),
  ('people.nicholas.role', 'Nicholas Sanders', 'Role', 'Founding Partner', 4),
  ('people.nicholas.intro', 'Nicholas Sanders', 'Introduction', 'Nick advises candidates, public officials, political committees, ballot measure campaigns, nonprofit organizations and political professionals on campaigns, elections, advocacy, lobbying and governmental ethics.', 5),
  ('people.nicholas.bio.1', 'Nicholas Sanders', 'Biography, paragraph 1', 'Nick serves as general counsel to campaigns and political organizations and advises clients throughout the lifecycle of political activity, from formation, fundraising and campaign communications to ballot access, regulatory compliance and enforcement. He has drafted dozens of ballot measures and counseled candidates and public officials throughout California.', 6),
  ('people.nicholas.bio.2', 'Nicholas Sanders', 'Biography, paragraph 2', 'He also maintains an active election law and litigation practice, including candidate ballot access, ballot designations, candidate statements and challenges to ballot materials.', 7),
  ('people.nicholas.bio.3', 'Nicholas Sanders', 'Biography, paragraph 3', 'Nick brings more than 15 years of political law experience, including service at the California Fair Political Practices Commission and the Federal Election Commission.', 8),
  ('people.nicholas.education', 'Nicholas Sanders', 'Education', 'University of California, Davis School of Law, J.D., 2015
University of California, Davis, B.A., 2008', 9),
  ('people.nicholas.admissions', 'Nicholas Sanders', 'Admissions', 'California', 10),
  ('people.nicholas.email', 'Nicholas Sanders', 'Email', 'nicholas@tpl.group', 11),
  ('people.tracey.name', 'Tracey Wigglesworth', 'Name', 'Tracey Frazier Wigglesworth', 12),
  ('people.tracey.role', 'Tracey Wigglesworth', 'Role', 'Founding Partner', 13),
  ('people.tracey.intro', 'Tracey Wigglesworth', 'Introduction', 'Tracey helps clients navigate the rules governing political activity, issue advocacy, campaign finance compliance, lobbying and governmental ethics in California and nationwide.', 14),
  ('people.tracey.bio.1', 'Tracey Wigglesworth', 'Biography, paragraph 1', 'Tracey counsels sophisticated nonprofit and corporate clients on structuring political and issue advocacy programs, multijurisdictional engagement and the compliance implications of operating across organizational, regulatory and geographic lines. She also represents clients in sensitive audits, investigations and enforcement matters.', 15),
  ('people.tracey.bio.2', 'Tracey Wigglesworth', 'Biography, paragraph 2', 'Her practice extends to emerging issues at the intersection of law, politics and technology, including applying election, campaign finance and disclosure laws to new products, business models and methods of political engagement.', 16),
  ('people.tracey.bio.3', 'Tracey Wigglesworth', 'Biography, paragraph 3', 'Before co-founding TPLG, Tracey helped build and oversee one of the country’s largest nonfederal campaign finance compliance programs; advised Fortune 100 corporations on 50-state engagement; and investigated, prosecuted, negotiated and resolved more than 1,700 matters involving alleged campaign finance, lobbying and government ethics violations.', 17),
  ('people.tracey.education', 'Tracey Wigglesworth', 'Education', 'University of the Pacific, McGeorge School of Law, J.D., 2015; Certificate in Public Law and Policy
Loyola Marymount University, B.B.A., 2008', 18),
  ('people.tracey.admissions', 'Tracey Wigglesworth', 'Admissions', 'California', 19),
  ('people.tracey.email', 'Tracey Wigglesworth', 'Email', 'tracey@tpl.group', 20),
  ('people.emma.name', 'Emma Olson Sharkey', 'Name', 'Emma Olson Sharkey', 21),
  ('people.emma.role', 'Emma Olson Sharkey', 'Role', 'Partner', 22),
  ('people.emma.intro', 'Emma Olson Sharkey', 'Introduction', 'Emma is a nationally recognized ballot measure and nonprofit tax lawyer who advises clients on campaign finance, tax and election laws governing political and issue advocacy nationwide.', 23),
  ('people.emma.bio.1', 'Emma Olson Sharkey', 'Biography, paragraph 1', 'Emma has served as outside counsel to ballot measure efforts in more than 15 states, advising clients from campaign formation and qualification through post-election proceedings. She counsels campaigns, defends clients before state regulatory agencies and advises on ballot measure litigation strategy.', 24),
  ('people.emma.bio.2', 'Emma Olson Sharkey', 'Biography, paragraph 2', 'She also serves as outside counsel to nonprofit organizations and political committees, helping clients structure and conduct political and issue advocacy consistent with federal tax law and state and federal campaign finance requirements.', 25),
  ('people.emma.bio.3', 'Emma Olson Sharkey', 'Biography, paragraph 3', 'Her work and commentary have appeared in or been cited by The New York Times, The Washington Post, NBC News, TIME, The Hill, Slate, CBS News Radio and Democracy Docket.', 26),
  ('people.emma.education', 'Emma Olson Sharkey', 'Education', 'Northwestern Law School, J.D., 2015
University of Minnesota, B.A., 2008', 27),
  ('people.emma.admissions', 'Emma Olson Sharkey', 'Admissions', 'District of Columbia
Illinois', 28),
  ('people.emma.email', 'Emma Olson Sharkey', 'Email', 'emma@tpl.group', 29),
  ('people.kristen.name', 'Kristen Lippstreu', 'Name', 'Kristen Lippstreu', 30),
  ('people.kristen.role', 'Kristen Lippstreu', 'Role', 'Director, Political Compliance', 31),
  ('people.kristen.intro', 'Kristen Lippstreu', 'Introduction', 'Kristen works with clients to build and manage sophisticated campaign finance, lobbying and political compliance programs across federal, state and local jurisdictions.', 32),
  ('people.kristen.bio.1', 'Kristen Lippstreu', 'Biography, paragraph 1', 'Kristen brings more than a decade of experience navigating complex reporting regimes, with particular depth in California political law and multijurisdictional compliance. Her experience spans PAC administration, major ballot measure campaigns and institution-wide political compliance.', 33),
  ('people.kristen.bio.2', 'Kristen Lippstreu', 'Biography, paragraph 2', 'She develops systems and processes that allow highly regulated organizations to engage in political activity at scale, translating legal requirements into practical clearance procedures, reporting systems and internal controls.', 34),
  ('people.kristen.bio.3', 'Kristen Lippstreu', 'Biography, paragraph 3', 'Kristen’s combination of technical expertise, operational experience and practical judgment helps clients treat political compliance as an integrated part of a broader engagement program.', 35),
  ('people.kristen.education', 'Kristen Lippstreu', 'Education', 'University of Oregon, B.A., 2012', 36),
  ('people.kristen.email', 'Kristen Lippstreu', 'Email', 'kristen@tpl.group', 37),
  ('why.heading.main', 'Why TPLG', 'Heading', 'Political law is not one of our practice areas.', 38),
  ('why.heading.emphasis', 'Why TPLG', 'Heading emphasis', 'It is our practice.', 39),
  ('why.body.1', 'Why TPLG', 'Paragraph 1', 'The Political Law Group is a national political law firm built to counsel clients operating at the intersection of law, politics and public policy. Our lawyers bring decades of experience advising candidates, public officials, ballot measure campaigns, political committees, nonprofit and advocacy organizations, corporations and major donors.', 40),
  ('why.body.2', 'Why TPLG', 'Paragraph 2', 'Political matters rarely present purely legal questions. They implicate larger strategic decisions that affect communications, fundraising, coalition-building and organizational priorities. We identify and contextualize risk, then provide clear, practical advice that allows clients to make informed decisions.', 41),
  ('why.body.3', 'Why TPLG', 'Paragraph 3', 'Our experience on both sides of the regulatory process helps us understand how regulators think, where scrutiny is likely to arise and how decisions made in real time may be viewed later.', 42),
  ('practice.campaign-finance.name', 'Practice Areas', 'Campaign Finance name', 'Campaign Finance', 43),
  ('practice.campaign-finance.description', 'Practice Areas', 'Campaign Finance description', 'Formation, fundraising, communications, coordination, disclosure and ongoing compliance.', 44),
  ('practice.elections.name', 'Practice Areas', 'Elections name', 'Elections', 45),
  ('practice.elections.description', 'Practice Areas', 'Elections description', 'Ballot access, ballot measures, candidate materials, disputes and political litigation.', 46),
  ('practice.advocacy.name', 'Practice Areas', 'Advocacy name', 'Advocacy', 47),
  ('practice.advocacy.description', 'Practice Areas', 'Advocacy description', 'Political and issue advocacy programs structured to operate confidently across jurisdictions.', 48),
  ('practice.nonprofits.name', 'Practice Areas', 'Nonprofits name', 'Nonprofits', 49),
  ('practice.nonprofits.description', 'Practice Areas', 'Nonprofits description', 'Tax, campaign finance and election-law guidance for nonprofit political and issue advocacy.', 50),
  ('practice.ethics.name', 'Practice Areas', 'Ethics name', 'Ethics', 51),
  ('practice.ethics.description', 'Practice Areas', 'Ethics description', 'Lobbying, governmental ethics and disclosure guidance for public and private actors.', 52),
  ('practice.enforcement.name', 'Practice Areas', 'Enforcement name', 'Enforcement', 53),
  ('practice.enforcement.description', 'Practice Areas', 'Enforcement description', 'Strategic representation in audits, investigations and agency enforcement matters.', 54),
  ('offices.heading.main', 'Offices', 'Heading', 'Two coasts.', 55),
  ('offices.heading.emphasis', 'Offices', 'Heading emphasis', 'One national practice.', 56),
  ('offices.lede', 'Offices', 'Location summary', 'Sacramento, California · Washington, D.C.', 57),
  ('offices.contact.label', 'Offices', 'Contact prompt', 'Start a conversation.', 58),
  ('offices.contact.email', 'Offices', 'Contact email', 'info@tpl.group', 59),
  ('offices.sacramento.city', 'Offices', 'Sacramento city', 'Sacramento', 60),
  ('offices.sacramento.region', 'Offices', 'Sacramento region', 'California', 61),
  ('offices.washington.city', 'Offices', 'Washington city', 'Washington', 62),
  ('offices.washington.region', 'Offices', 'Washington region', 'District of Columbia', 63),
  ('global.footer.tagline', 'Global', 'Footer tagline', 'Political law counsel nationwide.', 64);
