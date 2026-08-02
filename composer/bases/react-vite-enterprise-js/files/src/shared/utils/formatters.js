// Used by RHFCurrency/RHFNumber (formatting as the user types/blurs) and by
// any table column that displays a currency/number value.
export function formatCurrency(value, currency = "USD", locale = "en-US") {
  if (value === null || value === undefined || value === "") return "";
  const number = Number(value);
  if (Number.isNaN(number)) return "";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(number);
}

export function formatNumber(value, locale = "en-US") {
  if (value === null || value === undefined || value === "") return "";
  const number = Number(value);
  if (Number.isNaN(number)) return "";
  return new Intl.NumberFormat(locale).format(number);
}

// Strips everything except digits/decimal point — used to parse a
// formatted currency/number string back into a plain numeric value before
// it's stored in form state.
export function parseNumeric(value) {
  if (typeof value === "number") return value;
  if (!value) return null;
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const number = Number(cleaned);
  return Number.isNaN(number) ? null : number;
}
