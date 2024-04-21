import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	try {
	
		const { VITE_API_URL } = import.meta.env;
		if(!VITE_API_URL){
			return {error: 'VITE_API_URL is not set'}
		}
		const result = await fetch(`${VITE_API_URL}/publishers?`);
	
		const data = await result.json();
	
		return { data };
	} catch(err) {
		console.error(err);
		return { session: {}, data: [] };
	}
}