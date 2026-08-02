import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { RHFInput } from "@/shared/components/forms";
import { authApi } from "@/features/auth/api/authApi";
import { emailRules } from "@/features/auth/validations/authRules";
import { notify } from "@/services/notifications/notificationService";
import { ROUTES } from "@/constants/routes";

// A one-off action doesn't need a Redux slice — this calls authApi
// directly from local component state, unlike login/register (which need
// their result to live in global state for the rest of the app to read).
export function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit } = useForm({ defaultValues: { email: "" } });

  const onSubmit = async ({ email }) => {
    setSubmitting(true);
    try {
      await authApi.forgotPassword({ email });
      notify.success("If that email exists, a reset link is on its way.");
    } catch (error) {
      notify.error(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2.5} sx={{ width: "100%", maxWidth: 380 }}>
      <Typography variant="h5" fontWeight={700}>
        Reset your password
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Enter your email and we'll send you a reset link.
      </Typography>
      <RHFInput name="email" control={control} label="Email" type="email" rules={emailRules} />
      <Button type="submit" variant="contained" size="large" disabled={submitting}>
        {submitting ? "Sending..." : "Send reset link"}
      </Button>
      <Typography variant="body2">
        <Link component={RouterLink} to={ROUTES.LOGIN}>
          Back to log in
        </Link>
      </Typography>
    </Stack>
  );
}
