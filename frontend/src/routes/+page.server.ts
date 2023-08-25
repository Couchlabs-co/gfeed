// import { Api } from 'sst/node/api';
import type { PageServerLoad } from './$types.js';

export const load = (async () => {
	// const response = fetch(Api.FeedAPI.url, {
	// 	method: 'GET',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	}
	// });

	// response
	// 	.then((data) => data.json())
	// 	.then((data) => console.log(data))
	// 	.catch((error) => {
	// 		console.error('Error:', error);
	// 	});

	return { apiUrl: 'something' };
}) satisfies PageServerLoad;
