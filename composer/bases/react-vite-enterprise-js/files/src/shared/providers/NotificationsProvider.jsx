import { useCallback, useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { registerNotificationHandler } from "@/services/notifications/notificationService";

// Renders one toast at a time, queueing the rest. Registers itself as the
// handler behind services/notifications/notificationService's imperative
// notify.success()/error()/... — that's what lets code outside components
// (thunks, the axios interceptor) trigger a real toast.
export function NotificationsProvider({ children }) {
  const [queue, setQueue] = useState([]);
  // Derived straight from `queue` during render — no second state variable
  // or effect needed to "sync" the two.
  const current = queue[0] || null;

  const push = useCallback((notification) => {
    setQueue((q) => [...q, notification]);
  }, []);

  useEffect(() => {
    registerNotificationHandler(push);
    return () => registerNotificationHandler(null);
  }, [push]);

  const handleClose = (_event, reason) => {
    if (reason === "clickaway") return;
    setQueue((q) => q.slice(1));
  };

  return (
    <>
      {children}
      {current && (
        <Snackbar
          key={current.id}
          open
          autoHideDuration={4000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleClose} severity={current.severity} variant="filled" sx={{ width: "100%" }}>
            {current.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
