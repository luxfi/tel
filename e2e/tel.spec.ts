import { test, expect, type Page } from '@playwright/test'

const WIDTHS = [390, 768, 1280]

const gotoClean = async (page: Page) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/')
  return errors
}

test('renders the page', async ({ page }) => {
  const errors = await gotoClean(page)
  await expect(page).toHaveTitle(/Lux Tel/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('satellite connectivity')
  // The catalog reaches the page. Not a copy string — the pillars are data, and
  // this is what fails if the projection breaks rather than the wording changes.
  for (const pillar of ['Orbit', 'Communications', 'Wireless', 'Intelligence']) {
    await expect(page.getByRole('heading', { name: pillar, exact: true })).toBeVisible()
  }
  await expect(page.getByText('Lux Industries Inc.')).toBeVisible()
  expect(errors).toEqual([])
})

test('contact path is a real mailto, and there is no form', async ({ page }) => {
  await page.goto('/')
  expect(await page.locator('form').count()).toBe(0)
  const mailtos = page.locator('a[href^="mailto:"]')
  expect(await mailtos.count()).toBeGreaterThan(0)
  for (const href of await mailtos.evaluateAll((els) => els.map((e) => e.getAttribute('href')!))) {
    expect(href).toMatch(/^mailto:[^@\s]+@lux\.tel/)
  }
})

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  })

  test(`tap targets are at least 44px at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const small = await page.locator('a:visible, button:visible').evaluateAll((els) =>
      els
        .map((e) => ({ text: (e.textContent ?? '').trim().slice(0, 40), h: e.getBoundingClientRect().height }))
        .filter((r) => r.h < 44),
    )
    expect(small).toEqual([])
  })
}

/*
  Nothing on this site names anyone but Lux. Carriers, satellite operators,
  spectrum partners and the platform behind the wire are implementation; the
  product is Lux Industries. The rule covers copy, meta tags, alt text and markup,
  so it is checked against the rendered DOM of every page rather than the source of
  one — an alt attribute is exactly where a name survives a copy edit.
*/
test('nobody but Lux is named anywhere', async ({ page }) => {
  const forbidden = ['telnyx', 'starlink', 'spacex', 'mansat', 'hanzo']
  for (const path of ['/', '/network', '/products', '/solutions', '/pricing', '/company', '/legal', '/console']) {
    await page.goto(path)
    const html = (await page.content()).toLowerCase()
    for (const name of forbidden) {
      expect(html, `${name} appears on ${path}`).not.toContain(name)
    }
  }
})

/*
  Sign-in is Lux ID and only Lux ID: the console offers one control, and it must
  not have grown a password field.
*/
test('the console signs in through lux.id and holds no credential', async ({ page }) => {
  await page.goto('/console')
  await expect(page.getByRole('button', { name: /Sign in with Lux ID/i })).toBeVisible()
  expect(await page.locator('input[type=password]').count()).toBe(0)
})

/*
  WE DO NOT CLAIM TO OWN INFRASTRUCTURE. Lux delivers voice, messaging, numbering,
  wireless and satellite as one service; it does not own the fibre, the
  interconnect, the spectrum or the constellation, and a site that says otherwise
  is making a claim a customer can check and we cannot support.

  This is a gate rather than a note because the claims got written twice — the
  first draft was built on "we own the layers most providers rent", and it reads
  so naturally that it survives a careful edit. Checked against the rendered DOM,
  which is where a claim that slipped back into a heading would live.
*/
test('the site claims no ownership of infrastructure', async ({ page }) => {
  const claims = [
    /\bwe own\b/i,
    /\bowns? the (fibre|fiber|network|backbone|interconnect|spectrum|stack|telephony)/i,
    /\bour own (fibre|fiber|backbone|interconnect|network|constellation|carrier)/i,
    /owned end to end/i,
    // The PARTICIPLE, which is how four of these survived the patterns above:
    // "the physical layer, owned", "an owned terrestrial backbone", "its own
    // backbone", "our own carrier network". Same claim, no "we", no match.
    /\bowned\b/i,
    /\bits own (fibre|fiber|backbone|interconnect|network|spectrum)/i,
    // And the claim's mirror image: saying competitors RENT what we do not is
    // the same assertion, made about somebody else.
    /\b(providers|carriers|competitors) rent\b/i,
    /\bthe interconnect is ours\b/i,
    /\bwe operate our own\b/i,
  ]
  for (const path of ['/', '/network', '/products', '/solutions', '/pricing', '/company']) {
    await page.goto(path)
    const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
    for (const claim of claims) {
      expect(text, `${claim} appears on ${path}`).not.toMatch(claim)
    }
  }
})

/*
  Endpoints are documentation, not product copy. They were printed on every
  primitive's page and again in the console, so one rename meant editing a
  marketing site — and a reader comparing two spellings of the same route has
  found a bug rather than an API.
*/
test('no endpoint is printed as product copy', async ({ page }) => {
  for (const path of ['/products/voice', '/products/numbers', '/products/orbital-broadband', '/console']) {
    await page.goto(path)
    const text = await page.locator('body').innerText()
    expect(text, `an endpoint is printed on ${path}`).not.toMatch(/(GET|POST|PUT|DELETE)\s+\/v1\//)
  }
})

/*
  The globe is the hero's whole argument, and both ways it can fail are silent: a
  canvas that threw during setup is simply blank, and a canvas drawn from a fixed
  phase looks identical to one propagated from the clock in any single screenshot.
  So this asserts it drew SOMETHING, and that what it drew MOVES.
*/
test('the globe draws the Earth and keeps propagating', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('canvas').first()
  await expect(canvas).toBeVisible()

  const sample = () =>
    canvas.evaluate((el: HTMLCanvasElement) => {
      const ctx = el.getContext('2d')
      if (!ctx) return { lit: 0, hash: 0 }
      const d = ctx.getImageData(0, 0, el.width, el.height).data
      let lit = 0
      let hash = 0
      // Every 41st pixel: enough to see the picture, cheap enough to run twice,
      // and a stride coprime with the width so it does not sample one column.
      for (let i = 0; i < d.length; i += 4 * 41) {
        if (d[i + 3] > 24) {
          lit++
          hash = (hash * 31 + i * d[i + 3]) % 2147483647
        }
      }
      return { lit, hash }
    })

  // A blank canvas samples 0; the globe samples ~330 at the default viewport. The
  // bar sits between those rather than near the measurement, because the count
  // scales with viewport and this test is asking "did it draw", not "how much".
  const first = await sample()
  expect(first.lit, 'the globe rendered nothing').toBeGreaterThan(100)

  // One second is ~6 km of orbital travel and about 0.004° of Earth rotation —
  // small, but every satellite and every link endpoint moves, so the frame differs.
  await page.waitForTimeout(1000)
  const second = await sample()
  expect(second.hash, 'the globe is a still image').not.toBe(first.hash)
})

/*
  The phone menu must COVER the page, and the way it failed is invisible to every
  other check: the header sets `backdrop-blur`, backdrop-filter makes an element a
  containing block for fixed-position descendants, and so `fixed inset-0` resolved
  against the header's own 44px box rather than the viewport. The panel rendered,
  its background painted, all 44 links existed — inside a 44px window. It read as a
  background that would not paint.

  So this asserts the panel's HEIGHT against the viewport, not its existence.
*/
test('the phone menu covers the viewport and reaches every section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()

  const panel = page.locator('div.fixed.inset-0').first()
  await expect(panel).toBeVisible()
  const { panelH, viewportH } = await panel.evaluate((el) => ({
    panelH: el.getBoundingClientRect().height,
    viewportH: window.innerHeight,
  }))
  expect(panelH, 'the menu panel is not full height').toBeGreaterThanOrEqual(viewportH - 1)

  // Every top-level section is reachable, which is the whole point of having it.
  for (const label of ['Products', 'Solutions', 'Network', 'Company']) {
    await expect(panel.getByRole('link', { name: label, exact: true })).toBeVisible()
  }
  // The page behind must not scroll under it.
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden')

  await page.getByRole('button', { name: 'Close menu' }).click()
  await expect(panel).toHaveCount(0)
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden')
})
