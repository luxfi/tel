import { test, expect, type Page } from '@playwright/test'

const WIDTHS = [390, 768, 1280, 1920]

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

/* Both ways it fails are silent: a canvas that threw is blank, and a fixed phase
   is indistinguishable from a propagated one in any single frame. */
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
      // Every 41st pixel — coprime with the width, so not one column.
      for (let i = 0; i < d.length; i += 4 * 41) {
        if (d[i + 3] > 24) {
          lit++
          hash = (hash * 31 + i * d[i + 3]) % 2147483647
        }
      }
      return { lit, hash }
    })

  // Blank samples 0; the globe ~330. The bar sits between, not at either.
  const first = await sample()
  expect(first.lit, 'the globe rendered nothing').toBeGreaterThan(100)

  // One second is ~6km of orbital travel; every endpoint moves.
  await page.waitForTimeout(1000)
  const second = await sample()
  expect(second.hash, 'the globe is a still image').not.toBe(first.hash)
})

/* Measures HEIGHT, not existence: the panel rendered fine inside a 44px box when
   the header's backdrop-blur made it the containing block. */
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

/*
  The header menus, measured rather than looked at. Every one of these failures
  renders — the menu opens, every link works, and it is only WRONG, which is why
  it shipped: a panel 333px short of the container reads as a design, and a head
  34px below its neighbours reads as a head.

  The rule the numbers encode: a panel is placed against an EDGE that exists — the
  container's for a mega-menu, its trigger's for a list — and groups are grid
  columns, so heads share a top by construction instead of by offset.
*/
for (const width of [1280, 1920]) {
  test(`the header menus align to the container at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')

    for (const label of ['Products', 'Solutions', 'Company']) {
      const trigger = page.getByRole('button', { name: label, exact: false }).first()
      await trigger.hover()
      const panel = page.locator('header nav div.absolute').first()
      await expect(panel).toBeVisible()

      const m = await panel.evaluate((el) => {
        const nav = document.querySelector('header nav')!
        const cs = getComputedStyle(nav)
        const n = nav.getBoundingClientRect()
        const p = el.getBoundingClientRect()
        const t = el.parentElement!.querySelector('button')!.getBoundingClientRect()
        return {
          panel: { left: p.left, right: p.right, top: p.top },
          trigger: { left: t.left, bottom: t.bottom },
          content: { left: n.left + parseFloat(cs.paddingLeft), right: n.right - parseFloat(cs.paddingRight) },
          heads: [...el.querySelectorAll('.eyebrow')].map((h) => h.getBoundingClientRect().top),
        }
      })

      if (m.heads.length > 2) {
        // A mega-menu takes the container: its edges land on the wordmark and the
        // button, which is what makes the width read as chosen.
        expect(m.panel.left, `${label} left edge`).toBeCloseTo(m.content.left, 1)
        expect(m.panel.right, `${label} right edge`).toBeCloseTo(m.content.right, 1)
        // ONE row above xl, so every head shares a top. Balanced CSS columns broke
        // this silently: the break lands on the text metrics, so a five-item pillar
        // pushed the head under it out of line with the rest of its row.
        expect(new Set(m.heads).size, `${label} heads are not on one line`).toBe(1)
      } else {
        // A list hangs off the trigger you pointed at, and never past the container.
        expect(m.panel.left, `${label} left edge`).toBeCloseTo(m.trigger.left, 1)
        expect(m.panel.right).toBeLessThanOrEqual(m.content.right)
      }

      // Contiguous with the trigger. A gap is a strip belonging to neither, and
      // crossing it closes the menu on the way to the thing you are reaching for.
      expect(m.panel.top, `${label} floats off its trigger`).toBeCloseTo(m.trigger.bottom, 1)

      // A panel widened to the container is the classic way to buy 1-4px of sideways scroll.
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      expect(scrollWidth, `${label} open scrolls sideways`).toBeLessThanOrEqual(clientWidth)

      await page.mouse.move(width / 2, 850)
      await expect(panel).toHaveCount(0)
    }
  })
}

/* Drag turns the globe, and must not drag-select the hero heading behind it. */
test('the globe can be turned by hand', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('canvas').first()
  const box = (await canvas.boundingBox())!

  const face = () =>
    canvas.evaluate((el: HTMLCanvasElement) => {
      const d = el.getContext('2d')!.getImageData(0, 0, el.width, el.height).data
      let hash = 0
      for (let i = 0; i < d.length; i += 4 * 97) hash = (hash * 31 + d[i + 3]) % 2147483647
      return hash
    })

  const before = await face()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 240, box.y + box.height / 2, { steps: 10 })
  await page.mouse.up()
  expect(await face(), 'dragging did not turn the globe').not.toBe(before)
  expect(await page.evaluate(() => String(window.getSelection())), 'the drag selected page text').toBe('')
})
