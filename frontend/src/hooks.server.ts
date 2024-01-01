import { SvelteKitAuth } from '@auth/sveltekit';
import type { Provider } from '@auth/core/providers';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import type { Session } from '@auth/core/types';

const { VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_CLIENT_SECRET, VITE_API_URL, VITE_AUTH0_API_AUDIENCE, VITE_DOMAIN_NAME } = import.meta.env;


async function authorization({ event, resolve }): Promise<any> {
  // Protect any routes under /authenticated
  const pathName = event.url.pathname;
  const authenticatedPaths = ["/profile"];
  if (authenticatedPaths.includes(pathName)) {
    const session: Session | null = await event.locals.getSession();
    if (!session) {
      throw redirect(302, `/login?returnTo=${pathName}`);
    }
  }

  // If the request is still here, just proceed as normally
  return await resolve(event);
}

const handleAuth = (async (...args) => {
  // const { event } = args[0];

	return SvelteKitAuth({
    trustHost: true,
    providers: [
      {
        id: 'auth0',
        name: 'Auth0',
        type: 'oidc',
        clientId: VITE_AUTH0_CLIENT_ID,
        clientSecret: VITE_CLIENT_SECRET,
        issuer: `https://${VITE_AUTH0_DOMAIN}/`,  // <- remember to add trailing `/` 
        wellKnown: `https://${VITE_AUTH0_DOMAIN}/.well-known/openid-configuration`,
        token: `https://${VITE_AUTH0_DOMAIN}/oauth/token`,
        userinfo: `https://${VITE_AUTH0_DOMAIN}/userinfo`,
        authorization: {
          params: {
            scope: "openid profile email offline_access",
            audience: `${VITE_AUTH0_API_AUDIENCE}`
          },
        },
        profile(profile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            emailVerified: profile.email_verified,
            login_count: profile[`${VITE_DOMAIN_NAME}/count`],
          };
        }
      } as Provider,
    ],
    secret: '-any-random-string-',
    debug: false,
    session: {
      maxAge: 1800,// 30 mins 
      updateAge: 1800,// 30 mins
    },
    callbacks: {
      async jwt({token, account, profile, user}) {
        if (account?.access_token) {
          token.access_token = account.access_token;
          token.refreshToken = account.refresh_token;
          token.idToken = account.id_token;
        }
        if(profile){
          token.user = profile;
        }
        if(user && token.user){
          token.user.login_count = user.login_count;
        }
        return token;
      },
      async session({ session, token }) {
        if(!token){
          return session;
        }
        session.user = {
          ...session.user,
          name: token.name,
          email: token.email,
          image: token.picture,
          sub: token.sub,
          id: token.sub?.split('|')[1],
          login_count: token.user?.login_count ?? 0,
        };
        session.access_token = token.access_token;
        
        // Send properties to the client, like an access_token from a provider.
        return session;
      }
    }
  })(...args);
}) satisfies Handle;

export const handleError: HandleServerError = async ({ error, event }) => {
  const errorId = crypto.randomUUID();
  // example integration with https://sentry.io/
  console.log('error', error);

  return {
      message: 'Whoops!',
      errorId,
  };
};

async function FetchUser(userId: string) {
  
  const result = await fetch(`${VITE_API_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const user = await result.json();
  return user;
}

async function CreateUser({user}: Session) {
  const result = await fetch(`${VITE_API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({user}),
  });

  const newUser = await result.json();
  return newUser;
}

/// type: import('@sveltejs/kit').Handle
const handleUser = (async ({event, resolve}) => {
  try{
    const session = await event.locals.getSession();
    if (session && session.user.login_count === 1) {
      const user = await CreateUser(session);
      session.user = Object.assign({}, session.user, {createdAt: user.user.Attributes.createdAt.S});
      event.locals.user = {...session.user };
    } else if(session) {
      event.locals.user = {...session.user };
      const user = await FetchUser(session.user.id);
      session.user = Object.assign({}, session.user, {createdAt: user.user.Attributes.createdAt.S});
      event.locals.user = {...session.user };
    }
  } catch (err) {
    console.log('err----------- ', err);
  }
  return resolve(event);
});

export const handle: Handle = sequence(
  handleAuth,
  handleUser,
  authorization,
);
