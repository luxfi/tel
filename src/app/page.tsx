import React from 'react'
import { Antenna, ArrowRight, Hash, MessageSquare, Phone, SatelliteDish } from 'lucide-react'

import { CONTACT_EMAIL, contactHref, partners } from '../site'

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className='mb-4 text-[10px] font-semibold uppercase tracking-wider text-white/40'>{children}</p>
)

const Card: React.FC<{
  icon: React.ElementType
  title: string
  children: React.ReactNode
}> = ({ icon: Icon, title, children }) => (
  <div className='rounded-xl border border-neutral-800 bg-neutral-900/50 p-6'>
    <Icon className='mb-3 h-6 w-6 text-white/80' aria-hidden='true' />
    <h3 className='mb-2 font-semibold'>{title}</h3>
    <p className='text-sm leading-relaxed text-white/60'>{children}</p>
  </div>
)

export default function Page() {
  return (
    <>
      <section className='relative py-20 lg:py-32'>
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent' aria-hidden='true' />
        <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl lg:text-center'>
            <Eyebrow>Telecommunications &amp; satellite</Eyebrow>
            <h1 className='font-heading text-[26px] font-bold leading-[1.15] text-balance sm:text-4xl lg:text-5xl'>
              Voice, messaging, and satellite connectivity.
            </h1>
            <p className='mt-6 text-lg leading-relaxed text-white/60 sm:text-xl'>
              Lux runs telecommunications infrastructure — programmable voice, messaging, and phone
              numbers — and provides satellite internet where wire and tower don&rsquo;t reach.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row lg:justify-center'>
              <a
                href={contactHref('Lux Tel')}
                className='inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-white/90'
              >
                Talk to us
                <ArrowRight className='h-4 w-4' aria-hidden='true' />
              </a>
              <a
                href='#platform'
                className='inline-flex min-h-[44px] items-center justify-center rounded-md border border-white/20 px-6 text-sm font-medium transition-colors hover:border-white/40'
              >
                What we do
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id='platform' className='border-t border-white/10 py-16 lg:py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl'>
            <Eyebrow>Telecom platform</Eyebrow>
            <h2 className='font-heading text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl'>
              Programmable voice and messaging
            </h2>
            <p className='mt-5 text-base leading-relaxed text-white/60 sm:text-lg'>
              Calling and messaging your software drives directly. Carrier-grade infrastructure
              underneath, an API on top.
            </p>
          </div>
          <div className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <Card icon={Phone} title='Voice'>
              Place and receive calls from your own code, and route them where they need to go.
            </Card>
            <Card icon={MessageSquare} title='Messaging'>
              Send and receive text messages from your application.
            </Card>
            <Card icon={Hash} title='Phone numbers'>
              Provision numbers and attach them to your voice and messaging flows.
            </Card>
          </div>
        </div>
      </section>

      <section id='satellite' className='border-t border-white/10 py-16 lg:py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl'>
            <Eyebrow>Satellite internet</Eyebrow>
            <h2 className='font-heading text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl'>
              Connectivity past the end of the line
            </h2>
            <p className='mt-5 text-base leading-relaxed text-white/60 sm:text-lg'>
              Some sites will never be worth trenching to — remote operations, temporary sites, a
              fixed line that needs a second path. Those get their link from orbit.
            </p>
          </div>
          <div className='mt-10 grid gap-4 sm:grid-cols-2'>
            <Card icon={SatelliteDish} title='Terminals and service'>
              Lux supplies satellite internet equipment and the connectivity service that runs on it.
            </Card>
            <Card icon={Antenna} title='Starlink'>
              Starlink hardware and service, distributed by Lux. Lux is an authorized Starlink
              reseller.
            </Card>
          </div>
        </div>
      </section>

      <section className='border-t border-white/10 py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <Eyebrow>Partnerships</Eyebrow>
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

      <section className='border-t border-white/10 py-16'>
        <div className='mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='font-heading text-2xl font-bold leading-tight sm:text-3xl'>Talk to us</h2>
          <p className='mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60'>
            Tell us what you&rsquo;re connecting — an application that needs to make calls, a site
            that needs a link — and we&rsquo;ll come back with specifics.
          </p>
          <a
            href={contactHref('Lux Tel')}
            className='mt-8 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-white/90'
          >
            {CONTACT_EMAIL}
            <ArrowRight className='h-4 w-4' aria-hidden='true' />
          </a>
        </div>
      </section>
    </>
  )
}
