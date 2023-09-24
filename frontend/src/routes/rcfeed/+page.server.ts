import { DateTime } from 'luxon';
import type { PageServerLoad } from "./$types";


/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();

	const { VITE_API_URL } = import.meta.env;
	if(!VITE_API_URL){
		return {error: 'VITE_API_URL is not set'}
	}
	const result = await fetch(`${VITE_API_URL ?? 'https://r5rh81q6pe.execute-api.ap-southeast-2.amazonaws.com'}/feed`);

	const res = await result.json();

	for (const item of res.Items) {
		item.pubDate = DateTime.fromMillis(Number(item.pubDate)).toLocaleString(DateTime.DATE_MED);
	}

	return {res, session};
}
