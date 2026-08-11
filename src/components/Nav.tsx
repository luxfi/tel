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

/** A dropdown that opens on hover AND on click, and closes on Escape or blur. */
function Dropdown({ menu }: { menu: Menu }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    // Pointer, not click: click fires after the link and leaves the panel open.
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

  // A menu with groups to spread is a mega-menu and takes the container; one
  // group is a list and hangs off its own trigger.
  const wide = menu.columns.length > 2

  return (
    <div
      ref={box}
      // STATIC when wide, so the panel's containing block is the header row and
      // `inset-x-0` resolves to the container. Positioned when narrow, so the
      // list hangs under the trigger you pointed at.
      className=''
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
            // Opaque: at /95 the display heading stayed legible through it.
            // `top-full` with no offset, deliberately: a gap between the trigger
            // and the panel is a strip that belongs to neither, and crossing it
            // closes the menu. The top border lands exactly on the header's own
            // hairline, so the two read as one line.
            'absolute top-full z-50 rounded-b-2xl border-x border-b border-white/10 p-6 bg-black/70 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_24px_60px_rgba(0,0,0,0.55)] ' +
                'inset-x-0'
          }
        >
          {/* A grid, so every head is in row 1 and shares a top by construction.
              The predecessor balanced these as CSS columns, which puts a break
              wherever the text metrics fall — a five-item pillar pushed the head
              below it out of line with the other heads on its row. */}
          {/* Seven columns once seven fit; four below that, which is two rows
              whose heads each align rather than one ragged one. The gutter is 16
              and not 24 because the links carry 8 of their own on each side, so
              24 would spend 40px on air and make the longest labels wrap. */}
          <div className={wide ? 'grid grid-cols-4 items-start gap-x-4 gap-y-8 xl:grid-cols-8' : ''}>
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

/** The phone menu: one panel, everything expanded. */
export function MobileNav() {
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
