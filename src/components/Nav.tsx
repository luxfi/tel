'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'

import { PILLARS } from '@/content/catalog'
import { SOLUTIONS } from '@/content/solutions'

/* The header menu, projected from content/ so it cannot drift from the catalogue.
   Also the phone navigation, which did not exist before. */

interface Item {
  readonly href: string
  readonly label: string
  readonly note?: string
}

interface Menu {
  readonly href: string
  readonly label: string
  readonly columns?: readonly { readonly heading: string; readonly items: readonly Item[] }[]
}

const MENUS: readonly Menu[] = [
  {
    href: '/products',
    label: 'Products',
    columns: PILLARS.map((p) => ({
      heading: p.name,
      items: p.primitives.map((x) => ({ href: `/products/${x.slug}`, label: x.name })),
    })),
  },
  {
    href: '/solutions',
    label: 'Solutions',
    columns: [
      {
        heading: 'By operating problem',
        items: SOLUTIONS.map((s) => ({ href: `/solutions#${s.slug}`, label: s.name })),
      },
    ],
  },
  { href: '/network', label: 'Network' },
  {
    href: '/company',
    label: 'Company',
    columns: [
      {
        heading: 'About Lux',
        items: [
          { href: '/company', label: 'Who we are' },
          { href: '/pricing', label: 'How billing works' },
          { href: '/legal', label: 'Policies' },
        ],
      },
    ],
  },
]

/**
 * A dropdown that opens on hover AND on click, and closes on Escape or blur.
 *
 * PORTALLED to the body, and it has to be: the panel spans the VIEWPORT, and the
 * header both constrains its children to a max width and sets `backdrop-filter`,
 * which makes it the containing block for anything fixed inside it. Either alone
 * would cap the panel at the container.
 *
 * Portalling costs the hover relationship — the panel is no longer a descendant of
 * the trigger, so leaving the trigger fires immediately, on the way to the thing
 * you are reaching for. A short grace period, cancelled by entering the panel,
 * makes the two behave as one control.
 */
function Dropdown({ menu }: { menu: Menu }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [top, setTop] = useState(56)
  const trigger = useRef<HTMLDivElement | null>(null)

  useEffect(() => setMounted(true), [])

  const shut = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hold = () => {
    if (shut.current) clearTimeout(shut.current)
    shut.current = null
  }
  const leave = () => {
    hold()
    shut.current = setTimeout(() => setOpen(false), 140)
  }
  // MEASURED, not assumed: the panel hangs off the header's real bottom edge, so a
  // header that changes height does not leave a gap the pointer has to cross.
  const show = () => {
    hold()
    const header = trigger.current?.closest('header')
    if (header) setTop(header.getBoundingClientRect().bottom)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!menu.columns) {
    return (
      <Link
        href={menu.href}
        className='inline-flex min-h-tap items-center rounded-sm px-3 text-sm text-white/60 transition-colors hover:text-white'
      >
        {menu.label}
      </Link>
    )
  }

  const wide = menu.columns.length > 2

  return (
    <div ref={trigger} onMouseEnter={show} onMouseLeave={leave}>
      <button
        type='button'
        aria-expanded={open}
        aria-haspopup='true'
        onClick={() => (open ? setOpen(false) : show())}
        className='inline-flex min-h-tap items-center gap-1 rounded-sm px-3 text-sm text-white/60 transition-colors hover:text-white'
      >
        {menu.label}
        <ChevronDown className={'h-3.5 w-3.5 transition-transform ' + (open ? 'rotate-180' : '')} aria-hidden='true' />
      </button>

      {open && mounted
        ? createPortal(
            <div
              onMouseEnter={hold}
              onMouseLeave={leave}
              style={{ top }}
              // OPAQUE and edge to edge. Glass let the globe move behind the links,
              // which is motion under text somebody is reading.
              className='fixed inset-x-0 z-40 border-b border-white/10 bg-black shadow-[0_24px_60px_rgba(0,0,0,0.6)]'
            >
              {/* Full bleed panel, container-aligned content: the links land under
                  the wordmark, which is where the eye already is. */}
              <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
                <div
                  className={wide ? 'megagrid gap-x-4 gap-y-8' : ''}
                  style={wide ? ({ ['--cols' as string]: String(menu.columns.length) } as React.CSSProperties) : undefined}
                >
                  {menu.columns.map((col) => (
                    <div key={col.heading}>
                      <div className='eyebrow'>{col.heading}</div>
                      <ul className={'mt-3 space-y-0.5 ' + (wide ? '' : 'columns-2 sm:columns-3')}>
                        {col.items.map((it) => (
                          <li key={it.href}>
                            <Link
                              href={it.href}
                              onClick={() => setOpen(false)}
                              className='block rounded-md px-2 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white'
                            >
                              {it.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className='mt-6 border-t border-white/10 pt-4'>
                  <Link
                    href={menu.href}
                    onClick={() => setOpen(false)}
                    className='inline-flex min-h-tap items-center text-sm text-white transition-colors hover:text-white/70'
                  >
                    All {menu.label.toLowerCase()} &rarr;
                  </Link>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}

export function Nav() {
  return (
    <div className='hidden items-center gap-1 lg:flex'>
      {MENUS.map((m) => (
        <Dropdown key={m.href} menu={m} />
      ))}
    </div>
  )
}

/**
 * The phone menu: one panel, everything expanded.
 *
 * The panel's corner carries the wordmark, handed in rather than imported: this is
 * a client component, and the wordmark is drawn on the server (components/Wordmark).
 */
export function MobileNav({ wordmark }: { wordmark: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  // Portals need a DOM; this renders on the server first.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // The page behind must not scroll underneath.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className='lg:hidden'>
      <button
        type='button'
        aria-expanded={open}
        aria-label='Open menu'
        onClick={() => setOpen(true)}
        className='inline-flex h-11 w-11 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/5 hover:text-white'
      >
        <Menu className='h-5 w-5' aria-hidden='true' />
      </button>

      {/* Portalled, and it has to be: the header's backdrop-blur makes it a
          containing block, so `fixed inset-0` resolved to its 44px box. */}
      {open && mounted
        ? createPortal(
            <div className='fixed inset-0 z-[60] flex flex-col bg-black'>
          {/* Exactly the header's height, because both are one tap target tall —
              the bar takes its height from the controls in it. Said as `57px`
              here and again in the hero's min-height, it was wrong in both: the
              header measures 44, so opening the menu dropped the wordmark and
              the ✕ 6.5px below the ☰ they replaced. */}
          <div className='flex h-tap shrink-0 items-center justify-between border-b border-white/10 px-4'>
            {wordmark}
            <button
              type='button'
              aria-label='Close menu'
              onClick={() => setOpen(false)}
              className='inline-flex h-11 w-11 items-center justify-center rounded-md text-white/70 hover:text-white'
            >
              <X className='h-5 w-5' aria-hidden='true' />
            </button>
          </div>

          <nav className='flex-1 overflow-y-auto px-4 py-6'>
            {MENUS.map((m) => (
              <div key={m.href} className='mb-8'>
                <Link
                  href={m.href}
                  onClick={() => setOpen(false)}
                  className='flex min-h-tap items-center font-heading text-lg font-bold'
                >
                  {m.label}
                </Link>
                {m.columns?.map((col) => (
                  <div key={col.heading} className='mt-2'>
                    {m.columns!.length > 1 ? <div className='eyebrow mt-4'>{col.heading}</div> : null}
                    <ul className='mt-1'>
                      {col.items.map((it) => (
                        <li key={it.href}>
                          <Link
                            href={it.href}
                            onClick={() => setOpen(false)}
                            className='flex min-h-tap items-center text-sm text-white/60 transition-colors hover:text-white'
                          >
                            {it.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
              </nav>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
