// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a page is visited.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 0.1,
  
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Capture request bodies for API routes
  sendDefaultPii: true,
  
  // Filter out health check endpoints
  denyUrls: [
    /^https?:\/\/localhost(:\d+)?\/healthz/,
    /^https?:\/\/127\.0\.0\.1(:\d+)?\/healthz/,
  ],
  
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [
        /^https?:\/\/api\.yourdomain\.com\//,
        /^https?:\/\/yourdomain\.com\//,
      ],
    }),
    new Sentry.Replay(),
  ],
  
  // Disable in development or if no DSN is set
  enabled: process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});
