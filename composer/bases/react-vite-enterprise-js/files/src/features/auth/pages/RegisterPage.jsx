import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { RHFInput, RHFPassword } from "@/shared/components/forms";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { registerUser } from "@/features/auth/store/authSlice";
import { emailRules, passwordRules, nameRules } from "@/features/auth/validations/authRules";
import { notify } from "@/services/notifications/notificationService";
import { ROUTES } from "@/constants/routes";

export function RegisterPage() {
  const { register: doRegister, status } = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({ defaultValues: { name: "", email: "", password: "" } });
  const submitting = status === "loading";

  const onSubmit = async (values) => {
    const result = await doRegister(values);
    if (registerUser.rejected.match(result)) {
      notify.error(result.payload || "Registration failed.");
      return;
    }
    notify.success("Account created!");
    navigate(ROUTES.HOME);
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2.5} sx={{ width: "100%", maxWidth: 380 }}>
      <Typography variant="h5" fontWeight={700}>
        Create an account
      </Typography>
      <RHFInput name="name" control={control} label="Name" rules={nameRules} />
      <RHFInput name="email" control={control} label="Email" type="email" rules={emailRules} />
      <RHFPassword name="password" control={control} label="Password" rules={passwordRules} />
      <Button type="submit" variant="contained" size="large" disabled={submitting}>
        {submitting ? "Creating account..." : "Register"}
      </Button>
      <Typography variant="body2" color="text.secondary">
        Already have an account?{" "}
        <Link component={RouterLink} to={ROUTES.LOGIN}>
          Log in
        </Link>
      </Typography>
    </Stack>
  );
}
