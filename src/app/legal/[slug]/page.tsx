import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EFFECTIVE, POLICIES, policy } from '../../../content/legal'
import { COMPANY } from '../../../content/company'

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
        <Link href="/legal" className="inline-flex min-h-[44px] items-center eyebrow hover:text-white">Legal</Link>
        <h1 className="display mt-5 max-w-[16ch]">{p.title}</h1>
        <p className="lede mt-6">{p.summary}</p>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-white/40">
          Effective {EFFECTIVE} · {COMPANY.legalName}
        </p>
      </section>

      <section className="band">
        <div className="wrap max-w-[860px]">
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {p.sections.map((s, i) => (
              <li key={s.heading} className="grid gap-3 py-8 md:grid-cols-[48px_1fr] md:gap-8">
                <div className="eyebrow tabular pt-1">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h2 className="h3">{s.heading}</h2>
                  <div className="prose mt-3 space-y-3 text-[15px]">
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
            <a className="inline-flex min-h-[44px] items-center underline" href={`mailto:${COMPANY.contact.general}`}>{COMPANY.contact.general}</a>. Privacy
            requests go to{' '}
            <a className="inline-flex min-h-[44px] items-center underline" href={`mailto:${COMPANY.contact.general}`}>{COMPANY.contact.general}</a>, and
            legal process is served on{' '}
            <a className="inline-flex min-h-[44px] items-center underline" href={`mailto:${COMPANY.contact.general}`}>{COMPANY.contact.general}</a>.
          </div>
        </div>
      </section>
    </>
  )
}
