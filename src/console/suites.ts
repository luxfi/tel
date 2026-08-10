import { PILLARS, type Primitive } from '@/content/catalog'

/**
 * The console's navigation, PROJECTED from the catalog.
 *
 * A console that lists different products from the site that sold them is how the
 * two drift, and the drift is always found by a customer. So the suites are a
 * grouping of pillars, not a second list of products — a primitive added to the
 * catalog appears in the console's nav on the same commit.
 *
 * The grouping differs from the marketing pillars on purpose. A buyer reads the
 * network bottom-up (what do you own?); a builder reads it by what they are about
 * to wire up, and voice and messaging are two jobs even though both ride the same
 * carrier interconnect.
 */
export interface Suite {
  readonly slug: string
  readonly name: string
  readonly items: readonly Primitive[]
}

const of = (...slugs: string[]): Primitive[] => {
  const all = PILLARS.flatMap((p) => p.primitives)
  return slugs.map((s) => {
    const found = all.find((p) => p.slug === s)
    // Loud rather than silent: a nav that quietly drops an entry is a nav that
    // stops matching the catalog and nobody notices until a customer asks.
    if (!found) throw new Error(`console suites: no primitive "${s}" in the catalog`)
    return found
  })
}

export const SUITES: readonly Suite[] = [
  { slug: 'ai', name: 'AI Suite', items: of('voice-agents', 'transcription', 'speech', 'inference', 'embeddings') },
  { slug: 'voice', name: 'Voice Suite', items: of('voice', 'sip', 'webrtc', 'mobile-voice') },
  { slug: 'messaging', name: 'Messaging Suite', items: of('sms', 'email', 'numbers') },
  {
    slug: 'connectivity',
    name: 'Connectivity Suite',
    items: of('orbital-broadband', 'direct-to-cell', 'maritime-aviation', 'cell-backhaul', 'iot-sim', 'esim', 'failover', 'private-wireless'),
  },
  {
    slug: 'other',
    name: 'Other Products',
    items: of('verify', 'silent-verification', 'lookup', 'branded-calling', 'deepfake-detection', 'global-ip', 'cloud-vpn', 'cross-connects', 'functions', 'storage', 'state'),
  },
]

/** The three a builder reaches for first, and the call each one starts with. */
export const EXPLORE = [
  { slug: 'sms', title: 'Messaging', blurb: 'Send and receive SMS or MMS from your own code.', action: 'Create profile' },
  { slug: 'voice', title: 'Voice', blurb: 'Make, receive and control calls globally.', action: 'Create application' },
  { slug: 'numbers', title: 'Numbers', blurb: 'Local, national and toll-free numbers, by API.', action: 'Buy numbers' },
] as const
