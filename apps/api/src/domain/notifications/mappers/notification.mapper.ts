import { toIsoString } from '@api/common/mappers/mapper.utils';
import type { NotificationRecord } from '../repositories/notifications.repository';
import type { NotificationView } from '@repo/types';
import { isRecord } from '../utils/is-record';

export function toNotificationView(n: NotificationRecord): NotificationView {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    meta: isRecord(n.meta) ? n.meta : null,
    createdAt: toIsoString(n.createdAt),
  };
}

export function toNotificationViews(
  rows: NotificationRecord[],
): NotificationView[] {
  return rows.map(toNotificationView);
}
