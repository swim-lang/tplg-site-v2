import {
  CONTACT,
  GLOBAL,
  INSIGHTS,
  INSIGHTS_INTRO,
  NON_ATTORNEY_NOTE,
  PEOPLE,
  PRACTICES,
  WHY_TPLG
} from "./site-data.js";

const text = (key, label, fallback) => ({ key, label, type: "text", fallback });
const textarea = (key, label, fallback) => ({ key, label, type: "textarea", fallback });
const email = (key, label, fallback) => ({ key, label, type: "email", fallback });

const peopleGroups = PEOPLE.map((person) => ({
  page: person.name,
  path: `/people/${person.slug}/`,
  fields: [
    text(`people.${person.key}.name`, "Name", person.name),
    text(`people.${person.key}.role`, "Role", person.role),
    textarea(`people.${person.key}.intro`, "Introduction", person.intro),
    ...person.biography.map((paragraph, index) =>
      textarea(`people.${person.key}.bio.${index + 1}`, `Biography, paragraph ${index + 1}`, paragraph)
    ),
    textarea(`people.${person.key}.education`, "Education", person.education.join("\n")),
    ...(person.admissions.length
      ? [textarea(`people.${person.key}.admissions`, "Admissions", person.admissions.join("\n"))]
      : []),
    email(`people.${person.key}.email`, "Email", person.email)
  ]
}));

const practiceGroups = PRACTICES.map((practice) => ({
  page: `${practice.name} details`,
  path: `/practice/${practice.slug}/`,
  fields: practice.body.map((paragraph, index) =>
      textarea(`practice.${practice.key}.body.${index + 1}`, `Paragraph ${index + 1}`, paragraph)
    )
}));

const insightFields = INSIGHTS.flatMap((article) => [
  textarea(`insights.${article.key}.title`, `${article.publication}: title`, article.title),
  text(`insights.${article.key}.publication`, `${article.publication}: publication`, article.publication),
  text(`insights.${article.key}.date`, `${article.publication}: date`, article.date),
  text(`insights.${article.key}.credit`, `${article.publication}: credit`, article.credit)
]);

export const CONTENT_FIELDS = [
  {
    page: "People",
    path: "/people/",
    fields: [
      text("people.heading.main", "Heading", "Experienced political counsel,"),
      text("people.heading.emphasis", "Heading emphasis", "directly engaged."),
      textarea(
        "people.lede",
        "Introduction",
        "Clients work with people who know their organizations, understand their priorities and are accessible when decisions need to be made."
      ),
      text("people.nonattorney.note", "Non-attorney note", NON_ATTORNEY_NOTE)
    ]
  },
  ...peopleGroups,
  {
    page: "Firm",
    path: "/firm/",
    fields: [
      textarea("why.heading.main", "Heading", WHY_TPLG.headingMain),
      text("why.heading.emphasis", "Heading emphasis", WHY_TPLG.headingEmphasis),
      ...WHY_TPLG.body.map((paragraph, index) =>
        textarea(`why.body.${index + 1}`, `Paragraph ${index + 1}`, paragraph)
      )
    ]
  },
  {
    page: "Practice",
    path: "/practice/",
    fields: PRACTICES.flatMap((practice) => [
      text(`practice.${practice.key}.name`, `${practice.name}: name`, practice.name),
      textarea(`practice.${practice.key}.description`, `${practice.name}: summary`, practice.description)
    ])
  },
  ...practiceGroups,
  {
    page: "Insights",
    path: "/insights/",
    fields: [
      text("insights.heading.main", "Heading", INSIGHTS_INTRO.headingMain),
      text("insights.heading.emphasis", "Heading emphasis", INSIGHTS_INTRO.headingEmphasis),
      textarea("insights.lede", "Introduction", INSIGHTS_INTRO.lede),
      ...insightFields
    ]
  },
  {
    page: "Contact",
    path: "/contact/",
    fields: [
      text("contact.heading.main", "Heading", CONTACT.headingMain),
      text("contact.heading.emphasis", "Heading emphasis", CONTACT.headingEmphasis),
      text("contact.lede", "Introduction", CONTACT.lede),
      text("contact.address.street", "Street address", CONTACT.addressStreet),
      text("contact.address.locality", "City, state and ZIP", CONTACT.addressLocality),
      email("contact.email", "Email", CONTACT.email),
      text("contact.phone", "Phone", CONTACT.phone)
    ]
  },
  {
    page: "Global",
    path: "/",
    fields: [
      text("global.footer.tagline", "Footer tagline", GLOBAL.footerTagline)
    ]
  }
];

export const ALL_FIELDS = CONTENT_FIELDS.flatMap((group) => group.fields);
