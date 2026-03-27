import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GlobalUsersSearchQueryDto } from './dto/global-users-search-query.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UserIdParamDto } from './dto/user-id-param.dto';
import { AuthUser, UserView } from '@repo/types';

describe('UsersController', () => {
  const svc = {
    getUsersForOrg: jest.fn(),
    searchUsers: jest.fn(),
    requireById: jest.fn(),
  };

  const me: AuthUser = {
    id: '1415c2fc-4067-4c4f-a7e1-748afc4e9b71',
    orgId: '0415c2fc-4067-4c4f-a7e1-748afc4e9b70',
  };

  const row: UserView = {
    id: '2415c2fc-4067-4c4f-a7e1-748afc4e9b72',
    orgId: me.orgId,
    organizationName: 'Acme',
    email: 'test@example.com',
    name: 'Theo',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let controller: UsersController;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: svc }],
    }).compile();

    controller = mod.get(UsersController);
    jest.clearAllMocks();
  });

  it('GET / — org users, search optional', async () => {
    svc.getUsersForOrg.mockResolvedValue([row]);

    expect(
      await controller.getUsers(me, { search: 'te' } as GetUsersQueryDto),
    ).toEqual([row]);
    expect(svc.getUsersForOrg).toHaveBeenCalledWith(me.orgId, 'te');

    await controller.getUsers(me, {} as GetUsersQueryDto);
    expect(svc.getUsersForOrg).toHaveBeenLastCalledWith(me.orgId, undefined);
  });

  it('GET /search — hands the string to searchUsers', async () => {
    svc.searchUsers.mockResolvedValue([row]);

    expect(
      await controller.searchAllUsers({
        search: 'bob',
      } as GlobalUsersSearchQueryDto),
    ).toEqual([row]);
    expect(svc.searchUsers).toHaveBeenCalledWith('bob');
  });

  it('GET /:id — requireById; service errors surface as-is', async () => {
    svc.requireById.mockResolvedValue(row);
    expect(await controller.findById({ id: row.id } as UserIdParamDto)).toEqual(
      row,
    );

    svc.requireById.mockRejectedValueOnce(new NotFoundException('gone'));
    await expect(
      controller.findById({ id: 'missing-id' } as UserIdParamDto),
    ).rejects.toThrow(NotFoundException);
  });
});
