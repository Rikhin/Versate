// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,
  
  // Capture request bodies for API routes
  sendDefaultPii: true,
  
  // Filter out health check endpoints
  denyUrls: [
    /^https?:\/\/localhost(:\d+)?\/healthz/,
    /^https?:\/\/127\.0\.0\.1(:\d+)?\/healthz/,
  ],
  
  // Disable in development or if no DSN is set
  enabled: process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Add server-specific integrations
  integrations: [
    // Enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // Enable Postgres tracing if you're using it
    // new Sentry.Integrations.Postgres(),
  ],
});
