import type { Metadata } from 'next'
import { Box, css } from '@hanzo/ui'
import Link from 'next/link'
import { EFFECTIVE, POLICIES, REVIEWED } from '@/content/legal'
import { COMPANY } from '@/content/company'

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Terms, privacy, acceptable use, law enforcement, emergency services and the trust centre for the Lux network.',
}

export default function Legal() {
  return (
    <>
      <Box tag="section" className="wrap pt-16 pb-10">
        <Box className="eyebrow">Legal</Box>
        <Box tag="h1" className="display mt-5 max-w-[16ch]">What we commit to, in writing.</Box>
        <Box tag="p" className="lede mt-6">
          Lux is a carrier. That means obligations most software companies never take on — emergency calling,
          lawful process, retention, and specific protections on what the network knows about you. All of it is
          here rather than in a contract you only see after signing.
        </Box>
        <Box tag="p" className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/40">
          Effective {EFFECTIVE} · {COMPANY.legalName}
        </Box>
        {!REVIEWED ? (
          <Box tag="p" className="mt-6 max-w-3xl rounded-xl border border-white/20 bg-white/5 p-4 text-sm leading-relaxed text-white/70">
            <Box tag="strong" className="font-semibold">These policies are drafts.</Box> They are published
            for review and have not completed legal review, so they do not yet form part of any
            agreement.
          </Box>
        ) : null}
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap divide-y divide-white/10 border-y border-white/10">
          {POLICIES.map((p) => (
            <Link key={p.slug} href={`/legal/${p.slug}`} className={'grid gap-2 py-7 md:grid-cols-[300px_1fr] md:gap-10'} style={css('grid gap-2 py-7 md:grid-cols-[300px_1fr] md:gap-10')}>
              <Box tag="span" className="h3">{p.title}</Box>
              <Box tag="span" className="text-lg text-white/60">{p.summary}</Box>
            </Link>
          ))}
        </Box>
      </Box>
    </>
  )
}
