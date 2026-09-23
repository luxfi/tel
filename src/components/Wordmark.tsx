import React from 'react'
import Link from 'next/link'

/**
 * LUX tel: the product's name, set in one place.
 *
 * LUX is Zen in the wide preset (@hanzo/font presets.css `.zen-wide`: weight 650,
 * tracked in and widened), which is the face the drawn Lux wordmark is cut from,
 * with its caps 22px tall — the height lux.exchange gives its mark in the same
 * corner. The product word is Zen at the book weight on the secondary rung,
 * standing on the same baseline.
 *
 * With `href` it is the way home: a 44px target around the lockup, named for a
 * screen reader as the product rather than as its letters.
 */
export function Wordmark({ href, className = '' }: { href?: string; className?: string }) {
  const lockup = (
    <span className='wordmark'>
      <span className='wordmark-letters zen-wide'>LUX</span>
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
