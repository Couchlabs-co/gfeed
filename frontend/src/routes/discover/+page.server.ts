import type { PageServerLoad } from "./$types";

const { VITE_API_URL } = import.meta.env;

const fetchFeed = async (token: string|undefined) => {

	if(!VITE_API_URL){
		return {error: 'VITE_API_URL is not set'}
	}
	const result = await fetch(`${VITE_API_URL}/feed`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		}
	});

	const res = await result.json();

	return res;
}

const fetchPublishers = async () => {
	if(!VITE_API_URL){
		return {error: 'VITE_API_URL is not set'}
	}
	const result = await fetch(`${VITE_API_URL}/publishers`);

	const res = await result.json();

	return res;
}

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();	
	return {session, feed: await fetchFeed(session?.access_token), publishers: await fetchPublishers()};

}
