import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  	forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  	retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  	workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  	reporter: "html",
	webServer: {
		command: 'bun run build && bun run preview',
		port: 4173
	},
	projects: [
		{
			name: 'Chromium',
			use: { browserName: 'chromium' },
		},
	],
	testDir: 'playwrite-tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
