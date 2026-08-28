import React, { type PropsWithChildren } from 'react'
import { Box } from '@hanzo/ui'

import { Nav, MobileNav } from '@/components/Nav'
import { LEGAL_ENTITY, contactHref } from '@/site'

/* The marketing chrome. Moved here whole from the root layout when the console
   gained chrome of its own — a console rendering a marketing footer is a console
   that looks like a brochure. */
const Wordmark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Box tag="span" className={'whitespace-nowrap ' + className}>
    <Box tag="span" className='font-heading font-bold tracking-tight'>LUX</Box>
    <Box tag="span" className='text-white/40'> tel</Box>
  </Box>
)

const Header: React.FC = () => (
  // No rule under it. A hairline reads as a seam between two flat slabs; the header
  // is a pane the page slides beneath, so the blur and the fall-off do the work.
  <Box tag="header" className='sticky top-0 z-50 bg-black/55 backdrop-blur-xl backdrop-saturate-150'>
    <Box tag="nav" className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      {/* This row is the menus' containing block, and it is the only reason a
          mega-menu can span the container: its box IS the container's content
          box, so a panel says `inset-x-0` and lands on the wordmark's left edge
          and the button's right edge without restating the padding scale. */}
      <Box className='relative flex items-center justify-between gap-2'>
        <Box tag="a"
          href='/'
          className='-ml-2 inline-flex min-h-[var(--tap-target)] items-center rounded-sm px-2 text-lg'
          aria-label='Lux Tel, home'
        >
          <Wordmark />
        </Box>
        {/* The menu projects from the catalogue — see components/Nav. */}
        <Nav />
        {/* Two jobs, not one. Login is for somebody who already has an account and
            wants the console; Get started is for somebody who does not. A single
            'Talk to us' served neither of them. */}
        <Box className='flex items-center gap-1 sm:gap-2'>
          <Box tag="a"
            href='https://console.lux.tel'
            className='hidden min-h-[var(--tap-target)] items-center rounded-sm px-3 text-sm text-white/60 transition-colors hover:text-white sm:inline-flex'
          >
            Login
          </Box>
          <Box tag="a"
            href='/start'
            className='inline-flex min-h-[var(--tap-target)] items-center rounded-md bg-white px-3.5 text-sm font-medium text-black transition-colors hover:bg-white/90'
          >
            Get started
          </Box>
          <MobileNav />
        </Box>
      </Box>
    </Box>
  </Box>
)

const Footer: React.FC = () => (
  <Box tag="footer" className='border-t border-white/10 py-10'>
    <Box className='mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between'>
      <div>
        <Wordmark className='text-base' />
        <Box tag="p" className='mt-2 text-sm text-white/40'>
          &copy; {new Date().getFullYear()} {LEGAL_ENTITY}
        </Box>
      </div>
      <Box className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm'>
        <Box tag="a"
          href={contactHref('Lux Tel')}
          className='inline-flex min-h-[var(--tap-target)] items-center rounded-sm px-2 text-white/60 transition-colors hover:text-white'
        >
          Contact
        </Box>
        <Box tag="a"
          href='/legal/privacy'
          className='inline-flex min-h-[var(--tap-target)] items-center rounded-sm px-2 text-white/60 transition-colors hover:text-white'
        >
          Privacy
        </Box>
        <Box tag="a"
          href='/legal'
          className='inline-flex min-h-[var(--tap-target)] items-center rounded-sm px-2 text-white/60 transition-colors hover:text-white'
        >
          Legal
        </Box>
        <Box tag="a"
          href='https://lux.network'
          className='inline-flex min-h-[var(--tap-target)] items-center rounded-sm px-2 text-white/60 transition-colors hover:text-white'
          target='_blank'
          rel='noopener noreferrer'
        >
          Lux Network
        </Box>
      </Box>
    </Box>
  </Box>
)


export default function SiteLayout({ children }: PropsWithChildren) {
  return (
    <Box className='flex min-h-screen flex-col'>
      <Header />
      <Box tag="main" id='top' className='flex-1'>
        {children}
      </Box>
      <Footer />
    </Box>
  )
}
