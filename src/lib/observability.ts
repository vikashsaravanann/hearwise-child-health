type ObservabilitySeverity = "debug" | "info" | "warning" | "error";

type ObservabilityContext = Record<string, unknown>;

let context: ObservabilityContext = {};

export function setObservabilityContext(next: ObservabilityContext) {
  context = { ...context, ...next };
}

export function clearObservabilityContext() {
  context = {};
}

export function addObservabilityBreadcrumb(message: string, category?: string, data?: Record<string, unknown>) {
  // Intentionally lightweight: keeps the app working without a vendor SDK.
  // If you later add Sentry/Datadog/etc, wire breadcrumbs here.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[breadcrumb]", { message, category, data, context });
  }
}

export function captureEvent(name: string, payload?: Record<string, unknown>) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[event]", { name, payload, context });
  }
}

export function captureError(error: unknown, extra?: Record<string, unknown>, severity: ObservabilitySeverity = "error") {
  // In production, we still log to console so failures aren't silent.
  // eslint-disable-next-line no-console
  console[severity === "warning" ? "warn" : "error"]("[error]", { error, extra, context });
}
