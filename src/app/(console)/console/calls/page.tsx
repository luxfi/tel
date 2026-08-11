'use client'

import React from 'react'

import { Records, type Column } from '@/console/Records'
import type { Call } from '@/console/api'

/** Seconds as m:ss — a call is read as a duration, never as 143. */
const length = (s?: number) =>
  s === undefined ? '—' : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

const COLUMNS: readonly Column<Call>[] = [
  { head: 'From', cell: (c) => <span className='tabular'>{c.from}</span> },
  { head: 'To', cell: (c) => <span className='tabular'>{c.to}</span> },
  { head: 'Status', cell: (c) => c.status ?? '—' },
  { head: 'Started', cell: (c) => (c.startedAt ? new Date(c.startedAt).toLocaleString() : '—') },
  { head: 'Length', figure: true, cell: (c) => length(c.seconds) },
]

export default function Calls() {
  return (
    <Records<Call>
      title='Calls'
      path='/calls'
      columns={COLUMNS}
      empty='No calls yet. Place one from the API against a number on this account, and it appears here as it happens.'
    />
  )
}
