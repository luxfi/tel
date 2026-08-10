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
3. **Starlink** is described as equipment and service Lux distributes, and Lux
   is an authorized Starlink reseller. No SpaceX or Starlink logos or marks —
   plain text only. Keep it a supported offering, not the company's identity;
   positioning leads with Lux's own capability so owned network capacity can
   slot in later without a rewrite.
4. **No invented specifics.** No pricing, coverage maps, SLAs, certifications,
   customer logos, testimonials, or statistics. If a section needs a number
   nobody has supplied, leave the copy qualitative.
5. **Lux branding only.** No Hanzo names, logos, or assets. Legal entity is
   `Lux Industries Inc.` (see `src/site.ts`).

## Layout

- `src/app/page.tsx` — the whole page: hero, telecom platform, satellite,
  partnerships, contact
- `src/app/layout.tsx` — header, footer, metadata wiring
- `src/site.ts` — legal entity, contact address, partners
- `src/metadata.ts` — title, description, icons
- `e2e/tel.spec.ts` — render, mailto, overflow and tap-target checks at
  390 / 768 / 1280

## Design vocabulary

From `luxfi/brand` `DESIGN.md`: monochrome, `#000000` surface, white type,
secondary text at `white/60`, cards `rounded-xl border-neutral-800
bg-neutral-900/50 p-6`, opacity ladder in 5-point steps. Type is Druk Wide
(display) + Inter (body), self-hosted from `public/fonts`, matching
`@luxfi/ui`. Icons: Lucide only.

## Deploy

`pnpm build && npx wrangler@3 deploy` — Worker `lux-tel`, custom domains
`lux.tel` + `www.lux.tel`, both proxied. The account is at its Pages project
limit, so this is a Worker with `[assets]`, never a Pages project.

## Contact

`hi@lux.tel` — the domain's MX is Google Workspace. The site links to it as a
`mailto:`; there is no form and no backend.
