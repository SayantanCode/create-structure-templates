import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, registerUser, logout, loginAsDemoUser } from "@/features/auth/store/authSlice";

// Feature-owned — components go through this instead of raw
// useSelector/useDispatch calls against the auth slice, so nothing outside
// features/auth needs to know the slice's exact shape.
export function useAuth() {
  const dispatch = useDispatch();
  const { user, status, error, initializing } = useSelector((state) => state.auth);

  const doLogin = useCallback((credentials) => dispatch(login(credentials)), [dispatch]);
  const doRegister = useCallback((payload) => dispatch(registerUser(payload)), [dispatch]);
  const doLogout = useCallback(() => dispatch(logout()), [dispatch]);
  const continueAsDemoUser = useCallback(() => dispatch(loginAsDemoUser()), [dispatch]);

  return {
    user,
    isAuthenticated: Boolean(user),
    status,
    error,
    initializing,
    login: doLogin,
    register: doRegister,
    logout: doLogout,
    continueAsDemoUser,
  };
}
