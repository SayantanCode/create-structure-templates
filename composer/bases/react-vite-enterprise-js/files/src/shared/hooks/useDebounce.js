import { useEffect, useState } from "react";

// Debounces a value (not a callback) — e.g. a search input that shouldn't
// re-trigger a fetch on every keystroke: `const debounced = useDebounce(query, 300)`.
export function useDebounce(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
