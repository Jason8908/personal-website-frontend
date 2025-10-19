export type TimeZoneMode = "local" | "utc";

export type FormatOptions = {
  timeZone?: TimeZoneMode;
  locale?: string;
};

export function getLocalTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function ensureDate(input: Date | string | number): Date {
  if (input instanceof Date) return input;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid date input");
  }
  return d;
}

function pad(num: number, len = 2): string {
  return String(num).padStart(len, "0");
}

function getParts(d: Date, tz: TimeZoneMode, locale: string) {
  const year = tz === "utc" ? d.getUTCFullYear() : d.getFullYear();
  const monthIndex = tz === "utc" ? d.getUTCMonth() : d.getMonth(); // 0-based
  const month = monthIndex + 1;
  const day = tz === "utc" ? d.getUTCDate() : d.getDate();
  const hour24 = tz === "utc" ? d.getUTCHours() : d.getHours();
  const minute = tz === "utc" ? d.getUTCMinutes() : d.getMinutes();
  const second = tz === "utc" ? d.getUTCSeconds() : d.getSeconds();

  const hour12 = ((hour24 % 12) || 12);
  const ampm = hour24 < 12 ? "AM" : "PM";

  const weekdayLong = new Intl.DateTimeFormat(locale, {
    timeZone: tz === "utc" ? "UTC" : undefined,
    weekday: "long",
  }).format(d);
  const weekdayShort = new Intl.DateTimeFormat(locale, {
    timeZone: tz === "utc" ? "UTC" : undefined,
    weekday: "short",
  }).format(d);
  const monthLong = new Intl.DateTimeFormat(locale, {
    timeZone: tz === "utc" ? "UTC" : undefined,
    month: "long",
  }).format(d);
  const monthShort = new Intl.DateTimeFormat(locale, {
    timeZone: tz === "utc" ? "UTC" : undefined,
    month: "short",
  }).format(d);

  const tzShort = new Intl.DateTimeFormat(locale, {
    timeZone: tz === "utc" ? "UTC" : undefined,
    timeZoneName: "short",
  })
    .formatToParts(d)
    .find((p) => p.type === "timeZoneName")?.value;

  const tzLong = new Intl.DateTimeFormat(locale, {
    timeZone: tz === "utc" ? "UTC" : undefined,
    timeZoneName: "long",
  })
    .formatToParts(d)
    .find((p) => p.type === "timeZoneName")?.value;

  let offsetTotalMinutes = 0;
  if (tz === "utc") {
    offsetTotalMinutes = 0;
  } else {
    offsetTotalMinutes = -d.getTimezoneOffset();
  }
  const offsetSign = offsetTotalMinutes >= 0 ? "+" : "-";
  const offsetAbs = Math.abs(offsetTotalMinutes);
  const offsetHours = Math.floor(offsetAbs / 60);
  const offsetMinutes = offsetAbs % 60;
  const offsetXXX = `${offsetSign}${pad(offsetHours)}:${pad(offsetMinutes)}`;

  return {
    year,
    month,
    day,
    hour24,
    hour12,
    minute,
    second,
    ampm,
    weekdayLong,
    weekdayShort,
    monthLong,
    monthShort,
    tzShort: tzShort || (tz === "utc" ? "UTC" : "GMT"),
    tzLong: tzLong || (tz === "utc" ? "Coordinated Universal Time" : "Greenwich Mean Time"),
    offsetXXX,
  };
}

const TOKEN_REGEX = /yyyy|yy|MMMM|MMM|MM|M|dd|d|EEEE|EEE|HH|H|hh|h|mm|m|ss|s|a|XXX|zzzz|zzz|z/g;

export function formatDate(
  input: Date | string | number,
  formatStr: string,
  options?: FormatOptions
): string {
  const date = ensureDate(input);
  const tz: TimeZoneMode = options?.timeZone ?? "local";
  const locale = options?.locale ?? "en-US";

  const p = getParts(date, tz, locale);

  return formatStr.replace(TOKEN_REGEX, (token) => {
    switch (token) {
      // Year
      case "yyyy":
        return String(p.year);
      case "yy":
        return String(p.year).slice(-2);

      // Month
      case "MMMM":
        return p.monthLong;
      case "MMM":
        return p.monthShort;
      case "MM":
        return pad(p.month);
      case "M":
        return String(p.month);

      // Day
      case "dd":
        return pad(p.day);
      case "d":
        return String(p.day);

      // Weekday
      case "EEEE":
        return p.weekdayLong;
      case "EEE":
        return p.weekdayShort;

      // Hour 24
      case "HH":
        return pad(p.hour24);
      case "H":
        return String(p.hour24);

      // Hour 12
      case "hh":
        return pad(p.hour12);
      case "h":
        return String(p.hour12);

      // Minute
      case "mm":
        return pad(p.minute);
      case "m":
        return String(p.minute);

      // Second
      case "ss":
        return pad(p.second);
      case "s":
        return String(p.second);

      // AM/PM
      case "a":
        return p.ampm;

      // Timezone
      case "XXX":
        return p.offsetXXX;
      case "zzzz":
        return p.tzLong;
      case "zzz":
      case "z":
        return p.tzShort;

      default:
        return token; // leave unknown tokens as-is
    }
  });
}

export function formatDateRange(
  start: Date | string | number,
  end: Date | string | number,
  formatStr: string,
  options?: FormatOptions
): string {
  return `${formatDate(start, formatStr, options)} - ${formatDate(end, formatStr, options)}`;
}


