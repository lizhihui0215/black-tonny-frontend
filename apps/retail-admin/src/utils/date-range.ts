export type DateRangeInput = [Date | string, Date | string] | null | undefined;

export type DateRangeTuple = [Date, Date];

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
  const next = startOfDay(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function cloneDateRange(range: DateRangeTuple): DateRangeTuple {
  return [new Date(range[0]), new Date(range[1])];
}

export function formatDateToken(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatDateLabel(date: Date) {
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

export function formatDateRangeLabel(range: DateRangeTuple) {
  return `${formatDateLabel(range[0])} - ${formatDateLabel(range[1])}`;
}

export function normalizeDateInput(value: Date | string) {
  if (value instanceof Date) {
    return startOfDay(value);
  }

  const normalized = value.trim();
  const matched = normalized.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);

  if (matched) {
    const [, year, month, day] = matched;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime())
    ? startOfDay(new Date())
    : startOfDay(parsed);
}

export function normalizeDateRangeInput(
  value?: DateRangeInput,
): DateRangeTuple {
  if (value?.length === 2) {
    const start = normalizeDateInput(value[0]);
    const end = normalizeDateInput(value[1]);

    return start.getTime() <= end.getTime() ? [start, end] : [end, start];
  }

  const today = startOfDay(new Date());
  return [addDays(today, -6), today];
}

export function serializeDateRange(range: DateRangeTuple): [string, string] {
  return [formatDateToken(range[0]), formatDateToken(range[1])];
}

export function buildTrailingRange(
  anchor: Date | string,
  days: number,
): [string, string] {
  const end = normalizeDateInput(anchor);
  return [
    formatDateToken(addDays(end, 1 - Math.max(days, 1))),
    formatDateToken(end),
  ];
}
