import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry if we have a valid DSN
if (SENTRY_DSN && SENTRY_DSN !== 'https://your-key@o0.ingest.sentry.io/0') {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 1.0,
    debug: false,
    replaysOnErrorSampleRate: Number(process.env.SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE) || 1.0,
    replaysSessionSampleRate: Number(process.env.SENTRY_REPLAY_SESSION_SAMPLE_RATE) || 0.1,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}