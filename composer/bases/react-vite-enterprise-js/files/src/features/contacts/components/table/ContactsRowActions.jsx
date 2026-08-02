import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { EditIcon, DeleteIcon } from "@/shared/icons";
import { Can } from "@/platform/permissions";
import { PERMISSIONS } from "@/constants/permissions";

// Wrapped in <Can> so a "member" role (view-only, per constants/permissions'
// ROLE_PERMISSIONS map) simply doesn't see these buttons, instead of seeing
// them and hitting a server-side 403.
export function ContactsRowActions({ contact, onEdit, onDelete }) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }}>
      <Can permission={PERMISSIONS.CONTACTS_EDIT}>
        <IconButton size="small" onClick={() => onEdit(contact)} aria-label="Edit">
          <EditIcon fontSize="small" />
        </IconButton>
      </Can>
      <Can permission={PERMISSIONS.CONTACTS_DELETE}>
        <IconButton size="small" onClick={() => onDelete(contact)} aria-label="Delete">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Can>
    </Stack>
  );
}
