'use client'

import React, { useEffect, useState } from 'react'

import { complete, onConsoleHost } from '@/console/auth'

/*
  The return leg. It does one thing — spend the code — and then leaves, because a
  page that lingers here is a page someone can bookmark with a spent code on it.
*/
export default function Callback() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    complete(window.location.search)
      .then(() => window.location.replace(onConsoleHost() ? '/' : '/console'))
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <section className='wrap py-24'>
      <p className='eyebrow'>Console</p>
      {error ? (
        <>
          <h1 className='h2 mt-3'>That sign-in did not finish.</h1>
          <p className='lede mt-4'>{error}</p>
          <a href={onConsoleHost() ? '/' : '/console'} className='btn btn-solid mt-8'>
            Try again
          </a>
        </>
      ) : (
        <h1 className='h2 mt-3'>Signing you in…</h1>
      )}
    </section>
  )
}
