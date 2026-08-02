import { useCallback, useState } from "react";

// Same API as useState, but persisted — `const [mode, setMode] =
// useLocalStorage(STORAGE_KEYS.THEME_MODE, "system")`. Reads/writes JSON so
// it can hold anything JSON-serializable, not just strings.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // localStorage unavailable (private mode, quota) — value still
          // updates in memory for this session.
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, setStoredValue];
}
