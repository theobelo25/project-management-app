import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthUser, UserView } from '@repo/types';
import { NotFoundException } from '@nestjs/common';
import { GetUsersQueryDto } from './dto';

describe('UsersController', () => {
  let controller: UsersController;

  let usersService: {
    getUsersForOrg: jest.Mock;
    searchUsers: jest.Mock;
    findById: jest.Mock;
  };

  const authUser: AuthUser = {
    id: '1415c2fc-4067-4c4f-a7e1-748afc4e9b71',
    orgId: '0415c2fc-4067-4c4f-a7e1-748afc4e9b70',
  };

  const userView: UserView = {
    id: '2415c2fc-4067-4c4f-a7e1-748afc4e9b72',
    orgId: authUser.orgId,
    organizationName: 'Acme',
    email: 'test@example.com',
    name: 'Theo',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    usersService = {
      getUsersForOrg: jest.fn(),
      searchUsers: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('returns org users from the service', async () => {
      usersService.getUsersForOrg.mockResolvedValue([userView]);

      const result = await controller.getUsers(authUser, {
        search: 'te',
      } as GetUsersQueryDto);

      expect(usersService.getUsersForOrg).toHaveBeenCalledWith(
        authUser.orgId,
        'te',
      );
      expect(result).toEqual([userView]);
    });

    it('passes undefined search when omitted', async () => {
      usersService.getUsersForOrg.mockResolvedValue([userView]);

      await controller.getUsers(authUser, {} as GetUsersQueryDto);

      expect(usersService.getUsersForOrg).toHaveBeenCalledWith(
        authUser.orgId,
        undefined,
      );
    });
  });

  describe('searchAllUsers', () => {
    it('delegates to searchUsers with trimmed query', async () => {
      usersService.searchUsers.mockResolvedValue([userView]);

      const result = await controller.searchAllUsers({
        search: 'bob',
      } as GetUsersQueryDto);

      expect(usersService.searchUsers).toHaveBeenCalledWith('bob');
      expect(result).toEqual([userView]);
    });

    it('passes empty string when search is missing', async () => {
      usersService.searchUsers.mockResolvedValue([]);

      await controller.searchAllUsers({} as GetUsersQueryDto);

      expect(usersService.searchUsers).toHaveBeenCalledWith('');
    });
  });

  describe('findById', () => {
    it('returns a user by id from the service', async () => {
      usersService.findById.mockResolvedValue(userView);

      const result = await controller.findById({ id: userView.id });

      expect(usersService.findById).toHaveBeenCalledWith(userView.id);
      expect(result).toEqual(userView);
    });

    it('throws NotFoundException when the service returns null', async () => {
      const missingId = '3415c2fc-4067-4c4f-a7e1-748afc4e9b73';
      usersService.findById.mockResolvedValue(null);

      await expect(controller.findById({ id: missingId })).rejects.toThrow(
        NotFoundException,
      );

      expect(usersService.findById).toHaveBeenCalledWith(missingId);
    });
  });
});
