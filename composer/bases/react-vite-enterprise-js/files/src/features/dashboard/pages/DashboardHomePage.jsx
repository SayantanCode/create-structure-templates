import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { PageContainer, PageHeader, SectionCard, StatCard } from "@/shared/ui";
import { Can } from "@/platform/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchContacts } from "@/features/contacts/store/contactsSlice";
import { selectContacts } from "@/features/contacts/selectors/contactsSelectors";
import { ContactsIcon, DashboardIcon } from "@/shared/icons";

// Not tied to one business feature, so it lives in its own small
// "dashboard" feature rather than inside contacts/auth — the landing page
// after login, not something contacts/auth themselves own.
export function DashboardHomePage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const contacts = useSelector(selectContacts);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  return (
    <PageContainer>
      <PageHeader title={`Welcome${user ? `, ${user.name}` : ""}`} />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Contacts" value={contacts.length} icon={<ContactsIcon />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Your role" value={user?.role || "guest"} icon={<DashboardIcon />} color="secondary.main" />
        </Grid>
      </Grid>
      <SectionCard title="Getting started">
        <Typography color="text.secondary">
          This is <code>features/dashboard/pages/DashboardHomePage.jsx</code> — replace it with your own app's
          real landing page. The Contacts card above pulls from{" "}
          <code>features/contacts</code>, a full reference feature (table, dialog, RTK slice, permissions) worth
          reading before you build your first real one.
        </Typography>
        <Can
          permission={PERMISSIONS.CONTACTS_DELETE}
          fallback={
            <Typography sx={{ mt: 2 }} color="text.secondary">
              Your current role can't delete contacts — this line is wrapped in{" "}
              <code>{"<Can permission={PERMISSIONS.CONTACTS_DELETE}>"}</code> and only members with that
              permission see the version above it.
            </Typography>
          }
        >
          <Typography sx={{ mt: 2 }} color="success.main">
            Your role can delete contacts — try it from the Contacts page.
          </Typography>
        </Can>
      </SectionCard>
    </PageContainer>
  );
}
