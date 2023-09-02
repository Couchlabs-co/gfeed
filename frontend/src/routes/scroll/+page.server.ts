import { DateTime } from 'luxon';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const { VITE_API_URL } = import.meta.env;
	const result = await fetch(`${VITE_API_URL}/feed`);

	const res = await result.json();

	for (const item of res.Items) {
		item.pubDate = DateTime.fromMillis(Number(item.pubDate)).toLocaleString(DateTime.DATE_MED);
		// item.title = item.title;
	}

	return res;
}
