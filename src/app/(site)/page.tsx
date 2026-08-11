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
            <p className='eyebrow'>Internet · Cellular · Voice · Messaging · AI</p>
            <h1 className='display mt-4 max-w-[16ch]'>Everything your business needs to connect.</h1>
            <p className='lede mt-6'>
              Lux brings communications, connectivity and intelligent automation into one platform — one account, one
              bill, one team behind it. From a phone number, to a remote site, to an agent that can answer, act and
              operate on your behalf.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <a href={contactHref('Lux Tel')} className='btn btn-solid'>
                Tell us what you&rsquo;re connecting
                <ArrowRight className='h-4 w-4' aria-hidden='true' />
              </a>
              <Link href='/products' className='btn btn-ghost'>
                See what we do
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
          <p className='eyebrow'>The problem</p>
          <h2 className='h2 mt-4 max-w-[20ch]'>Most companies piece this together themselves.</h2>
          <div className='mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16'>
            <ul className='space-y-1 text-base leading-relaxed text-white/60 sm:text-lg'>
              {[
                'One provider for internet.',
                'Another for mobile connectivity.',
                'Another for phone numbers.',
                'Another for messaging.',
                'Another for AI.',
              ].map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <div>
              <p className='text-base leading-relaxed text-white/70 sm:text-lg'>
                Then five portals, five contracts, five support teams, and nobody responsible for the whole thing.
              </p>
              <p className='mt-5 text-base leading-relaxed text-white/70 sm:text-lg'>
                Lux replaces that stack with one relationship. We source the infrastructure, integrate the services,
                provision what you need, and give you a single place to operate it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The argument once, at full size — every other section here is a heading
          over a grid. */}
      <section className='band'>
        <div className='wrap'>
          <p className='display max-w-[24ch]'>
            One platform.{' '}
            <span className='text-white/40'>Every connection.</span>
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
          <p className='eyebrow'>How it fits together</p>
          <h2 className='h2 mt-4 max-w-[20ch]'>From the network to the model.</h2>
          <p className='lede mt-5'>
            Six layers a business normally buys from six companies, arranged as one service — the way online,
            the devices that move, the number, the message, the agent, and the network holding it together.
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
          <h2 className='h2 mt-4 max-w-[24ch]'>For the places software meets the real world.</h2>
          <p className='lede mt-5'>
            Find the one that looks like yours and we will tell you exactly how it is put together.
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
          <h2 className='h2 mt-4 max-w-[24ch]'>Building blocks for the connected business.</h2>
          <p className='lede mt-5'>
            A number, a SIM, a terminal and an agent are the same kind of thing here: created with a call, and
            cancelled with another.
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

      {/* Post-quantum, on its own. It is the one claim here a competitor cannot
          match by buying the same wholesale, and it is invisible unless said. */}
      <section className='band'>
        <div className='wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16'>
          <div>
            <p className='eyebrow'>Post-quantum</p>
            <h2 className='h2 mt-4 max-w-[20ch]'>Encrypted against a machine that does not exist yet.</h2>
          </div>
          <div>
            <p className='text-base leading-relaxed text-white/70 sm:text-lg'>
              Traffic captured today can be kept and decrypted later, once something exists that can do it. For card
              traffic, payment instructions, health records and legal process, that is not a future problem — the data
              still matters in a decade.
            </p>
            <p className='mt-5 text-base leading-relaxed text-white/70 sm:text-lg'>
              Lux links carry hybrid key exchange: a classical algorithm and a lattice one together, so a session is no
              weaker than it is today and still stands when the other machine arrives. Federal guidance sets a 2030
              target for readiness. Ours is already on.
            </p>
            <Link href='/products/post-quantum' className='btn btn-ghost mt-8'>
              How it works
              <ArrowRight className='h-4 w-4' aria-hidden='true' />
            </Link>
          </div>
        </div>
      </section>

      {/* The agentic argument, on its own. It is the newest line and the one a
          reader is least likely to already have a mental model for, so it gets
          space rather than a card in a grid. */}
      <section className='band'>
        <div className='wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16'>
          <div>
            <p className='eyebrow'>Agentic AI</p>
            <h2 className='h2 mt-4 max-w-[18ch]'>AI that can actually do something.</h2>
            <p className='mt-6 text-base leading-relaxed text-white/70 sm:text-lg'>
              Most AI stops at the answer. A Lux agent takes the next step, with the same tools your team uses: voice,
              messaging, your business systems, your APIs, your data, and the connectivity underneath all of it.
            </p>
            <a href={contactHref('Agentic AI')} className='btn btn-solid mt-8'>
              Give an agent a number
              <ArrowRight className='h-4 w-4' aria-hidden='true' />
            </a>
          </div>
          <ul className='grid gap-x-8 gap-y-2 sm:grid-cols-2'>
            {[
              'Answer the phone',
              'Send a message',
              'Look up an account',
              'Create a ticket',
              'Schedule an appointment',
              'Update your CRM',
              'Trigger a workflow',
              'Call an API',
              'Escalate to a person',
              'Or finish the whole process',
            ].map((a) => (
              <li key={a} className='flex items-baseline gap-3 border-b border-white/10 py-3 text-sm text-white/70'>
                <span className='dot dot-live shrink-0' aria-hidden='true' />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>Why Lux</p>
          <h2 className='h2 mt-4 max-w-[20ch]'>One account instead of five.</h2>
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
          <p className='eyebrow'>How we build it</p>
          <h2 className='h2 mt-4 max-w-[24ch]'>We use the right infrastructure for the job.</h2>
          <div className='mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16'>
            <p className='text-base leading-relaxed text-white/70 sm:text-lg'>
              Lux does not depend on a single network, carrier or infrastructure provider. That is the point.
              Different workloads need different networks, different countries need different operators, and different
              locations need different ways online.
            </p>
            <p className='text-base leading-relaxed text-white/70 sm:text-lg'>
              We combine what sits underneath around your requirements and present it as one Lux service. You tell us
              what needs to work. We handle the rest of it.
            </p>
          </div>

          <div className='mt-16 border-t border-white/10 pt-12'>
            <p className='eyebrow'>Where it goes</p>
            <h2 className='h2 mt-4 max-w-[22ch]'>From connectivity to intelligence.</h2>
            <p className='lede mt-6'>
              The network used to be the endpoint. Now it is the foundation. A connected device reports what is
              happening. A connected application talks to the customer. A connected agent understands the situation
              and acts on it.
            </p>
            <div className='mt-10 grid gap-4 md:grid-cols-3'>
              {[
                ['Connect the world.', 'Internet, cellular and satellite, wherever the work is.'],
                ['Communicate with it.', 'Numbers, calls and messages, from your own code.'],
                ['Act on it.', 'Agents that take the next step inside your systems.'],
              ].map(([t, d]) => (
                <div key={t} className='card'>
                  <div className='h3'>{t}</div>
                  <p className='mt-2 text-sm leading-relaxed text-white/60'>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>Getting started</p>
          <h2 className='h2 mt-4 max-w-[22ch]'>Tell us what needs to happen.</h2>
          <ol className='mt-10 divide-y divide-white/10 border-y border-white/10'>
            {[
              [
                'Start with the outcome',
                'A site needs internet. A fleet needs connectivity. An application needs voice. A company needs every inbound call answered. Tell us the problem, not the product.',
              ],
              [
                'We assemble the stack',
                'We choose the connectivity, communications, infrastructure and AI the outcome requires. One architecture, one commercial relationship, and an engineer on the other end of it rather than a form.',
              ],
              [
                'We make it operational',
                'We provision the services, integrate the systems, deploy the agents, and stay the team you call when something changes.',
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
          <h2 className='h2'>What are you connecting?</h2>
          <ul className='mx-auto mt-8 max-w-2xl space-y-2 text-base leading-relaxed text-white/60'>
            {[
              'An application that needs to make calls.',
              'A fleet operating across forty countries.',
              'A remote site nobody is going to run fibre to.',
              'A business that wants every inbound call answered.',
              'A support operation that needs agents working around the clock.',
              'A device that needs to stay connected anywhere it goes.',
              'Or something we have not seen before.',
            ].map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className='mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/80'>
            Tell us what it needs to do. We will build the connection around it.
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
