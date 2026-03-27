/* eslint-disable @typescript-eslint/no-unsafe-argument -- ExecutionContext test doubles */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ProjectRole } from '@repo/database';
import { AuthUser } from '@repo/types';
import { ProjectRoleGuard } from './project-role.guard';
import { ProjectAccessService } from '../policies/project-access.service';

type ReflectorLike = Pick<
  import('@nestjs/core').Reflector,
  'getAllAndOverride'
>;

describe('ProjectRoleGuard', () => {
  let guard: ProjectRoleGuard;

  const reflector: ReflectorLike = {
    getAllAndOverride: jest.fn(),
  };
  const access = { requireRole: jest.fn() } as unknown as ProjectAccessService;

  const ctx = (user: AuthUser | undefined, projectId?: string) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user, params: { id: projectId } }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    }) as any;

  const u = (id: string, org = 'org-1'): AuthUser => ({ id, orgId: org });

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new ProjectRoleGuard(
      reflector as unknown as import('@nestjs/core').Reflector,
      access,
    );
  });

  it('no @RequireProjectRole → no-op', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    expect(await guard.canActivate(ctx(u('1'), 'p1'))).toBe(true);
    expect(access.requireRole).not.toHaveBeenCalled();
  });

  it('needs :id, user.id, and user.orgId or it just returns false', async () => {
    reflector.getAllAndOverride.mockReturnValue(ProjectRole.ADMIN);

    expect(await guard.canActivate(ctx(u('1'), undefined))).toBe(false);
    expect(await guard.canActivate(ctx(undefined, 'p1'))).toBe(false);
    expect(await guard.canActivate(ctx({ id: '1' } as AuthUser, 'p1'))).toBe(
      false,
    );

    expect(access.requireRole).not.toHaveBeenCalled();
  });

  it('otherwise defers to ProjectAccessService.requireRole', async () => {
    reflector.getAllAndOverride.mockReturnValue(ProjectRole.ADMIN);
    access.requireRole.mockResolvedValue({});

    const user = u('user-1');
    expect(await guard.canActivate(ctx(user, 'project-1'))).toBe(true);
    expect(access.requireRole).toHaveBeenCalledWith(
      'project-1',
      user,
      ProjectRole.ADMIN,
    );
  });

  it('bubbles up whatever requireRole throws', async () => {
    reflector.getAllAndOverride.mockReturnValue(ProjectRole.ADMIN);
    access.requireRole.mockRejectedValue(new Error('nope'));

    await expect(guard.canActivate(ctx(u('1'), 'p1'))).rejects.toThrow('nope');
  });
});
