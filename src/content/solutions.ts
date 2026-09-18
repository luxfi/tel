/**
 * What the network is USED for. It lives here rather than in the page because the
 * header menu lists the same entries, and a menu keeping its own copy is a menu
 * that stops matching the page it links to.
 *
 * Each entry names a real operating problem and the primitives that answer it.
 * The links are the argument — a solution page that names no product is a brochure.
 */
export const SOLUTIONS = [
  {
    slug: 'app',
    name: 'An app that needs to call and text',
    problem:
      'Adding voice and messaging to a product means assembling a communications stack: numbers in each market, a carrier that will terminate your traffic, delivery infrastructure, and compliance in every country you send from.',
    answer:
      'Numbers, voice, messaging and AI on one key, so the feature ships instead of becoming a quarter of platform work.',
    uses: ['numbers', 'voice', 'sms', 'voice-agents'],
  },
  {
    slug: 'workforce',
    name: 'A business that needs an AI workforce',
    problem:
      'Calls go unanswered after hours, messages queue overnight, and the work that follows a conversation — the lookup, the update, the ticket — still waits for a person.',
    answer:
      'Agents that answer calls and messages, act inside your systems, and run continuously. They escalate to a person when the situation calls for it rather than when the script ends.',
    uses: ['voice-agents', 'transcription', 'speech', 'inference'],
  },
  {
    slug: 'fleet',
    name: 'A fleet operating across countries',
    problem:
      'Vehicles, devices and equipment cross borders, and each border has historically meant a new connectivity contract, a new SIM and a new invoice.',
    answer:
      'One eSIM deployment that attaches to the strongest network in range, with data pooled across the fleet rather than stranded per device.',
    uses: ['esim', 'iot-sim', 'failover'],
  },
  {
    slug: 'remote',
    name: 'A remote site with no fibre',
    problem:
      'Mines, farms, energy infrastructure and construction sit past the end of the line, and nobody will quote a build that never pays back.',
    answer:
      'Orbital capacity to the site, joined to the same network as everything else you run. Add cellular backup where the link matters enough never to drop.',
    uses: ['orbital-broadband', 'failover', 'private-wireless', 'numbers'],
  },
  {
    slug: 'phone-system',
    name: 'A company replacing its phone system',
    problem:
      'The phone system is a box in a cupboard, a contract nobody remembers signing, and a change request that takes a fortnight.',
    answer:
      'Numbers, calling, routing, messaging and automation on a programmable platform, where a change is a call to an API instead of a ticket.',
    uses: ['numbers', 'voice', 'sip', 'branded-calling'],
  },
  {
    slug: 'financial',
    name: 'ATMs, branches and financial networks',
    problem:
      'A cash machine on a forecourt, a branch on a high street and a trading desk all need a link that is up, attested and defensible to an auditor. The usual answer is a leased line nobody can move and a second one that shares the same duct.',
    answer:
      'Wireless and orbital paths that do not share a trench, failover that keeps the session rather than resetting it, and post-quantum key exchange on the link so captured traffic does not become readable later.',
    uses: ['post-quantum', 'failover', 'iot-sim', 'cloud-vpn'],
  },
  {
    slug: 'always-on',
    name: 'Operations that cannot go offline',
    problem:
      'Hospitals, ports, trading desks and emergency response cannot treat a failed network as an inconvenience, and a single provider is a single failure.',
    answer:
      'Several kinds of connectivity under one service, arranged so that one failed network does not become a failed operation.',
    uses: ['failover', 'orbital-broadband', 'cloud-vpn', 'global-ip'],
  },
  {
    slug: 'operator',
    name: 'A mobile operator selling eSIM under its own name',
    problem:
      'A brand with subscribers still needs profiles a handset will accept, roaming in every country its customers land in, and usage records good enough to bill and reward from. Each is a multi-year accreditation or a contract per carrier.',
    answer:
      'White-label eSIM for consumer handsets, at home and abroad, issued by API under your name. Usage comes back per subscriber per session, so the plan, the bill and the reward are all computed from the same record.',
    uses: ['esim', 'mobile-voice', 'numbers', 'sms'],
  },
  {
    slug: 'nation',
    name: 'A nation that runs the network on its land',
    problem:
      'A tribal nation holding a spectrum licence, or a country building national service, wants coverage on its land, service for its people when they leave it, emergency calling that reaches the right dispatcher, and subscriber data that stays under its own law.',
    answer:
      'Private wireless on the spectrum the nation holds, an eSIM that keeps working past the last tower, numbers and emergency calling for government and enterprise, and records held under keys the nation controls.',
    uses: ['private-wireless', 'esim', 'numbers', 'cell-backhaul', 'post-quantum'],
  },
] as const
