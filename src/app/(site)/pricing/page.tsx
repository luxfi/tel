import type { Metadata } from 'next'
import Link from 'next/link'
import { contactHref } from '@/site'
import { ENTERPRISE, RATES } from '@/content/pricing'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'The Lux rate card, and the enterprise plan: 24/7 support, 99.999% availability and dedicated infrastructure.',
}

const PRINCIPLES = [
  {
    heading: 'Usage by default',
    body: 'Everything here meters what it does — a minute, a message, a gigabyte, a terminal-month, a token. No seat licences on infrastructure, and no charge for capacity sitting idle.',
  },
  {
    heading: 'Commit only where it pays you back',
    body: 'A volume commitment lowers the unit rate. It is optional, it is not required to get support, and it does not gate a feature.',
  },
  {
    heading: 'Regulatory pass-through, itemised',
    body: 'Where a jurisdiction requires a fee to be collected, it is collected and shown as itself. It is not folded into the rate to make the rate look lower.',
  },
  {
    heading: 'Failover is billed when it carries',
    body: 'A standby wireless or orbital path costs the terminal, not the capacity. You pay for the traffic on the day it is needed.',
  },
  {
    heading: 'Support is included',
    body: 'Engineering support comes with the account. A paid tier buys response times and a named engineer, not the right to open a ticket.',
  },
]

export default function Pricing() {
  return (
    <>
      <section className="wrap pt-16 pb-10">
        <div className="eyebrow">Pricing</div>
        <h1 className="display mt-5 max-w-[16ch]">Published rates. An enterprise plan when you need the people.</h1>
        <p className="lede mt-6">
          Every service bills from one rate card, with no seats and nothing owed until it is switched on. The enterprise
          plan adds 24/7 engineering, a service level with credits and infrastructure dedicated to you.
        </p>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="eyebrow">{ENTERPRISE.name}</div>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-3">
            <span className="display">{ENTERPRISE.price}</span>
            <span className="lede">{ENTERPRISE.per}</span>
          </div>
          <p className="lede mt-4">{ENTERPRISE.note}</p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {ENTERPRISE.includes.map((f) => (
              <div key={f.heading} className="bg-neutral-900/50 p-7">
                <div className="h3">{f.heading}</div>
                <p className="mt-2 text-lg text-white/60">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={contactHref('Enterprise plan')} className="btn btn-solid">Talk to us about the enterprise plan</a>
            <Link href="/start" className="btn btn-ghost">Tell us what you are connecting</Link>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="eyebrow">Rate card · United States</div>
          <p className="lede mt-4">Other countries are quoted on the same card. A volume commitment lowers every rate on it.</p>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {RATES.map((g) => (
              <div key={g.name}>
                <div className="h3">{g.name}</div>
                <table className="mt-4 w-full border-collapse text-left text-lg">
                  <tbody>
                    {g.rates.map((r) => (
                      <tr key={r.what} className="border-b border-white/10">
                        <td className="py-3 pr-4 font-medium">{r.what}</td>
                        <td className="py-3 pr-4 text-right tabular-nums">{r.price}</td>
                        <td className="py-3 text-white/40">{r.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <p className="mt-8 text-lg text-white/40">
            Orbital capacity, inference and edge compute are quoted per site and per region.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="eyebrow">Principles</div>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.heading} className="bg-neutral-900/50 p-7">
                <div className="h3">{p.heading}</div>
                <p className="mt-2 text-lg text-white/60">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2 className="h2 max-w-[22ch]">Send us the shape of your traffic.</h2>
          <p className="lede mt-4">
            Countries, volumes and coordinates. A quote comes back with the rate, the service level and the
            provisioning time for each one.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={contactHref('Quote')} className="btn btn-solid">Request a quote</a>
            <Link href="/products" className="btn btn-ghost">See what is available</Link>
          </div>
        </div>
      </section>
    </>
  )
}
