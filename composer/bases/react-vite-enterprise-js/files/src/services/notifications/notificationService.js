// Imperative notify API — `notify.success("Saved")` works from anywhere
// (a thunk, an axios interceptor, a plain function), not just components
// with access to a hook. shared/providers/NotificationsProvider registers
// itself as the handler on mount; until it does, calls are no-ops instead
// of throwing, so this is safe to call even before the provider mounts.
let handler = null;

export function registerNotificationHandler(fn) {
  handler = fn;
}

function show(message, severity) {
  handler?.({ message, severity, id: crypto.randomUUID() });
}

export const notify = {
  success: (message) => show(message, "success"),
  error: (message) => show(message, "error"),
  warning: (message) => show(message, "warning"),
  info: (message) => show(message, "info"),
};
