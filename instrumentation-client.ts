export function onRouterTransitionStart(...args: unknown[]) {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  void import("@sentry/nextjs").then((Sentry) => {
    const capture = Sentry.captureRouterTransitionStart as ((...values: unknown[]) => void) | undefined;
    capture?.(...args);
  });
}

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  void import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.2,
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: 0.05,
      integrations: [
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: false,
        }),
      ],
    });
  });
}

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
if (posthogToken) {
  void import("posthog-js").then(({ default: posthog }) => {
    posthog.init(posthogToken, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2026-01-30",
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
    });
  });
}
