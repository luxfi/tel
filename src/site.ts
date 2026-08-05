export const LEGAL_ENTITY = 'Lux Industries Inc.'
export const CONTACT_EMAIL = 'hi@lux.tel'

export const contactHref = (subject: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`

/*
  Partnerships stated on the site. Text only — we render no third-party marks.
  Add an entry only with explicit sign-off: a published partnership claim is
  easy to ship and hard to walk back.
*/
export const partners: { name: string; note: string }[] = [
  { name: 'ManSat', note: 'Satellite spectrum and filings, Isle of Man.' },
]
