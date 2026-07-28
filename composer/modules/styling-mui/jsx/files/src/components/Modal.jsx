import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

export function Modal({ open, onClose, children }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
