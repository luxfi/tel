/*
  Responsive measurement harness — run against the PRODUCTION export, never `next dev`.

  Two traps this avoids on purpose:
   - `window.innerWidth` under Chromium mobile emulation reports the *widened*
     layout viewport (~389 on a 375 device). Every width here comes from CDP
     Page.getLayoutMetrics instead, which reports the real CSS layout viewport
     and the real content size.
   - `page.setViewportSize` alone does not emulate a phone. Each profile gets its
     own context with deviceScaleFactor / isMobile / hasTouch set.

  Usage: node measure.mjs <label>   ->  writes shots/<label>-<profile>.png + JSON
*/
import { chromium } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'

const LABEL = process.argv[2] ?? 'run'
const BASE = process.env.BASE ?? 'http://localhost:3000'
const OUT = '/home/z/.cache/go-tmp/claude-1000/-home-z-work-lux/ff17b0af-81f5-40f6-b5b6-b3972efbcb9a/scratchpad/shots/'
mkdirSync(OUT, { recursive: true })

const PROFILES = [
  { name: '375x667', width: 375, height: 667, dpr: 2, mobile: true },
  { name: '390x844', width: 390, height: 844, dpr: 3, mobile: true },
  { name: '768x1024', width: 768, height: 1024, dpr: 2, mobile: true },
  { name: '1280x800', width: 1280, height: 800, dpr: 1, mobile: false },
  { name: '1920x1080', width: 1920, height: 1080, dpr: 1, mobile: false },
]

const PATHS = process.env.PATHS?.split(',') ?? ['/']

const browser = await chromium.launch()
const report = {}

for (const p of PROFILES) {
  const ctx = await browser.newContext({
    viewport: { width: p.width, height: p.height },
    deviceScaleFactor: p.dpr,
    isMobile: p.mobile,
    hasTouch: p.mobile,
    reducedMotion: 'no-preference',
  })
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)

  for (const path of PATHS) {
    const key = `${p.name}${path === '/' ? '' : path}`
    const errors = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto(BASE + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)

    // Ground truth, from the browser's own layout engine — not from JS globals.
    const metrics = await cdp.send('Page.getLayoutMetrics')
    const layoutW = Math.round(metrics.cssLayoutViewport.clientWidth)
    const contentW = Math.round(metrics.cssContentSize.width)

    const dom = await page.evaluate(() => {
      const box = (el) => {
        if (!el) return null
        const r = el.getBoundingClientRect()
        return {
          top: Math.round(r.top + window.scrollY),
          left: Math.round(r.left),
          w: Math.round(r.width),
          h: Math.round(r.height),
        }
      }
      const canvas = document.querySelector('canvas')
      const h1 = document.querySelector('h1')
      const lede = h1?.parentElement?.querySelector('.lede, p:not(.eyebrow)')
      const eyebrow = document.querySelector('h1')?.parentElement?.querySelector('.eyebrow')

      // Anything that sticks out past the document box — the actual overflow culprits.
      const docW = document.documentElement.clientWidth
      const wide = [...document.querySelectorAll('body *')]
        .map((e) => {
          const r = e.getBoundingClientRect()
          return { r, e }
        })
        .filter(({ r }) => r.width > 0 && (r.right > docW + 1 || r.left < -1))
        .slice(0, 8)
        .map(({ r, e }) => ({
          tag: e.tagName.toLowerCase(),
          cls: (e.className?.baseVal ?? e.className ?? '').toString().slice(0, 70),
          left: Math.round(r.left),
          right: Math.round(r.right),
        }))

      const taps = [...document.querySelectorAll('a, button')]
        .filter((e) => e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== 'hidden')
        .map((e) => ({
          text: (e.textContent ?? '').trim().slice(0, 28),
          w: Math.round(e.getBoundingClientRect().width),
          h: Math.round(e.getBoundingClientRect().height),
        }))
        .filter((t) => t.h < 44)

      const px = (el, prop) => (el ? getComputedStyle(el).getPropertyValue(prop) : null)

      return {
        canvas: box(canvas),
        h1: box(h1),
        h1Text: h1?.textContent?.trim().slice(0, 60) ?? null,
        h1Font: px(h1, 'font-size'),
        eyebrow: box(eyebrow),
        lede: box(lede),
        ledeFont: px(lede, 'font-size'),
        bodyFont: px(document.body, 'font-size'),
        heroH: box(document.querySelector('main section')),
        docHeight: document.documentElement.scrollHeight,
        typeScale: getComputedStyle(document.documentElement).getPropertyValue('--type-scale').trim() || '(unset)',
        density: getComputedStyle(document.documentElement).getPropertyValue('--density').trim() || '(unset)',
        wide,
        taps,
      }
    })

    // Visual order down the page: which of globe / headline comes first.
    const order =
      dom.canvas && dom.h1
        ? dom.canvas.top < dom.h1.top
          ? 'globe -> headline'
          : 'headline -> globe'
        : 'n/a'

    report[key] = {
      viewportSet: `${p.width}x${p.height}`,
      layoutViewportWidth: layoutW,
      contentWidth: contentW,
      overflowPx: contentW - layoutW,
      order,
      ...dom,
      errors,
    }

    await page.screenshot({ path: `${OUT}${LABEL}-${key.replace(/\//g, '_')}-fold.png` })
    if (path === '/') {
      await page.screenshot({ path: `${OUT}${LABEL}-${key.replace(/\//g, '_')}-full.png`, fullPage: true })
    }
  }
  await ctx.close()
}

await browser.close()
writeFileSync(`${OUT}${LABEL}.json`, JSON.stringify(report, null, 2))

for (const [k, v] of Object.entries(report)) {
  console.log(
    `${k.padEnd(16)} layout=${String(v.layoutViewportWidth).padStart(4)} content=${String(v.contentWidth).padStart(4)} overflow=${String(v.overflowPx).padStart(4)}px  order=${v.order.padEnd(18)} h1=${v.h1Font} lede=${v.ledeFont} scale=${v.typeScale}/${v.density} docH=${v.docHeight}`,
  )
  if (v.wide.length) console.log(`   overflowing: ${v.wide.map((w) => `${w.tag}.${w.cls}[${w.left}..${w.right}]`).join(' | ')}`)
  if (v.taps.length) console.log(`   small taps: ${v.taps.map((t) => `"${t.text}"=${t.w}x${t.h}`).join(' | ')}`)
  if (v.errors.length) console.log(`   errors: ${v.errors.join(' | ')}`)
}
