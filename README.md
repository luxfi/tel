# tel

Lux Tel static site — telecommunications and satellite connectivity. Live at
[lux.tel](https://lux.tel).

## To run locally

Install `pnpm` [like so](https://pnpm.io/installation)

```
pnpm install
pnpm dev
```

## Build and verify

```
pnpm build        # static export -> ./out
pnpm tc           # typecheck
pnpm test:e2e     # renders ./out and checks 390 / 768 / 1280
```

The e2e suite also runs against the deployed site:

```
BASE_URL=https://lux.tel pnpm test:e2e
```

## Deploy

Cloudflare Worker serving the static export, with `lux.tel` and `www.lux.tel`
bound as custom domains (see `wrangler.toml`).

```
pnpm build && npx wrangler@3 deploy
```

## Stack

- Next.js 15, static export (`output: 'export'`)
- Tailwind CSS
- Lux type and color vocabulary per [luxfi/brand](https://github.com/luxfi/brand)
  `DESIGN.md` — Druk Wide headings, Inter body, monochrome on black
- Icons from [Lucide](https://lucide.dev)
