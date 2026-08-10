# tel

**Org:** luxfi · **Ecosystem:** lux · **Origin:** https://github.com/luxfi/tel.git

Lux Tel marketing site — lux.tel. Next.js 15 static export on a Cloudflare
Worker. Sibling shape: `luxfi/industries`, `luxfi/partners`.

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
- `src/components/Orbit.tsx` — the constellation, computed
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

## The orbit canvas is computed, not illustrated

`components/Orbit.tsx` draws planes at their inclinations, satellites advancing
along them, and a link only where one is above a ground site's horizon. Illustration
reproduces the picture but not the relationship, and the relationship is the
argument. Deterministic — no random seeding — so a screenshot is reproducible.
Honours `prefers-reduced-motion` with a single still frame.

## Design vocabulary

From `luxfi/brand` `DESIGN.md`: monochrome, `#000000` surface, white type,
secondary text at `white/60`, cards `rounded-xl border-neutral-800
bg-neutral-900/50 p-6`, opacity ladder in 5-point steps. Type is Druk Wide
(display) + Inter (body), self-hosted from `public/fonts`, matching
`@luxfi/ui`. Icons: Lucide only.

## Deploy — a static site, through our own API

    push / tag v*  ->  gate  ->  deploy
                                 POST api.lux.cloud/v1/projects/tel/deploy

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

`lux.tel` currently resolves to Cloudflare (172.67.188.143 / 104.21.19.189) and
serves the OLD single-page site. The cutover is a CNAME to `tel.hanzo.app`, which
is itself behind Cloudflare — so it is a record change in the same zone, not a
migration.

### What it waits on

The whole lane is proven by hand: token, project create, artifact upload. The
project exists (`proj_Y8qwGFfkLIbuxWE1o7yh4g`, org `lux`, bucket `hanzo-sites`)
and the upload reaches the metering gate, which is past every step that could be
wrong about the file. It answers **402 `insufficient_balance`** — the `lux` org
has `availableCents 0`.

Funding it through the API is itself blocked: `POST /v1/admin/customers/lux/credit`
with a SuperAdmin token answers **200 carrying**
`{"status":"error","msg":"grant failed: commerce not configured"}`. So two things
are open, and neither is in this repo.

`LUX_DEPLOY_TOKEN` is the one secret the workflow reads and it is not set. It must
be an `sk-` key scoped to the **lux** org — a key minted with a lux bearer against
`api.hanzo.ai` came back scoped elsewhere (it listed `insights`, not `tel`), and
`api.lux.cloud` does not serve `/v1/keys` at all.

## Contact## Contact

`hi@lux.tel` — the domain's MX is Google Workspace. The site links to it as a
`mailto:`; there is no form and no backend.
