import { EMAIL_REGEX } from "@/constants/regex";

// Field-level RHF `rules` objects — see this base's README for why this
// project doesn't use a schema-validation library.
export const emailRules = {
  required: "Email is required.",
  pattern: { value: EMAIL_REGEX, message: "Enter a valid email address." },
};

export const passwordRules = {
  required: "Password is required.",
  minLength: { value: 8, message: "Must be at least 8 characters." },
};

export const nameRules = {
  required: "Name is required.",
};
