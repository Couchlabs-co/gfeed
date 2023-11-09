import type { ServerLoadEvent } from "@sveltejs/kit";

const GetInterests = async () => {
    const { VITE_API_URL } = import.meta.env;
	if(!VITE_API_URL){
		return {error: 'VITE_API_URL is not set'}
	}
	const result = await fetch(`${VITE_API_URL}/interests`);
    const res = await result.json();
    return res;
}

const GetUserInterests = async (userId: string) => {
    const { VITE_API_URL } = import.meta.env;
	if(!VITE_API_URL){
		return {error: 'VITE_API_URL is not set'}
	}

	const result = await fetch(`${VITE_API_URL}/users/${userId}/interests`);

	const res = await result.json();
    const {message, data} = res;
    if(message === 'Success'){
        return data;
    }
};
export async function load(event: ServerLoadEvent) {
    const session = await event.locals.getSession();
    const userId = session && session?.user?.id.indexOf('|') > 0 ? 
        session?.user?.id.split('|')[1] : session?.user?.id;

    if(session?.user){
        return {
            interests : await GetInterests(), 
            userInterests: await GetUserInterests(userId as string),
            user: event.locals.user
        };
    }
    
    return {};
}