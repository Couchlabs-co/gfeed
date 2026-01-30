import * as Api from "./Api";

// Define secrets
const UserApiKey = new sst.Secret("UserApiKey");
const KindeClientId = new sst.Secret("KindeClientId");
const KindeClientSecret = new sst.Secret("KindeClientSecret");
const KindeIssuerUrl = new sst.Secret("KindeIssuerUrl");
const KindeRedirectUrl = new sst.Secret("KindeRedirectUrl");
const KindePostLogoutRedirectUrl = new sst.Secret("KindePostLogoutRedirectUrl");
const KindePostLoginRedirectUrl = new sst.Secret("KindePostLoginRedirectUrl");
const KindeAudience = new sst.Secret("KindeAudience");
const SentryDsn = new sst.Secret("SentryDsn");
const SentryAuthToken = new sst.Secret("SentryAuthToken");

export const Site = new sst.aws.SvelteKit("gfeedweb", {
  path: "./frontend",
  buildCommand: "bun run build",

  link: [
    UserApiKey,
    KindeClientId,
    KindeClientSecret,
    KindeIssuerUrl,
    KindeRedirectUrl,
    KindePostLogoutRedirectUrl,
    KindePostLoginRedirectUrl,
    KindeAudience,
    SentryDsn,
    SentryAuthToken,
  ],

  environment: {
    VITE_API_URL: Api.GFeedAPI.url,
    VITE_NODE_ENV: $app.stage,
    // Use secret value with fallback to process.env
    VITE_SENTRY_DSN: SentryDsn.value || process.env.SENTRY_DSN || "",
    VITE_SENTRY_AUTH_TOKEN:
      SentryAuthToken.value || process.env.SENTRY_AUTH_TOKEN || "",
    VITE_WEB_API_KEY: UserApiKey.value || process.env.USER_API_KEY || "",
    KINDE_CLIENT_ID: KindeClientId.value || process.env.KINDE_CLIENT_ID || "",
    KINDE_CLIENT_SECRET:
      KindeClientSecret.value || process.env.KINDE_CLIENT_SECRET || "",
    KINDE_ISSUER_URL:
      KindeIssuerUrl.value || process.env.KINDE_ISSUER_URL || "",
    KINDE_REDIRECT_URL:
      KindeRedirectUrl.value || process.env.KINDE_REDIRECT_URL || "",
    KINDE_POST_LOGOUT_REDIRECT_URL:
      KindePostLogoutRedirectUrl.value ||
      process.env.KINDE_POST_LOGOUT_REDIRECT_URL ||
      "",
    KINDE_POST_LOGIN_REDIRECT_URL:
      KindePostLoginRedirectUrl.value ||
      process.env.KINDE_POST_LOGIN_REDIRECT_URL ||
      "",
    KINDE_AUDIENCE: KindeAudience.value || process.env.KINDE_AUDIENCE || "",
  },

  server: {
    timeout: "30 seconds",
    memory: "1024 MB",
  },
});
