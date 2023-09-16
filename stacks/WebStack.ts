import { StackContext, use, SvelteKitSite, Config } from "sst/constructs";
import { ApiStack } from "./ApiStack";

export function WebStack({ stack }: StackContext) {
  const { ReadingCornerAPI } = use(ApiStack);

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
    runtime: "nodejs18.x",
    path: "./frontend",
    buildCommand: "pnpm run build",
    environment: {
      // Pass in the API endpoint to our app
      VITE_API_URL: ReadingCornerAPI.url,
      VITE_AUTH0_DOMAIN: Auth0Domain.value,
      VITE_AUTH0_CLIENT_ID: Auth0ClientId.value,
      VITE_CLIENT_SECRET: ClientSecret.value,
    },
    bind: [ReadingCornerAPI, Auth0Domain, Auth0ClientId],
  });

  stack.addOutputs({
    // ApiUrl: ReadingCornerAPI.url,
    SiteUrl: Site.url,
  });
}
