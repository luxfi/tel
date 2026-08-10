import { defineConfig, devices } from '@playwright/test'

/*
  Runs against the static export by default; point it at the deployed site with
  BASE_URL=https://lux.tel pnpm test:e2e
*/
const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        // `python3 -m http.server` cannot serve this export: `next export` writes
        // console.html AND a console/ directory beside it, and python answers
        // /console with a 301 to /console/ and then a DIRECTORY LISTING. Eight of
        // ten pages were unreachable and the console rendered as a file index.
        // e2e/serve.mjs resolves the way the real static server does.
        command: 'node e2e/serve.mjs',
        url: 'http://localhost:3000',
        // FALSE, deliberately: `true` reuses whatever already holds :3000, which
        // twice has been a stale server from an earlier run answering with the
        // listing above — a failure nobody reads as "wrong server".
        reuseExistingServer: false,
      },
})
