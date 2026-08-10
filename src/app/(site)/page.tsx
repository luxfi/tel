'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Orbit } from '@/components/Orbit'
import { PILLARS, STATUS_LABEL } from '@/content/catalog'
import { CAPABILITIES, DIFFERENTIATORS, STACK } from '@/content/company'
import { CONTACT_EMAIL, contactHref, partners } from '@/site'
import { onConsoleHost } from '@/console/auth'

export default function Page() {
  /*
    One bundle serves two hosts. On console.lux.tel the console IS the site, so the
    marketing home hands over immediately — `replace`, not `assign`, or Back lands
    on this page and bounces again.

    Done in the client rather than in the static server because the export has one
    index.html and the host is only knowable in the browser. A visitor who lands
    here on the console host sees this frame for a moment; the alternative is a
    second build of the same site.
  */
  useEffect(() => {
    if (onConsoleHost()) window.location.replace('/console')
  }, [])

  return (
    <>
      {/* The constellation is computed, not drawn — see components/Orbit. It sits
          behind the hero rather than beside it because it is the subject of the
          sentence, not an illustration of it. */}
      <section className='relative overflow-hidden py-20 lg:py-28'>
        <div className='pointer-events-none absolute inset-0 opacity-70' aria-hidden='true'>
          <Orbit height={680} />
        </div>
        <div className='wrap relative z-10'>
          <p className='eyebrow'>Lux Industries Inc</p>
          <h1 className='display mt-4 max-w-[18ch]'>Voice, messaging and connectivity on one network.</h1>
          <p className='lede mt-6'>
            Lux runs telecommunications infrastructure — programmable voice, messaging and phone numbers — with
            wireless and satellite connectivity where wire and tower do not reach. One API, one bill, one desk.
          </p>
          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <Link href='/network' className='btn btn-solid'>
              See the network
              <ArrowRight className='h-4 w-4' aria-hidden='true' />
            </Link>
            <Link href='/products' className='btn btn-ghost'>
              What we do
            </Link>
          </div>

          <dl className='mt-16 grid gap-x-8 gap-y-8 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4'>
            {CAPABILITIES.map((c) => (
              <div key={c.headline}>
                <dt className='h3'>{c.headline}</dt>
                <dd className='mt-2 text-sm leading-relaxed text-white/60'>{c.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>The stack</p>
          <h2 className='h2 mt-4 max-w-[22ch]'>Six layers, owned rather than rented.</h2>
          <p className='lede mt-5'>
            The parts a provider rents are the parts it cannot tune. Lux runs its own, from the fibre to the compute
            sitting beside the media.
          </p>
          <ol className='mt-10 divide-y divide-white/10 border-y border-white/10'>
            {STACK.map((l) => (
              <li key={l.n} className='grid gap-3 py-7 md:grid-cols-[56px_240px_1fr] md:gap-8'>
                <div className='eyebrow pt-1'>{l.n}</div>
                <div>
                  <div className='h3'>{l.name}</div>
                  <div className='mt-1 text-sm text-white/40'>{l.claim}</div>
                </div>
                <p className='text-sm leading-relaxed text-white/60'>{l.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>Primitives</p>
          <h2 className='h2 mt-4 max-w-[24ch]'>Everything provisions from one API.</h2>
          <p className='lede mt-5'>
            A number, a SIM, a terminal, a trunk and an agent are the same kind of object: declared, versioned and
            billed together.
          </p>
          <div className='mt-10 space-y-12'>
            {PILLARS.map((pillar) => (
              <div key={pillar.slug} id={pillar.slug} className='scroll-mt-20'>
                <div className='flex flex-wrap items-baseline justify-between gap-3 border-b border-white/10 pb-3'>
                  <h3 className='font-heading text-lg font-bold'>{pillar.name}</h3>
                  <Link href={`/products#${pillar.slug}`} className='inline-flex min-h-[44px] items-center text-sm text-white/40 transition-colors hover:text-white'>
                    All {pillar.primitives.length}
                  </Link>
                </div>
                <p className='mt-4 max-w-3xl text-sm leading-relaxed text-white/60'>{pillar.summary}</p>
                <div className='mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  {pillar.primitives.map((p) => (
                    <Link key={p.slug} href={`/products/${p.slug}`} className='card'>
                      <div className='flex items-center gap-2'>
                        <span className={`dot dot-${p.status}`} aria-hidden='true' />
                        <span className='h3'>{p.name}</span>
                      </div>
                      <p className='mt-2 text-sm leading-relaxed text-white/60'>{p.blurb}</p>
                      {p.status !== 'live' ? (
                        <p className='mt-3 text-[10px] font-semibold uppercase tracking-wider text-amber-300'>
                          {STATUS_LABEL[p.status]}
                        </p>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>Why it is different</p>
          <h2 className='h2 mt-4 max-w-[26ch]'>Not assembled from other people’s networks.</h2>
          <div className='mt-8 grid gap-4 md:grid-cols-2'>
            {DIFFERENTIATORS.map((d) => (
              <div key={d.claim} className='card'>
                <div className='h3'>{d.claim}</div>
                <p className='mt-2 text-sm leading-relaxed text-white/60'>{d.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Text only, and one entry per signed-off partnership — see site.ts. */}
      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>Partnerships</p>
          <dl className='flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-10'>
            {partners.map(({ name, note }) => (
              <div key={name}>
                <dt className='font-heading text-lg font-bold'>{name}</dt>
                <dd className='mt-1 text-sm text-white/60'>{note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className='band'>
        <div className='wrap max-w-3xl text-center'>
          <h2 className='h2'>Talk to us</h2>
          <p className='mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60'>
            Tell us what you are connecting — an application that needs to make calls, a fleet that needs to stay
            online, a site that needs a link — and we will come back with specifics.
          </p>
          <a href={contactHref('Lux Tel')} className='btn btn-solid mt-8'>
            {CONTACT_EMAIL}
            <ArrowRight className='h-4 w-4' aria-hidden='true' />
          </a>
        </div>
      </section>
    </>
  )
}
