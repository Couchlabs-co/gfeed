import * as Sentry from "@sentry/sveltekit";

const { VITE_SENTRY_DSN, VITE_NODE_ENV } = import.meta.env;

Sentry.init({
  dsn: VITE_SENTRY_DSN,
  environment: VITE_NODE_ENV,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // Optional: Initialize Session Replay:
  integrations: [new Sentry.Replay()],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const myErrorHandler = ({ error, event }) => { 
  const errorId = crypto.randomUUID(); 
  console.error("An error occurred on the client side:", error, event);
  Sentry.captureException(error, { extra: { event, errorId } });
  return {
    message: "Whoops!",
    errorId,
  };
};

export const handleError = Sentry.handleErrorWithSentry(myErrorHandler);
