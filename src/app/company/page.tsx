import type { Metadata } from 'next'
import Link from 'next/link'
import { ADVISORS, ENGINEERING, LEADERSHIP, type Person } from '../../content/team'
import { COMPANY, CAPABILITIES } from '../../content/company'

export const metadata: Metadata = {
  title: 'Company',
  description: 'Lux Industries Inc — who runs the network, and how to reach us.',
}

function Roster({ title, people }: { title: string; people: readonly Person[] }) {
  return (
    <div>
      <div className="eyebrow">{title}</div>
      <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <li key={p.name} className="bg-neutral-900/50 px-5 py-4">
            <div className="text-[15px] font-medium">{p.name}</div>
            <div className="mt-0.5 text-sm text-white/40">{p.title}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Company() {
  return (
    <>
      <section className="wrap pt-16 pb-10">
        <div className="eyebrow">{COMPANY.legalName}</div>
        <h1 className="display mt-5 max-w-[16ch]">We run the network ourselves.</h1>
        <p className="lede mt-6">{COMPANY.lede}</p>
      </section>

      <section className="band">
        <div className="wrap">
          <dl className="tabular grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((c) => (
              <div key={c.headline}>
                <dt className="h3">{c.headline}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/60">{c.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="band">
        <div className="wrap space-y-14">
          <Roster title="Leadership" people={LEADERSHIP} />
          <Roster title="Engineering and operations" people={ENGINEERING} />
          <Roster title="Advisors" people={ADVISORS} />
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="eyebrow">Contact</div>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Sales', COMPANY.contact.general],
              ['Support', COMPANY.contact.general],
              ['Partnerships', COMPANY.contact.general],
              ['Abuse', COMPANY.contact.general],
              ['Legal', COMPANY.contact.general],
              ['Law enforcement', COMPANY.contact.general],
            ].map(([label, address]) => (
              <div key={address} className="bg-neutral-900/50 px-5 py-4">
                <div className="eyebrow">{label}</div>
                <a href={`mailto:${address}`} className="inline-flex min-h-[44px] items-center mt-1 text-[15px] hover:underline">{address}</a>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-white/40">
            Policies, retention periods and how we answer legal process are set out under{' '}
            <Link href="/legal" className="inline-flex min-h-[44px] items-center underline">Legal</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
