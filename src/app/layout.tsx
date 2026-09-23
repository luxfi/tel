import React, { type PropsWithChildren } from 'react'
import type { Viewport } from 'next'

import { Appearance } from '@/appearance'
import metadata from '@/metadata'
// Zen, the one family, imported exactly as lux.exchange imports it: the faces, then
// the presets that name its weights (book 497, medium 606, and the wide display
// cut), whose variables globals.css reads. The faces are self-hosted: the bundler
// copies the woff2 files out of the package into the export, so this site vendors
// no font binary and makes no third-party request. Both are imported HERE rather
// than @import-ed from globals.css: postcss-import resolves neither a package
// `exports` map nor the url()s inside a package's own sheet.
import '@hanzo/font/css'
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
      <body className='flex min-h-full flex-col bg-black text-white'>
        <Appearance />
        {children}
      </body>
    </html>
  )
}
