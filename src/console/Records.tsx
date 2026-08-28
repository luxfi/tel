'use client'

import React, { useEffect, useState } from 'react'
import { Box } from '@hanzo/ui'

import { signIn, stored } from './auth'
import { list } from './api'

/**
 * A list of things the account holds, read from the tel API.
 *
 * ONE component for numbers, calls and messages, because they differ only in
 * which columns they show — three near-identical pages is how two of them stop
 * handling the empty case a month later.
 *
 * Every state a real account passes through is here and none of them is a spinner
 * that never resolves: signed out, loading, failed, empty, and rows. The empty
 * state says what to do next rather than "no data", which is a sentence nobody
 * has ever acted on.
 */

export interface Column<T> {
  readonly head: string
  readonly cell: (row: T) => React.ReactNode
  /** Right-aligned and tabular, for anything a reader compares down a column. */
  readonly figure?: boolean
}

export function Records<T extends { id: string }>({
  title,
  path,
  columns,
  empty,
}: {
  title: string
  path: string
  columns: readonly Column<T>[]
  empty: string
}) {
  // undefined = not resolved yet. This is a static export, so the server cannot
  // know whether anyone is signed in and guessing flashes the wrong shell.
  const [token, setToken] = useState<string | null | undefined>(undefined)
  const [rows, setRows] = useState<T[] | null>(null)
  const [failed, setFailed] = useState<string | null>(null)

  useEffect(() => setToken(stored()), [])

  useEffect(() => {
    if (!token) return
    let live = true
    list<T>(path)
      .then((r) => live && setRows(r))
      .catch((e: Error) => live && setFailed(e.message))
    return () => {
      live = false
    }
  }, [token, path])

  if (token === undefined) return <Box className='p-8 text-white/40'>Loading…</Box>

  if (!token) {
    return (
      <Box tag="section" className='mx-auto max-w-2xl px-6 py-24'>
        <Box tag="h1" className='h2'>{title}</Box>
        <Box tag="p" className='lede mt-5'>Sign in with your Lux ID to see this account.</Box>
        <Box tag="button" type='button' onClick={signIn} className='btn btn-solid mt-8'>
          Sign in with Lux ID
        </Box>
      </Box>
    )
  }

  return (
    <Box className='p-4 sm:p-6'>
      <Box tag="h1" className='font-heading text-lg font-bold'>{title}</Box>

      {failed ? (
        // The message, not a shrug. 'signed out' is the one a reader can act on,
        // and it is the one an expired token produces.
        <Box tag="p" className='mt-6 text-sm text-white/60'>
          {failed === 'signed out' ? (
            <>
              Your session ended.{' '}
              <Box tag="button" type='button' onClick={signIn} className='text-white underline underline-offset-4'>
                Sign in again
              </Box>
              .
            </>
          ) : (
            failed
          )}
        </Box>
      ) : rows === null ? (
        <Box tag="p" className='mt-6 text-sm text-white/40'>Reading…</Box>
      ) : rows.length === 0 ? (
        <Box tag="p" className='mt-6 max-w-xl text-sm leading-relaxed text-white/60'>{empty}</Box>
      ) : (
        <Box className='mt-6 overflow-x-auto'>
          <Box tag="table" className='w-full min-w-[560px] border-collapse text-sm'>
            <thead>
              <Box tag="tr" className='border-b border-white/10'>
                {columns.map((c) => (
                  <Box tag="th"
                    key={c.head}
                    className={
                      'eyebrow py-3 font-semibold ' + (c.figure ? 'text-right' : 'text-left')
                    }
                  >
                    {c.head}
                  </Box>
                ))}
              </Box>
            </thead>
            <tbody>
              {rows.map((row) => (
                <Box tag="tr" key={row.id} className='border-b border-white/5'>
                  {columns.map((c) => (
                    <Box tag="td"
                      key={c.head}
                      className={
                        'py-3 text-white/70 ' + (c.figure ? 'tabular text-right' : 'text-left')
                      }
                    >
                      {c.cell(row)}
                    </Box>
                  ))}
                </Box>
              ))}
            </tbody>
          </Box>
        </Box>
      )}
    </Box>
  )
}
