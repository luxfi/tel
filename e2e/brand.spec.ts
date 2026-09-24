import { test, expect, type Locator } from '@playwright/test'

/*
  The wordmark and the calls to action wear lux.exchange's brand, measured.

  Both were wrong in a way nothing else here could see. The page set "LUX" as type,
  at weight 650 with the wide cut's tracking, beside a 40% "tel" (now TEL, in the same face), in five copies
  that disagreed about the space between them; its buttons were 44px slabs cut at 6
  with 13px words at 500. It all rendered, and every other check passed.

  So what is pinned is what the brand is made of, read off the computed style: the
  letters' face and size, the family, weight and ink of the word beside them,
  and the fill, ink, cut and height of each button. The numbers are lux.exchange's,
  measured on the live site; globals.css says where each comes from.
*/

const family = (f: string) => f.split(',')[0].replace(/["']/g, '').trim()

/** Computed style of an element, or of its ::before, which paints a header button. */
const paint = (el: Locator, pseudo?: '::before') =>
  el.evaluate(
    (e, p) => {
      const cs = getComputedStyle(e, p ?? null)
      const box = e.getBoundingClientRect()
      return {
        family: cs.fontFamily,
        weight: cs.fontWeight,
        size: parseFloat(cs.fontSize),
        color: cs.color,
        background: cs.backgroundColor,
        border: cs.borderTopColor,
        radius: cs.borderTopLeftRadius,
        height: p ? parseFloat(cs.height) : box.height,
      }
    },
    pseudo,
  )

for (const path of ['/', '/console', '/start']) {
  test(`${path}: the wordmark is LUX TEL in Zen wide`, async ({ page }) => {
    await page.goto(path)
    const home = page.locator('a[aria-label="Lux Tel, home"]:visible')
    await expect(home, 'one visible way home').toHaveCount(1)

    // Zen's wide preset: weight 650, tracked in, widened by scaleX, the cut the
    // Lux wordmark is drawn from; caps 22px tall (.71em), typed as capitals.
    const mark = home.locator('.wordmark')
    await expect(mark).toHaveText('LUX TEL')
    const m = await mark.evaluate((e) => {
      const cs = getComputedStyle(e)
      return { family: cs.fontFamily, axes: cs.fontVariationSettings, transform: cs.transform, size: parseFloat(cs.fontSize), caps: cs.textTransform }
    })
    expect(family(m.family)).toBe('Zen')
    expect(m.axes).toContain('650')
    expect(m.transform).toMatch(/^matrix\(1\.486/)
    expect(m.size * 0.71).toBeCloseTo(22, 0)
    expect(m.caps, 'typed in capitals, not transformed').toBe('none')

    // TEL shares the face and size, on the secondary rung.
    const word = home.locator('.wordmark-word')
    const w = await paint(word)
    expect(family(w.family)).toBe('Zen')
    expect(w.size).toBeCloseTo(m.size, 1)
    expect(w.color).toBe('rgba(255, 255, 255, 0.65)')

    // The widening does not reflow, so the link must still cover the letters.
    const [hb, mb] = await Promise.all([home.boundingBox(), mark.boundingBox()])
    expect(hb!.x + hb!.width, 'the letters overhang the link').toBeGreaterThanOrEqual(mb!.x + mb!.width - 1)

    // And the face is on screen, not only named: a family on an element is not a
    // font that loaded, and the fallback renders the same letters.
    const loaded = await page.evaluate(async () => {
      await document.fonts.ready
      return [...document.fonts].some((f) => f.family.replace(/["']/g, '') === 'Zen' && f.status === 'loaded')
    })
    expect(loaded, 'Zen never loaded').toBe(true)
  })
}

for (const width of [390, 1280]) {
  test(`the calls to action are lux.exchange's at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')

    // The header's primary: a 44px target painting the exchange's 34px button,
    // white, cut at 12, black words at 13.5 on 606.
    const band = page.locator('header a[href="/start"]')
    const target = await paint(band)
    const drawn = await paint(band, '::before')
    expect(target.height, 'the target fell below 44').toBeGreaterThanOrEqual(44)
    expect(drawn.height).toBeCloseTo(34, 0)
    expect(drawn.background).toBe('rgb(255, 255, 255)')
    expect(drawn.radius).toBe('12px')
    expect(target.color).toBe('rgb(0, 0, 0)')
    expect(family(target.family)).toBe('Zen')
    expect(target.weight).toBe('606')
    expect(target.size).toBeCloseTo(13.468, 2)

    // A page's primary: 48 tall, white, cut at 24, black words at 17.3 on 606.
    const solid = await paint(page.locator('main a.btn-solid').first())
    expect(solid.background).toBe('rgb(255, 255, 255)')
    expect(solid.color).toBe('rgb(0, 0, 0)')
    expect(solid.radius).toBe('24px')
    expect(solid.height).toBeGreaterThanOrEqual(48)
    expect(solid.weight).toBe('606')
    expect(solid.size).toBeCloseTo(17.316, 2)

    // Its secondary: the card ground inside the .10 hairline, white words.
    const ghost = await paint(page.locator('main a.btn-ghost').first())
    expect(ghost.background).toBe('rgb(15, 15, 15)')
    expect(ghost.border).toBe('rgba(255, 255, 255, 0.1)')
    expect(ghost.color).toBe('rgb(255, 255, 255)')
    expect(ghost.radius).toBe('24px')
  })
}

/*
  The headings and the header's links are set in lux.exchange's type, measured.

  The headings used to carry the wide cut's -0.095em tracking without the stretch
  that tracking was drawn against, so the space between words closed: the hero
  read "Everythingyourbusiness". Every computed style was plausible, and the page
  rendered. What was wrong was the distance between two words, so that distance
  is what is measured: the gap between each word's last glyph and the next word's
  first, on one line, as a fraction of the size. The exchange's own hero measures
  0.218em, and the squash measured 0.136em on lux.tel before this.

  The sizes are the exchange's at each of its steps (Tailwind's sm and lg), and
  the links are its nav links: 17.316 at 497 on the .65 rung.
*/
const HERO: Record<number, { size: number; leading: number }> = {
  390: { size: 40, leading: 48 },
  768: { size: 52, leading: 62 },
  1280: { size: 64, leading: 76 },
  1920: { size: 64, leading: 76 },
}

for (const [width, want] of Object.entries(HERO).map(([w, v]) => [Number(w), v] as const)) {
  test(`the hero heading keeps its words apart at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)

    const h1 = page.locator('main h1')

    // Every adjacent pair of words on one line, from the glyphs' own boxes.
    const gaps = await h1.evaluate((e) => {
      const size = parseFloat(getComputedStyle(e).fontSize)
      const words: { text: string; left: number; right: number; top: number }[] = []
      const walk = document.createTreeWalker(e, NodeFilter.SHOW_TEXT)
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        const text = n.textContent ?? ''
        for (const m of text.matchAll(/\S+/g)) {
          const r = document.createRange()
          r.setStart(n, m.index!)
          r.setEnd(n, m.index! + m[0].length)
          const boxes = r.getClientRects()
          words.push({ text: m[0], left: boxes[0].left, right: boxes[boxes.length - 1].right, top: boxes[0].top })
        }
      }
      return words.slice(1).flatMap((w, i) =>
        Math.abs(w.top - words[i].top) < 2 ? [{ pair: `${words[i].text} ${w.text}`, em: (w.left - words[i].right) / size }] : [],
      )
    })
    expect(gaps.length, 'no two words share a line to measure').toBeGreaterThan(0)
    for (const g of gaps) expect(g.em, `"${g.pair}" runs together`).toBeGreaterThan(0.2)

    // And the setting that gives that gap, which is the exchange's at this width.
    const set = await h1.evaluate((e) => {
      const cs = getComputedStyle(e)
      const size = parseFloat(cs.fontSize)
      return {
        size,
        leading: parseFloat(cs.lineHeight),
        weight: cs.fontWeight,
        track: parseFloat(cs.letterSpacing) / size,
      }
    })
    expect(set.size).toBeCloseTo(want.size, 1)
    expect(set.leading).toBeCloseTo(want.leading, 0)
    expect(set.weight).toBe('497')
    expect(set.track).toBeCloseTo(-0.025, 3)
  })
}

const LINK = { size: 17.316, weight: '497', color: 'rgba(255, 255, 255, 0.65)' }

for (const width of [1280, 1920]) {
  test(`the header's links are lux.exchange's at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const nav = page.locator('header nav')
    const links = nav
      .getByRole('link', { name: 'Network', exact: true })
      .or(nav.getByRole('button', { name: /^(Products|Solutions|Company)$/ }))
    await expect(links).toHaveCount(4)
    for (const el of await links.all()) {
      const p = await paint(el)
      expect(family(p.family)).toBe('Zen')
      expect(p.size).toBeCloseTo(LINK.size, 2)
      expect(p.weight).toBe(LINK.weight)
      expect(p.color).toBe(LINK.color)
    }
  })
}

test('the phone menu sets its links as the header does', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const link = page.locator('nav a[href="/products/esim"]')
  const p = await paint(link)
  expect(p.size).toBeCloseTo(LINK.size, 2)
  expect(p.weight).toBe(LINK.weight)
  expect(p.color).toBe(LINK.color)
})
