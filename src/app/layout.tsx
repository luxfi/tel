import React, { type PropsWithChildren } from 'react'
import type { Viewport } from 'next'

import metadata from '@/metadata'
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
        {children}
      </body>
    </html>
  )
}
