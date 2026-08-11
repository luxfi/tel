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
            // Opaque: at /95 the display heading stayed legible through it.
            'absolute left-1/2 top-full z-50 -translate-x-1/2 rounded-xl border border-white/15 bg-black p-6 shadow-2xl ' +
            (wide ? 'w-[860px]' : 'w-[300px]')
          }
        >
          {/* Columns, not grid: seven pillars in four columns leave a dead row the
              height of the tallest. */}
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
