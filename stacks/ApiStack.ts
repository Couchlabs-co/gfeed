import { StackContext, use, Api, Config } from "sst/constructs";
import { DbStack } from "./DbStack";
import { SsrDomainProps } from "sst/constructs/SsrSite";

export function ApiStack({ stack, app }: StackContext) {
  let customDomain: SsrDomainProps | undefined;  

  const Auth0APIAudience = new Config.Parameter(stack, "AUTH0_API_AUDIENCE", {
    value: process.env.AUTH0_API_AUDIENCE ?? '',
  });

  const Auth0Issuer = new Config.Parameter(stack, "AUTH0_ISSUER", {
    value: process.env.AUTH0_ISSUER ?? '',
  });

  const UserAPIKey = new Config.Parameter(stack, "USER_API_KEY", {
    value: process.env.USER_API_KEY ?? '',
  })

  switch(stack.stage) {
    case "production": {
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
  
  const { PublisherTable, InterestsTable, NewSources, BigTable } = use(DbStack);

  const GFeedAPI = new Api(stack, "GFeedAPI", {
    customDomain,
    defaults: {
      function: {
        bind: [PublisherTable, InterestsTable, NewSources, BigTable],
        environment: {
          AUTH0_API_AUDIENCE: Auth0APIAudience.value,
          AUTH0_ISSUER: Auth0Issuer.value,
          USER_API_KEY: UserAPIKey.value
        }
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
      "GET /bookmarks/{userId}": "packages/functions/src/getBookmarks.handler",
      "POST /sources": "packages/functions/src/newSource.handler",
      "GET /users/{userId}/profile": "packages/functions/src/userProfile.handler",
    },
  });

  stack.addOutputs({
    ApiUrl: GFeedAPI.url,
  });

  return {
    GFeedAPI,
    Auth0APIAudience
  }
}
