import React, { type PropsWithChildren } from 'react'
import type { Viewport } from 'next'

import { Appearance } from '@/appearance'
import { Theme } from '@/theme'
import metadata from '@/metadata'
// Zen — the one family, sans and mono. @hanzo/design ships both variable faces and
// declares their @font-face, so this site vendors no font binary of its own; and
// @hanzo/font carries the display fittings (`.zen-wide` and its variables, which
// globals.css reads). Both are imported HERE rather than @import-ed from
// globals.css: postcss-import resolves neither a package `exports` map nor the
// url()s inside a package's own sheet.
import '@hanzo/design/tokens/fonts.css'
import '@hanzo/font/presets.css'
import './globals.css'

export { metadata }

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'black' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

/*
  The ROOT layout is html + body + metadata and nothing else. Chrome belongs to a
  route group: the marketing pages carry a header and a footer, the console carries
  a sidebar and a top bar, and neither should have to render around the other's.
*/
export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' className='dark'>
      {/* A host element, not a Box: `<Hanzo>` sits INSIDE the body, so a body
          rendering through gui would ask for a theme not yet in context and
          the prerender dies on "Missing theme." The body's ground is stated
          in globals.css, where it needs no provider and no classes. */}
      <body>
        {/* The design-system provider, behind a local name — see src/theme.tsx. */}
        <Theme>
          <Appearance />
          {children}
        </Theme>
      </body>
    </html>
  )
}
