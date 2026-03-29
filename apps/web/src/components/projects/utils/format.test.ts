import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  formatProjectRole,
  formatTaskStatus,
  getStatusBadgeVariant,
  formatUpdatedAt,
  formatDistanceToNow,
} from '@web/components/projects/utils/format';

describe('formatProjectRole', () => {
  it('maps known roles to labels', () => {
    expect(formatProjectRole('OWNER')).toBe('Owner');
    expect(formatProjectRole('ADMIN')).toBe('Admin');
    expect(formatProjectRole('MEMBER')).toBe('Member');
  });

  it('defaults when undefined', () => {
    expect(formatProjectRole(undefined)).toBe('Member');
  });
});

describe('formatTaskStatus', () => {
  it('maps statuses to display strings', () => {
    expect(formatTaskStatus('TODO')).toBe('Todo');
    expect(formatTaskStatus('IN_PROGRESS')).toBe('In Progress');
    expect(formatTaskStatus('REVIEW')).toBe('Review');
    expect(formatTaskStatus('DONE')).toBe('Done');
  });
});

describe('getStatusBadgeVariant', () => {
  it('maps DONE to default badge', () => {
    expect(getStatusBadgeVariant('DONE')).toBe('default');
  });

  it('maps IN_PROGRESS to secondary', () => {
    expect(getStatusBadgeVariant('IN_PROGRESS')).toBe('secondary');
  });

  it('maps other statuses to outline', () => {
    expect(getStatusBadgeVariant('TODO')).toBe('outline');
  });
});

describe('formatUpdatedAt', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-01T14:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a relative hour string', () => {
    const twoHoursAgo = new Date('2025-06-01T12:00:00.000Z');
    const out = formatUpdatedAt(twoHoursAgo);
    expect(out).toMatch(/2\s+hours/);
  });
});

describe('formatDistanceToNow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-01T14:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns Invalid date for NaN', () => {
    expect(formatDistanceToNow('not-a-date')).toBe('Invalid date');
  });

  it('uses seconds for near times', () => {
    const soon = new Date('2025-06-01T14:00:45.000Z');
    expect(formatDistanceToNow(soon)).toMatch(/second/);
  });
});
