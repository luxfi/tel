'use client'

import React, { useEffect } from 'react'
import { Box, css } from '@hanzo/ui'
import Link from 'next/link'
import {
  ArrowRight,
  Antenna,
  Bot,
  Braces,
  CalendarClock,
  CircleCheck,
  Database,
  Earth,
  MessageSquare,
  Phone,
  PhoneIncoming,
  Radio,
  Search,
  Send,
  Ticket,
  UserRound,
  Workflow,
  Zap,
} from 'lucide-react'

import { Card } from '@/components/Card'
import { Globe } from '@/components/Globe'
import { PILLARS } from '@/content/catalog'
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
      {/*
        ONE globe, placed two ways.

        Narrow, it is a BLOCK at the top of the page and the copy follows it, so
        the reading order down the screen is globe, headline, then the rest. It
        used to be absolute at every width — full-bleed wallpaper behind the
        copy at 90% opacity, with the scrim below suppressed under lg. So a phone
        got the worst of both: a picture too faint to read as a planet, and body
        text laid directly over a field of moving dots. The desktop scrim exists
        because that combination is unreadable; narrow simply had no answer.

        Wide, it goes back out of flow against the right edge, which is the only
        way it gets the size to read as a shell rather than as an illustration.
        A second <Globe /> for the phone would have been a second canvas and a
        second propagation loop for one picture.
      */}
      <Box tag="section" className='relative overflow-hidden lg:flex lg:min-h-[calc(100svh-var(--tap-target))] lg:items-center lg:py-16'>
        <Box className='relative h-56 sm:h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[58%]'>
          <Globe />
        </Box>
        {/* A scrim over the globe's left edge, wide only — narrow, nothing
            overlaps any more. The copy column and the canvas overlap by design
            there, and body text on a field of moving dots is unreadable at
            exactly the place someone is reading. Gradient, not a box: a hard edge
            would read as a panel. */}
        <Box
          className='pointer-events-none absolute inset-0 hidden lg:block'
          aria-hidden='true'
          style={{ background: 'linear-gradient(90deg, #000 0%, #000 34%, rgba(0,0,0,0.85) 46%, rgba(0,0,0,0) 62%)' }}
        />
        <Box className='wrap relative pb-12 lg:grid lg:grid-cols-[minmax(0,560px)_1fr] lg:items-center lg:gap-12 lg:pb-0'>
          <div>
            {/* Kept deliberately: it says what Lux sells in the reader's words,
                where "connectivity on one network" named the architecture. */}
            <Box tag="p" className='eyebrow'>Internet · Cellular · Voice · Messaging · AI</Box>
            <Box tag="h1" className='display mt-3 max-w-[16ch]'>Everything your business needs to connect.</Box>
            <Box tag="p" className='lede mt-4'>
              Lux brings communications, connectivity and intelligent automation into one platform — one account, one
              bill, one team behind it. From a phone number, to a remote site, to an agent that can answer, act and
              operate on your behalf.
            </Box>
            <Box className='mt-6 flex flex-col gap-2 sm:flex-row'>
              <Box tag="a" href={contactHref('Lux Tel')} className='btn btn-solid'>
                Tell us what you&rsquo;re connecting
                <ArrowRight className={'h-4 w-4'} style={css('h-4 w-4')} aria-hidden='true' />
              </Box>
              <Link href='/products' className={'btn btn-ghost'} style={css('btn btn-ghost')}>
                See what we do
              </Link>
            </Box>
          </div>

        </Box>
      </Box>

      <Box tag="section" className='band'>
        <Box className='wrap'>
          <Box tag="dl" className='grid gap-x-8 gap-y-8 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4'>
            {CAPABILITIES.map((c, i) => {
              const Icon = [Earth, Radio, Phone, Bot][i] ?? Antenna
              return (
                <div key={c.headline}>
                  <Icon className={'h-5 w-5 text-white/50'} style={css('h-5 w-5 text-white/50')} aria-hidden='true' />
                  <Box tag="dt" className='h3 mt-4'>{c.headline}</Box>
                  <Box tag="dd" className='mt-2 text-sm leading-relaxed text-white/60'>{c.note}</Box>
                </div>
              )
            })}
          </Box>
        </Box>
      </Box>

      {/* The pain, in their words, before any claim of ours. A page that opens with
          what we sell asks the reader to care first; this one names the thing they
          already live with. */}
      <Box tag="section" className='band'>
        <Box className='wrap'>
          <Box tag="p" className='eyebrow'>The problem</Box>
          <Box tag="h2" className='h2 mt-4 max-w-[20ch]'>Most companies piece this together themselves.</Box>
          <Box className='mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16'>
            <Box tag="ul" className='space-y-1 text-base leading-relaxed text-white/60 sm:text-lg'>
              {[
                'One provider for internet.',
                'Another for mobile connectivity.',
                'Another for phone numbers.',
                'Another for messaging.',
                'Another for AI.',
              ].map((l) => (
                <li key={l}>{l}</li>
              ))}
            </Box>
            <div>
              <Box tag="p" className='text-base leading-relaxed text-white/70 sm:text-lg'>
                Then five portals, five contracts, five support teams, and nobody responsible for the whole thing.
              </Box>
              <Box tag="p" className='mt-5 text-base leading-relaxed text-white/70 sm:text-lg'>
                Lux replaces that stack with one relationship. We source the infrastructure, integrate the services,
                provision what you need, and give you a single place to operate it.
              </Box>
            </div>
          </Box>
        </Box>
      </Box>

      {/* The argument once, at full size — every other section here is a heading
          over a grid. */}
      <Box tag="section" className='band'>
        <Box className='wrap'>
          <Box tag="p" className='display max-w-[24ch]'>
            One platform.{' '}
            <Box tag="span" className='text-white/40'>Every connection.</Box>
          </Box>
        </Box>
      </Box>

      {/* The reader this page is really for: whoever owns capacity and wants it to
          be a service someone can buy. It sits directly under the claim because it
          is the most valuable conversation on the site, not a footnote to it. */}
      <Box tag="section" className='band'>
        <Box className='wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16'>
          <div>
            <Box tag="p" className='eyebrow'>For operators</Box>
            <Box tag="h2" className='h2 mt-4 max-w-[18ch]'>Capacity is not a product.</Box>
          </div>
          <div>
            <Box tag="p" className='text-base leading-relaxed text-white/70 sm:text-lg'>
              You have beams over every ocean and desert. Selling that as service is a different trade: numbers a
              regulator will grant, interconnect with the carriers your users already dial, an emergency call that
              reaches the right dispatcher, lawful process in each country, and a bill that clears.
            </Box>
            <Box tag="p" className='mt-5 text-base leading-relaxed text-white/70 sm:text-lg'>
              That is years of licences, and it is already running here. Bring the beam. We bring the dial tone.
            </Box>
            <Box tag="a" href={contactHref('Operator partnership')} className='btn btn-solid mt-8'>
              Talk to our carrier team
              <ArrowRight className={'h-4 w-4'} style={css('h-4 w-4')} aria-hidden='true' />
            </Box>
          </div>
        </Box>
      </Box>

      <Box tag="section" className='band'>
        <Box className='wrap'>
          <Box tag="p" className='eyebrow'>How it fits together</Box>
          <Box tag="h2" className='h2 mt-4 max-w-[20ch]'>From the network to the model.</Box>
          <Box tag="p" className='lede mt-5'>
            Six layers a business normally buys from six companies, arranged as one service — the way online,
            the devices that move, the number, the message, the agent, and the network holding it together.
          </Box>
          <Box tag="ol" className='mt-10 divide-y divide-white/10 border-y border-white/10'>
            {STACK.map((l) => (
              <Box tag="li" key={l.n} className='grid gap-3 py-7 md:grid-cols-[280px_1fr] md:gap-10'>
                <div>
                  <Box className='h3'>{l.name}</Box>
                  <Box className='mt-1 text-sm text-white/40'>{l.claim}</Box>
                </div>
                <Box tag="p" className='text-sm leading-relaxed text-white/60'>{l.detail}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* What people buy it for. It lived only on /solutions, which nothing linked
          to from here. */}
      <Box tag="section" className='band'>
        <Box className='wrap'>
          <Box tag="p" className='eyebrow'>Solutions</Box>
          <Box tag="h2" className='h2 mt-4 max-w-[24ch]'>For the places software meets the real world.</Box>
          <Box tag="p" className='lede mt-5'>
            Find the one that looks like yours and we will tell you exactly how it is put together.
          </Box>
          <Box className='mt-10 divide-y divide-white/10 border-y border-white/10'>
            {SOLUTIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/solutions#${s.slug}`}
                className={'group grid gap-3 py-7 transition-colors hover:bg-white/[0.03] md:grid-cols-[300px_1fr] md:gap-10'} style={css('group grid gap-3 py-7 transition-colors hover:bg-white/[0.03] md:grid-cols-[300px_1fr] md:gap-10')}
              >
                <Box className='h3 flex items-baseline gap-2'>
                  {s.name}
                  <Box tag="span" className="h-3.5 w-3.5 shrink-0 text-white/0 transition-colors group-hover:text-white/50 grid">
                    <ArrowRight
                    className={'h-3.5 w-3.5 shrink-0 text-white/0 transition-colors group-hover:text-white/50'} style={css('w-full h-full')}
                    aria-hidden='true'
                  />
                  </Box>
                </Box>
                <Box tag="p" className='text-sm leading-relaxed text-white/60'>{s.problem}</Box>
              </Link>
            ))}
          </Box>
        </Box>
      </Box>

      <Box tag="section" className='band'>
        <Box className='wrap'>
          <Box tag="p" className='eyebrow'>Products</Box>
          <Box tag="h2" className='h2 mt-4 max-w-[24ch]'>Building blocks for the connected business.</Box>
          <Box tag="p" className='lede mt-5'>
            A number, a SIM, a terminal and an agent are the same kind of thing here: created with a call, and
            cancelled with another.
          </Box>
          <Box className='mt-10 space-y-12'>
            {PILLARS.map((pillar) => (
              <Box key={pillar.slug} id={pillar.slug} className='scroll-mt-20'>
                <Box className='flex flex-wrap items-baseline justify-between gap-3 border-b border-white/10 pb-3'>
                  <Box tag="h3" className='font-heading text-lg font-bold'>{pillar.name}</Box>
                  <Link href={`/products#${pillar.slug}`} className={'inline-flex min-h-[var(--tap-target)] items-center text-sm text-white/40 transition-colors hover:text-white'} style={css('inline-flex min-h-[var(--tap-target)] items-center text-sm text-white/40 transition-colors hover:text-white')}>
                    See all
                  </Link>
                </Box>
                <Box tag="p" className='mt-4 max-w-3xl text-sm leading-relaxed text-white/60'>{pillar.summary}</Box>
                <Box className='mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  {pillar.primitives.map((p) => (
                    <Card key={p.slug} primitive={p} />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Post-quantum, on its own. It is the one claim here a competitor cannot
          match by buying the same wholesale, and it is invisible unless said. */}
      <Box tag="section" className='band'>
        <Box className='wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16'>
          <div>
            <Box tag="p" className='eyebrow'>Post-quantum</Box>
            <Box tag="h2" className='h2 mt-4 max-w-[20ch]'>Encrypted against a machine that does not exist yet.</Box>
          </div>
          <div>
            <Box tag="p" className='text-base leading-relaxed text-white/70 sm:text-lg'>
              Traffic captured today can be kept and decrypted later, once something exists that can do it. For card
              traffic, payment instructions, health records and legal process, that is not a future problem — the data
              still matters in a decade.
            </Box>
            <Box tag="p" className='mt-5 text-base leading-relaxed text-white/70 sm:text-lg'>
              Lux links carry hybrid key exchange: a classical algorithm and a lattice one together, so a session is no
              weaker than it is today and still stands when the other machine arrives. Federal guidance sets a 2030
              target for readiness. Ours is already on.
            </Box>
            <Link href='/products/post-quantum' className={'btn btn-ghost mt-8'} style={css('btn btn-ghost mt-8')}>
              How it works
              <ArrowRight className={'h-4 w-4'} style={css('h-4 w-4')} aria-hidden='true' />
            </Link>
          </div>
        </Box>
      </Box>

      {/* The agentic argument, on its own. It is the newest line and the one a
          reader is least likely to already have a mental model for, so it gets
          space rather than a card in a grid. */}
      <Box tag="section" className='band'>
        <Box className='wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16'>
          <div>
            <Box tag="p" className='eyebrow'>Agentic AI</Box>
            <Box tag="h2" className='h2 mt-4 max-w-[18ch]'>AI that can actually do something.</Box>
            <Box tag="p" className='mt-6 text-base leading-relaxed text-white/70 sm:text-lg'>
              Most AI stops at the answer. A Lux agent takes the next step, with the same tools your team uses: voice,
              messaging, your business systems, your APIs, your data, and the connectivity underneath all of it.
            </Box>
            <Box tag="a" href={contactHref('Agentic AI')} className='btn btn-solid mt-8'>
              Give an agent a number
              <ArrowRight className={'h-4 w-4'} style={css('h-4 w-4')} aria-hidden='true' />
            </Box>
          </div>
          {/* An icon per action, not a repeated dot. Ten identical markers is a
              bullet list wearing a grid; the icons say which action each line is
              before the words do. */}
          <Box tag="ul" className='grid gap-x-8 gap-y-2 sm:grid-cols-2'>
            {(
              [
                [PhoneIncoming, 'Answer the phone'],
                [Send, 'Send a message'],
                [Search, 'Look up an account'],
                [Ticket, 'Create a ticket'],
                [CalendarClock, 'Schedule an appointment'],
                [Database, 'Update your CRM'],
                [Workflow, 'Trigger a workflow'],
                [Braces, 'Call an API'],
                [UserRound, 'Escalate to a person'],
                [CircleCheck, 'Or finish the whole process'],
              ] as const
            ).map(([Icon, a]) => (
              <Box tag="li" key={a} className='flex items-center gap-3 border-b border-white/10 py-3 text-sm text-white/70'>
                <Icon className={'h-4 w-4 shrink-0 text-white/40'} style={css('h-4 w-4 shrink-0 text-white/40')} aria-hidden='true' />
                {a}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box tag="section" className='band'>
        <Box className='wrap'>
          <Box tag="p" className='eyebrow'>Why Lux</Box>
          <Box tag="h2" className='h2 mt-4 max-w-[20ch]'>One account instead of five.</Box>
          <Box className='mt-8 grid gap-4 md:grid-cols-2'>
            {DIFFERENTIATORS.map((d) => (
              <Box key={d.claim} className='card'>
                <Box className='h3'>{d.claim}</Box>
                <Box tag="p" className='mt-2 text-sm leading-relaxed text-white/60'>{d.detail}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>


      {/* The close. Everything above is the argument; this is the part that removes
          the reason to put it off, by saying plainly what happens after the email. */}
      <Box tag="section" className='band'>
        <Box className='wrap'>
          <Box tag="p" className='eyebrow'>How we build it</Box>
          <Box tag="h2" className='h2 mt-4 max-w-[24ch]'>We use the right infrastructure for the job.</Box>
          <Box className='mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16'>
            <Box tag="p" className='text-base leading-relaxed text-white/70 sm:text-lg'>
              Lux does not depend on a single network, carrier or infrastructure provider. That is the point.
              Different workloads need different networks, different countries need different operators, and different
              locations need different ways online.
            </Box>
            <Box tag="p" className='text-base leading-relaxed text-white/70 sm:text-lg'>
              We combine what sits underneath around your requirements and present it as one Lux service. You tell us
              what needs to work. We handle the rest of it.
            </Box>
          </Box>

          <Box className='mt-16 border-t border-white/10 pt-12'>
            <Box tag="p" className='eyebrow'>Where it goes</Box>
            <Box tag="h2" className='h2 mt-4 max-w-[22ch]'>From connectivity to intelligence.</Box>
            <Box tag="p" className='lede mt-6'>
              The network used to be the endpoint. Now it is the foundation. A connected device reports what is
              happening. A connected application talks to the customer. A connected agent understands the situation
              and acts on it.
            </Box>
            <Box className='mt-10 grid gap-4 md:grid-cols-3'>
              {(
                [
                  [Earth, 'Connect the world.', 'Internet, cellular and satellite, wherever the work is.'],
                  [MessageSquare, 'Communicate with it.', 'Numbers, calls and messages, from your own code.'],
                  [Zap, 'Act on it.', 'Agents that take the next step inside your systems.'],
                ] as const
              ).map(([Icon, t, d]) => (
                <Box key={t} className='card'>
                  <Icon className={'h-5 w-5 text-white/50'} style={css('h-5 w-5 text-white/50')} aria-hidden='true' />
                  <Box className='h3 mt-4'>{t}</Box>
                  <Box tag="p" className='mt-2 text-sm leading-relaxed text-white/60'>{d}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box tag="section" className='band'>
        <Box className='wrap'>
          <Box tag="p" className='eyebrow'>Getting started</Box>
          <Box tag="h2" className='h2 mt-4 max-w-[22ch]'>Tell us what needs to happen.</Box>
          <Box tag="ol" className='mt-10 divide-y divide-white/10 border-y border-white/10'>
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
              <Box tag="li" key={t} className='grid gap-3 py-7 md:grid-cols-[280px_1fr] md:gap-10'>
                <Box className='h3'>{t}</Box>
                <Box tag="p" className='text-sm leading-relaxed text-white/60'>{d}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box tag="section" className='band'>
        <Box className='wrap max-w-3xl text-center'>
          <Box tag="h2" className='h2'>What are you connecting?</Box>
          <Box tag="ul" className='mx-auto mt-8 max-w-2xl space-y-2 text-base leading-relaxed text-white/60'>
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
          </Box>
          <Box tag="p" className='mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/80'>
            Tell us what it needs to do. We will build the connection around it.
          </Box>
          <Box tag="a" href={contactHref('Lux Tel')} className='btn btn-solid mt-8'>
            {CONTACT_EMAIL}
            <ArrowRight className={'h-4 w-4'} style={css('h-4 w-4')} aria-hidden='true' />
          </Box>
        </Box>
      </Box>
    </>
  )
}
