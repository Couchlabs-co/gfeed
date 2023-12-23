import { StackContext, SvelteKitSite, Config, use } from "sst/constructs";
import { SsrDomainProps } from "sst/constructs/SsrSite";
import { ApiStack } from "./ApiStack";

export function WebStack({ stack, app }: StackContext) {

  let customDomain: SsrDomainProps | undefined;
  let apiUrl: string | undefined;

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
    case "uat": {
      customDomain = {
        domainName: "uat.gfeed.app",
        hostedZone: "gfeed.app"
      }
      apiUrl = "https://uat.api.gfeed.app";
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
      const {GFeedAPI} = use(ApiStack);
      apiUrl = GFeedAPI.url;
      customDomain = undefined;
    }
  };

  const Auth0Domain = new Config.Parameter(stack, "AUTH0_DOMAIN", {
    value: process.env.AUTH0_DOMAIN ?? '',
  });

  const Auth0ClientId = new Config.Parameter(stack, "AUTH0_CLIENT_ID", {
    value: process.env.AUTH0_CLIENT_ID ?? '',
  });

  const Auth0Audience = new Config.Parameter(stack, "AUTH0_AUDIENCE", {
    value: process.env.AUTH0_AUDIENCE ?? '',
  });

  const ClientSecret = new Config.Parameter(stack, "AUTH0_CLIENT_SECRET", {
    value: process.env.AUTH0_CLIENT_SECRET ?? '',
  });

  const Site = new SvelteKitSite(stack, "site", {
    customDomain,
    runtime: "nodejs18.x",
    path: "./frontend",
    buildCommand: "pnpm run build",
    environment: {
      // Pass in the API endpoint to our app
      VITE_API_URL: apiUrl,
      VITE_AUTH0_DOMAIN: Auth0Domain.value,
      VITE_AUTH0_CLIENT_ID: Auth0ClientId.value,
      VITE_CLIENT_SECRET: ClientSecret.value,
      NODE_ENV: stack.stage
    },
    bind: [Auth0Domain, Auth0ClientId],
  });

  stack.addOutputs({
    SiteUrl: Site.url,
  });
}
