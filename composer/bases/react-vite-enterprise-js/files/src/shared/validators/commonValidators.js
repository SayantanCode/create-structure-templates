import { EMAIL_REGEX, PHONE_REGEX, HEX_COLOR_REGEX } from "@/constants/regex";

// Plain functions, not a schema library — consumed directly as an RHF
// `rules.validate` entry: `rules={{ validate: isEmail }}`. See the
// "No schema-validation library" decision in this base's README for why.
export function isEmail(value) {
  return EMAIL_REGEX.test(value || "") || "Enter a valid email address.";
}

export function isPhone(value) {
  if (!value) return true;
  return PHONE_REGEX.test(value) || "Enter a valid phone number.";
}

export function isHexColor(value) {
  if (!value) return true;
  return HEX_COLOR_REGEX.test(value) || "Enter a valid hex color.";
}

export function minLength(min) {
  return (value) => (value || "").length >= min || `Must be at least ${min} characters.`;
}

export function maxLength(max) {
  return (value) => (value || "").length <= max || `Must be at most ${max} characters.`;
}
