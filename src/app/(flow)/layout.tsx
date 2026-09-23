import React, { type PropsWithChildren } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

import { Wordmark } from '@/components/Wordmark'

/*
  A route group with NO site chrome.

  The questionnaire is a flow, not a page: menus, a footer and a second call to
  action are all exits from the one thing this screen is for. It keeps the wordmark
  and a way out, and nothing else, and they live here rather than in the page so
  the wordmark is drawn on the server like every other one (see components/Wordmark).
*/
export default function FlowLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='flex h-16 shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8'>
        <Wordmark href='/' />
        <Link
          href='/'
          aria-label='Leave'
          className='inline-flex h-11 w-11 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/5 hover:text-white'
        >
          <X className='h-5 w-5' aria-hidden='true' />
        </Link>
      </header>
      {children}
    </div>
  )
}
