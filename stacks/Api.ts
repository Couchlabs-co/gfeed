import * as DB from "./Database";

export const GFeedAPI = new sst.aws.ApiGatewayV2("GFeedAPI", {
  cors: {
    allowOrigins: ["http://localhost:3000"],
    allowHeaders: ["content-type", "authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },

  // Use string format directly (JSON format for CloudWatch Logs Insights)
  accessLog: {
    retention: "1 week",
  },

  transform: {
    route: {
      handler: {
        link: [
          DB.PublisherTable,
          DB.InterestsTable,
          DB.NewSources,
          DB.BigTable,
          DB.FeedbackTable,
          DB.UserDeleteTable,
        ],
        environment: {
          USER_API_KEY: process.env.USER_API_KEY ?? "",
          KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL ?? "",
          KINDE_AUDIENCE: process.env.KINDE_AUDIENCE ?? "",
          M2M_CLIENT_ID: process.env.M2M_CLIENT_ID ?? "",
          M2M_CLIENT_SECRET: process.env.M2M_CLIENT_SECRET ?? "",
          M2M_AUDIENCE: process.env.M2M_AUDIENCE ?? "",
          M2M_URL: process.env.M2M_URL ?? "",
        },
        timeout: "30 seconds",
        memory: "1024 MB",
      },
    },
  },
});

GFeedAPI.route("POST /feed", "packages/functions/src/feed.handler");
GFeedAPI.route("POST /search", "packages/functions/src/search.handler");

GFeedAPI.route("POST /users", "packages/functions/src/createUser.handler");
GFeedAPI.route("GET /users/{userId}", "packages/functions/src/getUser.handler");
GFeedAPI.route(
  "GET /users/{userId}/interests",
  "packages/functions/src/userInterests.handler",
);
GFeedAPI.route(
  "POST /users/action",
  "packages/functions/src/userAction.handler",
);
GFeedAPI.route(
  "POST /users/profile",
  "packages/functions/src/userProfile.handler",
);
GFeedAPI.route(
  "POST /delete-account",
  "packages/functions/src/deleteAccount.handler",
);

GFeedAPI.route(
  "GET /posts/{postTitle}",
  "packages/functions/src/getPost.handler",
);
GFeedAPI.route("GET /publishers", "packages/functions/src/publishers.handler");
GFeedAPI.route("GET /interests", "packages/functions/src/interests.handler");

GFeedAPI.route("POST /sources", "packages/functions/src/newSource.handler");
GFeedAPI.route("POST /feedback", "packages/functions/src/feedback.handler");
