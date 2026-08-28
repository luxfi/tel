import type { Metadata } from 'next'
import { Box, css } from '@hanzo/ui'
import Link from 'next/link'
import { Mark } from '@/components/Mark'
import { PILLARS, STATUS_LABEL } from '@/content/catalog'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Every primitive on the Lux network, by layer: orbit, network, wireless, communications, identity, intelligence and edge.',
}

export default function Products() {
  return (
    <>
      <Box tag="section" className="wrap pt-16 pb-10">
        <Box className="eyebrow">Products</Box>
        <Box tag="h1" className="display mt-5 max-w-[16ch]">Building blocks for the connected business.</Box>
        <Box tag="p" className="lede mt-6">
          Each of these is provisioned through the same API, under one identity model and one bill. A dot means it is
          in service; a ring means it is in field trial and we will say so before you build on it.
        </Box>
      </Box>

      {PILLARS.map((pillar) => (
        <Box tag="section" key={pillar.slug} id={pillar.slug} className="band scroll-mt-20">
          <Box className="wrap">
            <Box tag="h2" className="h2">{pillar.name}</Box>
            <Box tag="p" className="lede mt-4">{pillar.summary}</Box>
            <Box className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {pillar.primitives.map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}`} className={'grid gap-2 py-6 md:grid-cols-[280px_1fr] md:gap-10'} style={css('grid gap-2 py-6 md:grid-cols-[280px_1fr] md:gap-10')}>
                  <Box className="flex items-center gap-2">
                    <Mark slug={p.slug} />
                    <Box tag="span" className="h3">{p.name}</Box>
                  </Box>
                  <Box className="flex flex-wrap items-baseline justify-between gap-3">
                    <Box tag="p" className="text-lg text-white/60">{p.blurb}</Box>
                    <Box tag="span" className="font-mono text-xs uppercase tracking-wider text-white/40">
                      {STATUS_LABEL[p.status]}
                    </Box>
                  </Box>
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      ))}
    </>
  )
}
