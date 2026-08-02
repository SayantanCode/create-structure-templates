// Every feature-flag key the app checks. Values live wherever
// platform/featureFlags's provider reads them from (env/localStorage by
// default) — this file is only the list of valid keys, not their values.
export const FEATURE_FLAGS = {
  REALTIME_PRESENCE: "realtime_presence",
  NEW_CONTACTS_TABLE: "new_contacts_table",
};
