import type { Metadata } from 'next'
import { Box, css } from '@hanzo/ui'
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
      <Box tag="section" className="wrap pt-16 pb-10">
        <Link href="/legal" className={'inline-flex min-h-[var(--tap-target)] items-center eyebrow hover:text-white'} style={css('inline-flex min-h-[var(--tap-target)] items-center eyebrow hover:text-white')}>Legal</Link>
        <Box tag="h1" className="display mt-5 max-w-[16ch]">{p.title}</Box>
        <Box tag="p" className="lede mt-6">{p.summary}</Box>
        <Box tag="p" className="mt-5 text-xs font-semibold uppercase tracking-wider text-white/40">
          Effective {EFFECTIVE} · {COMPANY.legalName}
        </Box>
        {/* The flag is the gate and this is what it gates. A carrier publishing
            draft terms as though they were in force is the risk; saying so is
            cheap, and it disappears the moment counsel flips REVIEWED. */}
        {!REVIEWED ? (
          <Box tag="p" className="mt-6 rounded-xl border border-white/20 bg-white/5 p-4 text-sm leading-relaxed text-white/70">
            <Box tag="strong" className="font-semibold">Draft — not yet in force.</Box> This policy is
            published for review. It states how the network operates and what we intend to commit
            to, and it has not completed legal review. It does not yet form part of any agreement.
          </Box>
        ) : null}
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap max-w-[860px]">
          <Box tag="ol" className="divide-y divide-white/10 border-y border-white/10">
            {p.sections.map((s, i) => (
              <Box tag="li" key={s.heading} className="grid gap-3 py-8 md:grid-cols-[48px_1fr] md:gap-8">
                <Box className="eyebrow tabular pt-1">{String(i + 1).padStart(2, '0')}</Box>
                <div>
                  <Box tag="h2" className="h3">{s.heading}</Box>
                  <Box className="prose mt-3 space-y-3 text-lg">
                    {s.body.map((b) => (
                      <p key={b}>{b}</p>
                    ))}
                  </Box>
                </div>
              </Box>
            ))}
          </Box>

          <Box className="mt-10 text-sm text-white/60">
            Questions about this policy go to{' '}
            <Box tag="a" className="inline-flex min-h-[var(--tap-target)] items-center underline" href={`mailto:${COMPANY.contact.general}`}>{COMPANY.contact.general}</Box>. Privacy
            requests go to{' '}
            <Box tag="a" className="inline-flex min-h-[var(--tap-target)] items-center underline" href={`mailto:${COMPANY.contact.general}`}>{COMPANY.contact.general}</Box>, and
            legal process is served on{' '}
            <Box tag="a" className="inline-flex min-h-[var(--tap-target)] items-center underline" href={`mailto:${COMPANY.contact.general}`}>{COMPANY.contact.general}</Box>.
          </Box>
        </Box>
      </Box>
    </>
  )
}
