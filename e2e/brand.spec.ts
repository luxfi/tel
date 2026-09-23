import { test, expect, type Locator } from '@playwright/test'

/*
  The wordmark and the calls to action wear lux.exchange's brand, measured.

  Both were wrong in a way nothing else here could see. The page set "LUX" as type,
  at weight 650 with the wide cut's tracking, beside a 40% "tel", in five copies
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
  test(`${path}: the wordmark is LUX in Zen wide and a Zen "tel"`, async ({ page }) => {
    await page.goto(path)
    const home = page.locator('a[aria-label="Lux Tel, home"]:visible')
    await expect(home, 'one visible way home').toHaveCount(1)

    // The letters are Zen's wide preset: weight 650, tracked in, widened by
    // scaleX, the cut the Lux wordmark is drawn from; caps 22px tall (.71em).
    const letters = home.locator('.wordmark-letters')
    await expect(letters).toHaveText('LUX')
    const l = await letters.evaluate((e) => {
      const cs = getComputedStyle(e)
      return { family: cs.fontFamily, axes: cs.fontVariationSettings, track: cs.letterSpacing, transform: cs.transform, size: parseFloat(cs.fontSize), transformText: cs.textTransform }
    })
    expect(family(l.family)).toBe('Zen')
    expect(l.axes).toContain('650')
    expect(l.transform).toMatch(/^matrix\(1\.486/)
    expect(l.size * 0.71).toBeCloseTo(22, 0)
    expect(l.transformText, 'LUX is typed in capitals, not transformed').toBe('none')
    expect((await home.innerText()).replace(/\s+/g, ' ').trim()).toBe('LUX tel')

    // The word starts after the widened letters, not inside them.
    const [lb, wb] = await Promise.all([letters.boundingBox(), home.locator('.wordmark-word').boundingBox()])
    expect(wb!.x - (lb!.x + lb!.width), 'the word overlaps the letters').toBeGreaterThanOrEqual(8)

    // The word: Zen at the book weight, on the secondary rung, lower case as typed.
    const word = home.locator('.wordmark-word')
    const w = await paint(word)
    expect(family(w.family)).toBe('Zen')
    expect(w.weight).toBe('497')
    expect(w.color).toBe('rgba(255, 255, 255, 0.65)')
    expect(w.size).toBeCloseTo(17.316, 2)
    expect(await word.evaluate((e) => getComputedStyle(e).textTransform)).toBe('none')

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
