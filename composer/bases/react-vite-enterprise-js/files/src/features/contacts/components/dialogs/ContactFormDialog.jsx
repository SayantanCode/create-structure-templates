import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { RHFInput, RHFPhone } from "@/shared/components/forms";
import { contactNameRules, contactEmailRules, contactPhoneRules } from "@/features/contacts/validations/contactRules";

const emptyContact = { name: "", email: "", phone: "", company: "" };

// One dialog for both create and edit — `contact` is null for create,
// the row being edited otherwise. Business dialogs like this live inside
// their feature; only generic, business-agnostic dialogs (like the
// shared/providers ConfirmDialog) belong in shared/.
export function ContactFormDialog({ open, contact, onClose, onSubmit, submitting }) {
  const { control, handleSubmit, reset } = useForm({ defaultValues: emptyContact });

  useEffect(() => {
    if (open) reset(contact || emptyContact);
  }, [contact, reset, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{contact ? "Edit contact" : "New contact"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 0.5 }}>
            <RHFInput name="name" control={control} label="Name" rules={contactNameRules} />
            <RHFInput name="email" control={control} label="Email" type="email" rules={contactEmailRules} />
            <RHFPhone name="phone" control={control} label="Phone" rules={contactPhoneRules} />
            <RHFInput name="company" control={control} label="Company" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
