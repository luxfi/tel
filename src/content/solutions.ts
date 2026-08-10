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
    slug: 'remote-operations',
    name: 'Remote operations',
    problem:
      'Mine sites, farms, energy infrastructure and construction sit past the end of the fibre. Crews still need voice, telemetry and video, and the site still needs to be reachable on a normal number.',
    answer:
      'Orbital broadband for the site, Lux numbers for the crew, and wireless failover so a cut link is an event rather than an outage. All of it on one bill, provisioned before the equipment ships.',
    uses: ['orbital-broadband', 'failover', 'numbers', 'private-wireless'],
  },
  {
    slug: 'fleets',
    name: 'Connected fleets and devices',
    problem:
      'A product that ships to forty countries cannot carry forty SIM contracts, and a device sealed at the factory cannot be opened to swap one.',
    answer:
      'One eSIM profile that attaches to the strongest network in any country, pooled data across the fleet, and remote provisioning so the profile changes without touching the hardware.',
    uses: ['esim', 'iot-sim', 'failover'],
  },
  {
    slug: 'contact',
    name: 'Contact centres and voice AI',
    problem:
      'Agents that pause before answering sound broken, and callers hang up. Most of that pause is network distance between the call and the model.',
    answer:
      'Voice agents that run on the edge the call is already anchored to, with transcription and speech in the same facility, escalating to a human on the same call.',
    uses: ['voice-agents', 'voice', 'transcription', 'branded-calling'],
  },
  {
    slug: 'operators',
    name: 'Mobile operators',
    problem:
      'Coverage gaps sit where a fibre build will never pay back, and subscribers judge a network by the places it does not work.',
    answer:
      'Orbital backhaul to the tower with hand-off at your core, plus direct-to-cell messaging for the areas past any tower at all.',
    uses: ['cell-backhaul', 'direct-to-cell', 'global-ip'],
  },
  {
    slug: 'regulated',
    name: 'Regulated industries',
    problem:
      'Financial services, healthcare and government need to prove where a recording was made, where it was stored, and who reached it.',
    answer:
      'Media anchored and stored per region with verifiable pinning, identity checked at the carrier layer, and privileged access individually attributable.',
    uses: ['verify', 'silent-verification', 'storage', 'lookup'],
  },
  {
    slug: 'response',
    name: 'Emergency response',
    problem:
      'The networks a response depends on are the ones the event has just taken down, and a deployment cannot wait on a provisioning queue.',
    answer:
      'Terminals that ship configured and come up inside an hour, on numbers and SIMs issued in advance and held ready.',
    uses: ['orbital-broadband', 'maritime-aviation', 'mobile-voice'],
  },
] as const
