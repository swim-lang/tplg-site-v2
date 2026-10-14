-- Add the two client-approved coverage items to the existing content editor.
-- Article URLs remain code-managed in cms/site-data.js.
insert into public.site_content (content_key, page, label, content_value, sort_order)
values
  (
    'insights.la-voting-rights-election-disruption.title',
    'Insights',
    'Los Angeles Times: title',
    'L.A. voting rights groups mobilize to counter possible November election disruption',
    186
  ),
  (
    'insights.la-voting-rights-election-disruption.publication',
    'Insights',
    'Los Angeles Times: publication',
    'Los Angeles Times',
    187
  ),
  (
    'insights.la-voting-rights-election-disruption.date',
    'Insights',
    'Los Angeles Times: date',
    'September 27, 2026',
    188
  ),
  (
    'insights.la-voting-rights-election-disruption.credit',
    'Insights',
    'Los Angeles Times: credit',
    'Featuring Emma Olson Sharkey',
    189
  ),
  (
    'insights.becerra-steyer-legal-threats.title',
    'Insights',
    'The Sacramento Bee: title',
    'Becerra, Steyer trade legal threats over attack ad days before primary',
    190
  ),
  (
    'insights.becerra-steyer-legal-threats.publication',
    'Insights',
    'The Sacramento Bee: publication',
    'The Sacramento Bee',
    191
  ),
  (
    'insights.becerra-steyer-legal-threats.date',
    'Insights',
    'The Sacramento Bee: date',
    'May 31, 2026',
    192
  ),
  (
    'insights.becerra-steyer-legal-threats.credit',
    'Insights',
    'The Sacramento Bee: credit',
    'Featuring Nicholas Sanders, counsel to Xavier Becerra’s campaign',
    193
  )
on conflict (content_key) do nothing;
