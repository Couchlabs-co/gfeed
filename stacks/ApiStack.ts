import { StackContext, use, Api } from "sst/constructs";
import { DbStack } from "./DbStack";
import { SsrDomainProps } from "sst/constructs/SsrSite";

export function ApiStack({ stack, app }: StackContext) {
  let customDomain: SsrDomainProps | undefined;  

  switch(stack.stage) {
    case "prod": {
      customDomain = {
        domainName: "api.jasdeep.me",
        hostedZone: "jasdeep.me"
      };
      break;
    }
    case "uat": {
      customDomain = {
        domainName: "uat.api.jasdeep.me",
        hostedZone: "jasdeep.me"
      }
      break;
    }
    case "staging": {
      customDomain = {
        domainName: "staging.api.jasdeep.me",
        hostedZone: "jasdeep.me"
      }
      break;
    }
    default:
      customDomain =  {
        domainName: "dev.api.jasdeep.me",
        hostedZone: "jasdeep.me"
      };
  };
  
  const { PostTable, UserTable, UserActionsTable, BookmarkTable, PublisherTable, InterestsTable } = use(DbStack);

  const ReadingCornerAPI = new Api(stack, "ReadingCornerAPI", {
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
      "POST /users/action/bookmark": "packages/functions/src/userAction.handler",
      "POST /users/action/dislike": "packages/functions/src/userAction.handler",
      "GET /publishers": "packages/functions/src/publishers.handler",
      "GET /interests": "packages/functions/src/interests.handler",
      "POST /search": "packages/functions/src/search.handler",
    },
  });

  stack.addOutputs({
    ApiUrl: ReadingCornerAPI.url,
  });

  return {
    ReadingCornerAPI,
  }
}
