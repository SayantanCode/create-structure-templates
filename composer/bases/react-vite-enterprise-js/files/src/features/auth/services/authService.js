import { apiClient } from "@/services/api/client";
import { clearTokens, getAccessToken } from "@/services/auth/tokenStorage";

// Runs once when the app boots: if a token is already in storage from a
// previous session, verify it's still valid and fetch the current user
// before anything that depends on auth state renders. Distinct from
// features/auth/api/authApi.js's login/register — this is a startup
// orchestration flow (api call + token cleanup on failure), not a form
// submission, which is exactly what this feature's services/ folder is for.
export async function bootstrapSession() {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const { data } = await apiClient.get("/auth/me");
    return data;
  } catch {
    clearTokens();
    return null;
  }
}
