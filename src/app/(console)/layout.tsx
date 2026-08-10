'use client'

import React, { type PropsWithChildren, useState } from 'react'
import Link from 'next/link'
import { Bell, ChevronRight, CircleHelp, MessageSquare, Search, User } from 'lucide-react'

import { SUITES } from '@/console/suites'

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

function Suites() {
  // Collapsed by default: five suites open at once is a wall, and the console's
  // first job is to let somebody find one thing.
  const [open, setOpen] = useState<string | null>(null)
  return (
    <>
      {SUITES.map((s) => {
        const isOpen = open === s.slug
        return (
          <div key={s.slug}>
            <button
              type='button'
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : s.slug)}
              className='flex min-h-[44px] w-full items-center justify-between rounded-md px-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white'
            >
              {s.name}
              <ChevronRight
                className={'h-4 w-4 text-white/30 transition-transform ' + (isOpen ? 'rotate-90' : '')}
                aria-hidden='true'
              />
            </button>
            {isOpen ? (
              <ul className='mb-1 ml-3 border-l border-white/10 pl-3'>
                {s.items.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/products/${p.slug}`}
                      className='flex min-h-[36px] items-center gap-2 rounded-md px-2 text-sm text-white/50 transition-colors hover:text-white'
                    >
                      <span className={`dot dot-${p.status}`} aria-hidden='true' />
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      })}
    </>
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
        <Link href='/' className='flex h-[60px] items-center gap-2.5 px-5 text-lg' aria-label='Lux Tel, home'>
          <span className='font-heading font-bold tracking-tight'>LUX</span>
          <span className='text-white/40'>tel</span>
        </Link>

        <nav className='flex flex-1 flex-col gap-0.5 overflow-y-auto p-3'>
          <Link
            href='/console'
            className='flex min-h-[44px] items-center rounded-md bg-white/10 px-3 text-sm font-medium text-white'
          >
            Home
          </Link>
          <Suites />

          <div className='my-3 border-t border-white/10' />
          {[
            ['/console/reporting', 'Reporting'],
            ['/console/debugging', 'Debugging'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className='flex min-h-[44px] items-center rounded-md px-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white'
            >
              {label}
            </Link>
          ))}

          <div className='my-3 border-t border-white/10' />
          <Link
            href='/console/assistant'
            className='flex min-h-[44px] items-center gap-2 rounded-md px-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white'
          >
            <Triangle className='h-3 w-3' />
            Ask our AI assistant
          </Link>
          <a
            href='mailto:hi@lux.tel?subject=Lux%20Tel'
            className='flex min-h-[44px] items-center rounded-md px-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white'
          >
            Chat with us
          </a>
        </nav>

        {/* Status is the one place a hue earns its keep: it is the fact somebody
            acts on, and it is read at a glance or not at all. */}
        <a
          href='https://status.lux.tel'
          className='m-3 flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white'
        >
          <span className='dot dot-live' aria-hidden='true' />
          Platform status
        </a>
      </aside>

      <div className='flex min-w-0 flex-1 flex-col'>
        <header className='flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 sm:px-6'>
          <Link href='/' className='flex items-center gap-2.5 text-lg lg:hidden' aria-label='Lux Tel, home'>
            <span className='font-heading font-bold tracking-tight'>LUX</span>
            <span className='text-white/40'>tel</span>
          </Link>

          <label className='ml-auto hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 px-4 sm:flex sm:max-w-md'>
            <Search className='h-4 w-4 shrink-0 text-white/40' aria-hidden='true' />
            <span className='sr-only'>Search the console</span>
            <input
              type='search'
              placeholder='Search'
              className='min-h-[40px] w-full bg-transparent text-sm outline-none placeholder:text-white/40'
            />
            <kbd className='hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/40 md:block'>
              ⌘K
            </kbd>
          </label>

          <div className='flex items-center gap-1'>
            {/* The triangle IS the AI affordance. The reference uses a sparkle;
                ours is the mark, which is the one glyph this product already owns. */}
            <Link
              href='/console/assistant'
              aria-label='Ask our AI assistant'
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
