// Tiny app-wide pub/sub — for cross-cutting notifications that don't belong
// to one feature's Redux slice (e.g. "a background sync just flushed",
// "the socket reconnected"). Not a replacement for Redux: state that
// components read goes in a slice; one-off signals go through here.
function createEventBus() {
  const listeners = new Map();

  function on(event, handler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(handler);
    return () => off(event, handler);
  }

  function off(event, handler) {
    listeners.get(event)?.delete(handler);
  }

  function emit(event, payload) {
    listeners.get(event)?.forEach((handler) => handler(payload));
  }

  return { on, off, emit };
}

export const eventBus = createEventBus();
