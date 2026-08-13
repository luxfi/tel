import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EFFECTIVE, POLICIES, REVIEWED, policy } from '@/content/legal'
import { COMPANY } from '@/content/company'

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = policy((await params).slug)
  return p ? { title: p.title, description: p.summary } : {}
}

export default async function Policy({ params }: { params: Promise<{ slug: string }> }) {
  const p = policy((await params).slug)
  if (!p) notFound()

  return (
    <>
      <section className="wrap pt-16 pb-10">
        <Link href="/legal" className="inline-flex min-h-tap items-center eyebrow hover:text-white">Legal</Link>
        <h1 className="display mt-5 max-w-[16ch]">{p.title}</h1>
        <p className="lede mt-6">{p.summary}</p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-white/40">
          Effective {EFFECTIVE} · {COMPANY.legalName}
        </p>
        {/* The flag is the gate and this is what it gates. A carrier publishing
            draft terms as though they were in force is the risk; saying so is
            cheap, and it disappears the moment counsel flips REVIEWED. */}
        {!REVIEWED ? (
          <p className="mt-6 rounded-xl border border-white/20 bg-white/5 p-4 text-sm leading-relaxed text-white/70">
            <strong className="font-semibold">Draft — not yet in force.</strong> This policy is
            published for review. It states how the network operates and what we intend to commit
            to, and it has not completed legal review. It does not yet form part of any agreement.
          </p>
        ) : null}
      </section>

      <section className="band">
        <div className="wrap max-w-[860px]">
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {p.sections.map((s, i) => (
              <li key={s.heading} className="grid gap-3 py-8 md:grid-cols-[48px_1fr] md:gap-8">
                <div className="eyebrow tabular pt-1">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h2 className="h3">{s.heading}</h2>
                  <div className="prose mt-3 space-y-3 text-lg">
                    {s.body.map((b) => (
                      <p key={b}>{b}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 text-sm text-white/60">
            Questions about this policy go to{' '}
            <a className="inline-flex min-h-tap items-center underline" href={`mailto:${COMPANY.contact.general}`}>{COMPANY.contact.general}</a>. Privacy
            requests go to{' '}
            <a className="inline-flex min-h-tap items-center underline" href={`mailto:${COMPANY.contact.general}`}>{COMPANY.contact.general}</a>, and
            legal process is served on{' '}
            <a className="inline-flex min-h-tap items-center underline" href={`mailto:${COMPANY.contact.general}`}>{COMPANY.contact.general}</a>.
          </div>
        </div>
      </section>
    </>
  )
}
