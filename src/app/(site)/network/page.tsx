import type { Metadata } from 'next'
import { Box, css } from '@hanzo/ui'
import Link from 'next/link'
import { Globe } from '@/components/Globe'
import { COMPANY, STACK } from '@/content/company'
import { PILLARS } from '@/content/catalog'

export const metadata: Metadata = {
  title: 'Our network',
  description:
    'The Lux network: a terrestrial backbone, orbital capacity that terminates into it at the ground station, and compute co-located with the media.',
}

// The connectivity group, not a hard-coded 'orbit' pillar: the catalogue regrouped
// around what a customer buys, and a lookup that assumes the old shape crashes the
// build rather than degrading — which is the good failure, but only once.
const ORBIT_PILLAR = PILLARS.find((p) => p.slug === 'connectivity')!

/**
 * The integration argument, stated once. It is the reason orbital capacity on Lux
 * behaves differently from orbital capacity bought as a separate link.
 */
const INTEGRATION = [
  {
    n: '01',
    heading: 'The terminal is a site, not a subscription',
    body: 'A terminal is provisioned from the same API as a number or a SIM, with the same identity, the same policy and the same audit trail. It appears in the console beside the fibre sites, not in a second portal with a second login.',
  },
  {
    n: '02',
    heading: 'Capacity lands on our backbone, not the public internet',
    body: 'Traffic joins the Lux network at the ground station. From there to your cloud, your data centre or another site of yours, it stays on infrastructure we route — which is why the latency is a number we can commit to rather than one we observe.',
  },
  {
    n: '03',
    heading: 'One identity across ground and orbit',
    body: 'A device keeps its number and its subscriber identity as it moves between a private wireless network, a public one and an orbital link. Hand-off is the network’s problem. The application never learns which transport it is on.',
  },
  {
    n: '04',
    heading: 'One SLA, one invoice, one desk',
    body: 'A site that fails over from fibre to orbit does not change vendors mid-incident. The same operations team sees both paths, and the credit for a missed service level comes from the same contract.',
  },
]

/*
  Qualitative by rule. Points of presence, peering counts, service bands and
  latency figures are the numbers a prospect holds us to in a contract, and none
  of them are ours to publish until somebody who owns them signs them off. See the
  content rules in LLM.md.
*/
const GROUND = [
  {
    label: 'Points of presence',
    value: 'In-region',
    note: 'Media is anchored in the region it originated, with compute in the same facilities.',
  },
  {
    label: 'Interconnect',
    value: 'Direct',
    note: 'Peering with the networks and carriers we exchange traffic with, rather than through a transit chain.',
  },
  {
    label: 'Ground stations',
    value: 'Backbone-attached',
    note: 'Orbital capacity enters the Lux network at the station, not at a public exchange.',
  },
  {
    label: 'Provisioning',
    value: 'One API',
    note: 'A terminal, a number, a SIM and a trunk are created the same way, under one identity model.',
  },
]

export default function Network() {
  return (
    <>
      <Box tag="section" className="relative overflow-hidden border-b border-white/10">
        <Box className="pointer-events-none absolute inset-0 opacity-80">
          <Globe height={640} />
        </Box>
        <Box className="wrap relative pt-20 pb-24">
          <Box className="eyebrow">Our network</Box>
          <Box tag="h1" className="display mt-5 max-w-[15ch]">Every way online, arranged as one.</Box>
          <Box tag="p" className="lede mt-6">
            Satellite is usually a separate link with its own portal, its own contract and its own support queue. Here it
            is provisioned from the same API as everything else you buy from us, and answered by the same people.
          </Box>
        </Box>
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap">
          <Box tag="dl" className="tabular grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {GROUND.map((g) => (
              <div key={g.label}>
                <Box tag="dt" className="eyebrow">{g.label}</Box>
                <Box tag="dd" className="mt-3 text-2xl font-semibold leading-tight tracking-tight">{g.value}</Box>
                <Box tag="dd" className="mt-2 text-sm text-white/40">{g.note}</Box>
              </div>
            ))}
          </Box>
        </Box>
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap">
          <Box className="eyebrow">Integration</Box>
          <Box tag="h2" className="h2 mt-4 max-w-[26ch]">What it means for orbit to be part of the network.</Box>
          <Box className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2">
            {INTEGRATION.map((i) => (
              <Box key={i.n} className="bg-neutral-900/50 p-8">
                <Box className="eyebrow">{i.n}</Box>
                <Box className="h3 mt-3">{i.heading}</Box>
                <Box tag="p" className="mt-2 text-lg text-white/60">{i.body}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap">
          <Box className="eyebrow">Orbital services</Box>
          <Box tag="h2" className="h2 mt-4 max-w-[24ch]">{ORBIT_PILLAR.summary.split('.')[0]}.</Box>
          <Box className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {ORBIT_PILLAR.primitives.map((p) => (
              <Box key={p.slug} className="grid gap-4 py-8 md:grid-cols-[260px_1fr] md:gap-10">
                <div>
                  <Link href={`/products/${p.slug}`} className={'inline-flex min-h-[var(--tap-target)] items-center h3 hover:underline'} style={css('inline-flex min-h-[var(--tap-target)] items-center h3 hover:underline')}>
                    {p.name}
                  </Link>
                  <Box className="mt-2 flex items-center gap-2 text-sm text-white/40">
                    <Box tag="span" className={`dot dot-${p.status}`} aria-hidden="true" />
                    {p.status === 'live' ? 'In service' : 'In field trial'}
                  </Box>
                </div>
                <div>
                  <Box tag="p" className="text-lg text-white/60">{p.detail}</Box>
                  <Box tag="ul" className="mt-4 space-y-1.5">
                    {p.facts.map((f) => (
                      <Box tag="li" key={f} className="flex gap-3 text-sm text-white/60">
                        <Box tag="span" className="mt-[9px] h-px w-3 flex-none bg-white/20" aria-hidden="true" />
                        {f}
                      </Box>
                    ))}
                  </Box>
                </div>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap">
          <Box className="eyebrow">The layers</Box>
          <Box tag="h2" className="h2 mt-4 max-w-[22ch]">One integration, end to end.</Box>
          <Box tag="ol" className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-3">
            {STACK.map((l) => (
              <Box tag="li" key={l.n} className="bg-neutral-900/50 p-7">
                <Box className="eyebrow">{l.n}</Box>
                <Box className="h3 mt-3">{l.name}</Box>
                <Box tag="p" className="mt-2 text-sm text-white/60">{l.detail}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box tag="section" className="band">
        <Box className="wrap flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Box tag="h2" className="h2 max-w-[20ch]">Building on orbit with us?</Box>
            <Box tag="p" className="lede mt-4">
              We carry capacity, run ground infrastructure, and hold the numbering and wireless licences that turn a
              link into a service. Partnerships go to the address on the right.
            </Box>
          </div>
          <Box tag="a" href={`mailto:${COMPANY.contact.general}`} className="btn btn-solid">
            {COMPANY.contact.general}
          </Box>
        </Box>
      </Box>
    </>
  )
}
