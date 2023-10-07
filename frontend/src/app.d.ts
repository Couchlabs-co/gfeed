// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: string;
				name: string;
				email: string;
				image: string;
				emailVerified: boolean;
				token: string;
				login_count: number;
				createdAt: string;
			}
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
