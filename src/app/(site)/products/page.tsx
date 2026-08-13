import type { Metadata } from 'next'
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
      <section className="wrap pt-16 pb-10">
        <div className="eyebrow">Products</div>
        <h1 className="display mt-5 max-w-[16ch]">Building blocks for the connected business.</h1>
        <p className="lede mt-6">
          Each of these is provisioned through the same API, under one identity model and one bill. A dot means it is
          in service; a ring means it is in field trial and we will say so before you build on it.
        </p>
      </section>

      {PILLARS.map((pillar) => (
        <section key={pillar.slug} id={pillar.slug} className="band scroll-mt-20">
          <div className="wrap">
            <h2 className="h2">{pillar.name}</h2>
            <p className="lede mt-4">{pillar.summary}</p>
            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {pillar.primitives.map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}`} className="grid gap-2 py-6 md:grid-cols-[280px_1fr] md:gap-10">
                  <div className="flex items-center gap-2">
                    <Mark slug={p.slug} />
                    <span className="h3">{p.name}</span>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className="text-lg text-white/60">{p.blurb}</p>
                    <span className="font-mono text-xs uppercase tracking-wider text-white/40">
                      {STATUS_LABEL[p.status]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
