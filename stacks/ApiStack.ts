import { StackContext, use, Api, Config } from "sst/constructs";
import { DbStack } from "./DbStack";
import { SsrDomainProps } from "sst/constructs/SsrSite";

export function ApiStack({ stack, app }: StackContext) {
  let customDomain: SsrDomainProps | undefined;  

  const KindeAudience = new Config.Parameter(stack, "KINDE_AUDIENCE", {
    value: process.env.KINDE_AUDIENCE ?? '',
  });

  const KindeIssuer = new Config.Parameter(stack, "KINDE_ISSUER_URL", {
    value: process.env.KINDE_ISSUER_URL ?? '',
  });

  const UserAPIKey = new Config.Parameter(stack, "USER_API_KEY", {
    value: process.env.USER_API_KEY ?? '',
  })

  const M2M_CLIENT_ID = new Config.Parameter(stack, "M2M_CLIENT_ID", {
    value: process.env.M2M_CLIENT_ID ?? '',
  });

  const M2M_CLIENT_SECRET = new Config.Parameter(stack, "M2M_CLIENT_SECRET", {
    value: process.env.M2M_CLIENT_SECRET ?? '',
  });

  const M2M_AUDIENCE = new Config.Parameter(stack, "M2M_AUDIENCE", {
    value: process.env.M2M_AUDIENCE ?? '',
  });

  const M2M_URL = new Config.Parameter(stack, "M2M_URL", {
    value: process.env.M2M_URL ?? '',
  });

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
  
  const { PublisherTable, FeedbackTable, InterestsTable, NewSources, BigTable, UserDeleteTable } = use(DbStack);

  const GFeedAPI = new Api(stack, "GFeedAPI", {
    customDomain,
    defaults: {
      function: {
        bind: [PublisherTable, InterestsTable, NewSources, BigTable, FeedbackTable, UserDeleteTable],
        environment: {
          USER_API_KEY: UserAPIKey.value,
          KINDE_ISSUER_URL: KindeIssuer.value ?? '',
          KINDE_AUDIENCE: KindeAudience.value ?? '',
          M2M_CLIENT_ID: M2M_CLIENT_ID.value,
          M2M_CLIENT_SECRET: M2M_CLIENT_SECRET.value,
          M2M_AUDIENCE: M2M_AUDIENCE.value,
          M2M_URL: M2M_URL.value,
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
      "GET /publishers": "packages/functions/src/publishers.handler",
      "GET /interests": "packages/functions/src/interests.handler",
      "POST /search": "packages/functions/src/search.handler",
      "GET /posts/{postTitle}": "packages/functions/src/getPost.handler",
      "POST /sources": "packages/functions/src/newSource.handler",
      "POST /users/profile": "packages/functions/src/userProfile.handler",
      "POST /feedback": "packages/functions/src/feedback.handler",
      "POST /delete-account": "packages/functions/src/deleteAccount.handler",
    },
  });

  stack.addOutputs({
    ApiUrl: GFeedAPI.url,
  });

  return {
    GFeedAPI,
    // Auth0APIAudience
  }
}
