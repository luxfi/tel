'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { Mark } from '@/components/Mark'
import { SUITES } from '@/console/suites'

/**
 * The sidebar's catalogue: every suite, one open at a time.
 *
 * The only part of the console's chrome that holds state, and so the only part
 * that is a client component. The rest of the chrome renders on the server,
 * which is where the wordmark has to be drawn (see components/Wordmark).
 */
export function Catalog() {
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
              className='flex min-h-tap w-full items-center justify-between rounded-md px-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white'
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
                      <Mark slug={p.slug} />
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
