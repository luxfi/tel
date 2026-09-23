import React, { type PropsWithChildren } from 'react'

import { Nav, MobileNav } from '@/components/Nav'
import { Wordmark } from '@/components/Wordmark'
import { LEGAL_ENTITY, contactHref } from '@/site'

/* The marketing chrome. Moved here whole from the root layout when the console
   gained chrome of its own — a console rendering a marketing footer is a console
   that looks like a brochure. */
const Header: React.FC = () => (
  // No rule under it. A hairline reads as a seam between two flat slabs; the header
  // is a pane the page slides beneath, so the blur and the fall-off do the work.
  <header className='sticky top-0 z-50 bg-black/55 backdrop-blur-xl backdrop-saturate-150'>
    <nav className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      {/* This row is the menus' containing block, and it is the only reason a
          mega-menu can span the container: its box IS the container's content
          box, so a panel says `inset-x-0` and lands on the wordmark's left edge
          and the button's right edge without restating the padding scale. */}
      <div className='relative flex items-center justify-between gap-2'>
        <Wordmark href='/' />
        {/* The menu projects from the catalogue — see components/Nav. */}
        <Nav />
        {/* Two jobs, not one. Login is for somebody who already has an account and
            wants the console; Get started is for somebody who does not. A single
            'Talk to us' served neither of them. */}
        <div className='flex items-center gap-1 sm:gap-3'>
          <a href='https://console.lux.tel' className='btn btn-band btn-ghost hidden sm:inline-flex'>
            Login
          </a>
          <a href='/start' className='btn btn-band btn-solid'>
            Get started
          </a>
          <MobileNav wordmark={<Wordmark />} />
        </div>
      </div>
    </nav>
  </header>
)

const Footer: React.FC = () => (
  <footer className='border-t border-white/10 py-10'>
    <div className='mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between'>
      <div>
        <Wordmark />
        <p className='mt-2 text-sm text-white/40'>
          &copy; {new Date().getFullYear()} {LEGAL_ENTITY}
        </p>
      </div>
      <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm'>
        <a
          href={contactHref('Lux Tel')}
          className='inline-flex min-h-tap items-center rounded-sm px-2 text-white/60 transition-colors hover:text-white'
        >
          Contact
        </a>
        <a
          href='/legal/privacy'
          className='inline-flex min-h-tap items-center rounded-sm px-2 text-white/60 transition-colors hover:text-white'
        >
          Privacy
        </a>
        <a
          href='/legal'
          className='inline-flex min-h-tap items-center rounded-sm px-2 text-white/60 transition-colors hover:text-white'
        >
          Legal
        </a>
        <a
          href='https://lux.network'
          className='inline-flex min-h-tap items-center rounded-sm px-2 text-white/60 transition-colors hover:text-white'
          target='_blank'
          rel='noopener noreferrer'
        >
          Lux Network
        </a>
      </div>
    </div>
  </footer>
)


export default function SiteLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main id='top' className='flex-1'>
        {children}
      </main>
      <Footer />
    </div>
  )
}
