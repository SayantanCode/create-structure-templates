// Cache/request identity keys — used by platform/cache's memoryCache so two
// call sites asking for "the same data" always agree on its key. One entry
// per feature list/detail query, not per component.
export const QUERY_KEYS = {
  CONTACTS_LIST: "contacts:list",
};
