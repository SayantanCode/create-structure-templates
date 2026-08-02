import { EMAIL_REGEX, PHONE_REGEX } from "@/constants/regex";

export const contactNameRules = { required: "Name is required." };

export const contactEmailRules = {
  required: "Email is required.",
  pattern: { value: EMAIL_REGEX, message: "Enter a valid email address." },
};

export const contactPhoneRules = {
  pattern: { value: PHONE_REGEX, message: "Enter a valid phone number." },
};
