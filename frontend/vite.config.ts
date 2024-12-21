import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from "@sentry/sveltekit";
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';
import TurboConsole from 'unplugin-turbo-console/vite';

const plugins = [TurboConsole(), sveltekit(), svelteTesting()];

// Only add Sentry in production or when auth token is available
if (process.env.NODE_ENV === 'production' || process.env.SENTRY_AUTH_TOKEN) {
    plugins.unshift(sentrySvelteKit({
        autoInstrument: {
            load: true,
            serverLoad: false,
        },
        sourceMapsUploadOptions: {
            org: "couchlabs",
            project: "gfeed",
            authToken: process.env.SENTRY_AUTH_TOKEN,
        },
    }));
}

export default defineConfig({
	plugins,
	test: {
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['./vite-setup.ts'],
	}
});