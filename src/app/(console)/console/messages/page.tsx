'use client'

import React from 'react'
import { Box } from '@hanzo/ui'

import { Records, type Column } from '@/console/Records'
import type { Message } from '@/console/api'

const COLUMNS: readonly Column<Message>[] = [
  { head: 'From', cell: (m) => <Box tag="span" className='tabular'>{m.from}</Box> },
  { head: 'To', cell: (m) => <Box tag="span" className='tabular'>{m.to}</Box> },
  {
    head: 'Body',
    // Truncated in the cell, whole in the title: a table that wraps a 1,600
    // character message stops being a table.
    cell: (m) => (
      <Box tag="span" title={m.body} className='block max-w-[38ch] truncate'>
        {m.body || '—'}
      </Box>
    ),
  },
  { head: 'Status', cell: (m) => m.status ?? '—' },
  { head: 'Sent', cell: (m) => (m.sentAt ? new Date(m.sentAt).toLocaleString() : '—') },
]

export default function Messages() {
  return (
    <Records<Message>
      title='Messages'
      path='/messages'
      columns={COLUMNS}
      empty='No messages yet. Send one from the API against a number on this account, and both directions appear here.'
    />
  )
}
