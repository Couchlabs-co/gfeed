import { Api } from 'sst/node/api';
import { DateTime } from 'luxon';
/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const result = await fetch(Api.feedAPI.url);

	const res = await result.json();

	function htmlDecode(input: string): string {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = input;
        return textArea.value;
    }

	for (const item of res.Items) {
		item.pubDate = DateTime.fromMillis(Number(item.pubDate)).toLocaleString(DateTime.DATE_MED);
		item.title = htmlDecode(item.title);
	}

	return res;
}
