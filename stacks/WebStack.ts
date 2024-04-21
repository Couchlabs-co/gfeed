import { StackContext, SvelteKitSite, Config, use, Api } from "sst/constructs";
import { SsrDomainProps } from "sst/constructs/SsrSite";
import { ApiStack } from "./ApiStack";

export function WebStack({ stack, app }: StackContext) {

  let customDomain: SsrDomainProps | undefined;
  let apiUrl: string | undefined;
  const {GFeedAPI} = use(ApiStack);

  switch(stack.stage) {
    case "production": {
      customDomain = {
        domainName: "gfeed.app",
        domainAlias: "www.gfeed.app",
        hostedZone: "gfeed.app"
      };
      apiUrl = "https://api.gfeed.app";
      break;
    }
    case "staging": {
      customDomain = {
        domainName: "staging.gfeed.app",
        hostedZone: "gfeed.app"
      }
      apiUrl = "https://staging.api.gfeed.app";
      break;
    }
    default: {
      apiUrl = GFeedAPI.url;
      customDomain = undefined;
    }
  };

  const SentryDSN = new Config.Parameter(stack, "SENTRY_DSN", {
    value: process.env.SENTRY_DSN ?? '',
  });

  const WebAPIKey = new Config.Parameter(stack, "WEB_API_KEY", {
    value: process.env.USER_API_KEY ?? '',
  });

  const Site = new SvelteKitSite(stack, "site", {
    customDomain,
    runtime: "nodejs18.x",
    path: "./frontend",
    buildCommand: "pnpm run build",
    environment: {
      // Pass in the API endpoint to our app
      VITE_API_URL: apiUrl,
      VITE_SENTRY_DSN: SentryDSN.value,
      VITE_NODE_ENV: stack.stage,
      VITE_WEB_API_KEY: WebAPIKey.value,
      KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID ?? '',
      KINDE_CLIENT_SECRET: process.env.KINDE_CLIENT_SECRET ?? '',
      KINDE_ISSUER: process.env.KINDE_ISSUER ?? '',
      KINDE_REDIRECT_URL: process.env.KINDE_REDIRECT_URL ?? '',
      KINDE_POST_LOGOUT_REDIRECT_URL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL ?? '',
      KINDE_POST_LOGIN_REDIRECT_URL: process.env.KINDE_POST_LOGIN_REDIRECT_URL ?? '',
      KINDE_AUDIENCE: process.env.KINDE_AUDIENCE ?? '',
    },
    bind: [],
  });

  stack.addOutputs({
    SiteUrl: Site.url,
  });
}
