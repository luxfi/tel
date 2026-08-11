import { test, expect, type Page } from '@playwright/test'
import { PILLARS, PRIMITIVES } from '../src/content/catalog'

/*
  Every product card wears a real mark.

  The bug this exists to catch: the "Also in" grid on all forty product pages
  carried a status dot in the slot where the mark belongs, so the cards read
  `• Email API`. Nothing threw, nothing 404'd, the console was clean — a CSS
  circle is not a broken icon, it is a different element rendering perfectly.

  So the assertion is on GEOMETRY: an <svg> that paints something and has
  layout. Asserting a node is present, or that a glyph is on screen, passes on
  a bullet — which is exactly how this shipped.
*/

const cards = (page: Page) => page.locator('a.card').filter({ has: page.locator('.h3') })

/** What each card actually rendered in its mark slot. */
const marks = (page: Page) =>
  cards(page).evaluateAll((els) =>
    els.map((el) => {
      const svg = el.querySelector('svg')
      return {
        name: el.querySelector('.h3')!.textContent!.trim(),
        geometry: svg ? svg.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse').length : 0,
        width: svg ? svg.getBoundingClientRect().width : 0,
        dot: !!el.querySelector('.dot'),
      }
    }),
  )

test('every product page marks its siblings with an icon, not a bullet', async ({ page }) => {
  for (const p of PRIMITIVES) {
    const siblings = p.pillar.primitives.filter((s) => s.slug !== p.slug)
    if (!siblings.length) continue

    await page.goto(`/products/${p.slug}`)
    await expect(cards(page), `${p.slug}: sibling card count`).toHaveCount(siblings.length)

    for (const m of await marks(page)) {
      expect(m.geometry, `/products/${p.slug} → "${m.name}" mark draws nothing`).toBeGreaterThan(0)
      expect(m.width, `/products/${p.slug} → "${m.name}" mark has no layout`).toBeGreaterThan(0)
      expect(m.dot, `/products/${p.slug} → "${m.name}" has a status dot in the mark slot`).toBe(false)
    }
  }
})

test('the home and index grids mark every primitive', async ({ page }) => {
  for (const path of ['/', '/products']) {
    await page.goto(path)
    const count = await page.locator('a[href^="/products/"] svg').count()
    expect(count, `${path}: a mark per primitive`).toBeGreaterThanOrEqual(PRIMITIVES.length)
  }
})

test('the catalog and the mark set do not drift', async () => {
  // Mark throws on import when a primitive has no icon, so importing IS the
  // check. Named here so the failure reads as the mechanism, not a stack trace.
  const { Mark } = await import('../src/components/Mark')
  expect(typeof Mark).toBe('function')
  expect(PILLARS.flatMap((p) => p.primitives).length).toBe(PRIMITIVES.length)
})
