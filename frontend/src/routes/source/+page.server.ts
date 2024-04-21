import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	try {
		const { VITE_API_URL } = import.meta.env;
		if(!VITE_API_URL){
			return {error: 'VITE_API_URL is not set'}
		}
		const result = await fetch(`${VITE_API_URL}/publishers?uniq=true`);
	
		const data = await result.json();
	
		return { data };
	} catch(err) {
		console.error(err);
		return { data: [] };
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	addSource: async ({request}) => {
		const data = await request.formData();
		const sourceName = data.get('source-name');
		const sourceUrl = data.get('source-url');

		const { VITE_API_URL } = import.meta.env;
		if(!VITE_API_URL){
			return {error: 'VITE_API_URL is not set'}
		}

		const result = await fetch(`${VITE_API_URL}/sources`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ sourceName, sourceUrl }),
		});
	
		const formResult = await result.json();

		return formResult;
	}
};