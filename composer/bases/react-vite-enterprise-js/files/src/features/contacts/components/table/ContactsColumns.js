// Consumed by shared/components/table's generic DataTable — this feature
// owns its own column definitions, per this base's "the table shell is
// shared, the columns aren't" convention.
export const contactsColumns = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Phone" },
  { key: "company", label: "Company", sortable: true },
];
