import { PinoLogger } from 'nestjs-pino';
import { AuthUser } from '@repo/types';
import { ProjectsService } from './projects.service';
import { ProjectsCommandsService, ProjectsQueriesService } from './services';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let commands: jest.Mocked<
    Pick<
      ProjectsCommandsService,
      'create' | 'update' | 'archive' | 'unarchive' | 'delete'
    >
  >;
  let queries: jest.Mocked<
    Pick<
      ProjectsQueriesService,
      'findManyForUser' | 'findById' | 'findDetailById'
    >
  >;

  const me: AuthUser = { id: 'user-1', orgId: 'org-1' };

  beforeEach(() => {
    commands = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      unarchive: jest.fn(),
      delete: jest.fn(),
    };
    queries = {
      findManyForUser: jest.fn(),
      findById: jest.fn(),
      findDetailById: jest.fn(),
    };

    service = new ProjectsService(
      commands as unknown as ProjectsCommandsService,
      queries as unknown as ProjectsQueriesService,
      { setContext: jest.fn() } as PinoLogger,
    );
  });

  it('mostly just forwards to commands / queries', async () => {
    const dto = { name: 'x', description: null };
    commands.create.mockResolvedValue({} as never);
    queries.findManyForUser.mockResolvedValue({} as never);
    queries.findById.mockResolvedValue({} as never);
    queries.findDetailById.mockResolvedValue({} as never);
    commands.update.mockResolvedValue({} as never);
    commands.archive.mockResolvedValue({} as never);
    commands.delete.mockResolvedValue(undefined);

    await service.create(me, dto);
    await service.findManyForUser(me, {
      page: 1,
      pageSize: 20,
      includeArchived: false,
    });
    await service.findById('p1', me, {});
    await service.findDetailById('p1', me);
    await service.update('p1', me, { name: 'n' });
    await service.archive('p1', me);
    await service.delete('p1', me);

    expect(commands.create).toHaveBeenCalledWith(me, dto);
    expect(queries.findManyForUser).toHaveBeenCalled();
    expect(queries.findById).toHaveBeenCalledWith('p1', me, {});
    expect(queries.findDetailById).toHaveBeenCalledWith('p1', me, undefined);
    expect(commands.update).toHaveBeenCalledWith(
      'p1',
      me,
      { name: 'n' },
      undefined,
    );
    expect(commands.archive).toHaveBeenCalledWith('p1', me, undefined);
    expect(commands.delete).toHaveBeenCalledWith('p1', me, undefined);
  });

  it('unarchive still goes through commands', async () => {
    commands.unarchive.mockResolvedValue({} as never);
    await service.unarchive('p1', me);
    expect(commands.unarchive).toHaveBeenCalledWith('p1', me, undefined);
  });
});
