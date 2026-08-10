'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'

import { PILLARS } from '@/content/catalog'
import { SOLUTIONS } from '@/content/solutions'

/*
  The header menu, PROJECTED from the same content the pages are built from. A menu
  holding its own list of products is a menu that stops matching the catalogue, and
  the mismatch is always found by someone trying to buy something.

  It also carries the mobile navigation, which did not exist: below `sm` every link
  was `hidden` and nothing replaced them, so a phone had a header with a wordmark,
  a "Talk to us" button, and no way to reach any other page.
*/

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

/** A dropdown that opens on hover AND on click, and closes on Escape or blur. */
function Dropdown({ menu }: { menu: Menu }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    // Pointer, not click: a click listener fires after the link's own handler and
    // leaves the panel open across a same-page navigation.
    const onDown = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  if (!menu.columns) {
    return (
      <Link
        href={menu.href}
        className='inline-flex min-h-[44px] items-center rounded-sm px-3 text-sm text-white/60 transition-colors hover:text-white'
      >
        {menu.label}
      </Link>
    )
  }

  const wide = menu.columns.length > 2

  return (
    <div
      ref={box}
      className='relative'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type='button'
        aria-expanded={open}
        aria-haspopup='true'
        onClick={() => setOpen((v) => !v)}
        className='inline-flex min-h-[44px] items-center gap-1 rounded-sm px-3 text-sm text-white/60 transition-colors hover:text-white'
      >
        {menu.label}
        <ChevronDown className={'h-3.5 w-3.5 transition-transform ' + (open ? 'rotate-180' : '')} aria-hidden='true' />
      </button>

      {open ? (
        <div
          className={
            // OPAQUE. At bg-black/95 the display heading behind it stayed legible
            // through the panel — 5% of 60px white type is still white type.
            'absolute left-1/2 top-full z-50 -translate-x-1/2 rounded-xl border border-white/15 bg-black p-6 shadow-2xl ' +
            (wide ? 'w-[860px]' : 'w-[300px]')
          }
        >
          {/* Columns, not a grid: seven pillars in a four-wide grid make two rows,
              and the second row starts below the TALLEST column of the first, so
              the panel carried an empty band the height of six links. Multi-column
              flows them and breaks only between pillars. */}
          <div className={wide ? 'columns-4 gap-x-6 [&>*]:break-inside-avoid' : ''}>
            {menu.columns.map((col) => (
              <div key={col.heading} className={wide ? 'mb-6' : ''}>
                <div className='eyebrow'>{col.heading}</div>
                <ul className='mt-3 space-y-0.5'>
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
          <div className='mt-5 border-t border-white/10 pt-4'>
            <Link
              href={menu.href}
              onClick={() => setOpen(false)}
              className='inline-flex min-h-[44px] items-center text-sm text-white transition-colors hover:text-white/70'
            >
              All {menu.label.toLowerCase()} &rarr;
            </Link>
          </div>
        </div>
      ) : null}
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

/** The phone menu. Same content, one panel, everything expanded — a phone has room
    to scroll and no room for a second level of tapping. */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  // Portals need a DOM, and this bundle is a static export that renders on the
  // server first.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // The panel is fixed and full-height, so the page behind it must not scroll
  // underneath — that is the tell of a menu bolted on rather than built in.
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

      {/* PORTALLED TO document.body, and it has to be.

          The header sets `backdrop-blur`, and backdrop-filter makes an element a
          CONTAINING BLOCK for fixed-position descendants. So `fixed inset-0`
          resolved against the header's own 44px box instead of the viewport: the
          panel was 44px tall, the menu overflowed invisibly, and the page showed
          through everything below the first line. It looked like a background that
          would not paint — the background was fine, the box was 44px. */}
      {open && mounted
        ? createPortal(
            <div className='fixed inset-0 z-[60] flex flex-col bg-black'>
          <div className='flex h-[57px] shrink-0 items-center justify-between border-b border-white/10 px-4'>
            <span className='text-lg'>
              <span className='font-heading font-bold tracking-tight'>LUX</span>
              <span className='text-white/40'> tel</span>
            </span>
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
                  className='flex min-h-[44px] items-center font-heading text-lg font-bold'
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
                            className='flex min-h-[44px] items-center text-sm text-white/60 transition-colors hover:text-white'
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
