/**
 * Helpers for `<input type="month">`, whose value is a "YYYY-MM" string.
 *
 * The API rejects any ISO date that doesn't end in `Z`, so every conversion here
 * goes through Date.UTC + toISOString, which always produces one.
 *
 * Note: round-tripping an existing record normalises its day-of-month to the 1st.
 * The site only ever renders `MMM yyyy`, so this is invisible in the UI.
 */

export const MONTH_VALUE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

/** "2024-01" -> "2024-01-01T00:00:00.000Z" */
export function monthValueToUtcIso(value: string): string {
  const [year, month] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toISOString();
}

/** "2024-01-31T18:00:00.000Z" -> "2024-01" */
export function utcIsoToMonthValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}`;
}
