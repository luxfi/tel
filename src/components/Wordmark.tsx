import 'server-only'
import React from 'react'
import Link from 'next/link'
import { Wordmark as Letters } from '@luxfi/logo/react'

/**
 * LUX tel: the product's name, drawn in one place.
 *
 * The letters are @luxfi/logo's artwork, not type. Every Lux surface wears the
 * drawn wordmark (lux.exchange alone wears LX), at 22px, which is the height
 * lux.exchange draws its mark in the same corner. The product word is Zen at the
 * book weight on the secondary rung, standing on the letters' baseline.
 *
 * With `href` it is the way home: a 44px target around the lockup, named for a
 * screen reader as the product rather than as its letters.
 *
 * SERVER ONLY, and the import above makes the build fail rather than drift. The
 * logo package is one module holding every Lux drawing, several computed at load,
 * so a client component importing it ships all of them to every page for the
 * sake of one. Drawn here, a page carries the wordmark's SVG and nothing else; a
 * client component that shows it takes it as a prop (see MobileNav).
 */
export function Wordmark({ href, className = '' }: { href?: string; className?: string }) {
  const lockup = (
    <span className='wordmark'>
      <Letters height='var(--mark)' />
      <span className='wordmark-word'>tel</span>
    </span>
  )
  return href ? (
    <Link href={href} aria-label='Lux Tel, home' className={'inline-flex min-h-tap items-center ' + className}>
      {lockup}
    </Link>
  ) : (
    <span className={'inline-flex items-center ' + className}>{lockup}</span>
  )
}
