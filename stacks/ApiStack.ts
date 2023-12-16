import { StackContext, use, Api } from "sst/constructs";
import { DbStack } from "./DbStack";
import { SsrDomainProps } from "sst/constructs/SsrSite";

export function ApiStack({ stack, app }: StackContext) {
  let customDomain: SsrDomainProps | undefined;  

  switch(stack.stage) {
    case "prod": {
      customDomain = {
        domainName: "api.gfeed.app",
        hostedZone: "gfeed.app"
      };
      break;
    }
    case "uat": {
      customDomain = {
        domainName: "uat.api.gfeed.app",
        hostedZone: "gfeed.app"
      }
      break;
    }
    case "staging": {
      customDomain = {
        domainName: "staging.api.gfeed.app",
        hostedZone: "gfeed.app"
      }
      break;
    }
    default:
      customDomain =  undefined;
  };
  
  const { PostTable, UserTable, UserActionsTable, BookmarkTable, PublisherTable, InterestsTable } = use(DbStack);

  const GFeedAPI = new Api(stack, "GFeedAPI", {
    customDomain,
    defaults: {
      function: {
        bind: [PostTable, UserTable, UserActionsTable, BookmarkTable, PublisherTable, InterestsTable],
      },
    },
    accessLog:
      "$context.identity.sourceIp,$context.requestTime,$context.httpMethod,$context.routeKey,$context.protocol,$context.status,$context.responseLength,$context.requestId",
    routes: {
      "POST /feed": "packages/functions/src/feed.handler",
      "POST /users": "packages/functions/src/createUser.handler",
      "GET /users/{userId}": "packages/functions/src/getUser.handler",
      "GET /users/{userId}/interests": "packages/functions/src/userInterests.handler",
      "POST /users/action": "packages/functions/src/userAction.handler",
      "POST /users/action/dislike": "packages/functions/src/userAction.handler",
      "GET /publishers": "packages/functions/src/publishers.handler",
      "GET /interests": "packages/functions/src/interests.handler",
      "POST /search": "packages/functions/src/search.handler",
      "GET /posts/{postTitle}": "packages/functions/src/getPost.handler",
      "POST /bookmarks": "packages/functions/src/saveBookmark.handler",
      "GET /bookmarks/{userId}": "packages/functions/src/getBookmarks.handler",
    },
  });

  stack.addOutputs({
    ApiUrl: GFeedAPI.url,
  });

  return {
    GFeedAPI,
  }
}
