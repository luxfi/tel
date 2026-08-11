'use client'

import React, { useEffect, useState } from 'react'

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

  if (token === undefined) return <div className='p-8 text-white/40'>Loading…</div>

  if (!token) {
    return (
      <section className='mx-auto max-w-2xl px-6 py-24'>
        <h1 className='h2'>{title}</h1>
        <p className='lede mt-5'>Sign in with your Lux ID to see this account.</p>
        <button type='button' onClick={signIn} className='btn btn-solid mt-8'>
          Sign in with Lux ID
        </button>
      </section>
    )
  }

  return (
    <div className='p-4 sm:p-6'>
      <h1 className='font-heading text-lg font-bold'>{title}</h1>

      {failed ? (
        // The message, not a shrug. 'signed out' is the one a reader can act on,
        // and it is the one an expired token produces.
        <p className='mt-6 text-sm text-white/60'>
          {failed === 'signed out' ? (
            <>
              Your session ended.{' '}
              <button type='button' onClick={signIn} className='text-white underline underline-offset-4'>
                Sign in again
              </button>
              .
            </>
          ) : (
            failed
          )}
        </p>
      ) : rows === null ? (
        <p className='mt-6 text-sm text-white/40'>Reading…</p>
      ) : rows.length === 0 ? (
        <p className='mt-6 max-w-xl text-sm leading-relaxed text-white/60'>{empty}</p>
      ) : (
        <div className='mt-6 overflow-x-auto'>
          <table className='w-full min-w-[560px] border-collapse text-sm'>
            <thead>
              <tr className='border-b border-white/10'>
                {columns.map((c) => (
                  <th
                    key={c.head}
                    className={
                      'eyebrow py-3 font-semibold ' + (c.figure ? 'text-right' : 'text-left')
                    }
                  >
                    {c.head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className='border-b border-white/5'>
                  {columns.map((c) => (
                    <td
                      key={c.head}
                      className={
                        'py-3 text-white/70 ' + (c.figure ? 'tabular text-right' : 'text-left')
                      }
                    >
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
