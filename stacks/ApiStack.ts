import { StackContext, use, Api } from "sst/constructs";
import { DbStack } from "./DbStack";

export function ApiStack({ stack }: StackContext) {
  const { ArticleTable, UserTable, UsersInterestTable, BookmarkTable } = use(DbStack);

  const ReadingCornerAPI = new Api(stack, "ReadingCornerAPI", {
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
      "POST /user/action": "packages/functions/src/user.handler",
      "POST /user/action/bookmark": "packages/functions/src/user.handler",
      "POST /user/action/dislike": "packages/functions/src/user.handler",
    },
  });

  stack.addOutputs({
    ApiUrl: ReadingCornerAPI.url,
  });

  return {
    ReadingCornerAPI,
  }
}
