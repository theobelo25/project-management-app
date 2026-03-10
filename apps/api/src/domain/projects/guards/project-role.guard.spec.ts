import { Reflector } from '@nestjs/core';
import { ProjectRole } from '@repo/database';
import { ProjectRoleGuard } from './project-role.guard';
import { ProjectAccessService } from '../access/project-access.service';
describe('ProjectRoleGuard', () => {
  let guard: ProjectRoleGuard;
  const reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector;
  const projectAccessService = {
    requireRole: jest.fn(),
  } as unknown as jest.Mocked<ProjectAccessService>;
  const makeContext = (userId?: string, projectId?: string) =>
    ({
      switchToHttp: () => ({
        getRequest: () =>
          ({
            user: userId ? { userId, email: 'test@example.com' } : undefined,
            params: { id: projectId },
          }) as any,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    }) as any;
  beforeEach(() => {
    jest.clearAllMocks();
    guard = new ProjectRoleGuard(reflector, projectAccessService);
  });
  it('allows request when no required role metadata is set', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    const result = await guard.canActivate(makeContext('user-1', 'project-1'));
    expect(result).toBe(true);
    expect(projectAccessService.requireRole).not.toHaveBeenCalled();
  });
  it('returns false when projectId is missing', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(
      ProjectRole.ADMIN,
    );
    const result = await guard.canActivate(makeContext('user-1', undefined));
    expect(result).toBe(false);
    expect(projectAccessService.requireRole).not.toHaveBeenCalled();
  });
  it('returns false when userId is missing', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(
      ProjectRole.ADMIN,
    );
    const result = await guard.canActivate(makeContext(undefined, 'project-1'));
    expect(result).toBe(false);
    expect(projectAccessService.requireRole).not.toHaveBeenCalled();
  });
  it('calls ProjectAccessService.requireRole and allows when authorized', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(
      ProjectRole.ADMIN,
    );
    (projectAccessService.requireRole as jest.Mock).mockResolvedValue(
      {} as any,
    );
    const result = await guard.canActivate(makeContext('user-1', 'project-1'));
    expect(projectAccessService.requireRole).toHaveBeenCalledWith(
      'project-1',
      'user-1',
      ProjectRole.ADMIN,
    );
    expect(result).toBe(true);
  });
  it('propagates errors from ProjectAccessService.requireRole', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(
      ProjectRole.ADMIN,
    );
    (projectAccessService.requireRole as jest.Mock).mockRejectedValue(
      new Error('Insufficient project permissions'),
    );
    await expect(
      guard.canActivate(makeContext('user-1', 'project-1')),
    ).rejects.toThrow('Insufficient project permissions');
  });
});
