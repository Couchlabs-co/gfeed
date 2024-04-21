// import type { LayoutServerLoad } from "./$types";
import { kindeAuthClient, type SessionManager } from '@kinde-oss/kinde-auth-sveltekit';
import type {RequestEvent} from '@sveltejs/kit';


export async function load({locals, request}: RequestEvent) {

  const isAuthenticated = await kindeAuthClient.isAuthenticated(
    request as unknown as SessionManager
	);

  if(isAuthenticated) {
    const token = await kindeAuthClient.getToken(request as unknown as SessionManager);
    const userProfile = await kindeAuthClient.getUser(request as unknown as SessionManager);
    locals.user = userProfile;
    locals.token = token;
  }

  return {
    isAuthenticated,
    user: locals.user,
    token: locals.token
  };

}