import dayjs from "dayjs";
import { DATE_FORMATS } from "@/constants/dateFormats";

// Thin wrapper around dayjs — call sites use these instead of importing
// dayjs directly, so the underlying date library (and its format strings)
// can change in one place if this project ever needs to.
export function formatDate(value, format = DATE_FORMATS.DATE) {
  if (!value) return "";
  return dayjs(value).format(format);
}

export function formatDateTime(value) {
  return formatDate(value, DATE_FORMATS.DATE_TIME);
}

export function toISODate(value) {
  return formatDate(value, DATE_FORMATS.ISO_DATE);
}

export function isValidDate(value) {
  return dayjs(value).isValid();
}
