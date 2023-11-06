import type { Session as AuthSession } from '@auth/core/types';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Session {
			access_token: string;
			user: {
				id: string,
				name: string,
				email: string,
				image: string,
				emailVerified: boolean,
				login_count: number
			  },
			  expires: string,
		}
		interface Session extends AuthSession {}
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
