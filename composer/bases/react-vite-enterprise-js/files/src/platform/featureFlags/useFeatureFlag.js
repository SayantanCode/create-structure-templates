import { useContext } from "react";
import { FeatureFlagsContext } from "@/platform/featureFlags/FeatureFlagsProvider";

// Usage: useFeatureFlag(FEATURE_FLAGS.NEW_CONTACTS_TABLE) — flag values come
// from VITE_FLAG_<KEY> env vars by default; see FeatureFlagsProvider for how
// to swap in a real flag service later.
export function useFeatureFlag(flagKey) {
  const flags = useContext(FeatureFlagsContext);
  if (flags === null) {
    throw new Error("useFeatureFlag must be used within a FeatureFlagsProvider");
  }
  return Boolean(flags[flagKey]);
}
