'use client'

import React, { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, CircleAlert } from 'lucide-react'

import { CONTACT_EMAIL } from '@/site'

/**
 * The questionnaire.
 *
 * It asks what an engineer would ask on the first call, in the order they would
 * ask it, so the reply can be specific instead of "let us set up a discovery
 * session". Every answer is optional except the address to reply to — a required
 * field somebody cannot answer is a form they abandon.
 *
 * It posts to this site's OWN Base, same origin, with no key in the page.
 *
 * A published site host serves /v1/base scoped to the org its hostname resolves to
 * (HIP-0014), and the `submissions` collection every project is provisioned with
 * takes a free-form `data` object — so a new form needs no schema and no migration.
 * Create is public; list, view, update and delete are superuser-only, so anyone can
 * submit and nobody can read the pile back.
 *
 * That is stronger than shipping a publishable key and writing policies against it:
 * there is no credential in the page to leak, rotate or replay from somewhere else,
 * and the org comes from the RESOLVED HOST rather than from anything the caller
 * says. Writing into another tenant is not denied by a rule — it is unaddressable.
 *
 * Mail is the fallback, not the mechanism. If the post fails the answers are not
 * lost: the same body opens in a mail client.
 */

interface Step {
  readonly key: string
  readonly question: string
  readonly hint?: string
  readonly options?: readonly string[]
  /** Free text instead of options. */
  readonly open?: boolean
  readonly placeholder?: string
}

const STEPS: readonly Step[] = [
  {
    key: 'what',
    question: 'What are you connecting?',
    hint: 'Pick the closest. We will read the detail you add at the end.',
    options: [
      'An application that needs to make calls or send messages',
      'A business that wants AI agents answering',
      'A fleet of vehicles, devices or equipment',
      'A site with no fibre',
      'A phone system we want to replace',
      'ATMs, branches or financial infrastructure',
      'Something else',
    ],
  },
  {
    key: 'where',
    question: 'Where does it need to work?',
    hint: 'Countries, regions, or the awkward site that started this.',
    open: true,
    placeholder: 'e.g. UK and Ireland, plus a vessel in the North Sea',
  },
  {
    key: 'scale',
    question: 'Roughly how much of it?',
    hint: 'An order of magnitude is enough. Nobody is holding you to it.',
    options: [
      'A handful — under ten numbers, SIMs or sites',
      'Tens',
      'Hundreds',
      'Thousands or more',
      'No idea yet',
    ],
  },
  {
    key: 'when',
    question: 'When does it need to be live?',
    options: ['It is already a problem', 'Within a month', 'This quarter', 'Planning ahead'],
  },
  {
    key: 'now',
    question: 'What are you using today?',
    hint: 'Including "nothing" — that is a useful answer.',
    open: true,
    placeholder: 'e.g. two carriers, a leased line, and a phone system nobody maintains',
  },
]

export default function Start() {
  const [at, setAt] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [detail, setDetail] = useState('')

  const last = at === STEPS.length
  const step = STEPS[at]

  const body = useMemo(() => {
    const lines = [
      name ? `Name: ${name}` : null,
      company ? `Company: ${company}` : null,
      email ? `Email: ${email}` : null,
      '',
      ...STEPS.map((s) => (answers[s.key] ? `${s.question}\n  ${answers[s.key]}` : null)),
      detail ? `\nAnything else\n  ${detail}` : null,
    ].filter((l) => l !== null)
    return lines.join('\n')
  }, [answers, name, company, email, detail])

  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Getting started with Lux')}&body=${encodeURIComponent(body)}`

  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [failed, setFailed] = useState(false)

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setFailed(false)
    try {
      const res = await fetch('/v1/base/collections/submissions/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: 'start',
          data: { name, company, email, detail, ...answers, at: new Date().toISOString() },
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setSent(true)
    } catch {
      // Not an error page. The answers still exist, and mail still works.
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <section className='band'>
      <div className='wrap max-w-3xl'>
        <p className='eyebrow'>Get started</p>
        <h1 className='display mt-4 max-w-[18ch]'>Tell us what needs to happen.</h1>
        <p className='lede mt-6'>
          Five questions, none of them required. You will get back what it takes and what it costs, from someone who
          can answer it.
        </p>

        {/* Progress as a rule that fills, not a percentage. Nobody wants a number
            here; they want to know it is short. */}
        <div className='mt-10 flex gap-1.5' aria-hidden='true'>
          {STEPS.concat([{ key: 'you', question: 'You' }]).map((s, i) => (
            <div key={s.key} className={'h-0.5 flex-1 rounded ' + (i <= at ? 'bg-white/60' : 'bg-white/10')} />
          ))}
        </div>

        {!last ? (
          <div className='mt-10'>
            <h2 className='h2 max-w-[20ch]'>{step.question}</h2>
            {step.hint ? <p className='mt-3 text-sm text-white/50'>{step.hint}</p> : null}

            {step.open ? (
              <textarea
                autoFocus
                rows={4}
                value={answers[step.key] ?? ''}
                placeholder={step.placeholder}
                onChange={(e) => setAnswers({ ...answers, [step.key]: e.target.value })}
                className='mt-6 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30'
              />
            ) : (
              <ul className='mt-6 space-y-2'>
                {step.options!.map((o) => {
                  const picked = answers[step.key] === o
                  return (
                    <li key={o}>
                      <button
                        type='button'
                        onClick={() => {
                          setAnswers({ ...answers, [step.key]: o })
                          setAt(at + 1)
                        }}
                        className={
                          'flex min-h-[56px] w-full items-center justify-between gap-4 rounded-xl border px-5 text-left text-sm transition-colors ' +
                          (picked
                            ? 'border-white/40 bg-white/10 text-white'
                            : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white')
                        }
                      >
                        {o}
                        {picked ? <Check className='h-4 w-4 shrink-0' aria-hidden='true' /> : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            <div className='mt-8 flex items-center gap-3'>
              {at > 0 ? (
                <button type='button' onClick={() => setAt(at - 1)} className='btn btn-ghost'>
                  <ArrowLeft className='h-4 w-4' aria-hidden='true' />
                  Back
                </button>
              ) : null}
              <button type='button' onClick={() => setAt(at + 1)} className='btn btn-solid'>
                {answers[step.key] ? 'Next' : 'Skip'}
                <ArrowRight className='h-4 w-4' aria-hidden='true' />
              </button>
            </div>
          </div>
        ) : sent ? (
          <div className='mt-12'>
            <Check className='h-8 w-8 text-white' aria-hidden='true' />
            <h2 className='h2 mt-6 max-w-[20ch]'>That is with us.</h2>
            <p className='lede mt-5'>
              An engineer reads it, not a queue. You will get back what it takes and what it costs — and if any of it
              is a bad fit for us, we will say so rather than sell you the nearest thing.
            </p>
          </div>
        ) : (
          <form onSubmit={send} className='mt-10'>
            <h2 className='h2 max-w-[20ch]'>Where do we send the answer?</h2>
            <div className='mt-6 grid gap-3 sm:grid-cols-2'>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your name'
                className='min-h-[52px] rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30'
              />
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder='Company'
                className='min-h-[52px] rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30'
              />
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                className='min-h-[52px] rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30 sm:col-span-2'
              />
              <textarea
                rows={3}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder='Anything else worth knowing'
                className='rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30 sm:col-span-2'
              />
            </div>

            {/* The composed message, shown. A form that hides what it is about to
                send on your behalf is one people do not trust with a work address. */}
            <details className='mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4'>
              <summary className='cursor-pointer text-sm text-white/60'>See exactly what gets sent</summary>
              <pre className='mt-3 whitespace-pre-wrap text-xs leading-relaxed text-white/50'>{body || '—'}</pre>
            </details>

            <div className='mt-8 flex flex-wrap items-center gap-3'>
              <button type='button' onClick={() => setAt(at - 1)} className='btn btn-ghost'>
                <ArrowLeft className='h-4 w-4' aria-hidden='true' />
                Back
              </button>
              <button type='submit' disabled={sending} className='btn btn-solid disabled:opacity-50'>
                {sending ? 'Sending' : 'Send it'}
                <ArrowRight className='h-4 w-4' aria-hidden='true' />
              </button>
            </div>

            {failed ? (
              <div className='mt-6 flex items-start gap-3 rounded-xl border border-white/15 bg-white/[0.04] p-4'>
                <CircleAlert className='mt-0.5 h-4 w-4 shrink-0 text-white/60' aria-hidden='true' />
                <div className='text-sm leading-relaxed text-white/70'>
                  That did not go through — the answers are still here, nothing is lost.{' '}
                  <a href={href} className='text-white underline underline-offset-4'>
                    Send it as an email instead
                  </a>
                  .
                </div>
              </div>
            ) : null}
          </form>
        )}
      </div>
    </section>
  )
}
