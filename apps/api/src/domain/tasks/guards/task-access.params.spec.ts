import { BadRequestException } from '@nestjs/common';

import {
  parseRequiredProjectIdFromBody,
  parseRequiredProjectIdFromQuery,
  parseRequiredTaskIdFromParams,
  parseRequiredAssigneeUserIdFromParams,
} from './task-access.params';

describe('task-access.params', () => {
  describe('parseRequiredProjectIdFromBody', () => {
    it('returns projectId when valid', () => {
      const result = parseRequiredProjectIdFromBody({ projectId: 'project-1' });
      expect(result).toBe('project-1');
    });

    it('throws BadRequestException when projectId is missing', () => {
      try {
        parseRequiredProjectIdFromBody({});
        fail('Expected throw');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        const resp = (e as BadRequestException).getResponse() as any;
        expect(resp.details?.code).toBe('TASK_INVALID_PROJECT_ID');
      }
    });

    it('throws BadRequestException when projectId is empty string', () => {
      try {
        parseRequiredProjectIdFromBody({ projectId: '' });
        fail('Expected throw');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        const resp = (e as BadRequestException).getResponse() as any;
        expect(resp.details?.code).toBe('TASK_INVALID_PROJECT_ID');
      }
    });
  });

  describe('parseRequiredProjectIdFromQuery', () => {
    it('returns projectId when valid', () => {
      const result = parseRequiredProjectIdFromQuery({
        projectId: 'project-1',
      });
      expect(result).toBe('project-1');
    });

    it('throws BadRequestException when projectId is missing', () => {
      try {
        parseRequiredProjectIdFromQuery({});
        fail('Expected throw');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        const resp = (e as BadRequestException).getResponse() as any;
        expect(resp.details?.code).toBe('TASK_INVALID_PROJECT_ID');
      }
    });

    it('throws BadRequestException when projectId is empty string', () => {
      try {
        parseRequiredProjectIdFromQuery({ projectId: '' });
        fail('Expected throw');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        const resp = (e as BadRequestException).getResponse() as any;
        expect(resp.details?.code).toBe('TASK_INVALID_PROJECT_ID');
      }
    });
  });

  describe('parseRequiredTaskIdFromParams', () => {
    it('returns taskId when valid', () => {
      const result = parseRequiredTaskIdFromParams({ taskId: 'task-1' } as any);
      expect(result).toBe('task-1');
    });

    it('throws BadRequestException when taskId is missing', () => {
      try {
        parseRequiredTaskIdFromParams({} as any);
        fail('Expected throw');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        const resp = (e as BadRequestException).getResponse() as any;
        expect(resp.details?.code).toBe('TASK_INVALID_TASK_ID');
      }
    });

    it('throws BadRequestException when taskId is an array', () => {
      try {
        parseRequiredTaskIdFromParams({ taskId: ['task-1'] } as any);
        fail('Expected throw');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        const resp = (e as BadRequestException).getResponse() as any;
        expect(resp.details?.code).toBe('TASK_INVALID_TASK_ID');
      }
    });
  });

  describe('parseRequiredAssigneeUserIdFromParams', () => {
    it('returns assigneeUserId when valid', () => {
      const result = parseRequiredAssigneeUserIdFromParams({
        userId: 'assignee-1',
      } as any);
      expect(result).toBe('assignee-1');
    });

    it('throws BadRequestException when userId is missing', () => {
      try {
        parseRequiredAssigneeUserIdFromParams({} as any);
        fail('Expected throw');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        const resp = (e as BadRequestException).getResponse() as any;
        expect(resp.details?.code).toBe('TASK_INVALID_ASSIGNEE_USER_ID');
      }
    });

    it('throws BadRequestException when userId is an array', () => {
      try {
        parseRequiredAssigneeUserIdFromParams({
          userId: ['assignee-1'],
        } as any);
        fail('Expected throw');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        const resp = (e as BadRequestException).getResponse() as any;
        expect(resp.details?.code).toBe('TASK_INVALID_ASSIGNEE_USER_ID');
      }
    });
  });
});
