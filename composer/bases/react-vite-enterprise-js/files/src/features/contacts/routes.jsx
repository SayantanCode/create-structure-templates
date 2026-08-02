import { lazy } from "react";
import { ROUTES } from "@/constants/routes";
import { PERMISSIONS } from "@/constants/permissions";

const ContactsListPage = lazy(() =>
  import("@/features/contacts/pages/ContactsListPage").then((m) => ({ default: m.ContactsListPage }))
);

// Lazy-loaded, unlike features/auth/routes.jsx — this is a heavier,
// not-always-needed page (table + dialog + its own RTK slice), so
// code-splitting it out of the main bundle is worth the one extra request.
export const contactsRoutes = [
  {
    path: ROUTES.CONTACTS,
    element: <ContactsListPage />,
    layout: "dashboard",
    permission: PERMISSIONS.CONTACTS_VIEW,
    breadcrumb: "Contacts",
  },
];
