import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';

let posthogReady = false;
// IMPORTANT: Sentry DSN is sourced exclusively from the VITE_SENTRY_DSN environment variable.
// Never hardcode a DSN here — it would be bundled into the public JS and expose your project.
const REDACTED = '[REDACTED]';

type Primitive = string | number | boolean | null | undefined;
type TelemetryData = Record<string, Primitive>;

interface ObservabilityContext {
  sessionLocalId?: string;
  studentLocalId?: string;
  schoolLocalId?: string;
  teacherLocalId?: string;
  classGrade?: string;
  district?: string;
}

let currentContext: ObservabilityContext = {};

function sanitizeTelemetry(data?: object): TelemetryData {
  if (!data) return {};

  const out: TelemetryData = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (value === null || value === undefined) {
      out[key] = value as Primitive;
      continue;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      const lowerKey = key.toLowerCase();
      // Basic PII guard for user-entered names.
      if (lowerKey.includes('name') && !lowerKey.includes('event')) {
        out[key] = REDACTED;
      } else {
        out[key] = value;
      }
      continue;
    }

    out[key] = String(value);
  }

  return out;
}

export function initObservability() {
  const env = import.meta.env as Record<string, string | undefined>;
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      tracesSampleRate: 0.2,
      environment: import.meta.env.MODE,
      sendDefaultPii: false,
    });
    Sentry.setTag('app', 'hearwise-child-health');
  }

  const posthogKey = env.VITE_POSTHOG_KEY || env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const posthogHost = env.VITE_POSTHOG_HOST || env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      defaults: '2026-01-30',
      capture_pageview: true,
      capture_pageleave: true,
    });
    posthogReady = true;
  }
}

export function captureEvent(eventName: string, properties?: Record<string, unknown>) {
  if (!posthogReady) return;
  posthog.capture(eventName, {
    ...sanitizeTelemetry(currentContext),
    ...sanitizeTelemetry(properties),
    captured_at: new Date().toISOString(),
  });
}

export function captureError(
  error: unknown,
  context?: Record<string, unknown>,
  level: Sentry.SeverityLevel = 'error'
) {
  const safeContext = sanitizeTelemetry(context);
  const safeSession = sanitizeTelemetry(currentContext);
  Sentry.addBreadcrumb({
    category: 'app.error',
    level,
    message: 'Captured application error',
    data: {
      ...safeSession,
      ...safeContext,
    },
  });

  Sentry.captureException(error, {
    level,
    extra: {
      ...safeSession,
      ...safeContext,
    },
  });
}

export function setObservabilityContext(context: ObservabilityContext) {
  currentContext = {
    ...currentContext,
    ...context,
  };

  const safeContext = sanitizeTelemetry(currentContext);
  Object.entries(safeContext).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      Sentry.setTag(key, String(value));
    }
  });

  if (posthogReady) {
    const distinctId = currentContext.teacherLocalId || currentContext.sessionLocalId;
    if (distinctId) {
      posthog.identify(distinctId, safeContext);
    }
  }
}

export function clearObservabilityContext() {
  currentContext = {};
  if (posthogReady) posthog.reset();
}

export function addObservabilityBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>,
  level: Sentry.SeverityLevel = 'info'
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data: sanitizeTelemetry({
      ...currentContext,
      ...data,
    }),
  });
}
