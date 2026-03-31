import { REALTIME_EVENT, realtimeRoom } from './realtime.events';

describe('realtime events', () => {
  it('builds stable room keys', () => {
    expect(realtimeRoom.user('u1')).toBe('user:u1');
    expect(realtimeRoom.org('o1')).toBe('org:o1');
    expect(realtimeRoom.project('p1')).toBe('project:p1');
    expect(realtimeRoom.task('t1')).toBe('task:t1');
  });

  it('exposes expected task collaboration events', () => {
    expect(REALTIME_EVENT.taskCreated).toBe('task.created');
    expect(REALTIME_EVENT.taskUpdated).toBe('task.updated');
    expect(REALTIME_EVENT.taskDeleted).toBe('task.deleted');
  });
});
