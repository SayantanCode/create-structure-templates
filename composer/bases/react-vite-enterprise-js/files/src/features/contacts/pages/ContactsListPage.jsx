import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { PageContainer, PageHeader, SectionCard } from "@/shared/ui";
import { DataTable, TablePaginationBar, useTableState, sortAndPaginate } from "@/shared/components/table";
import { useDisclosure } from "@/shared/hooks";
import { useConfirm } from "@/shared/providers";
import { notify } from "@/services/notifications/notificationService";
import { getBreadcrumbs } from "@/routes/breadcrumbs";
import {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
} from "@/features/contacts/store/contactsSlice";
import { selectContacts, selectContactsStatus } from "@/features/contacts/selectors/contactsSelectors";
import { contactsColumns } from "@/features/contacts/components/table/ContactsColumns";
import { ContactsToolbar } from "@/features/contacts/components/table/ContactsToolbar";
import { ContactsFilters } from "@/features/contacts/components/table/ContactsFilters";
import { ContactsRowActions } from "@/features/contacts/components/table/ContactsRowActions";
import { ContactFormDialog } from "@/features/contacts/components/dialogs/ContactFormDialog";

export function ContactsListPage() {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const status = useSelector(selectContactsStatus);
  const tableState = useTableState();
  const dialog = useDisclosure();
  const confirm = useConfirm();
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const companies = useMemo(
    () => Array.from(new Set(contacts.map((c) => c.company).filter(Boolean))).sort(),
    [contacts]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return contacts.filter((c) => {
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      const matchesCompany = !company || c.company === company;
      return matchesQuery && matchesCompany;
    });
  }, [contacts, query, company]);

  const pageRows = sortAndPaginate(filtered, tableState);

  function handleCreate() {
    setEditingContact(null);
    dialog.open();
  }

  function handleEdit(contact) {
    setEditingContact(contact);
    dialog.open();
  }

  async function handleDelete(contact) {
    const confirmed = await confirm({
      title: "Delete contact?",
      message: `This will remove ${contact.name} from the list.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!confirmed) return;

    const result = await dispatch(deleteContact(contact.id));
    if (deleteContact.rejected.match(result)) {
      notify.error(result.payload || "Couldn't delete this contact.");
      return;
    }
    notify.success("Contact deleted.");
  }

  async function handleFormSubmit(values) {
    setSubmitting(true);
    try {
      const action = editingContact ? updateContact({ id: editingContact.id, ...values }) : createContact(values);
      const result = await dispatch(action);
      if (result.meta.requestStatus === "rejected") {
        notify.error(result.payload || "Couldn't save this contact.");
        return;
      }
      notify.success(editingContact ? "Contact updated." : "Contact created.");
      dialog.close();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer>
      <PageHeader title="Contacts" breadcrumbs={getBreadcrumbs(location.pathname)} />
      <SectionCard>
        <ContactsToolbar query={query} onQueryChange={setQuery} onCreate={handleCreate} />
        <ContactsFilters companies={companies} company={company} onCompanyChange={setCompany} />
        <DataTable
          columns={contactsColumns}
          rows={pageRows}
          getRowId={(row) => row.id}
          loading={status === "loading"}
          emptyMessage="No contacts match your search."
          orderBy={tableState.orderBy}
          order={tableState.order}
          onSort={tableState.toggleSort}
          renderRowActions={(row) => <ContactsRowActions contact={row} onEdit={handleEdit} onDelete={handleDelete} />}
        />
        <TablePaginationBar
          count={filtered.length}
          page={tableState.page}
          rowsPerPage={tableState.rowsPerPage}
          onPageChange={tableState.handleChangePage}
          onRowsPerPageChange={tableState.handleChangeRowsPerPage}
        />
      </SectionCard>
      <ContactFormDialog
        open={dialog.isOpen}
        contact={editingContact}
        onClose={dialog.close}
        onSubmit={handleFormSubmit}
        submitting={submitting}
      />
    </PageContainer>
  );
}
