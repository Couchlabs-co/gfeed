import { StackContext, use, Api } from "sst/constructs";
import { DbStack } from "./DbStack";

export function ApiStack({ stack, app }: StackContext) {
  const { ArticleTable, UserTable, UsersInterestTable, BookmarkTable } = use(DbStack);

  const ReadingCornerAPI = new Api(stack, "ReadingCornerAPI", {
    // customDomain: app.stage === "prod" ? "api.jasdeep.me" : `api-${app.stage}.jasdeep.me`,
    defaults: {
      function: {
        bind: [ArticleTable, UserTable, UsersInterestTable, BookmarkTable],
      },
    },
    accessLog:
      "$context.identity.sourceIp,$context.requestTime,$context.httpMethod,$context.routeKey,$context.protocol,$context.status,$context.responseLength,$context.requestId",
    routes: {
      "GET /feed": "packages/functions/src/feed.handler",
      "POST /users": "packages/functions/src/users.handler",
      "GET /users/{userId}/interests": "packages/functions/src/userInterests.handler",
      "POST /user/action": "packages/functions/src/user.handler",
      "POST /user/action/bookmark": "packages/functions/src/user.handler",
      "POST /user/action/dislike": "packages/functions/src/user.handler",
      "GET /publishers": "packages/functions/src/publishers.handler",
    },
  });

  stack.addOutputs({
    ApiUrl: ReadingCornerAPI.url,
  });

  return {
    ReadingCornerAPI,
  }
}
