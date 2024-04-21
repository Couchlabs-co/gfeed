import {handleAuth} from "@kinde-oss/kinde-auth-sveltekit";
import type {RequestEvent} from "@sveltejs/kit";

export function GET(requestEvents: RequestEvent) {
	const res = handleAuth(requestEvents);
    return res;
};