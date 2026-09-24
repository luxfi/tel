import React from 'react'
import Link from 'next/link'

/**
 * LUXTEL: the product's name, set in one place.
 *
 * Both words are Zen in the wide preset (@hanzo/font presets.css `.zen-wide`:
 * weight 650, tracked in and widened), the face the drawn Lux wordmark is cut
 * from, caps 22px tall — the height lux.exchange gives its mark in the same
 * corner. One word; TEL in a darker grey so LUX reads first.
 *
 * With `href` it is the way home: a 44px target around the lockup, named for a
 * screen reader as the product rather than as its letters.
 */
export function Wordmark({ href, className = '' }: { href?: string; className?: string }) {
  const lockup = (
    <span className='wordmark zen-wide'>
      LUX<span className='wordmark-word'>TEL</span>
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
