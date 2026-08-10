export const LEGAL_ENTITY = 'Lux Industries Inc.'
export const CONTACT_EMAIL = 'hi@lux.tel'

export const contactHref = (subject: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`

/*
  No partner is named on this site. Who carries a leg of the network, who files
  spectrum, whose platform sits behind a wire — that is implementation, and the
  product is Lux. The `partners` list and the section that rendered it are DELETED
  rather than emptied: an empty list is an invitation to fill it, and the reason
  this one is gone is a policy about the surface, not a gap in the data.
*/
