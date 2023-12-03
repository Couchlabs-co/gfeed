import * as Sentry from "@sentry/sveltekit";

Sentry.init({
  dsn: "https://0b36a5b45e437e89f170afc798e43f65@o129578.ingest.sentry.io/4506002558746624",

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
