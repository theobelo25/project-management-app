import { ProjectRole } from "@repo/types";
import { ProjectTask } from "./types";

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
