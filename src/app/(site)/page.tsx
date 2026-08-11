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
      {/* A column of its own: at 70% opacity behind the copy the mesh was
          unreadable, and an unreadable picture is decoration. */}
      <section className='relative flex min-h-[calc(100vh-57px)] items-center overflow-hidden py-16'>
        {/* Full-bleed and behind, at full strength. The globe is the hero, and a
            column could not give it the size it needs to read as a shell. */}
        <div className='absolute inset-y-0 right-[-15%] w-[120%] opacity-90 lg:right-0 lg:w-[58%] lg:opacity-100'>
          <Globe />
        </div>
        <div className='wrap relative grid items-center gap-12 lg:grid-cols-[minmax(0,560px)_1fr]'>
          <div>
            {/* Kept deliberately: it says what Lux sells in the reader's words,
                where "connectivity on one network" named the architecture. */}
            <p className='eyebrow'>Telecommunications &amp; satellite</p>
            <h1 className='display mt-4 max-w-[18ch]'>Voice, messaging, and satellite connectivity.</h1>
            <p className='lede mt-6'>
              Buy a phone number. Send a text. Put a SIM in a device that ships anywhere. Point a terminal at a site
              with no fibre. Let an agent answer the call. Same key, same bill, same desk.
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

        </div>
      </section>

      <section className='band'>
        <div className='wrap'>
          <dl className='grid gap-x-8 gap-y-8 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4'>
            {CAPABILITIES.map((c) => (
              <div key={c.headline}>
                <dt className='h3'>{c.headline}</dt>
                <dd className='mt-2 text-sm leading-relaxed text-white/60'>{c.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The pain, in their words, before any claim of ours. A page that opens with
          what we sell asks the reader to care first; this one names the thing they
          already live with. */}
      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>The shift</p>
          <h2 className='h2 mt-4 max-w-[16ch]'>The wire ran out.</h2>
          <p className='lede mt-6'>
            Then the tower. Then the fibre. Past that was blank map, and the people out there — on a ship, at a mine,
            after a storm took the mast down — were simply out of reach.
          </p>
        </div>
      </section>

      {/* The argument once, at full size — every other section here is a heading
          over a grid. */}
      <section className='band'>
        <div className='wrap'>
          <p className='display max-w-[26ch]'>
            The sky did not.{' '}
            <span className='text-white/40'>
              Numbers that ring anywhere. SIMs that work everywhere. Satellite where there is no tower. Agents that
              pick up.
            </span>
          </p>
        </div>
      </section>

      {/* The reader this page is really for: whoever owns capacity and wants it to
          be a service someone can buy. It sits directly under the claim because it
          is the most valuable conversation on the site, not a footnote to it. */}
      <section className='band'>
        <div className='wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16'>
          <div>
            <p className='eyebrow'>For operators</p>
            <h2 className='h2 mt-4 max-w-[18ch]'>A constellation cannot ring a phone.</h2>
          </div>
          <div>
            <p className='text-base leading-relaxed text-white/70 sm:text-lg'>
              You have beams over every ocean and desert. Selling that as service is a different trade: numbers a
              regulator will grant, interconnect with the carriers your users already dial, an emergency call that
              reaches the right dispatcher, lawful process in each country, and a bill that clears.
            </p>
            <p className='mt-5 text-base leading-relaxed text-white/70 sm:text-lg'>
              That is years of licences, and it is already running here. Bring the beam. We bring the dial tone.
            </p>
            <a href={contactHref('Operator partnership')} className='btn btn-solid mt-8'>
              Talk to our carrier team
              <ArrowRight className='h-4 w-4' aria-hidden='true' />
            </a>
          </div>
        </div>
      </section>

      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>The stack</p>
          <h2 className='h2 mt-4 max-w-[20ch]'>We carry the call the whole way.</h2>
          <p className='lede mt-5'>
            The number it lands on, the interconnect it crosses, the link at the far end, and the compute that
            answers. Ours, end to end, so you build against a network instead of a purchase order.
          </p>
          <ol className='mt-10 divide-y divide-white/10 border-y border-white/10'>
            {STACK.map((l) => (
              <li key={l.n} className='grid gap-3 py-7 md:grid-cols-[280px_1fr] md:gap-10'>
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

      {/* What people buy it for. It lived only on /solutions, which nothing linked
          to from here. */}
      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>Solutions</p>
          <h2 className='h2 mt-4 max-w-[18ch]'>Wherever the work is.</h2>
          <p className='lede mt-5'>
            Ships, rigs, convoys, flood zones, factory floors, trading desks. Find yours and we will show you how it
            is built.
          </p>
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
          <p className='eyebrow'>Products</p>
          <h2 className='h2 mt-4 max-w-[18ch]'>Ask, and it exists.</h2>
          <p className='lede mt-5'>
            A number, a SIM, a terminal, a voice agent. Same key, same call to make it, same call to kill it.
          </p>
          <div className='mt-10 space-y-12'>
            {PILLARS.map((pillar) => (
              <div key={pillar.slug} id={pillar.slug} className='scroll-mt-20'>
                <div className='flex flex-wrap items-baseline justify-between gap-3 border-b border-white/10 pb-3'>
                  <h3 className='font-heading text-lg font-bold'>{pillar.name}</h3>
                  <Link href={`/products#${pillar.slug}`} className='inline-flex min-h-[44px] items-center text-sm text-white/40 transition-colors hover:text-white'>
                    See all
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
          <p className='eyebrow'>Support</p>
          <h2 className='h2 mt-4 max-w-[18ch]'>It breaks, we answer.</h2>
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


      {/* The close. Everything above is the argument; this is the part that removes
          the reason to put it off, by saying plainly what happens after the email. */}
      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>Getting started</p>
          <h2 className='h2 mt-4 max-w-[20ch]'>Talk to a builder, not a form.</h2>
          <ol className='mt-10 divide-y divide-white/10 border-y border-white/10'>
            {[
              [
                'Tell us what you are connecting',
                'What it does, where it runs, and roughly how much of it. You get back what it takes and what it costs — an engineer\u2019s answer, not a brochure.',
              ],
              [
                'Try it on a real number',
                'A number, a SIM or a terminal on your own account, against the same API you would use in production. Nothing here is a sandbox that behaves differently later.',
              ],
              [
                'Go live, and keep the same everything',
                'Same key, same invoice, same desk. Adding a country, a terminal or a voice agent later is a call to the API, not a new contract.',
              ],
            ].map(([t, d]) => (
              <li key={t} className='grid gap-3 py-7 md:grid-cols-[280px_1fr] md:gap-10'>
                <div className='h3'>{t}</div>
                <p className='text-sm leading-relaxed text-white/60'>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className='band'>
        <div className='wrap max-w-3xl text-center'>
          <h2 className='h2'>Tell us what you&rsquo;re connecting.</h2>
          <p className='mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60'>
            An application that needs to make calls. A fleet that needs to stay online in forty countries. A site
            nobody will run fibre to. Say which, and we will come back with what it takes and what it costs.
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
