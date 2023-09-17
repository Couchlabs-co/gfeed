import type { ServerLoadEvent } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load(event: ServerLoadEvent) {
    const session = await event.locals.getSession();

    return session;
}