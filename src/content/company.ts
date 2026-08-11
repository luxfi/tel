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
  tagline: 'Voice, messaging and connectivity as one service.',
  /**
   * The positioning, in one paragraph, for a reader who will decide in ten seconds
   * whether to keep reading.
   */
  lede:
    'Lux delivers voice, messaging, numbering, wireless and satellite connectivity as one service. A call, a message, a SIM and a satellite terminal are provisioned from one API, billed on one invoice and answered by one support desk — so the thing you integrate against is a network, not a procurement exercise.',
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
    headline: 'Numbers where you need them',
    note: 'Local, national, toll-free and short-code ranges in the countries we are licensed in, provisioned by API with the regulatory requirements surfaced before purchase.',
  },
  {
    headline: 'The strongest network, wherever it lands',
    note: 'A single SIM or eSIM profile attaches to the strongest available network, with data pooled across the fleet rather than stranded per device.',
  },
  {
    headline: 'Coverage past the last tower',
    note: 'Orbital capacity for sites terrestrial carriers will not quote, joining the Lux backbone at the ground station rather than the public internet.',
  },
  {
    headline: 'Inference beside the media',
    note: 'Models run in the facilities calls are anchored in, which is why a voice agent can answer inside a human turn.',
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
    name: 'Fibre and interconnect',
    claim: 'You set the path.',
    detail:
      'Traffic reaches the networks it has to reach through carrier-grade interconnect. What Lux adds is a single place to configure it, so the path a call takes is something you can reason about instead of something you discover.',
  },
  {
    n: '02',
    name: 'Orbit',
    claim: 'Coverage where the ground network ends.',
    detail:
      'Low-earth-orbit capacity for sites past the end of the line, provisioned and supported alongside everything else you buy from us rather than as a separate contract with a separate desk.',
  },
  {
    n: '03',
    name: 'Spectrum and access',
    claim: 'The device keeps its name.',
    detail:
      'SIM, eSIM, private wireless and fixed access resolve to one subscriber identity, so a device that moves between a factory floor, a public network and an orbital link does not change who it is.',
  },
  {
    n: '04',
    name: 'Carrier services',
    claim: 'You raise it. We carry it.',
    detail:
      'Numbers, voice, SIP and messaging come from us, not from four desks. When quality drops you raise it here, and we chase it — which is the part a customer actually feels.',
  },
  {
    n: '05',
    name: 'Edge compute',
    claim: 'Inference close to the call.',
    detail:
      'GPUs and application compute sit in the same facilities as the media. A voice agent’s round trip is a hop inside a building rather than a journey across a continent.',
  },
  {
    n: '06',
    name: 'Control plane',
    claim: 'Configuration is data.',
    detail:
      'Numbers, SIMs, terminals, trunks, agents and functions are declared, versioned and billed the same way. Configuration is data, not a ticket queue.',
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
    claim: 'We answer for the whole path',
    detail:
      'Numbers, voice, messaging, wireless and satellite arrive on the same contract, the same invoice, the same desk, instead of vendors pointing at each other',
  },
  {
    claim: 'Ground and orbit, same console',
    detail:
      'A remote site is provisioned, monitored and supported in the same place as a wired one, rather than in a second portal with a second login.',
  },
  {
    claim: 'Inference sits near the call',
    detail:
      'Models are served close to where calls are handled, so an agent answers inside a human turn rather than after one.',
  },
  {
    claim: 'Compliance runs before execution',
    detail:
      'Campaign registration, numbering eligibility and jurisdiction checks are enforced when a request is made — so a non-compliant send fails immediately instead of being rejected downstream at cost.',
  },
  {
    claim: 'Data stays in its region',
    detail:
      'Media, storage and inference are pinned per region, and which region is visible to you rather than asserted.',
  },
]
