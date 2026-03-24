import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  retries: process.env.CI ? 2 : 0,
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    viewport: {
      height: 1000,
      width: 1600,
    },
  },
  webServer: {
    command:
      'pnpm --filter @black-tonny/retail-admin run build && pnpm --filter @black-tonny/retail-admin exec vite preview --host 127.0.0.1 --port 4173',
    env: {
      ...process.env,
      VITE_APP_NAMESPACE: 'black-tonny-retail-admin',
      VITE_APP_TITLE: 'Black Tonny Retail Admin',
      VITE_ARCHIVER: 'false',
      VITE_GLOB_API_URL: '/api',
      VITE_BASE: '/',
      VITE_E2E_BYPASS_CAPTCHA: 'true',
      VITE_ROUTER_HISTORY: 'history',
    },
    port: 4173,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  workers: 1,
});
