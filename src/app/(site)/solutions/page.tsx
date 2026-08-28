import type { Metadata } from 'next'
import { Box, css } from '@hanzo/ui'
import Link from 'next/link'
import { COMPANY } from '@/content/company'
import { SOLUTIONS } from '@/content/solutions'

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'What the Lux network is used for: remote operations, connected fleets, contact centres, mobile operators and regulated industries.',
}


export default function Solutions() {
  return (
    <>
      <Box tag="section" className="wrap pt-16 pb-10">
        <Box className="eyebrow">Solutions</Box>
        <Box tag="h1" className="display mt-5 max-w-[16ch]">What people build on it.</Box>
        <Box tag="p" className="lede mt-6">
          Seven situations people arrive with. Each one names the products that answer it, because a solution that
          names no product is a brochure.
        </Box>
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap divide-y divide-white/10 border-y border-white/10">
          {SOLUTIONS.map((s) => (
            <Box key={s.slug} className="grid gap-5 py-10 md:grid-cols-[300px_1fr] md:gap-12">
              <Box tag="h2" className="h3">{s.name}</Box>
              <div>
                <Box tag="p" className="text-lg text-white/40">{s.problem}</Box>
                <Box tag="p" className="mt-4 text-lg text-white/60">{s.answer}</Box>
                <Box className="mt-5 flex flex-wrap gap-2">
                  {s.uses.map((u) => (
                    <Link
                      key={u}
                      href={`/products/${u}`}
                      className={'inline-flex min-h-[var(--tap-target)] items-center rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-white/60 transition-colors hover:border-white/20 hover:text-white'} style={css('inline-flex min-h-[var(--tap-target)] items-center rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-white/60 transition-colors hover:border-white/20 hover:text-white')}
                    >
                      {u.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </Box>
              </div>
            </Box>
          ))}
        </Box>
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap">
          <Box tag="h2" className="h2 max-w-[20ch]">Not on this list?</Box>
          <Box tag="p" className="lede mt-4">Tell us the coverage, the volume and the jurisdiction. We will tell you whether we are the right network.</Box>
          <Box tag="a" href={`mailto:${COMPANY.contact.general}`} className="btn btn-solid mt-7">Talk to us</Box>
        </Box>
      </Box>
    </>
  )
}
