/**
 * Every primitive Lux sells, in one place.
 *
 * The navigation, the products index and each product page are all projections of
 * this list — so a primitive is added once and appears everywhere it should, and
 * there is no second list to fall out of step with the first.
 *
 * `status` is the honest field: `live` ships today, `beta` is in customer hands,
 * `soon` is announced and dated. A page that says everything is live is a page
 * nobody trusts twice.
 */

export type Status = 'live' | 'beta' | 'soon'

export interface Primitive {
  readonly slug: string
  readonly name: string
  /** One line, in the nav. What it is, not what it enables. */
  readonly blurb: string
  readonly status: Status
  /** The paragraph on its own page. */
  readonly detail: string
  /** What an engineer actually gets. Specifics, not adjectives. */
  readonly facts: readonly string[]
  /** The endpoint or interface it is reached through. */
  readonly api?: string
}

export interface Pillar {
  readonly slug: string
  readonly name: string
  readonly summary: string
  readonly primitives: readonly Primitive[]
}

export const PILLARS: readonly Pillar[] = [
  {
    slug: 'orbit',
    name: 'Orbit',
    summary:
      'Low-earth-orbit capacity, integrated with the terrestrial network rather than bolted beside it. One account, one bill, one support path, whether a site is on fibre or on a dish.',
    primitives: [
      {
        slug: 'orbital-broadband',
        name: 'Orbital Broadband',
        blurb: 'LEO capacity to any coordinate',
        status: 'live',
        detail:
          'Symmetric broadband to sites terrestrial carriers will not quote: mine heads, farms, construction, disaster zones, research stations. Provisioned from the same console as a number or a SIM, and routed onto the Lux backbone at the ground station rather than out to the public internet.',
        facts: [
          'Service to coordinates a terrestrial carrier will not quote, including sites with no road access',
          'Round trip to the nearest Lux point of presence suitable for interactive use, including voice',
          'Terminals ship configured — a site comes up without a truck roll or a network engineer',
          'Traffic joins the private backbone at the ground station — it does not transit the public internet to reach your cloud',
        ],
        api: 'POST /v1/orbit/terminals',
      },
      {
        slug: 'direct-to-cell',
        name: 'Direct to Cell',
        blurb: 'Coverage without a tower',
        status: 'beta',
        detail:
          'Messaging and voice to unmodified handsets outside terrestrial coverage. The phone in a pocket keeps working past the last tower — no dish, no app, no second device. Delivered against Lux numbers, so a device keeps its identity when it leaves the ground network.',
        facts: [
          'Standard LTE handsets, unmodified — no client software',
          'Messaging in service; voice in field trial',
          'The subscriber keeps one number across terrestrial and orbital coverage',
          'Session hand-off is the network’s problem, not the application’s',
        ],
      },
      {
        slug: 'maritime-aviation',
        name: 'Maritime & Aviation',
        blurb: 'Connectivity in motion',
        status: 'live',
        detail:
          'Stabilised terminals for vessels and aircraft, with capacity that follows the route rather than the port. Crew welfare, operational telemetry and passenger service ride the same link, separated by policy rather than by hardware.',
        facts: [
          'In-motion terminals rated to open ocean and commercial flight profiles',
          'Route-following capacity commitments rather than per-port contracts',
          'Operational and passenger traffic separated on the terminal, not by a second dish',
          'Per-vessel and per-tail reporting through the same API as every other site',
        ],
      },
      {
        slug: 'cell-backhaul',
        name: 'Cell Backhaul',
        blurb: 'Orbital transport for tower sites',
        status: 'live',
        detail:
          'Backhaul for mobile operators at sites where trenching fibre never pays back. Lux terminates the tower into its own backbone and hands off at the operator’s core, so coverage extends without a civil works programme.',
        facts: [
          'Carrier hand-off at the operator core, not at a public exchange',
          'Latency budgets suitable for standard voice and data profiles',
          'Sites commission on the timescale of a delivery rather than a civil works programme',
          'Terrestrial and orbital transport under one SLA and one invoice',
        ],
      },
    ],
  },
  {
    slug: 'network',
    name: 'Network',
    summary:
      'The physical layer, owned. Fibre, peering, points of presence and the wireless edge — the parts most providers rent and therefore cannot tune.',
    primitives: [
      {
        slug: 'global-ip',
        name: 'Global IP',
        blurb: 'Transit on the Lux backbone',
        status: 'live',
        detail:
          'IP transit that stays on the Lux backbone as far as the destination allows, with direct interconnect to the major networks. Deterministic routing, because the path is ours to choose.',
        facts: [
          'Direct interconnect at the major exchanges across three continents',
          'Anycast ingress with per-prefix routing policy under your control',
          'IPv4 and IPv6 at parity — no tunnelled second-class v6',
          'BGP communities exposed so you can steer your own traffic',
        ],
      },
      {
        slug: 'cloud-vpn',
        name: 'Cloud VPN',
        blurb: 'Private reach into any cloud',
        status: 'live',
        detail:
          'Encrypted private connectivity between your sites, your devices and your cloud tenancies, terminating inside the Lux network rather than on a rented appliance at the edge of it.',
        facts: [
          'Terminates on the backbone, so traffic never crosses the public internet',
          'Per-tenant key material, rotated on a schedule you set',
          'Routes and policy declared through the API, not a ticket',
        ],
      },
      {
        slug: 'cross-connects',
        name: 'Virtual Cross Connects',
        blurb: 'Private peering, provisioned by API',
        status: 'live',
        detail:
          'A private circuit to a cloud region, an exchange or another tenant, created by an API call instead of a cross-connect order and a data-centre visit.',
        facts: [
          'Provisioned in minutes; the physical patch already exists',
          'Bandwidth adjustable in place without re-provisioning',
          'Metered by the hour, so a migration window does not become a year contract',
        ],
      },
      {
        slug: 'private-wireless',
        name: 'Private Wireless',
        blurb: 'Your own cellular network',
        status: 'live',
        detail:
          'A private LTE or 5G network for a site — port, mine, campus, factory floor — with the core hosted by Lux and the spectrum handled for you. Devices roam onto the public network at the gate without changing identity.',
        facts: [
          'Hosted core; the site runs radios, not a telco',
          'SIM identity shared with the public network, so devices roam seamlessly',
          'Site-local breakout keeps machine traffic on the factory floor',
        ],
      },
    ],
  },
  {
    slug: 'wireless',
    name: 'Wireless',
    summary:
      'SIMs, eSIMs and mobile service on one profile that works across countries and across networks — including the orbital one.',
    primitives: [
      {
        slug: 'iot-sim',
        name: 'IoT SIM',
        blurb: 'One profile, every network',
        status: 'live',
        detail:
          'A single SIM profile that attaches to whichever network is strongest, in any country, with a data plan that is pooled rather than per-device. Built for fleets that ship once and run for years.',
        facts: [
          'Coverage across the networks we hold agreements with, several per country',
          'Pooled data across the fleet — one device’s quiet month funds another’s busy one',
          'Industrial form factors including embedded MFF2 for sealed hardware',
          'Per-device policy, kill switch and usage alarms through the API',
        ],
        api: 'POST /v1/sims',
      },
      {
        slug: 'esim',
        name: 'eSIM',
        blurb: 'Provision without shipping plastic',
        status: 'live',
        detail:
          'Download a profile to a device already in the field. No logistics, no truck roll, no second SKU for a second country.',
        facts: [
          'Remote provisioning to consumer and industrial devices',
          'Profiles swap network without swapping hardware',
          'Bulk issuance by API for a production line',
        ],
        api: 'POST /v1/esim/profiles',
      },
      {
        slug: 'mobile-voice',
        name: 'Mobile Voice',
        blurb: 'Cellular voice on your own numbers',
        status: 'live',
        detail:
          'Voice and messaging on Lux numbers over the cellular network, so a mobile device is reachable on the same identity as the desk line and the API.',
        facts: [
          'One number across mobile, desk and programmable voice',
          'Calls terminate on the Lux voice network, not a wholesale reseller path',
        ],
      },
      {
        slug: 'failover',
        name: 'Wireless Failover',
        blurb: 'The link that takes over',
        status: 'live',
        detail:
          'Automatic cellular — and, where it is deployed, orbital — failover when the primary circuit drops. The site keeps its address and its sessions; the transport underneath changes.',
        facts: [
          'Detection and cut-over fast enough that sessions survive it',
          'The public address is retained, so sessions and inbound routes survive',
          'Failover capacity billed on use, not on standby',
        ],
      },
    ],
  },
  {
    slug: 'communications',
    name: 'Communications',
    summary:
      'Numbers, voice and messaging, delivered on our own carrier network. The interconnect is ours, so quality is something we fix rather than escalate.',
    primitives: [
      {
        slug: 'numbers',
        name: 'Global Numbers',
        blurb: 'Local presence in the countries we are licensed in',
        status: 'live',
        detail:
          'Search, buy and provision local, national, toll-free and short-code numbers by API, with the regulatory paperwork handled in-line rather than by email.',
        facts: [
          'Local, national, toll-free and short-code ranges in the countries we are licensed in',
          'Regulatory address requirements surfaced in the API before purchase, not after',
          'Porting managed end to end with status you can poll',
        ],
        api: 'GET /v1/numbers/available',
      },
      {
        slug: 'voice',
        name: 'Voice API',
        blurb: 'Programmable calls',
        status: 'live',
        detail:
          'Place, receive, record, transcribe and branch calls from code. Media rides the Lux network end to end, which is why the audio arrives intact.',
        facts: [
          'Opus and G.711 with transcoding at the edge',
          'Call control over webhooks or a persistent socket',
          'Recording and live transcription as a call flag, not a second product',
        ],
        api: 'POST /v1/calls',
      },
      {
        slug: 'sip',
        name: 'SIP Trunking',
        blurb: 'Enterprise voice connectivity',
        status: 'live',
        detail:
          'Elastic SIP trunks with per-trunk policy, in-region media and failover routing to a second location that is already provisioned.',
        facts: [
          'Elastic capacity — no channel bundles to forecast',
          'Media anchored in-region for latency and for data residency',
          'Second-site failover configured up front, tested on demand',
        ],
      },
      {
        slug: 'sms',
        name: 'Messaging API',
        blurb: 'SMS, MMS and rich messaging',
        status: 'live',
        detail:
          'Two-way messaging on your own numbers and short codes, with campaign registration and carrier policy enforced before a message is spent rather than after it is rejected.',
        facts: [
          'Registration checked at send time — a non-compliant campaign fails fast and cheap',
          'Delivery receipts from the carrier, not inferred from a queue',
          'Rich messaging on capable handsets with automatic fallback to SMS',
        ],
        api: 'POST /v1/messages',
      },
      {
        slug: 'webrtc',
        name: 'WebRTC',
        blurb: 'Browser and app calling',
        status: 'live',
        detail:
          'Calls from a browser or a mobile app onto the same voice network as a phone number, with media relayed by Lux points of presence rather than by a public TURN service.',
        facts: [
          'SDKs for browser, iOS and Android',
          'Media relayed on the Lux network for consistent quality',
          'The same call control as a PSTN call — one API, both worlds',
        ],
      },
      {
        slug: 'email',
        name: 'Email API',
        blurb: 'Transactional delivery',
        status: 'live',
        detail:
          'Transactional email from dedicated addresses, with authentication configured at setup so the first send is deliverable rather than the hundredth.',
        facts: [
          'SPF, DKIM and DMARC configured at provisioning',
          'Dedicated addressing with reputation isolated per tenant',
          'Events streamed to the same webhook plane as voice and messaging',
        ],
      },
    ],
  },
  {
    slug: 'trust',
    name: 'Identity & Trust',
    summary:
      'The network knows things about a call and a number that an application cannot. These expose that knowledge — verification, provenance and fraud signals, sourced at the carrier layer.',
    primitives: [
      {
        slug: 'verify',
        name: 'Verify API',
        blurb: 'One-time codes, any channel',
        status: 'live',
        detail:
          'Delivers and checks a verification code over SMS, voice, or a silent network check, choosing the channel that will actually reach the handset. You call one endpoint; the routing is our problem.',
        facts: [
          'One endpoint across SMS, voice and silent verification',
          'Automatic fallback when a channel is blocked or undeliverable',
          'Attempt limits and expiry enforced server-side',
        ],
        api: 'POST /v1/verify',
      },
      {
        slug: 'silent-verification',
        name: 'Silent Verification',
        blurb: 'Proof of possession, no code',
        status: 'live',
        detail:
          'Confirms the handset holds the number by checking against the mobile network directly. Nothing is typed, nothing is intercepted, and there is no code for anyone to phish.',
        facts: [
          'Verifies over the cellular data path — no SMS to intercept',
          'Completes in under a second on a mobile network',
          'Falls back to a code automatically when the device is on Wi-Fi only',
        ],
      },
      {
        slug: 'lookup',
        name: 'Number Lookup',
        blurb: 'What the network knows',
        status: 'live',
        detail:
          'Carrier, line type, portability history and risk signals for any number, read from network data rather than a purchased list.',
        facts: [
          'Live carrier and line type, including recent porting',
          'Disposable and virtual number detection',
          'Risk signals derived from network behaviour, not from a static list',
        ],
        api: 'GET /v1/lookup/{number}',
      },
      {
        slug: 'branded-calling',
        name: 'Branded Calling',
        blurb: 'Your name on the handset',
        status: 'live',
        detail:
          'Your organisation name, logo and call reason displayed on the receiving handset, with the identity attested at the carrier layer so it cannot be spoofed downstream.',
        facts: [
          'Attested caller identity carried through interconnect',
          'Name, logo and call reason on supported handsets',
          'Answer rates measurable per campaign, in the same reporting as the calls',
        ],
      },
      {
        slug: 'deepfake-detection',
        name: 'Deepfake Detection',
        blurb: 'Synthetic voice, flagged live',
        status: 'beta',
        detail:
          'Scores live call audio for synthesis in the media path, before it reaches your agents. A voice that was generated is a fact about the call, and the network is where that fact is available first.',
        facts: [
          'Scored in the media path, not from a recording after the fact',
          'Result available to call control while the call is still up',
          'No audio leaves the region the call was anchored in',
        ],
      },
    ],
  },
  {
    slug: 'intelligence',
    name: 'Intelligence',
    summary:
      'Inference co-located with the network edge. When the model runs in the same facility the call is anchored in, the round trip is a hop rather than a journey.',
    primitives: [
      {
        slug: 'voice-agents',
        name: 'Voice Agents',
        blurb: 'Conversational agents on real calls',
        status: 'live',
        detail:
          'Agents that answer and place real calls, with transcription, reasoning and speech running at the edge the call is already anchored on. The turn latency is short because nothing leaves the building.',
        facts: [
          'Turn latency short enough to hold a conversation, because the model runs where the call is anchored',
          'Barge-in and turn detection handled in the media path',
          'Escalation to a human on the same call, with context carried across',
        ],
        api: 'POST /v1/agents',
      },
      {
        slug: 'transcription',
        name: 'Transcription',
        blurb: 'Speech to text, live or batch',
        status: 'live',
        detail:
          'Streaming and batch transcription, available as a flag on any call rather than as a separate pipeline you have to build.',
        facts: [
          'Broad language and dialect coverage, listed in the documentation',
          'Streaming partials during the call; final transcript on hang-up',
          'Diarisation and per-channel transcripts on recorded legs',
        ],
      },
      {
        slug: 'speech',
        name: 'Speech',
        blurb: 'Text to speech, and custom voices',
        status: 'live',
        detail:
          'Natural speech synthesis at conversational latency, including voices built to a brand from a consented recording session.',
        facts: [
          'First audio streams before the sentence is finished',
          'Custom voice construction from a consented session',
          'Consent and provenance recorded with the voice, and checkable',
        ],
      },
      {
        slug: 'inference',
        name: 'Inference',
        blurb: 'Models at the network edge',
        status: 'live',
        detail:
          'An OpenAI-compatible endpoint served from GPUs co-located with the network points of presence, so a model call from a voice agent is a local hop.',
        facts: [
          'OpenAI-compatible API — existing clients work unchanged',
          'GPUs co-located with the voice edge, in-region',
          'Per-region pinning for data residency commitments',
        ],
        api: 'POST /v1/chat/completions',
      },
      {
        slug: 'embeddings',
        name: 'Embeddings',
        blurb: 'Vectors, in-region',
        status: 'live',
        detail:
          'Embedding generation alongside inference, in the same region, so retrieval does not become the slow part of a live conversation.',
        facts: [
          'Batch and streaming generation',
          'Co-located with inference to keep retrieval inside the turn budget',
        ],
      },
    ],
  },
  {
    slug: 'edge',
    name: 'Edge',
    summary:
      'The small amount of compute and state a communications workload actually needs, run at the same points of presence as the traffic.',
    primitives: [
      {
        slug: 'functions',
        name: 'Functions',
        blurb: 'Code on the call path',
        status: 'live',
        detail:
          'Run a handler at the point of presence the call or message is on, without a round trip to your cloud. Webhook handlers stop being the slowest part of a call flow.',
        facts: [
          'Invoked in the media and messaging path, in-region',
          'Cold start fast enough to sit inside a call turn',
          'Deployed by API; no cluster to operate',
        ],
      },
      {
        slug: 'storage',
        name: 'Storage',
        blurb: 'Recordings and objects, where they were made',
        status: 'live',
        detail:
          'Object storage in the region the data originated, with S3-compatible access, so a recording made under one jurisdiction is not silently stored under another.',
        facts: [
          'S3-compatible; existing tooling works unchanged',
          'Region pinned at write, and provable afterwards',
          'Lifecycle and retention policy per bucket',
        ],
      },
      {
        slug: 'state',
        name: 'State',
        blurb: 'Key-value and SQL at the edge',
        status: 'live',
        detail:
          'A key-value store and a managed SQL database at the edge, for the session state a call flow needs while it is running.',
        facts: [
          'Key-value for session state, SQL for what must be queried',
          'Replicated within the region, not across a continent',
        ],
      },
    ],
  },
]

export const PRIMITIVES: readonly (Primitive & { pillar: Pillar })[] = PILLARS.flatMap((pillar) =>
  pillar.primitives.map((p) => ({ ...p, pillar })),
)

export function primitive(slug: string) {
  return PRIMITIVES.find((p) => p.slug === slug)
}

export const STATUS_LABEL: Readonly<Record<Status, string>> = {
  live: 'Available',
  beta: 'In field trial',
  soon: 'Announced',
}
