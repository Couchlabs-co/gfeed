import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from "@sentry/sveltekit";
import {svelteTesting} from '@testing-library/svelte/vite'
import { defineConfig } from 'vitest/config';
import TurboConsole from 'unplugin-turbo-console/vite';

export default defineConfig({
	plugins: [
		TurboConsole(),
		sentrySvelteKit({
			autoInstrument: {
				load: true,
				serverLoad: false,
			},
			sourceMapsUploadOptions: {
				org: "couchlabs",
				project: "gfeed",
				authToken: process.env.SENTRY_AUTH_TOKEN,
      		},
    	}), sveltekit(), svelteTesting()],
	test: {
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['./vite-setup.ts'],
	}
});
