/**
 * Who Lux is, and the numbers a customer is entitled to check.
 *
 * Every figure here is one somebody can hold us to. A statistic that cannot be
 * disputed is a statistic nobody believes, so this file carries no round numbers
 * that were chosen because they sounded large.
 */

export const COMPANY = {
  legalName: 'Lux Industries Inc',
  brand: 'Lux',
  site: 'lux.tel',
  tagline: 'Communications, connectivity and agentic AI, as one service.',
  /**
   * The positioning, in one paragraph, for a reader who will decide in ten seconds
   * whether to keep reading.
   */
  lede:
    'Lux brings communications, connectivity and intelligent automation into one platform — one account, one bill, one team behind it. From a phone number to a remote site to an AI agent that can answer, act and operate on your behalf.',
  contact: {
    /* One address. The domain's MX is Google Workspace and hi@ is what it
       receives on; a page full of role addresses that bounce is worse than one
       that works. Subject lines route it — see `contactHref` in site.ts. */
    general: 'hi@lux.tel',
  },
} as const

/**
 * What the network can do, stated as capability rather than as a number.
 *
 * Deliberately not statistics. Coverage counts, latency figures and service bands
 * are the numbers a prospect will hold us to in a contract, and none of them are
 * ours to publish until someone who owns them signs them off. A qualitative claim
 * that is true beats a precise one that was invented — see the content rules in
 * LLM.md, which this file exists to obey rather than to work around.
 */
export interface Capability {
  readonly headline: string
  readonly note: string
}

export const CAPABILITIES: readonly Capability[] = [
  {
    headline: 'Internet anywhere it has to be',
    note: 'Fixed, wireless and satellite for offices, remote sites and mobile operations. We choose the connection that fits the location, and pair it with a second one where the link cannot fail.',
  },
  {
    headline: 'Devices that stay online as they move',
    note: 'SIM and eSIM for fleets, equipment and products deployed across regions — a single deployment instead of a carrier relationship in every market you enter.',
  },
  {
    headline: 'Phone numbers for people and agents',
    note: 'Local, national, toll-free and international numbers with calling, routing and messaging behind them. Give one to a team, or give it to an agent.',
  },
  {
    headline: 'AI that does the next step',
    note: 'Agents that answer, look up the account, update the system, trigger the workflow and escalate when they should — over voice, messaging, web and API.',
  },
]


export interface Layer {
  readonly n: string
  readonly name: string
  readonly claim: string
  readonly detail: string
}

/**
 * The stack, bottom up. It is written this way because the argument only works in
 * this order: owning the fibre is what makes the routing deterministic, which is
 * what makes the edge inference worth co-locating, which is what makes a voice
 * agent answer inside a human turn.
 */
export const STACK: readonly Layer[] = [
  {
    n: '01',
    name: 'Internet',
    claim: 'Connectivity for places, not just buildings.',
    detail:
      'Offices, remote sites, infrastructure and mobile operations, including the places conventional networks do not reach. Fixed, wireless, satellite and redundant — we choose the connection that fits the location rather than selling you the one we happen to carry.',
  },
  {
    n: '02',
    name: 'Cellular',
    claim: 'For the things that move.',
    detail:
      'SIM and eSIM for fleets, equipment, sensors, backup links and products shipped across borders. One deployment covers the countries you operate in, instead of a separate carrier relationship in each of them.',
  },
  {
    n: '03',
    name: 'Voice',
    claim: 'Phone infrastructure without building a phone company.',
    detail:
      'Numbers, calling, routing, SIP and programmable voice — the machinery behind a modern communications product. Point it at your people, or hand the number to an agent.',
  },
  {
    n: '04',
    name: 'Messaging',
    claim: 'Conversations your software can hold.',
    detail:
      'Send alerts, receive replies, verify a user, run a two-way thread. SMS, MMS and the delivery infrastructure underneath, on the same platform as everything else you buy here.',
  },
  {
    n: '05',
    name: 'AI agents',
    claim: 'AI that can act, not only answer.',
    detail:
      'Agents that talk, text, call your APIs, use tools and finish a task: qualify the lead, book the appointment, update the record, raise the ticket, escalate to a person when it matters. Reachable over voice, messaging, web and API.',
  },
  {
    n: '06',
    name: 'Network',
    claim: 'The layer holding it together.',
    detail:
      'Private networking, VPN, routing, failover and multi-network deployments, designed around what has to stay online rather than around one provider\u2019s footprint — and carried with post-quantum key exchange, so traffic captured today is not readable later.',
  },
]


export interface Differentiator {
  readonly claim: string
  readonly detail: string
}

/**
 * What is actually different, stated as things that are true of us and not of a
 * provider assembled from other people's networks. No competitor is named: the
 * claims are checkable on their own terms.
 */
export const DIFFERENTIATORS: readonly Differentiator[] = [
  {
    claim: 'One account',
    detail: 'Every part of it inside a single commercial relationship, instead of five renewals on five calendars.',
  },
  {
    claim: 'One platform',
    detail: 'Connectivity, communications and AI built to work together rather than integrated by you after the fact.',
  },
  {
    claim: 'One bill',
    detail: 'Infrastructure without a pile of separate invoices nobody can reconcile against a single call.',
  },
  {
    claim: 'One API',
    detail: 'Build across services without rebuilding the integration each time you add one.',
  },
  {
    claim: 'One team to call',
    detail: 'When something breaks you start with us, and we work out the rest. That is the part you are actually buying.',
  },
]

