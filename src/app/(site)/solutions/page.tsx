import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY } from '@/content/company'

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'What the Lux network is used for: remote operations, connected fleets, contact centres, mobile operators and regulated industries.',
}

/**
 * Each entry names a real operating problem and the primitives that answer it.
 * The links are the argument — a solution page that names no product is a brochure.
 */
const SOLUTIONS = [
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

export default function Solutions() {
  return (
    <>
      <section className="wrap pt-16 pb-10">
        <div className="eyebrow">Solutions</div>
        <h1 className="display mt-5 max-w-[16ch]">What people build on it.</h1>
        <p className="lede mt-6">
          Six problems we are bought for. Each names the primitives that answer it, because a solution that names no
          product is a brochure.
        </p>
      </section>

      <section className="band">
        <div className="wrap divide-y divide-white/10 border-y border-white/10">
          {SOLUTIONS.map((s) => (
            <div key={s.slug} className="grid gap-5 py-10 md:grid-cols-[300px_1fr] md:gap-12">
              <h2 className="h3">{s.name}</h2>
              <div>
                <p className="text-[15px] text-white/40">{s.problem}</p>
                <p className="mt-4 text-[15px] text-white/60">{s.answer}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {s.uses.map((u) => (
                    <Link
                      key={u}
                      href={`/products/${u}`}
                      className="inline-flex min-h-[44px] items-center rounded-full border border-white/10 px-4 text-[11px] font-semibold uppercase tracking-wider text-white/60 transition-colors hover:border-white/20 hover:text-white"
                    >
                      {u.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2 className="h2 max-w-[20ch]">Not on this list?</h2>
          <p className="lede mt-4">Tell us the coverage, the volume and the jurisdiction. We will tell you whether we are the right network.</p>
          <a href={`mailto:${COMPANY.contact.general}`} className="btn btn-solid mt-7">Talk to us</a>
        </div>
      </section>
    </>
  )
}
