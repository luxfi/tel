import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY } from '../../content/company'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'How Lux charges: usage by default, commitments where they earn a discount, and no per-seat licence on infrastructure.',
}

/**
 * Principles rather than a rate card. Numbering, wireless and orbital pricing are
 * per-jurisdiction and per-site, so a published number would be wrong for most
 * readers — and a wrong number costs more trust than an absent one.
 */
const PRINCIPLES = [
  {
    heading: 'Usage by default',
    body: 'Every primitive meters what it does — a minute, a message, a gigabyte, a terminal-month, a token. No seat licences on infrastructure, and no charge for capacity sitting idle.',
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

const SHAPES = [
  { what: 'Numbers', unit: 'Per number, per month', note: 'Plus per-minute or per-message usage. Rates vary by country and by range type.' },
  { what: 'Voice and messaging', unit: 'Per minute · per message', note: 'Destination-based. Volume tiers apply automatically.' },
  { what: 'Wireless', unit: 'Per SIM, per month + pooled data', note: 'Data pools across the fleet; unused capacity is not stranded per device.' },
  { what: 'Orbital', unit: 'Per terminal, per month + capacity', note: 'Quoted per site: coordinate, capacity commitment and service level.' },
  { what: 'Inference and speech', unit: 'Per token · per second of audio', note: 'Region-pinned. In-region pinning does not carry a surcharge.' },
  { what: 'Edge compute and storage', unit: 'Per invocation · per GB-month', note: 'Storage billed in the region the data was written.' },
]

export default function Pricing() {
  return (
    <>
      <section className="wrap pt-16 pb-10">
        <div className="eyebrow">Pricing</div>
        <h1 className="display mt-5 max-w-[16ch]">You pay for traffic, not for seats.</h1>
        <p className="lede mt-6">
          Numbering, wireless and orbital rates are set per jurisdiction and per site, so a single published number
          would be wrong for most people reading it. What does not change is how the charging works.
        </p>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="eyebrow">Principles</div>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.heading} className="bg-neutral-900/50 p-7">
                <div className="h3">{p.heading}</div>
                <p className="mt-2 text-[15px] text-white/60">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="eyebrow">How each thing meters</div>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="eyebrow py-3 pr-6 font-normal">Service</th>
                  <th className="eyebrow py-3 pr-6 font-normal">Unit</th>
                  <th className="eyebrow py-3 font-normal">Notes</th>
                </tr>
              </thead>
              <tbody>
                {SHAPES.map((s) => (
                  <tr key={s.what} className="border-b border-white/10">
                    <td className="py-4 pr-6 font-medium">{s.what}</td>
                    <td className="py-4 pr-6 text-white/60">{s.unit}</td>
                    <td className="py-4 text-white/40">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <a href={`mailto:${COMPANY.contact.general}`} className="btn btn-solid">Request a quote</a>
            <Link href="/products" className="btn btn-ghost">See what is available</Link>
          </div>
        </div>
      </section>
    </>
  )
}
