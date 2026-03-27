import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import cookieParser from 'cookie-parser';

import { AppModule } from '../src/app.module';
import { PRISMA } from '../src/prisma/types/prisma.constants';
import { PrismaClient, ProjectRole } from '@repo/database';
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

describe('Projects E2E', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api'); // mirror main.ts
    app.useGlobalPipes(new ZodValidationPipe());
    app.useGlobalFilters(new AppExceptionFilter(mockLogger));
    await app.init();

    prisma = app.get(PRISMA);
  });

  beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('creates a project and auto-adds the owner as OWNER member', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-create@example.com',
      'Owner Create',
    );

    const response = await owner.agent.post('/api/projects').send({
      name: 'Project Alpha',
      description: 'First project',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Project Alpha',
        description: 'First project',
        ownerId: owner.userId,
        archivedAt: null,
        currentUserRole: ProjectRole.OWNER,
      }),
    );

    const projectId = response.body.id as string;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    expect(project).toEqual(
      expect.objectContaining({
        id: projectId,
        name: 'Project Alpha',
        description: 'First project',
        ownerId: owner.userId,
      }),
    );

    const ownerMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: owner.userId,
        },
      },
    });

    expect(ownerMembership).toEqual(
      expect.objectContaining({
        projectId,
        userId: owner.userId,
        role: ProjectRole.OWNER,
      }),
    );
  });

  it('lists only the authenticated user projects and hides archived projects by default', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-list@example.com',
      'Owner List',
    );
    const outsider = await signUpAndLogin(
      app,
      'outsider-list@example.com',
      'Outsider List',
    );

    const ownerProject = await owner.agent.post('/api/projects').send({
      name: 'Owner Project',
      description: 'Visible to owner',
    });
    expect(ownerProject.status).toBe(201);

    const outsiderProject = await outsider.agent.post('/api/projects').send({
      name: 'Outsider Project',
      description: 'Should not be visible to owner',
    });
    expect(outsiderProject.status).toBe(201);

    const archiveResponse = await owner.agent.patch(
      `/api/projects/${ownerProject.body.id}/archive`,
    );
    expect(archiveResponse.status).toBe(200);

    const defaultListResponse = await owner.agent.get('/api/projects');

    expect(defaultListResponse.status).toBe(200);
    expect(defaultListResponse.body).toEqual(
      expect.objectContaining({
        items: expect.any(Array),
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0,
      }),
    );

    const includeArchivedResponse = await owner.agent.get(
      '/api/projects?includeArchived=true',
    );

    expect(includeArchivedResponse.status).toBe(200);
    expect(includeArchivedResponse.body.items).toHaveLength(1);
    expect(includeArchivedResponse.body.items[0]).toEqual(
      expect.objectContaining({
        id: ownerProject.body.id,
        name: 'Owner Project',
        ownerId: owner.userId,
      }),
    );

    expect(
      includeArchivedResponse.body.items.some(
        (item: { id: string }) => item.id === outsiderProject.body.id,
      ),
    ).toBe(false);
  });

  it('allows a member to view a project and forbids a non-member', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-view@example.com',
      'Owner View',
    );
    const member = await signUpAndLogin(
      app,
      'member-view@example.com',
      'Member View',
    );
    const outsider = await signUpAndLogin(
      app,
      'outsider-view@example.com',
      'Outsider View',
    );

    const createResponse = await owner.agent.post('/api/projects').send({
      name: 'Shared Project',
      description: 'Test access rules',
    });

    expect(createResponse.status).toBe(201);
    const projectId = createResponse.body.id as string;

    const addMemberResponse = await owner.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: member.userId,
        role: ProjectRole.MEMBER,
      });

    expect(addMemberResponse.status).toBe(201);

    const memberViewResponse = await member.agent.get(
      `/api/projects/${projectId}`,
    );
    expect(memberViewResponse.status).toBe(200);
    expect(memberViewResponse.body).toEqual(
      expect.objectContaining({
        id: projectId,
        name: 'Shared Project',
      }),
    );

    const outsiderViewResponse = await outsider.agent.get(
      `/api/projects/${projectId}`,
    );
    expect(outsiderViewResponse.status).toBe(403);

    const missingResponse = await owner.agent.get(
      '/api/projects/does-not-exist',
    );
    expect(missingResponse.status).toBe(400);
  });

  it('supports membership management: add, list, update role, remove', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-members@example.com',
      'Owner Members',
    );
    const member = await signUpAndLogin(
      app,
      'member-members@example.com',
      'Member Members',
    );

    const createResponse = await owner.agent.post('/api/projects').send({
      name: 'Membership Project',
      description: 'Manage members',
    });

    expect(createResponse.status).toBe(201);
    const projectId = createResponse.body.id as string;

    const addMemberResponse = await owner.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: member.userId,
        role: ProjectRole.MEMBER,
      });

    expect(addMemberResponse.status).toBe(201);
    expect(addMemberResponse.body).toEqual(
      expect.objectContaining({
        userId: member.userId,
        role: ProjectRole.MEMBER,
        joinedAt: expect.any(String),
      }),
    );

    const duplicateMemberResponse = await owner.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: member.userId,
        role: ProjectRole.MEMBER,
      });

    expect(duplicateMemberResponse.status).toBe(409);

    const membersResponse = await owner.agent.get(
      `/api/projects/${projectId}/members`,
    );

    expect(membersResponse.status).toBe(200);
    expect(membersResponse.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: owner.userId,
          role: ProjectRole.OWNER,
        }),
        expect.objectContaining({
          userId: member.userId,
          role: ProjectRole.MEMBER,
        }),
      ]),
    );

    const updateRoleResponse = await owner.agent
      .patch(`/api/projects/${projectId}/members/${member.userId}`)
      .send({
        role: ProjectRole.ADMIN,
      });

    expect(updateRoleResponse.status).toBe(200);
    expect(updateRoleResponse.body).toEqual(
      expect.objectContaining({
        userId: member.userId,
        role: ProjectRole.ADMIN,
      }),
    );

    const removeMemberResponse = await owner.agent.delete(
      `/api/projects/${projectId}/members/${member.userId}`,
    );

    expect(removeMemberResponse.status).toBe(204);

    const removedMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: member.userId,
        },
      },
    });

    expect(removedMembership).toBeNull();
  });

  it('prevents non-owners from managing membership', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-guard@example.com',
      'Owner Guard',
    );
    const member = await signUpAndLogin(
      app,
      'member-guard@example.com',
      'Member Guard',
    );
    const outsider = await signUpAndLogin(
      app,
      'outsider-guard@example.com',
      'Outsider Guard',
    );

    const createResponse = await owner.agent.post('/api/projects').send({
      name: 'Protected Membership Project',
      description: 'Permission checks',
    });

    expect(createResponse.status).toBe(201);
    const projectId = createResponse.body.id as string;

    const addMemberResponse = await owner.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: member.userId,
        role: ProjectRole.MEMBER,
      });

    expect(addMemberResponse.status).toBe(201);

    const memberAddResponse = await member.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: outsider.userId,
        role: ProjectRole.MEMBER,
      });

    expect(memberAddResponse.status).toBe(403);

    const outsiderAddResponse = await outsider.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: outsider.userId,
        role: ProjectRole.MEMBER,
      });

    expect(outsiderAddResponse.status).toBe(403);

    const memberRemoveResponse = await member.agent.delete(
      `/api/projects/${projectId}/members/${member.userId}`,
    );

    expect(memberRemoveResponse.status).toBe(403);
  });

  it('archives a project, blocks updates while archived, and allows unarchive by owner', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-archive@example.com',
      'Owner Archive',
    );
    const member = await signUpAndLogin(
      app,
      'member-archive@example.com',
      'Member Archive',
    );

    const createResponse = await owner.agent.post('/api/projects').send({
      name: 'Archive Project',
      description: 'Archive me',
    });

    expect(createResponse.status).toBe(201);
    const projectId = createResponse.body.id as string;

    const addMemberResponse = await owner.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: member.userId,
        role: ProjectRole.ADMIN,
      });

    expect(addMemberResponse.status).toBe(201);

    const archiveResponse = await owner.agent.patch(
      `/api/projects/${projectId}/archive`,
    );

    expect(archiveResponse.status).toBe(200);
    expect(archiveResponse.body).toEqual(
      expect.objectContaining({
        id: projectId,
        archivedAt: expect.any(String),
      }),
    );

    const ownerUpdateWhileArchived = await owner.agent
      .patch(`/api/projects/${projectId}`)
      .send({
        name: 'Updated While Archived',
      });

    expect(ownerUpdateWhileArchived.status).toBe(403);

    const memberArchiveResponse = await member.agent.patch(
      `/api/projects/${projectId}/archive`,
    );

    expect(memberArchiveResponse.status).toBe(403);

    const unarchiveResponse = await owner.agent.patch(
      `/api/projects/${projectId}/unarchive`,
    );

    expect(unarchiveResponse.status).toBe(200);
    expect(unarchiveResponse.body).toEqual(
      expect.objectContaining({
        id: projectId,
        archivedAt: null,
      }),
    );

    const ownerUpdateAfterUnarchive = await owner.agent
      .patch(`/api/projects/${projectId}`)
      .send({
        name: 'Updated After Unarchive',
      });

    expect(ownerUpdateAfterUnarchive.status).toBe(200);
    expect(ownerUpdateAfterUnarchive.body).toEqual(
      expect.objectContaining({
        id: projectId,
        name: 'Updated After Unarchive',
      }),
    );
  });

  it('transfers ownership to an existing member', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-transfer@example.com',
      'Owner Transfer',
    );
    const nextOwner = await signUpAndLogin(
      app,
      'next-owner-transfer@example.com',
      'Next Owner Transfer',
    );

    const createResponse = await owner.agent.post('/api/projects').send({
      name: 'Ownership Project',
      description: 'Transfer me',
    });

    expect(createResponse.status).toBe(201);
    const projectId = createResponse.body.id as string;

    const addMemberResponse = await owner.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: nextOwner.userId,
        role: ProjectRole.ADMIN,
      });

    expect(addMemberResponse.status).toBe(201);

    const transferResponse = await owner.agent
      .patch(`/api/projects/${projectId}/owner`)
      .send({
        userId: nextOwner.userId,
      });

    expect(transferResponse.status).toBe(200);
    expect(transferResponse.body).toEqual(
      expect.objectContaining({
        id: projectId,
        ownerId: nextOwner.userId,
        currentUserRole: ProjectRole.OWNER,
      }),
    );

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    expect(project?.ownerId).toBe(nextOwner.userId);

    const oldOwnerMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: owner.userId,
        },
      },
    });

    const newOwnerMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: nextOwner.userId,
        },
      },
    });

    expect(oldOwnerMembership?.role).toBe(ProjectRole.ADMIN);
    expect(newOwnerMembership?.role).toBe(ProjectRole.OWNER);
  });

  it('prevents transferring ownership to a non-member', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-transfer-nonmember@example.com',
      'Owner Transfer NonMember',
    );
    const nonMember = await signUpAndLogin(
      app,
      'nonmember-transfer@example.com',
      'NonMember Transfer',
    );
    const createResponse = await owner.agent.post('/api/projects').send({
      name: 'Ownership NonMember Project',
      description: 'Do not transfer to non-member',
    });
    expect(createResponse.status).toBe(201);
    const projectId = createResponse.body.id as string;
    const transferResponse = await owner.agent
      .patch(`/api/projects/${projectId}/owner`)
      .send({
        userId: nonMember.userId,
      });
    expect(transferResponse.status).toBe(404);
  });

  it('prevents transferring ownership to the current owner', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-transfer-self@example.com',
      'Owner Transfer Self',
    );
    const createResponse = await owner.agent.post('/api/projects').send({
      name: 'Ownership Self Project',
      description: 'Do not transfer to self',
    });
    expect(createResponse.status).toBe(201);
    const projectId = createResponse.body.id as string;
    const transferResponse = await owner.agent
      .patch(`/api/projects/${projectId}/owner`)
      .send({
        userId: owner.userId,
      });
    expect(transferResponse.status).toBe(409);
  });

  it('prevents adding the owner as a member and prevents removing the owner', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-members-owner-edge@example.com',
      'Owner Members Edge',
    );
    const createResponse = await owner.agent.post('/api/projects').send({
      name: 'Owner Edge Project',
      description: 'Test owner membership invariants',
    });
    expect(createResponse.status).toBe(201);
    const projectId = createResponse.body.id as string;
    const addOwnerResponse = await owner.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: owner.userId,
        role: ProjectRole.MEMBER,
      });
    expect(addOwnerResponse.status).toBe(409);
    const removeOwnerResponse = await owner.agent.delete(
      `/api/projects/${projectId}/members/${owner.userId}`,
    );
    expect(removeOwnerResponse.status).toBe(403);
  });

  it('blocks membership changes while project is archived', async () => {
    const owner = await signUpAndLogin(
      app,
      'owner-archive-members@example.com',
      'Owner Archive Members',
    );
    const member = await signUpAndLogin(
      app,
      'member-archive-members@example.com',
      'Member Archive Members',
    );
    const createResponse = await owner.agent.post('/api/projects').send({
      name: 'Archive Members Project',
      description: 'Membership changes while archived',
    });
    expect(createResponse.status).toBe(201);
    const projectId = createResponse.body.id as string;
    const addMemberResponse = await owner.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: member.userId,
        role: ProjectRole.MEMBER,
      });
    expect(addMemberResponse.status).toBe(201);
    const archiveResponse = await owner.agent.patch(
      `/api/projects/${projectId}/archive`,
    );
    expect(archiveResponse.status).toBe(200);
    const addWhileArchived = await owner.agent
      .post(`/api/projects/${projectId}/members`)
      .send({
        userId: 'some-other-user-id',
        role: ProjectRole.MEMBER,
      });
    expect(addWhileArchived.status).toBe(403);
    const removeWhileArchived = await owner.agent.delete(
      `/api/projects/${projectId}/members/${member.userId}`,
    );
    expect(removeWhileArchived.status).toBe(403);
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
