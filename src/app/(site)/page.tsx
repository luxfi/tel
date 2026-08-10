'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Globe } from '@/components/Globe'
import { PILLARS, STATUS_LABEL } from '@/content/catalog'
import { CAPABILITIES, DIFFERENTIATORS, STACK } from '@/content/company'
import { SOLUTIONS } from '@/content/solutions'
import { CONTACT_EMAIL, contactHref } from '@/site'
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
      {/* The constellation is propagated from the clock, not animated — see
          components/Globe. It gets a column of its own rather than a wash behind
          the copy: at 70% opacity under text the mesh was unreadable, and a picture
          you cannot read is decoration no matter how honestly it was computed. */}
      <section className='overflow-hidden py-20 lg:py-24'>
        <div className='wrap grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-10'>
          <div>
            {/* The original heading, kept deliberately. It says what Lux sells in the
                reader's own words — voice, messaging, satellite — where the version
                that replaced it ("connectivity on one network") named the
                architecture instead, which is our concern and not theirs. */}
            <p className='eyebrow'>Telecommunications &amp; satellite</p>
            <h1 className='display mt-4 max-w-[18ch]'>Voice, messaging, and satellite connectivity.</h1>
            <p className='lede mt-6'>
              Lux runs telecommunications infrastructure — programmable voice, messaging, and phone numbers — and
              provides satellite internet where wire and tower don&rsquo;t reach.
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
          </div>

          <div className='-mx-6 sm:mx-0'>
            <Globe height={560} />
          </div>
        </div>

        <div className='wrap'>
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

      {/* The argument, once, at full size. Every other section on this page is a
          heading over a grid; this one is a sentence over nothing, because the
          claim it makes is the reason to read the rest and it was previously
          buried as the fourth paragraph of the fourth band. */}
      <section className='band'>
        <div className='wrap'>
          <p className='display max-w-[20ch]'>
            A call, a SIM, a terminal, and the model that answers.{' '}
            <span className='text-white/40'>One network, one API, one invoice.</span>
          </p>
        </div>
      </section>

      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>The stack</p>
          <h2 className='h2 mt-4 max-w-[22ch]'>Six layers, one integration.</h2>
          <p className='lede mt-5'>
            Everything a real-time application needs — the number a call arrives on, the network it crosses, and the
            model that answers it — under one account.
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

      {/* What people actually buy this for. It lived only on /solutions, which is
          the page nobody reaches from a home page that never mentions it — and a
          named operating problem persuades where a feature list does not. */}
      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>What it is bought for</p>
          <h2 className='h2 mt-4 max-w-[24ch]'>Six problems, named.</h2>
          <div className='mt-10 divide-y divide-white/10 border-y border-white/10'>
            {SOLUTIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/solutions#${s.slug}`}
                className='group grid gap-3 py-7 transition-colors hover:bg-white/[0.03] md:grid-cols-[300px_1fr] md:gap-10'
              >
                <div className='h3 flex items-baseline gap-2'>
                  {s.name}
                  <ArrowRight
                    className='h-3.5 w-3.5 shrink-0 text-white/0 transition-colors group-hover:text-white/50'
                    aria-hidden='true'
                  />
                </div>
                <p className='text-sm leading-relaxed text-white/60'>{s.problem}</p>
              </Link>
            ))}
          </div>
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
                        <p className='mt-3 text-[10px] font-semibold uppercase tracking-wider text-white/60'>
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
          <h2 className='h2 mt-4 max-w-[26ch]'>One account instead of five.</h2>
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
