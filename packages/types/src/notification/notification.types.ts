export type NotificationType =
  | "task_assigned"
  | "task_updated"
  | "project_member_added"
  | "project_member_removed"
  | "project_member_role_changed";

export type NotificationView = {
  id: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  meta?: Record<string, unknown> | null;
  createdAt: string; // ISO
};

// `POST /notifications/:id/clear` follows the `204 No Content` convention.
export type ClearNotificationResponse = void;
