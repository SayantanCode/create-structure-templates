import { createContext, useMemo, useState } from "react";

const FeatureFlagsContext = createContext(null);

// Flag values default to off; a real deployment either bakes VITE_FLAG_*
// env vars in at build time (read here) or swaps this provider's body for
// a fetch against a real flag service (LaunchDarkly/Unleash/etc.) — the
// useFeatureFlag() call sites never need to change either way.
function readInitialFlags() {
  const flags = {};
  for (const [key, value] of Object.entries(import.meta.env)) {
    if (key.startsWith("VITE_FLAG_")) {
      const flagKey = key.slice("VITE_FLAG_".length).toLowerCase();
      flags[flagKey] = value === "true" || value === "1";
    }
  }
  return flags;
}

export function FeatureFlagsProvider({ children }) {
  const [flags] = useState(readInitialFlags);
  const value = useMemo(() => flags, [flags]);

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
}

export { FeatureFlagsContext };
