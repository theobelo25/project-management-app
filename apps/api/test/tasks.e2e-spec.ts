import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { PRISMA } from '../src/prisma/types/prisma.constants';
import {
  PrismaClient,
  ProjectRole,
  TaskPriority,
  TaskStatus,
} from '@repo/database';
import { ZodValidationPipe } from '@api/common';
import { AppExceptionFilter } from '@api/common/filters/app-exception.filter';
import type { AppLogger } from '@api/logger/app.logger.interface';

const mockLogger: AppLogger = {
  setContext: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('Tasks E2E', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ZodValidationPipe());
    app.useGlobalFilters(new AppExceptionFilter(mockLogger));
    await app.init();
    prisma = app.get(PRISMA);
  });
  beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.taskAssignee.deleteMany();
    await prisma.task.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });
  afterAll(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.taskAssignee.deleteMany();
    await prisma.task.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });
  it('creates a task in a project and returns a TaskView', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-tasks-create@example.com',
      'Owner Tasks Create',
    );
    const projectResponse = await owner.agent.post('/api/projects').send({
      name: 'Tasks Project',
      description: 'Project for tasks',
    });
    expect(projectResponse.status).toBe(201);
    const projectId = projectResponse.body.id as string;
    const createTaskResponse = await owner.agent.post('/api/tasks').send({
      projectId,
      title: 'My first task',
      description: 'Do something important',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
    });
    expect(createTaskResponse.status).toBe(201);
    expect(createTaskResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        projectId,
        title: 'My first task',
        description: 'Do something important',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        createdById: owner.userId,
        assignees: [],
      }),
    );
    const taskId = createTaskResponse.body.id as string;
    const taskInDb = await prisma.task.findUnique({
      where: { id: taskId },
    });
    expect(taskInDb).toEqual(
      expect.objectContaining({
        id: taskId,
        projectId,
        title: 'My first task',
        description: 'Do something important',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        createdById: owner.userId,
      }),
    );
  });
  it('lists tasks with filters and enforces project access', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-tasks-list@example.com',
      'Owner Tasks List',
    );
    const outsider = await signUpAndLogin(
      app,
      'outsider-tasks-list@example.com',
      'Outsider Tasks List',
    );
    const projectResponse = await owner.agent.post('/api/projects').send({
      name: 'Filter Project',
      description: 'Task filters',
    });
    expect(projectResponse.status).toBe(201);
    const projectId = projectResponse.body.id as string;
    // Create tasks with different statuses / priorities
    const makeTask = async (
      overrides: Partial<{
        title: string;
        status: TaskStatus;
        priority: TaskPriority;
      }> = {},
    ) => {
      const res = await owner.agent.post('/api/tasks').send({
        projectId,
        title: overrides.title ?? 'Task',
        description: 'Desc',
        status: overrides.status,
        priority: overrides.priority,
      });
      expect(res.status).toBe(201);
      return res.body;
    };
    const todoLow = await makeTask({
      title: 'TODO Low',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
    });
    const inProgressHigh = await makeTask({
      title: 'In Progress High',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
    });
    // Owner can list tasks and filter by status
    const listAllResponse = await owner.agent.get(
      `/api/tasks?projectId=${projectId}&page=1&limit=20`,
    );
    expect(listAllResponse.status).toBe(200);
    expect(listAllResponse.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        meta: expect.objectContaining({
          page: 1,
          limit: 20,
          total: 2,
        }),
      }),
    );
    const listTodoResponse = await owner.agent.get(
      `/api/tasks?projectId=${projectId}&status=${TaskStatus.TODO}&page=1&limit=20`,
    );
    expect(listTodoResponse.status).toBe(200);
    expect(listTodoResponse.body.data).toHaveLength(1);
    expect(listTodoResponse.body.data[0]).toEqual(
      expect.objectContaining({
        id: todoLow.id,
        title: 'TODO Low',
        status: TaskStatus.TODO,
      }),
    );
    // Outsider cannot read tasks from someone else's project
    const outsiderListResponse = await outsider.agent.get(
      `/api/tasks?projectId=${projectId}&page=1&pageSize=20`,
    );
    expect(outsiderListResponse.status).toBe(403);
  });
  it('allows authorized users to read, update, and delete tasks while enforcing access rules', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-tasks-update@example.com',
      'Owner Tasks Update',
    );
    const admin = await signUpAndLogin(
      app,
      'admin-tasks-update@example.com',
      'Admin Tasks Update',
    );
    const member = await signUpAndLogin(
      app,
      'member-tasks-update@example.com',
      'Member Tasks Update',
    );
    const outsider = await signUpAndLogin(
      app,
      'outsider-tasks-update@example.com',
      'Outsider Tasks Update',
    );
    // Owner creates project
    const projectResponse = await owner.agent.post('/api/projects').send({
      name: 'Task Access Project',
      description: 'Test task access',
    });
    expect(projectResponse.status).toBe(201);
    const projectId = projectResponse.body.id as string;
    // Owner adds ADMIN and MEMBER
    const addAdminResponse = await owner.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: admin.userId,
        role: ProjectRole.ADMIN,
      });
    expect(addAdminResponse.status).toBe(201);
    const addMemberResponse = await owner.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: member.userId,
        role: ProjectRole.MEMBER,
      });
    expect(addMemberResponse.status).toBe(201);
    // Owner creates a task
    const createTaskResponse = await owner.agent.post('/api/tasks').send({
      projectId,
      title: 'Access Controlled Task',
      description: 'Only certain roles can update/delete',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
    });
    expect(createTaskResponse.status).toBe(201);
    const taskId = createTaskResponse.body.id as string;
    // Owner can read
    const ownerRead = await owner.agent.get(`/api/tasks/${taskId}`);
    expect(ownerRead.status).toBe(200);
    expect(ownerRead.body).toEqual(
      expect.objectContaining({
        id: taskId,
        title: 'Access Controlled Task',
      }),
    );
    // Admin (project member) can read
    const adminRead = await admin.agent.get(`/api/tasks/${taskId}`);
    expect(adminRead.status).toBe(200);
    // Member can read
    const memberRead = await member.agent.get(`/api/tasks/${taskId}`);
    expect(memberRead.status).toBe(200);
    // Outsider cannot read
    const outsiderRead = await outsider.agent.get(`/api/tasks/${taskId}`);
    expect(outsiderRead.status).toBe(403);
    // Admin can update
    const adminUpdate = await admin.agent.patch(`/api/tasks/${taskId}`).send({
      title: 'Updated by Admin',
      status: TaskStatus.IN_PROGRESS,
    });
    expect(adminUpdate.status).toBe(200);
    expect(adminUpdate.body).toEqual(
      expect.objectContaining({
        id: taskId,
        title: 'Updated by Admin',
        status: TaskStatus.IN_PROGRESS,
      }),
    );
    // Member cannot update (not assignee, not owner/admin)
    const memberUpdate = await member.agent.patch(`/api/tasks/${taskId}`).send({
      title: 'Updated by Member',
    });
    expect(memberUpdate.status).toBe(403);
    // Owner can delete
    const ownerDelete = await owner.agent.delete(`/api/tasks/${taskId}`);
    expect(ownerDelete.status).toBe(204);
    const deletedTask = await prisma.task.findUnique({
      where: { id: taskId },
    });
    expect(deletedTask).toBeNull();
  });
  it('allows owners/admins to assign and unassign users to tasks', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-tasks-assign@example.com',
      'Owner Tasks Assign',
    );
    const admin = await signUpAndLogin(
      app,
      'admin-tasks-assign@example.com',
      'Admin Tasks Assign',
    );
    const assignee = await signUpAndLogin(
      app,
      'assignee-tasks-assign@example.com',
      'Assignee Tasks Assign',
    );
    const outsider = await signUpAndLogin(
      app,
      'outsider-tasks-assign@example.com',
      'Outsider Tasks Assign',
    );
    const projectResponse = await owner.agent.post('/api/projects').send({
      name: 'Assignment Project',
      description: 'Task assignment rules',
    });
    expect(projectResponse.status).toBe(201);
    const projectId = projectResponse.body.id as string;
    // Add admin as project ADMIN
    const addAdminResponse = await owner.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: admin.userId,
        role: ProjectRole.ADMIN,
      });
    expect(addAdminResponse.status).toBe(201);
    // Create a task
    const createTaskResponse = await owner.agent.post('/api/tasks').send({
      projectId,
      title: 'Assignable Task',
      description: 'Can be assigned',
    });
    expect(createTaskResponse.status).toBe(201);
    const taskId = createTaskResponse.body.id as string;
    // Owner assigns user
    const ownerAssignResponse = await owner.agent.post(
      `/api/tasks/${taskId}/assignees/${assignee.userId}`,
    );
    expect(ownerAssignResponse.status).toBe(201);
    expect(ownerAssignResponse.body).toEqual(
      expect.objectContaining({
        taskId,
        userId: assignee.userId,
        assignedAt: expect.any(String),
      }),
    );
    const assignmentInDb = await prisma.taskAssignee.findUnique({
      where: {
        taskId_userId: {
          taskId,
          userId: assignee.userId,
        },
      },
    });
    expect(assignmentInDb).not.toBeNull();
    // Admin can unassign
    const adminUnassignResponse = await admin.agent.delete(
      `/api/tasks/${taskId}/assignees/${assignee.userId}`,
    );
    expect(adminUnassignResponse.status).toBe(204);
    const removedAssignment = await prisma.taskAssignee.findUnique({
      where: {
        taskId_userId: {
          taskId,
          userId: assignee.userId,
        },
      },
    });
    expect(removedAssignment).toBeNull();
    // Outsider cannot assign
    const outsiderAssignResponse = await outsider.agent.post(
      `/api/tasks/${taskId}/assignees/${assignee.userId}`,
    );
    expect(outsiderAssignResponse.status).toBe(403);
  });
});
async function signUpAndLogin(
  app: INestApplication,
  email: string,
  name: string,
): Promise<{ agent: any; userId: string }> {
  const agent = request.agent(app.getHttpServer());
  const signupResponse = await agent.post('/api/auth/signup').send({
    email,
    name,
    password: 'Password123!',
    confirmPassword: 'Password123!',
  });
  expect(signupResponse.status).toBe(201);
  expect(signupResponse.body).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      email,
      name,
    }),
  );
  return {
    agent,
    userId: signupResponse.body.id as string,
  };
}
