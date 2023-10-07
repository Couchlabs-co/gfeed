import type { ServerLoadEvent } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load(event: ServerLoadEvent) {
    const session = await event.locals.getSession();

    const { VITE_API_URL } = import.meta.env;
	if(!VITE_API_URL){
		return {error: 'VITE_API_URL is not set'}
	}
	const result = await fetch(`${VITE_API_URL}/users/${session?.user?.id}/interests`);

	const res = await result.json();
    const {message, data} = res;
    if(message === 'Success'){
        return {...data, user: event.locals.user};
    }
    
    return {};
}