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
}

export interface Pillar {
  readonly slug: string
  readonly name: string
  readonly summary: string
  readonly primitives: readonly Primitive[]
}

export const PILLARS: readonly Pillar[] = [
  {
    slug: 'connectivity',
    name: 'Connectivity',
    summary:
      'Internet wherever it has to be — fixed, wireless, satellite, and the backup link behind it. We choose the connection that fits the location.',
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
          'Backhaul for mobile operators at sites where trenching fibre never pays back. The tower terminates into the Lux backbone and hands off at the operator’s core, so coverage extends without a civil works programme.',
        facts: [
          'Carrier hand-off at the operator core, not at a public exchange',
          'Latency budgets suitable for standard voice and data profiles',
          'Sites commission on the timescale of a delivery rather than a civil works programme',
          'Terrestrial and orbital transport under one SLA and one invoice',
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
      {
        slug: 'private-wireless',
        name: 'Private Wireless',
        blurb: 'Your own cellular network',
        status: 'live',
        detail:
          'A private LTE or 5G network for a site — port, mine, campus, factory floor — with the core hosted by Lux and the spectrum handled for you. Devices roam onto the public network at the gate without changing identity.',
        facts: [
          'Hosted core; the site runs radios, not a telco',
          'SIM identity shared with the public network, so a device keeps one identity as it roams',
          'Site-local breakout keeps machine traffic on the factory floor',
        ],
      },
    ],
  },
  {
    slug: 'cellular',
    name: 'Cellular',
    summary:
      'Connect devices almost anywhere. One deployment across the countries you operate in, instead of a carrier relationship in each of them.',
    primitives: [
      {
        slug: 'esim',
        name: 'eSIM',
        blurb: 'Provision without shipping plastic',
        status: 'live',
        detail:
          'Download a profile to a device already in the field. No logistics, no truck roll, no second SKU for a second country.',
        facts: [
          'Remote provisioning to consumer and industrial devices',
          'Consumer plans for one country or the world, installed from a QR code or in your app',
          'White-label for operators: your name on the profile, per-session usage records behind it',
          'Profiles swap network without swapping hardware',
          'Bulk issuance by API for a production line',
        ],
      },
      {
        slug: 'iot-sim',
        name: 'IoT SIM',
        blurb: 'Every network, same profile',
        status: 'live',
        detail:
          'A single SIM profile that attaches to whichever network is strongest, in any country, with a data plan that is pooled rather than per-device. Built for fleets that ship once and run for years.',
        facts: [
          'Coverage across the networks we hold agreements with, several per country',
          'Pooled data across the fleet — one device’s quiet month funds another’s busy one',
          'Industrial form factors including embedded MFF2 for sealed hardware',
          'Per-device policy, kill switch and usage alarms through the API',
        ],
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
    ],
  },
  {
    slug: 'numbers',
    name: 'Phone numbers',
    summary:
      'Numbers for people, applications and AI agents. Local, national, toll-free and international, provisioned by API.',
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
      },
    ],
  },
  {
    slug: 'voice',
    name: 'Voice',
    summary:
      'Make and receive calls from code, or behind the systems you already run.',
    primitives: [
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
    ],
  },
  {
    slug: 'messaging',
    name: 'Messaging',
    summary:
      'Send, receive and automate conversations — alerts, replies, verification and two-way threads.',
    primitives: [
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
    ],
  },
  {
    slug: 'agents',
    name: 'Agentic AI',
    summary:
      'Agents connected to your business: they talk, text, call your APIs, use tools, and finish the task.',
    primitives: [
      {
        slug: 'chat',
        name: 'Lux Chat',
        blurb: 'The agent, without writing anything',
        status: 'live',
        detail:
          'The same agents, reachable as a portal rather than as an API. Point one at your systems, give your team a login, and the work an agent can do is available to people who are never going to call an endpoint.',
        facts: [
          'Same agents and tools as the API surface',
          'Signed in with Lux ID, like every Lux property',
          'Hand off from chat to a call on the same context',
        ],
      },
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
    slug: 'network',
    name: 'Network',
    summary:
      'Connect locations, infrastructure and systems, arranged around what has to stay online.',
    primitives: [
      {
        slug: 'mesh',
        name: 'Private Mesh',
        blurb: 'A private network with no single operator',
        status: 'beta',
        detail:
          'A private network normally has a control plane, and whoever runs it can reroute you, log you, or be compelled to. This one is coordinated by a decentralised network instead, and the keys that gate it are held in threshold — no single party, Lux included, holds enough to decrypt a session or move a route. The signing schemes underneath are Lux\u2019s own: Corona, Pulsar and Magnetar.',
        facts: [
          'Threshold-held keys — no single holder, including us',
          'Route and policy changes are signed and auditable',
          'Post-quantum key exchange on every hop',
        ],
      },
      {
        slug: 'post-quantum',
        name: 'Post-Quantum Links',
        blurb: 'Encrypted against a decrypt that has not happened yet',
        status: 'live',
        detail:
          'Traffic captured today can be stored and decrypted later, once the machine to do it exists. That is not a future problem for anyone whose data still matters in a decade — card traffic, payment instructions, health records, legal process. Lux links carry hybrid key exchange: a classical algorithm and a lattice one together, so the session is no weaker than it is now and survives the arrival of the other machine.',
        facts: [
          'Hybrid key exchange — classical and lattice, not lattice alone',
          'Applies to site links, private networking and cross connects',
          'Federal guidance sets a 2030 target for post-quantum readiness',
        ],
      },
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
    ],
  },
  {
    slug: 'hardware',
    name: 'Hardware',
    summary:
      'The physical layer, for when software alone is not enough. Specified for the site, shipped configured, and already on your account when it arrives.',
    primitives: [
      {
        slug: 'terminals',
        name: 'Satellite Terminals',
        blurb: 'The dish, sized for the site',
        status: 'live',
        detail:
          'Terminals for fixed sites, vessels and vehicles, specified against the coverage and the throughput the location actually needs rather than against a catalogue page. They arrive provisioned to your account, so the link comes up when the installer points it rather than after a support call.',
        facts: [
          'Fixed, maritime and in-motion mounts',
          'Shipped configured and already attached to your account',
          'Spares and replacement handled as part of the service',
        ],
      },
      {
        slug: 'routers',
        name: 'Routers',
        blurb: 'Several ways online, one box',
        status: 'live',
        detail:
          'Edge routers that hold more than one path at once — fibre, wireless and orbital — and move traffic between them on policy rather than on a person noticing. This is what turns a second connection from a spare into failover.',
        facts: [
          'Multiple simultaneous paths with policy routing',
          'Fails over without dropping established sessions',
          'Managed from the same console as the links behind it',
        ],
      },
      {
        slug: 'gateways',
        name: 'Gateways',
        blurb: 'Industrial kit onto the network',
        status: 'live',
        detail:
          'Gateways for equipment that predates the internet and is not going to be replaced: serial, industrial protocols and sensor buses on one side, a managed connection on the other.',
        facts: [
          'Serial and industrial protocol support',
          'Cellular, wireless or orbital backhaul',
          'Provisioned with the SIM or terminal it ships beside',
        ],
      },
    ],
  },
  {
    slug: 'devices',
    name: 'Devices',
    summary:
      'The consumer end of the same network — a SIM anyone can buy, a handset built around it, and an operating system that treats an agent as part of the phone rather than as an app on it.',
    primitives: [
      {
        slug: 'sim',
        name: 'Lux SIM',
        blurb: 'One SIM, wherever you land',
        status: 'beta',
        detail:
          'The consumer end of the same wireless service the fleets run on: a profile that attaches to the strongest network in range wherever you land, without a roaming bill that arrives a month later.',
        facts: [
          'eSIM or physical, activated from the app',
          'Attaches to the strongest network in range, not to one carrier',
          'The same profile abroad as at home',
        ],
      },
      {
        slug: 'phone',
        name: 'Lux Phone',
        blurb: 'A handset that assumes the agent',
        status: 'soon',
        detail:
          'A handset built around the network rather than adapted to it: the SIM, the private mesh and the agent are part of the device, not applications installed onto it. In development.',
        facts: [
          'Lux SIM and private mesh built in',
          'The agent answers on the device, not only in the cloud',
          'In development — talk to us if you want one early',
        ],
      },
      {
        slug: 'os',
        name: 'Lux OS',
        blurb: 'The agent is part of the system',
        status: 'soon',
        detail:
          'An operating system where an agent is a first-class part of the system with access to the calls, the messages and the network underneath — rather than an app asking permission for each of them. In development.',
        facts: [
          'Agents hold system capabilities, not app permissions',
          'Runs on Lux Phone and on standard hardware',
          'In development',
        ],
      },
    ],
  },
  {
    slug: 'edge',
    name: 'Edge',
    summary:
      'Compute beside the media, so the work that follows a conversation happens where the conversation is.',
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
