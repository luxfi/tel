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
        command: 'python3 -m http.server 3000 --directory out',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
      },
})
