import { test, expect, type Page } from '@playwright/test'
import { KEY } from '@hanzo/appearance/state'

/* 375 is the narrowest phone still in wide use, and it is the width the hero
   breaks at first: every rung above it had room to hide a layout that only just
   fits. */
const WIDTHS = [375, 390, 768, 1280, 1920]

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
  await expect(page.getByRole('heading', { level: 1 })).toContainText('needs to connect')
  // The catalog reaches the page. Not a copy string — the pillars are data, and
  // this is what fails if the projection breaks rather than the wording changes.
  for (const pillar of ['Connectivity', 'Cellular', 'Messaging', 'Agentic AI']) {
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
  The hero reads globe, then headline — and it is the ORDER that is asserted,
  because every other property of this section survived the bug.

  The globe was absolute at every width: full-bleed wallpaper behind the copy,
  dimmed to 90%, with the scrim that makes text legible over it suppressed under
  lg. It rendered, it propagated, it never overflowed, and every check in this
  file passed while a phone showed body copy laid over a field of moving dots.
  Nothing here can see "unreadable", so what is pinned instead is the geometry
  that made it so: on a phone the canvas ENDS above where the headline STARTS.

  Wide, the same one canvas goes back beside the copy — asserted from the same
  numbers, so a change that fixes one width by breaking the other fails here.
*/
test('narrow, the globe sits above the headline; wide, beside it', async ({ page }) => {
  const geometry = async () =>
    page.evaluate(() => {
      const r = (s: string) => {
        const el = document.querySelector(s)
        if (!el) return null
        const b = el.getBoundingClientRect()
        return { top: b.top + scrollY, bottom: b.bottom + scrollY, left: b.left, right: b.right }
      }
      return { globe: r('canvas'), headline: r('h1') }
    })

  for (const width of [375, 390, 768]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    const { globe, headline } = await geometry()
    expect(globe, `no globe at ${width}`).not.toBeNull()
    expect(globe!.bottom, `the globe is not clear of the headline at ${width}`).toBeLessThanOrEqual(headline!.top)
  }

  for (const width of [1280, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const { globe, headline } = await geometry()
    // BESIDE, which is a vertical fact: the two share a band rather than
    // following one another. They also overlap horizontally, by design and at
    // full bleed — the scrim exists precisely because they do — so the side is
    // read from the canvas's midpoint, not from its near edge.
    expect(globe!.bottom, `the globe stacked above the headline at ${width}`).toBeGreaterThan(headline!.top)
    expect((globe!.left + globe!.right) / 2, `the globe left the right half at ${width}`).toBeGreaterThan(width / 2)
  }
})

/*
  The scale is @hanzo/appearance's to move, and this proves the page answers it.

  The knobs are two custom properties on <html>; every rung in tailwind.config.ts
  is a calc() against them, so type and spacing travel together. The failure this
  guards is silent and total: point one utility at a literal and the site still
  renders perfectly at the default, having quietly stopped listening. Written
  against the package's own storage key rather than a copy of it, and driven the
  way a person would — store a preference, load the page — so it also fails if
  the site stops applying what it finds.
*/
test('a stored preference retunes type and spacing together', async ({ page }) => {
  const measure = () =>
    page.evaluate(() => {
      const cs = (s: string, p: string) => parseFloat(getComputedStyle(document.querySelector(s)!).getPropertyValue(p))
      return { headline: cs('h1', 'font-size'), lede: cs('.lede', 'font-size'), band: cs('.band', 'padding-top') }
    })

  await page.goto('/')
  const published = await measure()

  await page.addInitScript(
    ([k, v]) => localStorage.setItem(k, v),
    [KEY, JSON.stringify({ type: 1.3, density: 'comfortable' })] as const,
  )
  await page.goto('/')
  // WAITED FOR, not snapshotted. The preference lands on mount rather than in an
  // inline head script (see src/appearance.tsx for why), so measuring as soon as
  // `goto` resolves races hydration — and losing that race reports "the page
  // ignores the knob", which is the failure this test exists to find. Waiting for
  // the property asserts nothing on its own; the sizes below are still the claim.
  await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--type-scale') !== '')
  const larger = await measure()

  expect(larger.headline, 'type did not follow --type-scale').toBeCloseTo(published.headline * 1.3, 0)
  expect(larger.lede, 'the ramp moved by rung rather than as a whole').toBeCloseTo(published.lede * 1.3, 0)
  expect(larger.band, 'spacing did not follow --density').toBeCloseTo(published.band * 1.15, 0)
})

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

  The rule the numbers encode: every panel is placed against the container's edges,
  and groups are grid columns, so heads share a top by construction rather than by
  offset.
*/
for (const width of [1280, 1920]) {
  test(`the header menus span the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')

    for (const label of ['Products', 'Solutions', 'Company']) {
      const trigger = page.getByRole('button', { name: label, exact: false }).first()
      await trigger.hover()

      // The panel is PORTALLED to the body, so it is not under `header` any more.
      const panel = page.locator('body > div.fixed.inset-x-0').first()
      await expect(panel).toBeVisible()

      const m = await panel.evaluate((el) => {
        const nav = document.querySelector('header nav')!
        const cs = getComputedStyle(nav)
        const n = nav.getBoundingClientRect()
        const p = el.getBoundingClientRect()
        // CONTENT box, not the border box: both the nav and the panel's inner
        // container carry the same responsive padding, so comparing border boxes
        // compares two paddings rather than two alignments.
        const innerEl = el.firstElementChild as HTMLElement
        const innerCs = getComputedStyle(innerEl)
        const innerRect = innerEl.getBoundingClientRect()
        const inner = {
          left: innerRect.left + parseFloat(innerCs.paddingLeft),
          right: innerRect.right - parseFloat(innerCs.paddingRight),
        }
        return {
          panel: { left: p.left, right: p.right, top: p.top },
          inner,
          header: document.querySelector('header')!.getBoundingClientRect().bottom,
          content: { left: n.left + parseFloat(cs.paddingLeft), right: n.right - parseFloat(cs.paddingRight) },
          heads: [...el.querySelectorAll('.eyebrow')].map((h) => h.getBoundingClientRect().top),
          opaque: getComputedStyle(el).backgroundColor,
          viewport: window.innerWidth,
        }
      })

      // EDGE TO EDGE. The panel escapes the container; only its content is held to
      // the grid, so the links still land under the wordmark.
      expect(m.panel.left, `${label} left edge`).toBeCloseTo(0, 1)
      expect(m.panel.right, `${label} right edge`).toBeCloseTo(m.viewport, 1)
      expect(m.inner.left, `${label} content left`).toBeCloseTo(m.content.left, 1)
      expect(m.inner.right, `${label} content right`).toBeCloseTo(m.content.right, 1)

      // OPAQUE. Glass put the moving globe under text somebody is reading.
      expect(m.opaque, `${label} is not opaque`).toBe('rgb(0, 0, 0)')

      // One row, so every group head shares a top. Balanced columns broke this
      // silently: the break lands on the text metrics, so a long group pushed the
      // head under it out of line with the rest of its row.
      if (m.heads.length > 2) {
        expect(new Set(m.heads).size, `${label} heads are not on one line`).toBe(1)
      }

      // Contiguous with the header. A gap is a strip belonging to neither, and
      // crossing it closes the menu on the way to the thing you are reaching for.
      expect(m.panel.top, `${label} floats off the header`).toBeCloseTo(m.header, 1)

      // A panel widened past the container is the classic way to buy sideways scroll.
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

/*
  EVERY internal link resolves.

  The console's sidebar linked to /console/assistant, /console/reporting and
  /console/debugging for as long as it existed. All three 404'd. Nothing caught it
  because every other test visits pages it already knows about, and a nav item is
  exactly the thing nobody re-checks after writing it.

  This crawls what the site actually links to rather than a list kept beside it, so
  a link added tomorrow is covered without anyone remembering to add it here.
*/
test('every internal link resolves', async ({ page, request }) => {
  const seen = new Set<string>()
  const bad: string[] = []

  for (const path of ['/', '/products', '/solutions', '/network', '/company', '/pricing', '/legal', '/console', '/start']) {
    await page.goto(path)
    const hrefs = await page.locator('a[href]').evaluateAll((els) =>
      els.map((e) => e.getAttribute('href') ?? '').filter((h) => h.startsWith('/')),
    )
    for (const h of hrefs) {
      const url = h.split('#')[0]
      if (!url || seen.has(url)) continue
      seen.add(url)
      // ONCE more before believing it. Run straight after a cache purge, the edge
      // is refetching every path from origin and a cold miss can time out — which
      // is not a dead link, and a suite that fails after every deploy stops being
      // read. A link that is genuinely gone fails both times.
      let res = await request.get(url)
      if (!res.ok()) res = await request.get(url)
      if (!res.ok()) bad.push(`${url} -> ${res.status()} (linked from ${path})`)
    }
  }

  expect(seen.size, 'crawled nothing — the selector is wrong').toBeGreaterThan(30)
  expect(bad, `dead internal links:\n${bad.join('\n')}`).toEqual([])
})

/*
  The links that leave the site, limited to hosts WE run.

  A link to status.lux.tel sat in the console shell beside a green dot that said
  everything was fine. The host had never existed — no A record, no CNAME — so
  every console page shipped a confident lie, and the internal crawl above could
  not see it because the href left the site. Third-party links are somebody
  else's uptime and are deliberately not asserted here; ours are ours, and a
  host we name is a host we are claiming to run.
*/
test('every link to a host we run resolves', async ({ page, request }) => {
  const ours = /(^|\.)(lux|hanzo|zoo)\.(tel|network|cloud|id|ai|ngo)$/
  const seen = new Set<string>()
  const bad: string[] = []

  for (const path of ['/', '/products', '/solutions', '/network', '/company', '/pricing', '/legal', '/console']) {
    await page.goto(path)
    const hrefs = await page.locator('a[href]').evaluateAll((els) =>
      els.map((e) => e.getAttribute('href') ?? '').filter((h) => h.startsWith('http')),
    )
    for (const h of hrefs) {
      let host = ''
      try {
        host = new URL(h).host
      } catch {
        continue
      }
      if (!ours.test(host) || seen.has(host)) continue
      seen.add(host)
      let res = await request.get(`https://${host}`, { failOnStatusCode: false }).catch(() => null)
      if (!res) res = await request.get(`https://${host}`, { failOnStatusCode: false }).catch(() => null)
      if (!res) bad.push(`${host} does not resolve (linked from ${path})`)
      else if (res.status() >= 500) bad.push(`${host} -> ${res.status()} (linked from ${path})`)
    }
  }

  expect(seen.size, 'found no first-party outbound links — the filter is wrong').toBeGreaterThan(0)
  expect(bad, `links to hosts we run that do not answer:\n${bad.join('\n')}`).toEqual([])
})

/*
  The console's record views, in every state a real account passes through.

  A signed-out visitor is the only state a browser reaches without a Lux ID, so the
  rest are driven by seeding the token the console reads and INTERCEPTING the API —
  which is the honest way to test a client: it asserts what this code does with an
  answer, and never pretends to have logged anybody in.

  What the interception is held to is the real contract: the paths, the `{data:[]}`
  envelope and the field names come from /v1/tel, and `the console asks the tel API
  the way it answers` below pins the request itself so a route rename fails here
  rather than in production.
*/
const VIEWS = [
  { path: '/console/numbers', title: 'Numbers', api: '**/v1/tel/numbers' },
  { path: '/console/calls', title: 'Calls', api: '**/v1/tel/calls' },
  { path: '/console/messages', title: 'Messages', api: '**/v1/tel/messages' },
]

for (const v of VIEWS) {
  test(`${v.title}: a signed-out visitor is asked to sign in, not shown an error`, async ({ page }) => {
    await page.goto(v.path)
    await expect(page.getByRole('heading', { name: v.title })).toBeVisible()
    await expect(page.getByRole('button', { name: /Sign in with Lux ID/i })).toBeVisible()
    // No table, and no half-rendered shell claiming the account is empty.
    expect(await page.locator('table').count()).toBe(0)
  })

  test(`${v.title}: an empty account says what to do, not "no data"`, async ({ page }) => {
    await page.route(v.api, (r) => r.fulfill({ json: { data: [] } }))
    await page.addInitScript(() => localStorage.setItem('lux_tel_token', 'test'))
    await page.goto(v.path)
    // An empty state that names the next action, which is the only kind anyone acts on.
    //
    // WAITED FOR, not snapshotted. The request this mocks resolves after load, so
    // reading innerText once races the render — and under three views in parallel
    // whichever one lost the race failed, a different one each run. A retrying
    // assertion asks the same question without depending on who got there first.
    await expect(page.locator('main')).toContainText(/yet\./)
    expect(await page.locator('main').innerText()).not.toMatch(/no data|nothing here/i)
  })

  test(`${v.title}: an expired session offers a way back in`, async ({ page }) => {
    await page.route(v.api, (r) => r.fulfill({ status: 401, json: {} }))
    await page.addInitScript(() => localStorage.setItem('lux_tel_token', 'stale'))
    await page.goto(v.path)
    // Not "401", and not a spinner that never resolves.
    await expect(page.getByText(/session ended/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Sign in again/i })).toBeVisible()
  })
}

/*
  The REQUEST, pinned. X-Org-Id is not optional on these routes — they read the org
  from the header while others read it from the token, so omitting it turns a
  correct request into a 403. That is invisible from the rendered page, which is
  why it is asserted on the wire.
*/
test('the console asks the tel API the way it answers', async ({ page }) => {
  let seen: { url: string; auth: string | undefined; org: string | undefined } | null = null
  await page.route('**/v1/tel/numbers', (r) => {
    const h = r.request().headers()
    seen = { url: r.request().url(), auth: h['authorization'], org: h['x-org-id'] }
    return r.fulfill({ json: { data: [{ id: 'n1', e164: '+441632960000', country: 'GB', type: 'local', capable: ['voice', 'sms'], monthly: 250, currency: 'GBP' }] } })
  })
  await page.addInitScript(() => localStorage.setItem('lux_tel_token', 'test-token'))
  await page.goto('/console/numbers')

  await expect(page.getByText('+441632960000')).toBeVisible()
  expect(seen, 'the page never called the API').not.toBeNull()
  expect(seen!.url).toContain('api.hanzo.ai/v1/tel/numbers')
  expect(seen!.auth, 'the token was not sent').toBe('Bearer test-token')
  expect(seen!.org, 'X-Org-Id is required by this route and was not sent').toBe('lux')

  // Minor units are money, not a count: 250 GBP-minor is £2.50 and never 250.
  await expect(page.getByText('£2.50')).toBeVisible()
})
