import type { ProjectRole } from "@repo/types";

import type { ProjectTask } from "./types";

export function formatProjectRole(role: ProjectRole | undefined): string {
  if (!role) return "Member";
  switch (role) {
    case "OWNER":
      return "Owner";
    case "ADMIN":
      return "Admin";
    case "MEMBER":
      return "Member";
    default:
      return role;
  }
}

export function formatTaskStatus(status: ProjectTask["status"]) {
  switch (status) {
    case "TODO":
      return "Todo";
    case "IN_PROGRESS":
      return "In Progress";
    case "REVIEW":
      return "Review";
    case "DONE":
      return "Done";
    default:
      return status;
  }
}

export function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "DONE":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    default:
      return "outline";
  }
}

export function formatUpdatedAt(date: string | Date) {
  const value = typeof date === "string" ? new Date(date) : date;

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round((value.getTime() - Date.now()) / (1000 * 60 * 60)),
    "hour",
  );
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDistanceToNow(
  date: string | Date,
  options?: { locale?: string; numeric?: "always" | "auto" },
) {
  const locale = options?.locale ?? "en";
  const numeric = options?.numeric ?? "auto";
  const value = typeof date === "string" ? new Date(date) : date;
  const ms = value.getTime();
  if (Number.isNaN(ms)) return "Invalid date";
  const diffMs = ms - Date.now(); // future => positive, past => negative
  const absSeconds = Math.round(Math.abs(diffMs) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric });
  // thresholds are common, simple, and stable
  if (absSeconds < 60) {
    const seconds = Math.round(diffMs / 1000);
    return rtf.format(seconds, "second");
  }
  const absMinutes = Math.round(absSeconds / 60);
  if (absMinutes < 60) {
    const minutes = Math.round(diffMs / (1000 * 60));
    return rtf.format(minutes, "minute");
  }
  const absHours = Math.round(absMinutes / 60);
  if (absHours < 24) {
    const hours = Math.round(diffMs / (1000 * 60 * 60));
    return rtf.format(hours, "hour");
  }
  const absDays = Math.round(absHours / 24);
  if (absDays < 30) {
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
    return rtf.format(days, "day");
  }
  const absMonths = Math.round(absDays / 30);
  if (absMonths < 12) {
    const months = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30));
    return rtf.format(months, "month");
  }
  const years = Math.round(diffMs / (1000 * 60 * 60 * 24 * 365));
  return rtf.format(years, "year");
}
