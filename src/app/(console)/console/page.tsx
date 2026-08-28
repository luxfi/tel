'use client'

import React, { useEffect, useState } from 'react'
import { Box, css } from '@hanzo/ui'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { Mark } from '@/components/Mark'
import { EXPLORE } from '@/console/suites'
import { signIn, signOut, stored } from '@/console/auth'

/*
  The builder's home. Structure follows the reference — a highlight band, an
  explore grid, help, and a what's-new column — and the surface is inverted:
  black ground, white type, hairlines, with hue reserved for state.

  It lists the SAME catalog the marketing site sells from, so the console and the
  site cannot disagree about what exists.
*/

/** What shipped. Newest first; dates are the release, not the write-up. */
const NEWS = [
  {
    date: '2026-08-05',
    title: 'Voice agents answer inside a human turn',
    body: 'Inference runs in the facility the call is anchored in, so the model round trip is a hop rather than a journey. Escalation to a person keeps the call and its context.',
    href: '/products/voice-agents',
  },
  {
    date: '2026-08-03',
    title: 'Edge compute is available',
    body: 'Functions, storage and session state at the points of presence the traffic is already on — so a webhook handler stops being the slowest part of a call flow.',
    href: '/products/functions',
  },
  {
    date: '2026-08-02',
    title: 'Direct to cell enters field trial',
    body: 'Messaging to unmodified handsets past the last tower, on the same number the device carries on the ground network. Voice is in trial behind it.',
    href: '/products/direct-to-cell',
  },
]

const HELP = [
  { title: 'Developer docs', body: 'API reference for every primitive.', href: 'https://docs.lux.network', external: true },
  { title: 'How billing works', body: 'What meters, and what a commitment changes.', href: '/pricing', external: false },
  { title: 'Policies', body: 'Terms, privacy, acceptable use and emergency services.', href: '/legal', external: false },
]

export default function Console() {
  // Resolved after mount: this is a static export, so the server cannot know
  // whether anyone is signed in and guessing would flash the wrong shell.
  const [token, setToken] = useState<string | null | undefined>(undefined)
  useEffect(() => setToken(stored()), [])

  if (token === undefined) return <Box className='p-8 text-white/40'>Loading…</Box>

  if (!token) {
    return (
      <Box tag="section" className='mx-auto max-w-2xl px-6 py-24'>
        <Box tag="p" className='eyebrow'>Console</Box>
        <Box tag="h1" className='display mt-4'>Build on the network.</Box>
        <Box tag="p" className='lede mt-6'>
          Numbers, messaging, wireless, orbital terminals and voice agents, from one API. Sign in with your Lux ID —
          the same identity as every other Lux property.
        </Box>
        <Box tag="button" type='button' onClick={signIn} className='btn btn-solid mt-8'>
          Sign in with Lux ID
        </Box>
      </Box>
    )
  }

  return (
    <Box className='p-4 sm:p-6'>
      {/* The highlight band. The reference fills it with a green gradient; this is
          a glass pane and a white CTA, so the only bright thing on the page is the
          action. */}
      <Box tag="section" className='glass p-6 sm:p-8'>
        <Box tag="p" className='eyebrow'>Product highlight</Box>
        <Box tag="h1" className='h2 mt-3 max-w-[22ch]'>Conversational AI on your own numbers</Box>
        <Box tag="p" className='mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base'>
          Design and deploy voice agents with global telephony and inference co-located with the calls, for
          real-time engagement that answers inside a human turn.
        </Box>
        <Box className='mt-6 flex flex-wrap gap-3'>
          <Link href='/products/voice-agents' className={'btn btn-solid'} style={css('btn btn-solid')}>
            Try a demo
          </Link>
          <Link href='/products' className={'btn btn-ghost'} style={css('btn btn-ghost')}>
            Get started
          </Link>
        </Box>
      </Box>

      <Box className='mt-8 grid gap-8 xl:grid-cols-[1fr_360px]'>
        <div>
          <Box tag="h2" className='font-heading text-lg font-bold'>Explore products</Box>
          <Box className='mt-4 grid gap-4 sm:grid-cols-3'>
            {EXPLORE.map((e) => (
              <Box key={e.slug} className='card flex flex-col'>
                <Box className='flex items-center gap-2'>
                  <Mark slug={e.slug} />
                  <Box tag="span" className='h3'>{e.title}</Box>
                </Box>
                <Box tag="p" className='mt-2 flex-1 text-sm leading-relaxed text-white/60'>{e.blurb}</Box>
                <Link href={`/products/${e.slug}`} className={'btn btn-ghost mt-5 self-start'} style={css('btn btn-ghost mt-5 self-start')}>
                  {e.action}
                </Link>
              </Box>
            ))}
          </Box>

          <Box tag="h2" className='mt-10 font-heading text-lg font-bold'>Help and resources</Box>
          <Box className='mt-4 grid gap-4 sm:grid-cols-3'>
            {HELP.map((h) =>
              h.external ? (
                <Box tag="a" key={h.title} href={h.href} className='card' target='_blank' rel='noopener noreferrer'>
                  <Box className='flex items-center gap-2'>
                    <Box tag="span" className='h3'>{h.title}</Box>
                    <ArrowUpRight className={'h-4 w-4 text-white/40'} style={css('h-4 w-4 text-white/40')} aria-hidden='true' />
                  </Box>
                  <Box tag="p" className='mt-2 text-sm leading-relaxed text-white/60'>{h.body}</Box>
                </Box>
              ) : (
                <Link key={h.title} href={h.href} className={'card'} style={css('card')}>
                  <Box tag="span" className='h3'>{h.title}</Box>
                  <Box tag="p" className='mt-2 text-sm leading-relaxed text-white/60'>{h.body}</Box>
                </Link>
              ),
            )}
          </Box>
        </div>

        <aside>
          <Box tag="h2" className='font-heading text-lg font-bold'>What&rsquo;s new</Box>
          <Box tag="ol" className='mt-4 space-y-3'>
            {NEWS.map((n) => (
              <Box tag="li" key={n.title} className='card'>
                <Box tag="time" dateTime={n.date} className='eyebrow tabular'>
                  {n.date}
                </Box>
                <Box tag="h3" className='h3 mt-2'>{n.title}</Box>
                <Box tag="p" className='mt-2 text-sm leading-relaxed text-white/60'>{n.body}</Box>
                <Link
                  href={n.href}
                  className={'mt-3 inline-flex min-h-[var(--tap-target)] items-center gap-1 text-sm text-white/70 transition-colors hover:text-white'} style={css('mt-3 inline-flex min-h-[var(--tap-target)] items-center gap-1 text-sm text-white/70 transition-colors hover:text-white')}
                >
                  Read more
                  <ArrowUpRight className={'h-3.5 w-3.5'} style={css('h-3.5 w-3.5')} aria-hidden='true' />
                </Link>
              </Box>
            ))}
          </Box>

          <Box tag="button" type='button' onClick={signOut} className='btn btn-ghost mt-6 w-full'>
            Sign out
          </Box>
        </aside>
      </Box>
    </Box>
  )
}
