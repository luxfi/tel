/**
 * The published rate card and the enterprise plan. The pricing page and the console
 * both read from here, so a rate is changed in one place.
 *
 * United States rates. Other countries are quoted on the same card; a volume
 * commitment lowers every unit rate on it.
 */

export interface Rate {
  what: string
  price: string
  unit: string
}

export interface Group {
  name: string
  rates: Rate[]
}

export const RATES: Group[] = [
  {
    name: 'Cellular',
    rates: [
      { what: 'eSIM profile', price: '$0.77', unit: 'one time' },
      { what: 'Physical SIM', price: '$1.10', unit: 'one time' },
      { what: 'Active SIM', price: '$2.20', unit: 'per month, plus data' },
      { what: 'Data, 5 GB and over', price: '$14.50', unit: 'per GB, tier-one countries' },
      { what: 'Data, 2 to 5 GB', price: '$17.00', unit: 'per GB, tier-one countries' },
      { what: 'Private wireless gateway', price: '$110', unit: 'per month, plus $0.33–$0.66 per SIM' },
    ],
  },
  {
    name: 'Numbers',
    rates: [
      { what: 'Local or toll-free number', price: '$1.10', unit: 'per month; $0.28 at 5,000+' },
      { what: 'SMS on a number', price: '$0.11', unit: 'per month' },
      { what: 'E-911 registration', price: '$1.65', unit: 'per number, per month' },
      { what: 'Number lookup', price: '$0.0017', unit: 'per query' },
    ],
  },
  {
    name: 'Voice',
    rates: [
      { what: 'Outbound', price: '$0.0055', unit: 'per minute' },
      { what: 'Inbound', price: '$0.0036', unit: 'per minute' },
      { what: 'Toll-free inbound', price: '$0.017', unit: 'per minute' },
      { what: 'Inbound channel', price: '$13.50', unit: 'per month; $8.80 at 250+' },
      { what: 'Programmable voice', price: '$0.0022', unit: 'per minute' },
      { what: 'Recording', price: '$0.0022', unit: 'per minute' },
    ],
  },
  {
    name: 'Messaging and identity',
    rates: [
      { what: 'SMS', price: '$0.0044', unit: 'per part, plus carrier fee' },
      { what: 'MMS', price: '$0.017', unit: 'per part, plus carrier fee' },
      { what: 'Verification', price: '$0.033', unit: 'per successful check' },
      { what: 'Speech to text', price: '$0.0033', unit: 'per minute' },
    ],
  },
]

export const ENTERPRISE = {
  name: 'Enterprise plan',
  price: 'From $9,999',
  per: 'per month',
  note: 'Usage bills on the rate card on top. The plan buys the people, the service level and the dedicated infrastructure.',
  includes: [
    { heading: '24/7 engineering support', body: 'A named account manager, priority escalation and a network operations desk.' },
    { heading: '99.999% availability', body: 'Written into the agreement, with service credits.' },
    { heading: 'Dedicated infrastructure', body: 'Dedicated IPs, private interconnect to your core and unlimited API rate limits.' },
    { heading: 'Your name on it', body: 'eSIM, numbers, voice and messaging under your brand.' },
    { heading: 'Agents on the desk', body: 'Voice and text agents on your support lines and subscriber tickets, in every language your markets speak.' },
    { heading: 'Certified infrastructure', body: 'Carried on infrastructure certified to SOC 2 Type II, ISO 27001, PCI DSS, HIPAA and GDPR.' },
  ],
}
