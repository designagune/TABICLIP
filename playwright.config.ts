import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html', {open: 'never'}], ['github']] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'ja-JP',
    timezoneId: 'Asia/Seoul'
  },
  expect: {toHaveScreenshot: {animations: 'disabled', caret: 'hide'}},
  projects: [
    {
      name: 'chromium-mobile',
      use: {...devices['Desktop Chrome'], viewport: {width: 390, height: 844}}
    }
  ],
  webServer: {
    command: 'pnpm exec next dev --port 3100',
    env: {...process.env, NEXT_DIST_DIR: '.next-e2e'},
    url: 'http://127.0.0.1:3100/ja',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
