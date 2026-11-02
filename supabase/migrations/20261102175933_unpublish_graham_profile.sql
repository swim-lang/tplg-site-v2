delete from public.site_content
where content_key in (
  'people.graham.intro',
  'people.graham.bio.1',
  'people.graham.bio.2',
  'people.graham.bio.3',
  'people.graham.education',
  'people.graham.admissions',
  'people.graham.email'
);
