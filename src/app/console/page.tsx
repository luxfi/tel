'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Terminal } from 'lucide-react'

import { PILLARS, STATUS_LABEL } from '../../content/catalog'
import { signIn, signOut, stored } from '../../console/auth'

/*
  The builder's home. It is deliberately the same catalog the marketing site
  renders — a console that lists different products from the site that sold them
  is how the two drift, and the drift is always discovered by a customer.

  What a first-run console owes someone: what they can build, the first call for
  each, and where the reference is. Not a chart of zero.
*/

const START = [
  { pillar: 'communications', slug: 'numbers', action: 'Buy a number', curl: 'GET /v1/numbers/available?country=US' },
  { pillar: 'communications', slug: 'voice', action: 'Place a call', curl: 'POST /v1/calls' },
  { pillar: 'communications', slug: 'sms', action: 'Send a message', curl: 'POST /v1/messages' },
  { pillar: 'wireless', slug: 'esim', action: 'Issue an eSIM', curl: 'POST /v1/esim/profiles' },
  { pillar: 'orbit', slug: 'orbital-broadband', action: 'Order a terminal', curl: 'POST /v1/orbit/terminals' },
  { pillar: 'intelligence', slug: 'voice-agents', action: 'Deploy an agent', curl: 'POST /v1/agents' },
]

export default function Console() {
  // Rendered after mount: this is a static export, so the server has no idea
  // whether anyone is signed in and guessing would flash the wrong shell.
  const [token, setToken] = useState<string | null | undefined>(undefined)
  useEffect(() => setToken(stored()), [])

  if (token === undefined) return <div className='wrap py-24 text-white/40'>Loading…</div>

  if (!token) {
    return (
      <section className='wrap py-24'>
        <p className='eyebrow'>Console</p>
        <h1 className='display mt-4 max-w-[16ch]'>Build on the network.</h1>
        <p className='lede mt-6'>
          Numbers, messaging, wireless, orbital terminals and voice agents, from one API. Sign in with your Lux ID —
          the same identity as every other Lux property.
        </p>
        <button type='button' onClick={signIn} className='btn btn-solid mt-8'>
          Sign in with Lux ID
        </button>
      </section>
    )
  }

  return (
    <>
      <section className='wrap py-12'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='eyebrow'>Console</p>
            <h1 className='h2 mt-3'>What do you want to build?</h1>
          </div>
          <button type='button' onClick={signOut} className='btn btn-ghost'>
            Sign out
          </button>
        </div>
      </section>

      <section className='wrap pb-12'>
        <p className='eyebrow'>Start here</p>
        <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {START.map((s) => (
            <Link key={s.slug} href={`/products/${s.slug}`} className='card'>
              <div className='flex items-center gap-2'>
                <Terminal className='h-4 w-4 text-white/60' aria-hidden='true' />
                <span className='h3'>{s.action}</span>
              </div>
              <code className='mt-3 block overflow-x-auto rounded-md border border-neutral-800 bg-black px-3 py-2 text-[12px] text-white/60'>
                {s.curl}
              </code>
            </Link>
          ))}
        </div>
      </section>

      <section className='band'>
        <div className='wrap'>
          <p className='eyebrow'>Everything available to you</p>
          <div className='mt-6 space-y-10'>
            {PILLARS.map((pillar) => (
              <div key={pillar.slug}>
                <h2 className='font-heading text-lg font-bold'>{pillar.name}</h2>
                <div className='mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                  {pillar.primitives.map((p) => (
                    <Link key={p.slug} href={`/products/${p.slug}`} className='card'>
                      <div className='flex items-center gap-2'>
                        <span className={`dot dot-${p.status}`} aria-hidden='true' />
                        <span className='h3'>{p.name}</span>
                      </div>
                      <p className='mt-2 text-sm leading-relaxed text-white/60'>{p.blurb}</p>
                      {p.api ? (
                        <code className='mt-3 block truncate text-[11px] text-white/40'>{p.api}</code>
                      ) : (
                        <p className='mt-3 text-[10px] font-semibold uppercase tracking-wider text-amber-300'>
                          {p.status === 'live' ? '' : STATUS_LABEL[p.status]}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='band'>
        <div className='wrap grid gap-4 sm:grid-cols-3'>
          <a href='https://docs.lux.network' className='card' target='_blank' rel='noopener noreferrer'>
            <div className='flex items-center gap-2'>
              <span className='h3'>Developer docs</span>
              <ArrowUpRight className='h-4 w-4 text-white/40' aria-hidden='true' />
            </div>
            <p className='mt-2 text-sm text-white/60'>API reference for every primitive.</p>
          </a>
          <Link href='/pricing' className='card'>
            <span className='h3'>How billing works</span>
            <p className='mt-2 text-sm text-white/60'>What meters, and what a commitment changes.</p>
          </Link>
          <Link href='/legal' className='card'>
            <span className='h3'>Policies</span>
            <p className='mt-2 text-sm text-white/60'>Terms, privacy, acceptable use and emergency services.</p>
          </Link>
        </div>
      </section>
    </>
  )
}
