export function toIsoString(date: Date): string {
  return date.toISOString();
}

export function toIsoStringOrNull(
  date: Date | null | undefined,
): string | null {
  return date ? date.toISOString() : null;
}
