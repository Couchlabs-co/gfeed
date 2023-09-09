import { StackContext, use, Api, SvelteKitSite, Config } from "sst/constructs";
import { ReadingFunctionsStack } from "./ReadingStack";

export function FrontendStack({ stack }: StackContext) {
  const { ItemsTable, UserTable, UsersInterestTables, BookmarkTable } = use(ReadingFunctionsStack);

  const Auth0Domain = new Config.Parameter(stack, "AUTH0_DOMAIN", {
    value: process.env.AUTH0_DOMAIN ?? '',
  });

  const Auth0ClientId = new Config.Parameter(stack, "AUTH0_CLIENT_ID", {
    value: process.env.AUTH0_CLIENT_ID ?? '',
  });

  const Auth0Audience = new Config.Parameter(stack, "AUTH0_AUDIENCE", {
    value: process.env.AUTH0_AUDIENCE ?? '',
  });

  const FeedAPI = new Api(stack, "feedAPI", {
    defaults: {
      function: {
        bind: [ItemsTable, UserTable, UsersInterestTables, BookmarkTable],
      },
    },
    accessLog:
      "$context.identity.sourceIp,$context.requestTime,$context.httpMethod,$context.routeKey,$context.protocol,$context.status,$context.responseLength,$context.requestId",
    routes: {
      "GET /feed": "packages/functions/src/feed.handler",
      "POST /user/action": "packages/functions/src/user.handler",
      "POST /user/action/bookmark": "packages/functions/src/user.handler",
      "POST /user/action/dislike": "packages/functions/src/user.handler",
    },
  });

  const Site = new SvelteKitSite(stack, "site", {
    runtime: "nodejs18.x",
    path: "./frontend",
    buildCommand: "pnpm run build",
    environment: {
      // Pass in the API endpoint to our app
      VITE_API_URL: FeedAPI.url,
      VITE_AUTH0_DOMAIN: Auth0Domain.value,
      VITE_AUTH0_CLIENT_ID: Auth0ClientId.value,
    },
    bind: [FeedAPI, Auth0Domain, Auth0ClientId],
  });

  stack.addOutputs({
    ApiUrl: FeedAPI.url,
    SiteUrl: Site.url,
  });
}
