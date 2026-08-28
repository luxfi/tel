'use client'

import React from 'react'
import { Box } from '@hanzo/ui'

import { Records, type Column } from '@/console/Records'
import type { Number as Num } from '@/console/api'

/** Minor units as the carrier quoted them, so 1200 GBP-minor reads as £12.00. */
const money = (minor?: number, currency?: string) =>
  minor === undefined
    ? '—'
    : new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD' }).format(minor / 100)

const COLUMNS: readonly Column<Num>[] = [
  { head: 'Number', cell: (n) => <Box tag="span" className='tabular text-white'>{n.e164}</Box> },
  { head: 'Country', cell: (n) => n.country },
  { head: 'Type', cell: (n) => n.type },
  { head: 'Carries', cell: (n) => (n.capable ?? []).join(', ') || '—' },
  { head: 'Monthly', figure: true, cell: (n) => money(n.monthly, n.currency) },
]

export default function Numbers() {
  return (
    <Records<Num>
      title='Numbers'
      path='/numbers'
      columns={COLUMNS}
      empty='No numbers on this account yet. Search the countries we are licensed in and buy one from the API, or tell us what you need and we will provision it.'
    />
  )
}
