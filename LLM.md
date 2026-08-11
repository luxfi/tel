# tel

**Org:** luxfi · **Ecosystem:** lux · **Origin:** https://github.com/luxfi/tel.git

Lux Tel — lux.tel. A Next.js 15 static export served by our own sites plane, plus
a console at `console.lux.tel` that signs in through lux.id. Sibling shape:
`luxfi/industries`, `luxfi/partners`.

It used to run on a Cloudflare Worker. It does not any more, and nothing here
should reach for wrangler.

## Content rules — read before editing copy

The page says only what Lux has authorized. Everything below is a hard rule,
not a style preference.

1. **Never name the carrier platform the voice/messaging side is built on.**
   Describe the capability — "our voice and messaging platform",
   "carrier-grade infrastructure" — never the vendor, anywhere: copy, meta
   tags, alt text, code, comments, commit messages. Publishing a vendor
   relationship is easy and walking it back is not.
2. **Partnerships live in one place**: the `partners` array in `src/site.ts`.
   Adding a partner is one entry, and requires explicit sign-off first.
   ManSat (satellite spectrum and filings, Isle of Man) is authorized.
3. **Never name the satellite network either.** Superseded rule 3, which had the
   satellite provider named as equipment Lux distributes. It is now described only
   as Lux's own orbital capacity — the same treatment rule 1 already gave the
   carrier platform. Changed on the CTO's explicit instruction; the old wording is
   recorded here so nobody reinstates it from memory. No third-party marks, names
   or logos anywhere: copy, meta tags, alt text, code, comments, commit messages.
4. **No invented specifics.** No pricing, coverage maps, SLAs, certifications,
   customer logos, testimonials, or statistics. If a section needs a number
   nobody has supplied, leave the copy qualitative.
5. **Lux branding only.** No Hanzo names, logos, or assets. Legal entity is
   `Lux Industries Inc.` (see `src/site.ts`).

## Layout

Content is DATA. Four files under `src/content/` hold everything the site says;
pages are projections. Adding a primitive is one entry in `catalog.ts` and it
appears in the nav, the index, its own page and its pillar's cross-links.

| File | Holds |
|---|---|
| `catalog.ts` | 31 primitives in 7 pillars — orbit, network, wireless, communications, identity, intelligence, edge |
| `company.ts` | positioning, the six stack layers, capabilities, differentiators |
| `team.ts` | leadership, engineering, advisors — the same roster luxfi/industries publishes |
| `legal.ts` | six policies as structured sections |

- `src/app/page.tsx` — home: hero, stack, catalog, differentiators, partners, contact
- `src/app/network/` — the owned-network and orbit argument; the page to show a partner
- `src/app/products/` + `[slug]` — index and one page per primitive
- `src/app/solutions/`, `pricing/`, `company/`, `legal/` + `legal/[slug]`
- `src/app/console/` + `callback/` — the builder console, behind Lux ID
- `src/console/auth.ts` — OIDC + PKCE against lux.id
- `src/components/Globe.tsx` — the Earth and the constellation, propagated
- `scripts/land.mjs` — regenerates `src/content/land.ts` from coastline geometry
- `src/site.ts` — legal entity, contact address, partners
- `e2e/tel.spec.ts` — render, mailto, overflow and tap targets at 390 / 768 / 1280

**`status` in the catalog is load-bearing.** `live` ships, `beta` is in field
trial, `soon` is announced. The dot and the label render straight off it. A
catalog where everything is `live` is one nobody believes twice.

## Sign-in is Lux ID, and only Lux ID

`src/console/auth.ts` runs an authorization-code flow with PKCE against
`https://lux.id/v1/iam/oauth/*`. There is no password field here and no user
record — the console is a public client with no secret, which is why PKCE is not
optional.

The `lux-tel` application is declared in
`~/work/hanzo/universe/infra/k8s/iam/init_data.json` with the callback
`https://lux.tel/console/callback`. An unregistered `client_id` 400s at authorize,
so the declaration lands before the console does. Paths are `/v1/iam/oauth/*` —
a bare `/oauth/authorize` answers 200 with the portal's SPA shell rather than 404,
so a wrong path reads as a broken page rather than a wrong address.

## The legal pages are DRAFTS

`src/content/legal.ts` exports `REVIEWED = false`. Six policies — terms, privacy,
acceptable use, law enforcement, emergency services, trust — structurally correct
for a carrier and accurate to how the network operates, but **not through outside
counsel.** Do not point DNS at them until they have been, and flip `REVIEWED` when
they are.

They exist because **no Lux property publishes a legal page anywhere today**:
`lux.network/terms`, `lux.exchange/terms`, `lux.cloud/terms` and
`docs.lux.network/terms` each return 200 with the byte-identical document they
serve for a nonsense path. A 200 from an SPA host is not evidence a page exists —
fetch a control path and compare the bytes.

The sections with teeth are the ones a software company would not write: emergency
calling routes to the *registered* address rather than the device's location and
fails on power loss (regulated disclosure, and customers must pass it to their own
users); customer network information carries statutory protection separate from
privacy law; legal process needs a higher standard for content than for records.

## The globe is propagated, not illustrated

`components/Globe.tsx` is the hero. Coverage is where the satellites are, and it
changes while you watch — which is the argument, and why it is computed.

| | |
|---|---|
| Land | Real coastlines. `scripts/land.mjs` rasterises Natural Earth into `content/land.ts` — 240×120 bits, 3,600 bytes, scanline with even-odd fill so lakes need no ring winding. |
| Orientation | Greenwich mean sidereal time. A phase turns at the right rate from an arbitrary start, so it is wrong by a fixed angle forever. |
| Orbits | Period from altitude by Kepler. A Walker star — nodes spanning 180°, so one seam counter-rotates and carries no cross-links, and cross-links drop near the poles. |
| Links | A terminal tracks ONE satellite plus the next during handover. Every one above the mask angle put a dozen chords across the planet. |

The mask is data about the Earth, not about drawing: the renderer picks its own
lattice and asks it.

Honours `prefers-reduced-motion`. Covered by e2e because both failures are silent —
a canvas that threw is blank, and a fixed phase is indistinguishable from a
propagated one in any single frame.

## The menu projects from the catalogue

`components/Nav.tsx` builds Products from `PILLARS` and Solutions from `SOLUTIONS`,
so the header cannot drift from what the pages sell. `SOLUTIONS` moved out of the
solutions page into `content/` for that reason.

**The phone menu is portalled to `document.body`.** The header sets
`backdrop-blur`, which makes it a containing block for fixed descendants, so
`fixed inset-0` resolved to its 44px box. Everything rendered — inside a 44px
window. The test measures HEIGHT, because existing is what it was already doing.

Before this there was no phone navigation at all.

## The questionnaire writes into Base, with no key in the page

`/start` posts to `/v1/base/collections/submissions/records` on its OWN origin.

Two things already built make that work, and neither needed a schema:

- **Every project is provisioned a `submissions` collection** (`apps/base/space.go`)
  — `form`, `data`, `created`, where `data` is free-form JSON. A new form is a new
  value of `form`, not a new table. `EnsureSpace` runs at project create and is
  idempotent.
- **A published site host serves `/v1/base` scoped to the org its HOSTNAME resolves
  to** (HIP-0014, `CLOUD_BASE_PUBLIC_HOST`). The org comes from the resolved site,
  never from the caller.

So the page carries no credential at all. Create is public; list, view, update and
delete stay superuser-only. Verified live: anonymous `POST` → 200, anonymous `GET`
→ `403 Only superusers can perform this action`.

⛔ This is NOT the publishable-key-plus-policies pattern, and it is stronger than
it. There is no credential in the page to leak, rotate or replay from another
origin, and writing into another tenant is not denied by a rule — it is
unaddressable, because the only Base a page can reach is the one its own hostname
resolves to.

Mail is the fallback, not the mechanism: a failed post keeps the answers on screen
and offers the same body as a `mailto:`.

**Reading submissions back needs a superuser session** — a machine token gets 403,
by the same design that makes the write safe.

## Design vocabulary

From `luxfi/brand` `DESIGN.md`: monochrome, `#000000` surface, white type,
secondary text at `white/60`, cards `rounded-xl border-neutral-800
bg-neutral-900/50 p-6`, opacity ladder in 5-point steps. Type is Druk Wide
(display) + Inter (body), self-hosted from `public/fonts`, matching
`@luxfi/ui`. Icons: Lucide only.

## Deploy — a static site, through our own API

    push / tag v*  ->  gate  ->  deploy
                                 POST api.hanzo.ai/v1/projects/tel/deploy
                                 X-Org-Id: lux

The gate proves the tree (`tc`, `build`, Playwright against the BUILT export). The
deploy ships a tar.gz of `out/` to the static-site API, which stores it as an
immutable content-addressed release and flips a pointer — so rollback is
activating an older release, not a rebuild.

**It was a container image for one afternoon and should not be again.** A static
export is FILES: it needed no image, no GHCR package, no pull secret, no replica
count and no liveness probe, and every one of those was a thing to get wrong. Two
hours went on a registry permission — the package landed UNLINKED, which grants
pull to the pushing token alone, so both pods sat in ImagePullBackOff against an
image that existed and was correct.

**A tar.gz, not the JSON file manifest.** `/v1/sites/deploy` casts each file's
`content` straight to `[]byte` and JSON strings must be valid UTF-8, so the
self-hosted Druk Wide and Inter faces would arrive CORRUPT under a 200. The
artifact path (`/v1/projects/:slug/deploy`) sniffs the archive and preserves bytes.

**Read the body, not the status.** A 402 (org out of credits) and a 503 both leave
the live site exactly as it was; a step that only checks for a 2xx reports a deploy
that never happened.

### Deploying puts bytes on the edge; BINDING is what makes lux.tel serve them

The deploy lands the release at `tel.hanzo.app` — `<slug>.<CLOUD_SITES_APEX>`, the
one-label edge the sites plane serves from object storage. `lux.tel` only shows it
once the domain is BOUND to the project, so the workflow binds all three hosts
after every deploy. Without that step a deploy is green and the domain keeps
showing whatever it showed before, which is the exact failure this repo kept
hitting in other forms.

The bind is idempotent and non-fatal: a verified host comes back live, an
unverified one comes back `pending` **with the DNS records to publish**, printed
into the log rather than discovered later by wondering why the site did not change.

### api.hanzo.ai and api.lux.cloud are DIFFERENT deployments

Two builds of cloud, different storage, different billing state. lux.tel is served
by the plane behind **api.hanzo.ai** (`x-hanzo-site: tel`).

The deploy job pointed at the other one and answered `402 insufficient_balance`,
which read as a funding problem and was not: a success would have written into a
plane nobody serves lux.tel from. No credit was ever needed.

⛔ Both answer 200 on `/v1/projects`. Compare `x-api-version`.

### The project's ORG comes from two places

Create takes it from the token; list and deploy take it from **`X-Org-Id`**. Create
without the header lands the project in the token's org and deploy then 404s on a
project that exists — create said 409, list said `[]`, deploy said 404, all true
about different orgs. Send `X-Org-Id: lux` on every call.

Live project: `proj_COjngPJawoyS-OpDqxQMEw`, org `lux`, prefix `lux/tel`.

### Binding a domain does NOT route it — that takes an Ingress

The bind writes a row in the projects store and creates no Ingress, so TLS fails at
SNI with `tlsv1 unrecognized name` — reads like a certificate problem, is a missing
route. The three hosts are declared in `hanzo/universe →
charts/app/values/hanzo/hanzo-domains.yaml`, backing `cloud:8000`. cert-manager
issues per-host certs once the Ingress exists.

### Cloudflare: `full` SSL first, then detach the Worker

1. **SSL `flexible` → `full`**, first — flexible talks HTTP to the origin and loops
   against the ingress redirect.
2. **Detach the Worker Custom Domain.** The apex was `AAAA 100::`, read-only
   (`code 1043`) until the Worker domain is deleted at
   `/accounts/:id/workers/domains/:id`. An empty `workers/routes` does not mean
   unbound.

All three hosts are `A 129.212.164.5` proxied. A new proxied record 522s for ~30s —
edge propagation, not the origin.

## Contact

`hi@lux.tel` — the domain's MX is Google Workspace. The site links to it as a
`mailto:`; there is no form and no backend.
