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
  tagline: 'Communications infrastructure, owned end to end.',
  /**
   * The positioning, in one paragraph, for a reader who will decide in ten seconds
   * whether to keep reading.
   */
  lede:
    'Lux owns the layers most providers rent: the fibre, the interconnect, the spectrum, the orbital capacity and the compute at the edge. A call, a message, a SIM and a satellite terminal are provisioned from one API, billed on one invoice and answered by one support desk — because underneath they are one network.',
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
    headline: 'One wireless profile, many networks',
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
    claim: 'You cannot tune what you rent.',
    detail:
      'Lux runs its own backbone and interconnects directly with the major networks and carriers. Routing is a decision we make rather than a path we are given, which is the whole reason the layers above are predictable.',
  },
  {
    n: '02',
    name: 'Orbit',
    claim: 'Coverage where the ground network ends.',
    detail:
      'Low-earth-orbit capacity terminates into the same backbone at the ground station. An orbital site is a site on the Lux network — not a third-party link we resell and cannot see inside.',
  },
  {
    n: '03',
    name: 'Spectrum and access',
    claim: 'One identity across every access network.',
    detail:
      'SIM, eSIM, private wireless and fixed access resolve to one subscriber identity, so a device that moves between a factory floor, a public network and an orbital link does not change who it is.',
  },
  {
    n: '04',
    name: 'Carrier services',
    claim: 'Voice and messaging without a wholesale middle.',
    detail:
      'Numbers, voice, SIP and messaging are delivered on our own interconnect. When quality degrades, it is ours to fix — not a ticket we forward and wait on.',
  },
  {
    n: '05',
    name: 'Edge compute',
    claim: 'The model runs where the call lands.',
    detail:
      'GPUs and application compute sit in the same facilities as the media. A voice agent’s round trip is a hop inside a building rather than a journey across a continent.',
  },
  {
    n: '06',
    name: 'Control plane',
    claim: 'One API for all of it.',
    detail:
      'Numbers, SIMs, terminals, trunks, agents and functions are provisioned through one API with one identity model, one audit trail and one bill. Configuration is data, not a ticket queue.',
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
    claim: 'We own the telephony stack',
    detail:
      'Numbers and voice ride our own interconnect. A quality problem is a change we make, not an escalation we file with a wholesaler.',
  },
  {
    claim: 'Terrestrial and orbital are one network',
    detail:
      'Satellite capacity joins the backbone at the ground station. A remote site appears in the same console, under the same routing policy, as a fibre site.',
  },
  {
    claim: 'Compute sits with the media',
    detail:
      'Inference runs in the facilities the calls are anchored in. That is a physical fact about latency, and it is not something an API wrapper can reproduce.',
  },
  {
    claim: 'Compliance runs before execution',
    detail:
      'Campaign registration, numbering eligibility and jurisdiction checks are enforced when a request is made — so a non-compliant send fails immediately instead of being rejected downstream at cost.',
  },
  {
    claim: 'Data stays in the region it was made in',
    detail:
      'Media anchoring, storage and inference are pinned per region, and the pinning is verifiable rather than promised.',
  },
]
