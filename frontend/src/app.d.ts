// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Session {
			token: string;
			idToken: string;
			user: {
				given_name: string;
				name: string;
				id: string;
				family_name: string;
				email: string;
				picture: string | null;
			  } & AuthSession['user'],
			  expires: string,
		};
		interface Locals {
			isAuthenticated: boolean;
			token: string;
			idToken: string;
			user: {
				picture: null | string;
				family_name: string;
				given_name: string;
				email: string;
				id: string;
			}
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
