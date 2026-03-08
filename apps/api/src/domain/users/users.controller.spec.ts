import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserView } from '@repo/types';

describe('UsersController', () => {
  let controller: UsersController;

  let usersService: {
    getAllUsers: jest.Mock;
    findById: jest.Mock;
  };

  const currentUser: UserView = {
    id: '1415c2fc-4067-4c4f-a7e1-748afc4e9b71',
    email: 'current@example.com',
    name: 'Current User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const userView: UserView = {
    id: '2415c2fc-4067-4c4f-a7e1-748afc4e9b72',
    email: 'test@example.com',
    name: 'Theo',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    usersService = {
      getAllUsers: jest.fn(),
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
    it('returns all users from the service', async () => {
      usersService.getAllUsers.mockResolvedValue([userView]);

      const result = await controller.getUsers();

      expect(usersService.getAllUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual([userView]);
    });
  });

  describe('findById', () => {
    it('returns a user by id from the service', async () => {
      usersService.findById.mockResolvedValue(userView);

      const result = await controller.findById(userView.id);

      expect(usersService.findById).toHaveBeenCalledWith(userView.id);
      expect(result).toEqual(userView);
    });

    it('returns null when the service returns null', async () => {
      usersService.findById.mockResolvedValue(null);

      const result = await controller.findById(
        '3415c2fc-4067-4c4f-a7e1-748afc4e9b73',
      );

      expect(usersService.findById).toHaveBeenCalledWith(
        '3415c2fc-4067-4c4f-a7e1-748afc4e9b73',
      );
      expect(result).toBeNull();
    });
  });
});
