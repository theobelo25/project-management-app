import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';
import { USERS_REPOSITORY } from './types/users.tokens';
import { PinoLogger } from 'nestjs-pino';

describe('UsersService', () => {
  let service: UsersService;

  let usersRepository: {
    findByEmail: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    findById: jest.Mock;
    findPrivateUserById: jest.Mock;
    findPrivateUserByEmail: jest.Mock;
    getAllUsers: jest.Mock;
  };

  let logger: {
    setContext: jest.Mock;
    info: jest.Mock;
    warn: jest.Mock;
    debug: jest.Mock;
    error: jest.Mock;
  };

  const db = { prisma: 'tx' };

  const userView = {
    id: '1415c2fc-4067-4c4f-a7e1-748afc4e9b71',
    email: 'test@example.com',
    name: 'Theo',
  };

  const privateUser = {
    id: '1415c2fc-4067-4c4f-a7e1-748afc4e9b71',
    email: 'test@example.com',
    name: 'Theo',
    passwordHash: 'hashed-password',
  };

  const createUserDto = {
    email: 'test@example.com',
    name: 'Theo',
    passwordHash: 'hashed-password',
  };

  const updateUserDto = {
    name: 'Updated Theo',
  };

  beforeEach(async () => {
    usersRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findPrivateUserById: jest.fn(),
      findPrivateUserByEmail: jest.fn(),
      getAllUsers: jest.fn(),
    };

    logger = {
      setContext: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USERS_REPOSITORY,
          useValue: usersRepository,
        },
        {
          provide: PinoLogger,
          useValue: logger,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a user when email is available', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(userView);

      const result = await service.create(createUserDto, db as any);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
        db,
      );
      expect(usersRepository.create).toHaveBeenCalledWith(createUserDto, db);
      expect(result).toEqual(userView);
      expect(logger.info).toHaveBeenCalledWith(
        expect.objectContaining({ userId: userView.id }),
        'User created successfully',
      );
    });

    it('throws ConflictException when email already exists', async () => {
      usersRepository.findByEmail.mockResolvedValue(userView);

      await expect(service.create(createUserDto, db as any)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createUserDto, db as any)).rejects.toThrow(
        'User already exists',
      );

      expect(usersRepository.create).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        { email: createUserDto.email },
        'User creation rejected because email is already in use',
      );
    });

    it('creates a user without db when no db is provided', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(userView);

      const result = await service.create(createUserDto);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
        undefined,
      );
      expect(usersRepository.create).toHaveBeenCalledWith(
        createUserDto,
        undefined,
      );
      expect(result).toEqual(userView);
    });
  });

  describe('update', () => {
    it('delegates to usersRepository.update', async () => {
      usersRepository.update.mockResolvedValue({
        ...userView,
        ...updateUserDto,
      });

      const result = await service.update(
        userView.id,
        updateUserDto,
        db as any,
      );

      expect(usersRepository.update).toHaveBeenCalledWith(
        userView.id,
        updateUserDto,
        db,
      );
      expect(result).toEqual({
        ...userView,
        ...updateUserDto,
      });
    });
  });

  describe('findById', () => {
    it('delegates to usersRepository.findById', async () => {
      usersRepository.findById.mockResolvedValue(userView);

      const result = await service.findById(userView.id, db as any);

      expect(usersRepository.findById).toHaveBeenCalledWith(userView.id, db);
      expect(result).toEqual(userView);
    });

    it('returns null when repository returns null', async () => {
      usersRepository.findById.mockResolvedValue(null);

      const result = await service.findById(userView.id, db as any);

      expect(result).toBeNull();
    });
  });

  describe('findPrivateUserById', () => {
    it('delegates to usersRepository.findPrivateUserById', async () => {
      usersRepository.findPrivateUserById.mockResolvedValue(privateUser);

      const result = await service.findPrivateUserById(userView.id, db as any);

      expect(usersRepository.findPrivateUserById).toHaveBeenCalledWith(
        userView.id,
        db,
      );
      expect(result).toEqual(privateUser);
    });

    it('returns null when repository returns null', async () => {
      usersRepository.findPrivateUserById.mockResolvedValue(null);

      const result = await service.findPrivateUserById(userView.id, db as any);

      expect(result).toBeNull();
    });
  });

  describe('findPrivateUserByEmail', () => {
    it('delegates to usersRepository.findPrivateUserByEmail', async () => {
      usersRepository.findPrivateUserByEmail.mockResolvedValue(privateUser);

      const result = await service.findPrivateUserByEmail(
        privateUser.email,
        db as any,
      );

      expect(usersRepository.findPrivateUserByEmail).toHaveBeenCalledWith(
        privateUser.email,
        db,
      );
      expect(result).toEqual(privateUser);
    });

    it('returns null when repository returns null', async () => {
      usersRepository.findPrivateUserByEmail.mockResolvedValue(null);

      const result = await service.findPrivateUserByEmail(
        privateUser.email,
        db as any,
      );

      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('delegates to usersRepository.getAllUsers', async () => {
      usersRepository.getAllUsers.mockResolvedValue([userView]);

      const result = await service.getAllUsers();

      expect(usersRepository.getAllUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual([userView]);
    });
  });
});
