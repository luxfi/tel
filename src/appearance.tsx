'use client'

import { useEffect } from 'react'
import { apply, read } from '@hanzo/appearance/state'

/**
 * A person's stored reading of the scale, put on the document.
 *
 * The whole transform is two custom properties on <html> — `--type-scale` and
 * `--density` — which every rung in tailwind.config.ts multiplies by. So this
 * renders nothing and moves the entire page: type, padding, gaps and section
 * rhythm all follow, because they are all the same two numbers.
 *
 * Reading and writing the preference stays in `@hanzo/appearance`. A local copy
 * of the storage key or of the clamp would be a second answer to a question that
 * already has one, and the copy is the one that goes stale.
 *
 * Applied on MOUNT rather than from an inline head script. The package offers
 * `bootScript()` for a first paint that is already correct, and it is the better
 * mechanism — but its body carries the storage key as a literal, and this site
 * holds every rendered page to naming nobody but Lux. The cost is bounded and
 * paid by one person: an unset preference is the published scale, which is what
 * the stylesheet already painted, so only somebody who deliberately chose a
 * different size sees it settle.
 */
export function Appearance() {
  useEffect(() => {
    apply(read())
  }, [])
  return null
}
