import { useEffect } from "react";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/app/store/store";
import { AppThemeProvider } from "@/shared/providers/AppThemeProvider";
import { NotificationsProvider } from "@/shared/providers/NotificationsProvider";
import { ConfirmDialogProvider } from "@/shared/providers/ConfirmDialogProvider";
import { FeatureFlagsProvider } from "@/platform/featureFlags";
import { RealtimeProvider } from "@/platform/realtime";
import { bootstrapAuth } from "@/features/auth/store/authSlice";

// Rendered inside <ReduxProvider> so it can dispatch — AppProviders itself
// can't, since useDispatch needs to be below the Provider it's paired with.
function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);
  return children;
}

// Every provider the app needs nests here, in one place — not spread
// across main.jsx and App.jsx. Order matters where providers depend on
// each other: Redux before anything reading from it; Router before
// anything reading route params.
export function AppProviders({ children }) {
  return (
    <ReduxProvider store={store}>
      <AuthBootstrap>
        <AppThemeProvider>
          <BrowserRouter>
            <FeatureFlagsProvider>
              <RealtimeProvider>
                <NotificationsProvider>
                  <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
                </NotificationsProvider>
              </RealtimeProvider>
            </FeatureFlagsProvider>
          </BrowserRouter>
        </AppThemeProvider>
      </AuthBootstrap>
    </ReduxProvider>
  );
}
