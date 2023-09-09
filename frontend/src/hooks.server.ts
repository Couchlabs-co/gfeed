import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import Auth0Provider from '@auth/core/providers/auth0';
import type { Provider } from '@auth/core/providers';
import type { Handle } from '@sveltejs/kit';
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

async function authorization({ event, resolve }) {
  // Protect any routes under /authenticated
  const pathName = event.url.pathname;
  const authenticatedPaths = ["/scroll", "/profile", "/settings"];
  if (authenticatedPaths.includes(pathName)) {
  const session = await event.locals.getSession();
    if (!session) {
      throw redirect(303, "/");
    }
  }

  // If the request is still here, just proceed as normally
  return resolve(event);
}

const config: SvelteKitAuthConfig = {
  providers: [
    Auth0Provider({
      id: 'auth0',
      name: 'Auth0',
      clientId: 'Nxjg0lVSumIu6prwLwuGTUpSzFbJIp3X',
      clientSecret: 'ysESMzNsZxFNb_baHwzo2eZLD8ZRW7d2Z7kRiGO0kAp3Q5SR_o0xU9IzDal_3A5v',
      issuer: 'https://readingcorner.au.auth0.com/',  // <- remember to add trailing `/` 
      wellKnown: 'https://readingcorner.au.auth0.com/.well-known/openid-configuration'
    }) as Provider
  ],
  secret: '-any-random-string-',
  debug: false,
  session: {
    maxAge: 1800 // 30 mins
  }
};

export const handle: Handle = sequence(
  SvelteKitAuth(config),
  authorization
);
// SvelteKitAuth(config) satisfies Handle;
