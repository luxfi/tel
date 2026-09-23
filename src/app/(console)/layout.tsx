import React, { type PropsWithChildren } from 'react'
import Link from 'next/link'
import { Bell, CircleHelp, MessageSquare, Search, User } from 'lucide-react'

import { Wordmark } from '@/components/Wordmark'
import { Catalog } from '@/console/Catalog'

/*
  The console's own chrome: a sidebar of suites and a top bar. It renders in a
  route group of its own so it never has to sit inside the marketing header and
  footer — a console that wears a brochure's chrome reads like one.

  MONOCHROME, and inverted from the reference: black ground, white type, hairline
  rules. The reference leans on a green gradient hero and coloured product chips;
  colour here is reserved for STATE (a service is in field trial, a platform is
  degraded), which is the only thing on this page a reader has to act on.
*/

/** The Lux mark. It is the AI affordance too — see the top bar. */
function Triangle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox='0 0 100 100' className={className} aria-hidden='true'>
      <path d='M50 85 L15 25 L85 25 Z' fill='currentColor' />
    </svg>
  )
}

const ICONS = [
  { Icon: Bell, label: 'Notifications' },
  { Icon: CircleHelp, label: 'Help' },
  { Icon: MessageSquare, label: 'Messages' },
  { Icon: User, label: 'Account' },
]

export default function ConsoleLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex min-h-screen'>
      <aside className='hidden w-[248px] shrink-0 flex-col border-r border-white/10 lg:flex'>
        {/* The wordmark, not the mark: this is the product's name in its own
            console, and the triangle is spoken for below. */}
        <div className='flex h-[60px] shrink-0 items-center px-5'>
          <Wordmark href='/' />
        </div>

        <nav className='flex flex-1 flex-col gap-0.5 overflow-y-auto p-3'>
          <Link
            href='/console'
            className='flex min-h-tap items-center rounded-md bg-white/10 px-3 text-sm font-medium text-white'
          >
            Home
          </Link>
          <Catalog />

          {/* The account's own records, and both halves now answer.

              These were linked before either existed — the pages were never written
              and /v1/tel was unreleased, so all three 404'd for as long as the
              sidebar did. The condition for putting them back was that the route AND
              the endpoint answer; /v1/tel shipped in cloud sha-df1f56d4 and the
              pages are here, so they are back.

              Anything added below has to clear the same bar: `every internal link
              resolves` fails the build on a link to a page that does not exist. */}
          <div className='my-3 border-t border-white/10' />
          {[
            ['/console/numbers', 'Numbers'],
            ['/console/calls', 'Calls'],
            ['/console/messages', 'Messages'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className='flex min-h-tap items-center rounded-md px-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white'
            >
              {label}
            </Link>
          ))}

          {/* Billing lives at pay.lux.tel: the same Lux ID, the org's balance, top-up,
              plans and invoices, served by commerce for the lux org. */}
          <div className='my-3 border-t border-white/10' />
          {[
            ['https://pay.lux.tel', 'Billing'],
            ['https://pay.lux.tel/invoices', 'Invoices'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className='flex min-h-tap items-center rounded-md px-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white'
            >
              {label}
            </a>
          ))}

          <div className='my-3 border-t border-white/10' />
          <a
            href='mailto:hi@lux.tel?subject=Lux%20Tel'
            className='flex min-h-tap items-center rounded-md px-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white'
          >
            Chat with us
          </a>
        </nav>

        {/* Status is the one place a hue earns its keep: it is the fact somebody
            acts on, and it is read at a glance or not at all. */}
        <a
          href='https://status.lux.network'
          className='m-3 flex min-h-tap items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white'
        >
          <span className='dot dot-live' aria-hidden='true' />
          Platform status
        </a>
      </aside>

      <div className='flex min-w-0 flex-1 flex-col'>
        <header className='flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 sm:px-6'>
          <Wordmark href='/' className='lg:hidden' />

          <label className='ml-auto hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 px-4 sm:flex sm:max-w-md'>
            <Search className='h-4 w-4 shrink-0 text-white/40' aria-hidden='true' />
            <span className='sr-only'>Search the console</span>
            <input
              type='search'
              placeholder='Search'
              className='min-h-[40px] w-full bg-transparent text-sm outline-none placeholder:text-white/40'
            />
            <kbd className='hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-xs text-white/40 md:block'>
              ⌘K
            </kbd>
          </label>

          <div className='flex items-center gap-1'>
            {/* The triangle IS the AI affordance. The reference uses a sparkle;
                ours is the mark, which is the one glyph this product already owns. */}
            <Link
              href='/products/chat'
              aria-label='Lux Chat'
              className='inline-flex h-11 w-11 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/5 hover:text-white'
            >
              <Triangle className='h-4 w-4' />
            </Link>
            {ICONS.map(({ Icon, label }) => (
              <button
                key={label}
                type='button'
                aria-label={label}
                className='inline-flex h-11 w-11 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/5 hover:text-white'
              >
                <Icon className='h-4 w-4' aria-hidden='true' />
              </button>
            ))}
          </div>
        </header>

        <main className='min-w-0 flex-1'>{children}</main>
      </div>
    </div>
  )
}
