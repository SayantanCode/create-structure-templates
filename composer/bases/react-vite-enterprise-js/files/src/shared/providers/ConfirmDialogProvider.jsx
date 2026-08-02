import { createContext, useCallback, useContext, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const ConfirmDialogContext = createContext(null);

// Imperative confirm() instead of every delete button owning its own
// "are you sure" dialog + open-state: `const confirm = useConfirm(); if
// (await confirm({ title: "Delete contact?", destructive: true })) { ... }`.
export function ConfirmDialogProvider({ children }) {
  const [options, setOptions] = useState(null);
  const resolveRef = useRef(null);

  const confirm = useCallback((opts) => {
    setOptions(opts);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleClose = (result) => {
    setOptions(null);
    resolveRef.current?.(result);
    resolveRef.current = null;
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      <Dialog open={Boolean(options)} onClose={() => handleClose(false)}>
        <DialogTitle>{options?.title || "Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{options?.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>{options?.cancelLabel || "Cancel"}</Button>
          <Button
            onClick={() => handleClose(true)}
            color={options?.destructive ? "error" : "primary"}
            variant="contained"
            autoFocus
          >
            {options?.confirmLabel || "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmDialogContext);
  if (!ctx) throw new Error("useConfirm must be used within a ConfirmDialogProvider");
  return ctx;
}
