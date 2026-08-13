import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY } from '@/content/company'
import { SOLUTIONS } from '@/content/solutions'

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'What the Lux network is used for: remote operations, connected fleets, contact centres, mobile operators and regulated industries.',
}


export default function Solutions() {
  return (
    <>
      <section className="wrap pt-16 pb-10">
        <div className="eyebrow">Solutions</div>
        <h1 className="display mt-5 max-w-[16ch]">What people build on it.</h1>
        <p className="lede mt-6">
          Seven situations people arrive with. Each one names the products that answer it, because a solution that
          names no product is a brochure.
        </p>
      </section>

      <section className="band">
        <div className="wrap divide-y divide-white/10 border-y border-white/10">
          {SOLUTIONS.map((s) => (
            <div key={s.slug} className="grid gap-5 py-10 md:grid-cols-[300px_1fr] md:gap-12">
              <h2 className="h3">{s.name}</h2>
              <div>
                <p className="text-lg text-white/40">{s.problem}</p>
                <p className="mt-4 text-lg text-white/60">{s.answer}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {s.uses.map((u) => (
                    <Link
                      key={u}
                      href={`/products/${u}`}
                      className="inline-flex min-h-tap items-center rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-white/60 transition-colors hover:border-white/20 hover:text-white"
                    >
                      {u.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2 className="h2 max-w-[20ch]">Not on this list?</h2>
          <p className="lede mt-4">Tell us the coverage, the volume and the jurisdiction. We will tell you whether we are the right network.</p>
          <a href={`mailto:${COMPANY.contact.general}`} className="btn btn-solid mt-7">Talk to us</a>
        </div>
      </section>
    </>
  )
}
