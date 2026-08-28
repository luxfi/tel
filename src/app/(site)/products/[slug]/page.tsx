import type { Metadata } from 'next'
import { Box, css } from '@hanzo/ui'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card } from '@/components/Card'
import { PRIMITIVES, STATUS_LABEL, primitive } from '@/content/catalog'
import { COMPANY } from '@/content/company'

export function generateStaticParams() {
  return PRIMITIVES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = primitive((await params).slug)
  return p ? { title: p.name, description: p.detail } : {}
}

export default async function Primitive({ params }: { params: Promise<{ slug: string }> }) {
  const p = primitive((await params).slug)
  if (!p) notFound()

  const siblings = p.pillar.primitives.filter((s) => s.slug !== p.slug)

  return (
    <>
      <Box tag="section" className="wrap pt-16 pb-12">
        <Link href={`/products#${p.pillar.slug}`} className={'inline-flex min-h-[var(--tap-target)] items-center eyebrow hover:text-white'} style={css('inline-flex min-h-[var(--tap-target)] items-center eyebrow hover:text-white')}>
          {p.pillar.name}
        </Link>
        <Box tag="h1" className="display mt-5 max-w-[14ch]">{p.name}</Box>
        <Box className="mt-5 flex items-center gap-2 text-sm text-white/40">
          <Box tag="span" className={`dot dot-${p.status}`} aria-hidden="true" />
          {STATUS_LABEL[p.status]}
        </Box>
        <Box tag="p" className="lede mt-7">{p.detail}</Box>
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap">
          <Box className="eyebrow">What you get</Box>
          <Box tag="ul" className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {p.facts.map((f) => (
              <Box tag="li" key={f} className="py-5 text-lg text-white/60">{f}</Box>
            ))}
          </Box>
          <Box className="mt-10 flex flex-wrap gap-3">
            <Box tag="a" href={`mailto:${COMPANY.contact.general}`} className="btn btn-solid">Talk to us</Box>
            <Link href="/pricing" className={'btn btn-ghost'} style={css('btn btn-ghost')}>Pricing</Link>
          </Box>
        </Box>
      </Box>

      {siblings.length ? (
        <Box tag="section" className="band">
          <Box className="wrap">
            <Box className="eyebrow">Also in {p.pillar.name}</Box>
            <Box className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((s) => (
                <Card key={s.slug} primitive={s} />
              ))}
            </Box>
          </Box>
        </Box>
      ) : null}
    </>
  )
}
