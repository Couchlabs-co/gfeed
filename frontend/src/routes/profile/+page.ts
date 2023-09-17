/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return {
		interests: {
			"likes": ['tech', 'finance'],
            "dislikes": ['politics', 'sports'],
		}
	};
}