import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/features/auth/api/authApi";
import { bootstrapSession } from "@/features/auth/services/authService";
import { setTokens, clearTokens, getAccessToken } from "@/services/auth/tokenStorage";
import { ROLES } from "@/constants/roles";

// Thunks only handle the request + token persistence — no side effects
// (notify, navigate) inside them, since those belong in the component that
// dispatches (see features/auth/pages/LoginPage.jsx), not in reducer-adjacent
// code that's supposed to stay pure.
export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await authApi.login({ email, password });
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    return data.user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.register({ name, email, password });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  clearTokens();
});

// Dispatched once from app/AppProviders.jsx on mount — see
// features/auth/services/authService.js for what it actually does.
export const bootstrapAuth = createAsyncThunk("auth/bootstrap", async () => {
  return await bootstrapSession();
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    // A token already in storage means a previous session might still be
    // valid — routes/ProtectedRoute treats this as "still checking", not
    // "logged out", until bootstrapAuth resolves it one way or the other.
    initializing: Boolean(getAccessToken()),
  },
  reducers: {
    // Sets a fake admin user directly in state — no network call, no
    // token. This exists purely so the protected dashboard/RBAC-gated UI
    // is actually explorable against the demo API (which has no real
    // /auth/* routes to log in against). See features/auth/pages/LoginPage's
    // "Continue as demo user" button. Delete this reducer once you have a
    // real backend to log in against.
    loginAsDemoUser(state) {
      state.user = { id: 0, name: "Demo User", email: "demo@example.com", role: ROLES.ADMIN };
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initializing = false;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.user = null;
        state.initializing = false;
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      });
  },
});

export const { loginAsDemoUser } = authSlice.actions;
export default authSlice.reducer;
