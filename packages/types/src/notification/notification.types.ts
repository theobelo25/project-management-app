export type NotificationType = "task_assigned";

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
