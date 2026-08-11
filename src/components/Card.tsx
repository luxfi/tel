import Link from 'next/link'
import { Mark } from '@/components/Mark'
import { STATUS_LABEL, type Primitive } from '@/content/catalog'

/**
 * A product, as a card.
 *
 * There were two copies of this markup — the home grid and the "Also in" grid on
 * each product page — and they drifted: the home copy learned the mark, the
 * product-page copy kept a status dot in the slot where the mark belongs, so
 * forty pages read as a bullet list. One card, used by both, cannot drift.
 *
 * The mark says WHAT the product is; status is a word underneath. The dot was
 * carrying status alone here, which the rule in globals.css says it must never
 * do — a glance, never the only carrier of the fact.
 */
export function Card({ primitive }: { primitive: Primitive }) {
  return (
    <Link href={`/products/${primitive.slug}`} className='card'>
      <div className='flex items-center gap-2'>
        <Mark slug={primitive.slug} />
        <span className='h3'>{primitive.name}</span>
      </div>
      <p className='mt-2 text-sm leading-relaxed text-white/60'>{primitive.blurb}</p>
      {primitive.status !== 'live' ? (
        <p className='mt-3 text-[10px] font-semibold uppercase tracking-wider text-white/60'>
          {STATUS_LABEL[primitive.status]}
        </p>
      ) : null}
    </Link>
  )
}
