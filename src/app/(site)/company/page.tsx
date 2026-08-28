import type { Metadata } from 'next'
import { Box, css } from '@hanzo/ui'
import Link from 'next/link'
import { ADVISORS, ENGINEERING, LEADERSHIP, type Person } from '@/content/team'
import { COMPANY, CAPABILITIES } from '@/content/company'

export const metadata: Metadata = {
  title: 'Company',
  description: 'Lux Industries Inc — the team behind the platform, and how to reach us.',
}

function Roster({ title, people }: { title: string; people: readonly Person[] }) {
  return (
    <div>
      <Box className="eyebrow">{title}</Box>
      <Box tag="ul" className="mt-6 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <Box tag="li" key={p.name} className="bg-neutral-900/50 px-5 py-4">
            <Box className="text-lg font-medium">{p.name}</Box>
            <Box className="mt-0.5 text-sm text-white/40">{p.title}</Box>
          </Box>
        ))}
      </Box>
    </div>
  )
}

export default function Company() {
  return (
    <>
      <Box tag="section" className="wrap pt-16 pb-10">
        <Box className="eyebrow">{COMPANY.legalName}</Box>
        <Box tag="h1" className="display mt-5 max-w-[18ch]">We are the layer that makes it one service.</Box>
        <Box tag="p" className="lede mt-6">{COMPANY.lede}</Box>
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap">
          <Box tag="dl" className="tabular grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((c) => (
              <div key={c.headline}>
                <Box tag="dt" className="h3">{c.headline}</Box>
                <Box tag="dd" className="mt-2 text-sm leading-relaxed text-white/60">{c.note}</Box>
              </div>
            ))}
          </Box>
        </Box>
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap space-y-14">
          <Roster title="Leadership" people={LEADERSHIP} />
          <Roster title="Engineering and operations" people={ENGINEERING} />
          <Roster title="Advisors" people={ADVISORS} />
        </Box>
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap">
          <Box className="eyebrow">Contact</Box>
          <Box className="mt-8 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Sales', COMPANY.contact.general],
              ['Support', COMPANY.contact.general],
              ['Partnerships', COMPANY.contact.general],
              ['Abuse', COMPANY.contact.general],
              ['Legal', COMPANY.contact.general],
              ['Law enforcement', COMPANY.contact.general],
            ].map(([label, address]) => (
              <Box key={address} className="bg-neutral-900/50 px-5 py-4">
                <Box className="eyebrow">{label}</Box>
                <Box tag="a" href={`mailto:${address}`} className="inline-flex min-h-[var(--tap-target)] items-center mt-1 text-lg hover:underline">{address}</Box>
              </Box>
            ))}
          </Box>
          <Box tag="p" className="mt-8 text-sm text-white/40">
            Policies, retention periods and how we answer legal process are set out under{' '}
            <Link href="/legal" className={'inline-flex min-h-[var(--tap-target)] items-center underline'} style={css('inline-flex min-h-[var(--tap-target)] items-center underline')}>Legal</Link>.
          </Box>
        </Box>
      </Box>
    </>
  )
}
