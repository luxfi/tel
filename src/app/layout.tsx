import React, { type PropsWithChildren } from 'react'
import type { Viewport } from 'next'

import metadata from '../metadata'
import { LEGAL_ENTITY, contactHref } from '../site'
import './globals.css'

export { metadata }

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'black' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

const Wordmark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={'whitespace-nowrap ' + className}>
    <span className='font-heading font-bold tracking-tight'>LUX</span>
    <span className='text-white/40'> tel</span>
  </span>
)

const Header: React.FC = () => (
  <header className='sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur'>
    <nav className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
      <a
        href='#top'
        className='-ml-2 inline-flex min-h-[44px] items-center rounded-sm px-2 text-lg'
        aria-label='Lux Tel, home'
      >
        <Wordmark />
      </a>
      <div className='flex items-center gap-1 sm:gap-2'>
        <a
          href='#platform'
          className='hidden min-h-[44px] items-center rounded-sm px-3 text-sm text-white/60 transition-colors hover:text-white sm:inline-flex'
        >
          Platform
        </a>
        <a
          href='#satellite'
          className='hidden min-h-[44px] items-center rounded-sm px-3 text-sm text-white/60 transition-colors hover:text-white sm:inline-flex'
        >
          Satellite
        </a>
        <a
          href={contactHref('Lux Tel')}
          className='inline-flex min-h-[44px] items-center rounded-md bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90'
        >
          Talk to us
        </a>
      </div>
    </nav>
  </header>
)

const Footer: React.FC = () => (
  <footer className='border-t border-white/10 py-10'>
    <div className='mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between'>
      <div>
        <Wordmark className='text-base' />
        <p className='mt-2 text-sm text-white/40'>
          &copy; {new Date().getFullYear()} {LEGAL_ENTITY}
        </p>
      </div>
      <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm'>
        <a
          href={contactHref('Lux Tel')}
          className='inline-flex min-h-[44px] items-center rounded-sm px-2 text-white/60 transition-colors hover:text-white'
        >
          Contact
        </a>
        <a
          href='/assets/standard-docs/LUX-Privacy-Policy.pdf'
          className='inline-flex min-h-[44px] items-center rounded-sm px-2 text-white/60 transition-colors hover:text-white'
        >
          Privacy
        </a>
        <a
          href='https://lux.network'
          className='inline-flex min-h-[44px] items-center rounded-sm px-2 text-white/60 transition-colors hover:text-white'
          target='_blank'
          rel='noopener noreferrer'
        >
          Lux Network
        </a>
      </div>
    </div>
  </footer>
)

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' className='dark'>
      <body className='flex min-h-full flex-col bg-black text-white'>
        <Header />
        <main id='top' className='flex-1'>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
