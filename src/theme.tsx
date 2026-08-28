'use client'

/**
 * The design-system provider, behind a name of this site's own.
 *
 * `@hanzo/ui` exports its provider as `Hanzo`, and Next writes the EXPORT NAME
 * of every client component into the flight payload — so mounting it directly
 * puts the string "Hanzo" into the served HTML of a Lux property. `e2e/tel.spec`
 * asserts nobody but Lux is named anywhere on this site, and it is right to.
 *
 * The boundary is declared here instead, so the name in the payload is `Theme`.
 * Nothing else changes: this renders the same provider with the same props.
 */
import type { PropsWithChildren } from 'react'
import { Hanzo } from '@hanzo/ui'

export const Theme = ({ children }: PropsWithChildren) => (
  <Hanzo theme="dark">{children}</Hanzo>
)

export default Theme
