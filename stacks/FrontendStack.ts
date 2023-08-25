import { StackContext, use, Api, SvelteKitSite } from "sst/constructs";
import { ReadingFunctionsStack } from "./ReadingStack";

export function FrontendStack({ stack }: StackContext) {
  const { ItemsTable } = use(ReadingFunctionsStack);
  const FeedAPI = new Api(stack, "feedAPI", {
    defaults: {
      function: {
        bind: [ItemsTable],
      },
    },
    accessLog:
      "$context.identity.sourceIp,$context.requestTime,$context.httpMethod,$context.routeKey,$context.protocol,$context.status,$context.responseLength,$context.requestId",
    routes: {
      "GET /": "packages/functions/src/feed.handler",
    },
  });

  const Site = new SvelteKitSite(stack, "site", {
    runtime: "nodejs18.x",
    path: "./frontend",
    buildCommand: "yarn run build",
    environment: {
      // Pass in the API endpoint to our app
      PUBLIC_API_URL: FeedAPI.url,
    },
    bind: [FeedAPI],
  });

  stack.addOutputs({
    ApiUrl: FeedAPI.url,
    SiteUrl: Site.url,
  });
}
