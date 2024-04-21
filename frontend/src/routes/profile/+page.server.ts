import { kindeAuthClient, type SessionManager } from "@kinde-oss/kinde-auth-sveltekit";
import { redirect, type RequestEvent } from "@sveltejs/kit";

const GetInterests = async () => {
    const { VITE_API_URL } = import.meta.env;
	const result = await fetch(`${VITE_API_URL}/interests`);
    const res = await result.json();
    return res;
}

const GetUserData = async (token: string) => {
    const { VITE_API_URL } = import.meta.env;
	const result = await fetch(`${VITE_API_URL}/users/profile`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		}
	});

	const res = await result.json();
    const {message, data} = res;
    if(message === 'Success'){
        return data;
    }
};

/** @type {import('./$types').PageServerLoad} */
export async function load({request}: RequestEvent) {
    const { VITE_API_URL } = import.meta.env;
	if(!VITE_API_URL){
		return {error: 'VITE_API_URL is not set'}
	}

    const isAuthenticated = await kindeAuthClient.isAuthenticated(
        request as unknown as SessionManager
        );
    
    if(isAuthenticated) {
        const token = await kindeAuthClient.getToken(request as unknown as SessionManager);
        const userProfile = await kindeAuthClient.getUser(request as unknown as SessionManager);
        return {
            interests : await GetInterests(), 
            userData: await GetUserData(token),
            user: userProfile,
        };
    } else {
        redirect(301, '/login');
    }
    
}