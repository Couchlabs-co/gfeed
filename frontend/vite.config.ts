import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from "@sentry/sveltekit";
import { defineConfig } from 'vitest/config';

console.log(process.env.SENTRY_AUTH_TOKEN);
export default defineConfig({
	plugins: [
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
    	}), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
