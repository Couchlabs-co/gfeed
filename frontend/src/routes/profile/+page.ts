import type { PageLoadEvent } from "./$types";

/** @type {import('./$types').PageLoad} */
export function load(evt: PageLoadEvent) {

	const { data, params } = evt;
	return {
		...data,
		interests1: {
			"likes": ['tech', 'finance'],
            "dislikes": ['politics', 'sports'],
		}
	};
}