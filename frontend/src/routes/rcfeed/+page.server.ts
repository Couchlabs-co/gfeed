import { DateTime } from 'luxon';
import type { PageServerLoad } from "./$types";


/** @type {import('./$types').PageServerLoad} */

const { VITE_API_URL } = import.meta.env;
const fetchFeed = async () => {
	if(!VITE_API_URL){
		return {error: 'VITE_API_URL is not set'}
	}
	const result = await fetch(`${VITE_API_URL}/feed`);

	const res = await result.json();

	for (const item of res.Items) {
		item.pubDate = DateTime.fromMillis(Number(item.pubDate)).toLocaleString(DateTime.DATE_MED);
	}

	res.Items.sort((a: any, b:any) => {
		if (a.pubDate > b.pubDate) {
			return -1;
		}
		if (a.pubDate < b.pubDate) {
			return 1;
		}
		return 0;
	});

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

	return {session, feed: await fetchFeed(), publishers: await fetchPublishers()};
}
