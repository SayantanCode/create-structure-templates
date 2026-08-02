import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { RHFInput, RHFPassword } from "@/shared/components/forms";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { login } from "@/features/auth/store/authSlice";
import { emailRules, passwordRules } from "@/features/auth/validations/authRules";
import { notify } from "@/services/notifications/notificationService";
import { ROUTES } from "@/constants/routes";

export function LoginPage() {
  const { login: doLogin, continueAsDemoUser, status } = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({ defaultValues: { email: "", password: "" } });
  const submitting = status === "loading";

  const onSubmit = async (values) => {
    const result = await doLogin(values);
    if (login.rejected.match(result)) {
      notify.error(result.payload || "Login failed.");
      return;
    }
    notify.success("Welcome back!");
    navigate(ROUTES.HOME);
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2.5} sx={{ width: "100%", maxWidth: 380 }}>
      <Typography variant="h5" fontWeight={700}>
        Log in
      </Typography>
      <RHFInput name="email" control={control} label="Email" type="email" rules={emailRules} />
      <RHFPassword name="password" control={control} label="Password" rules={passwordRules} />
      <Button type="submit" variant="contained" size="large" disabled={submitting}>
        {submitting ? "Logging in..." : "Log in"}
      </Button>
      <Typography variant="body2" color="text.secondary">
        Need an account?{" "}
        <Link component={RouterLink} to={ROUTES.REGISTER}>
          Register
        </Link>
      </Typography>
      <Typography variant="body2">
        <Link component={RouterLink} to={ROUTES.FORGOT_PASSWORD}>
          Forgot password?
        </Link>
      </Typography>
      <Divider>or</Divider>
      <Button
        variant="outlined"
        onClick={() => {
          continueAsDemoUser();
          navigate(ROUTES.HOME);
        }}
      >
        Continue as demo user
      </Button>
      <Typography variant="caption" color="text.secondary" align="center">
        This demo API has no real login endpoint — "Continue as demo user" sets a
        fake admin session locally so you can explore the protected dashboard and
        RBAC-gated actions without a backend.
      </Typography>
    </Stack>
  );
}
