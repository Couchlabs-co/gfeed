import { Api } from 'sst/node/api';
/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const result = await fetch(Api.feedAPI.url);

	const data = await result.json();

	return data;
}
