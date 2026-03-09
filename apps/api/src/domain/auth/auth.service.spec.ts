import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { USERS_REPOSITORY } from '../users/types/users.tokens';
import { HASHING_SERVICE } from './hashing/hashing.service.interface';
import { AccessTokensService } from './accessTokens/access-tokens.service';
import { RefreshTokensService } from './refreshTokens/refresh-tokens.service';
import { UNIT_OF_WORK } from '@api/prisma';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

describe('AuthService', () => {
  let service: AuthService;

  let usersRepository: {
    findPrivateUserByEmail: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
  };

  let hashingService: {
    hash: jest.Mock;
    verify: jest.Mock;
  };

  let accessTokensService: {
    sign: jest.Mock;
  };

  let refreshTokensService: {
    issueInitial: jest.Mock;
    findValidRefreshToken: jest.Mock;
    rotate: jest.Mock;
    revoke: jest.Mock;
  };

  let uow: {
    transaction: jest.Mock;
  };

  let logger: {
    setContext: jest.Mock;
    info: jest.Mock;
    warn: jest.Mock;
    debug: jest.Mock;
    error: jest.Mock;
  };

  const signupDto = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Theo',
  };

  const privateUser = {
    id: '1415c2fc-4067-4c4f-a7e1-748afc4e9b71',
    email: 'test@example.com',
    name: 'Theo',
    passwordHash: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const userView = {
    id: privateUser.id,
    email: privateUser.email,
    name: privateUser.name,
    createdAt: privateUser.createdAt,
    updatedAt: privateUser.updatedAt,
  };

  const tx = { prisma: 'tx' };

  beforeEach(async () => {
    usersRepository = {
      findPrivateUserByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    hashingService = {
      hash: jest.fn(),
      verify: jest.fn(),
    };

    accessTokensService = {
      sign: jest.fn(),
    };

    refreshTokensService = {
      issueInitial: jest.fn(),
      findValidRefreshToken: jest.fn(),
      rotate: jest.fn(),
      revoke: jest.fn(),
    };

    uow = {
      transaction: jest.fn(async (callback: (tx: any) => Promise<any>) => {
        return callback(tx);
      }),
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
        AuthService,
        {
          provide: USERS_REPOSITORY,
          useValue: usersRepository,
        },
        {
          provide: HASHING_SERVICE,
          useValue: hashingService,
        },
        {
          provide: AccessTokensService,
          useValue: accessTokensService,
        },
        {
          provide: RefreshTokensService,
          useValue: refreshTokensService,
        },
        {
          provide: UNIT_OF_WORK,
          useValue: uow,
        },
        {
          provide: PinoLogger,
          useValue: logger,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('creates a user and returns a full session payload', async () => {
      usersRepository.findPrivateUserByEmail.mockResolvedValue(null);
      hashingService.hash.mockResolvedValue('hashed-password');
      usersRepository.create.mockResolvedValue(userView);
      accessTokensService.sign.mockReturnValue({ accessToken: 'access-token' });
      refreshTokensService.issueInitial.mockResolvedValue('refresh-token');

      const result = await service.signup(signupDto);

      expect(uow.transaction).toHaveBeenCalledTimes(1);
      expect(usersRepository.findPrivateUserByEmail).toHaveBeenCalledWith(
        signupDto.email,
        tx,
      );
      expect(hashingService.hash).toHaveBeenCalledWith(signupDto.password);
      expect(usersRepository.create).toHaveBeenCalledWith(
        {
          email: signupDto.email,
          name: signupDto.name,
          passwordHash: 'hashed-password',
        },
        tx,
      );
      expect(accessTokensService.sign).toHaveBeenCalledWith(userView);
      expect(refreshTokensService.issueInitial).toHaveBeenCalledWith(
        userView.id,
        tx,
      );
      expect(result).toEqual({
        user: userView,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(logger.info).toHaveBeenCalledWith(
        { userId: userView.id },
        'User signed up successfully',
      );
    });

    it('throws ConflictException when email is already taken', async () => {
      usersRepository.findPrivateUserByEmail.mockResolvedValue(privateUser);

      await expect(service.signup(signupDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.signup(signupDto)).rejects.toThrow(
        'User already exists',
      );

      expect(hashingService.hash).not.toHaveBeenCalled();
      expect(usersRepository.create).not.toHaveBeenCalled();
      expect(refreshTokensService.issueInitial).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when user creation returns null', async () => {
      usersRepository.findPrivateUserByEmail.mockResolvedValue(null);
      hashingService.hash.mockResolvedValue('hashed-password');
      usersRepository.create.mockResolvedValue(null);

      await expect(service.signup(signupDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.signup(signupDto)).rejects.toThrow(
        'Problem creating user',
      );

      expect(refreshTokensService.issueInitial).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns a full session payload for a valid user', async () => {
      accessTokensService.sign.mockReturnValue({ accessToken: 'access-token' });
      refreshTokensService.issueInitial.mockResolvedValue('refresh-token');

      const result = await service.login(userView);

      expect(accessTokensService.sign).toHaveBeenCalledWith(userView);
      expect(refreshTokensService.issueInitial).toHaveBeenCalledWith(
        userView.id,
        undefined,
      );
      expect(result).toEqual({
        user: userView,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(logger.info).toHaveBeenCalledWith(
        { userId: userView.id },
        'User logged in successfully',
      );
    });
  });

  describe('authenticateUser', () => {
    it('returns a UserView when email and password are valid', async () => {
      usersRepository.findPrivateUserByEmail.mockResolvedValue(privateUser);
      hashingService.verify.mockResolvedValue(true);

      const result = await service.authenticateUser(
        'test@example.com',
        'password123',
      );

      expect(usersRepository.findPrivateUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(hashingService.verify).toHaveBeenCalledWith(
        'password123',
        privateUser.passwordHash,
      );
      expect(result).toEqual(userView);
    });

    it('throws UnauthorizedException when user does not exist', async () => {
      usersRepository.findPrivateUserByEmail.mockResolvedValue(null);

      await expect(
        service.authenticateUser('missing@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.authenticateUser('missing@example.com', 'password123'),
      ).rejects.toThrow('Credentials are not valid');

      expect(hashingService.verify).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException when password is invalid', async () => {
      usersRepository.findPrivateUserByEmail.mockResolvedValue(privateUser);
      hashingService.verify.mockResolvedValue(false);

      await expect(
        service.authenticateUser('test@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.authenticateUser('test@example.com', 'wrong-password'),
      ).rejects.toThrow('Credentials are not valid');
    });
  });

  describe('authenticateRefreshToken', () => {
    it('returns the user when refresh token is valid', async () => {
      refreshTokensService.findValidRefreshToken.mockResolvedValue({
        userId: userView.id,
      });
      usersRepository.findById.mockResolvedValue(userView);

      const result =
        await service.authenticateRefreshToken('raw-refresh-token');

      expect(refreshTokensService.findValidRefreshToken).toHaveBeenCalledWith(
        'raw-refresh-token',
      );
      expect(usersRepository.findById).toHaveBeenCalledWith(userView.id);
      expect(result).toEqual(userView);
    });

    it('throws UnauthorizedException when refresh token is invalid', async () => {
      refreshTokensService.findValidRefreshToken.mockResolvedValue(null);

      await expect(
        service.authenticateRefreshToken('bad-token'),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.authenticateRefreshToken('bad-token'),
      ).rejects.toThrow('Invalid refresh token');

      expect(usersRepository.findById).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException when token exists but user does not', async () => {
      refreshTokensService.findValidRefreshToken.mockResolvedValue({
        userId: 'missing-user',
      });
      usersRepository.findById.mockResolvedValue(null);

      await expect(
        service.authenticateRefreshToken('raw-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.authenticateRefreshToken('raw-refresh-token'),
      ).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('refresh', () => {
    it('rotates the refresh token and returns a new session payload', async () => {
      refreshTokensService.rotate.mockResolvedValue({
        userId: userView.id,
        nextRawToken: 'new-refresh-token',
      });
      usersRepository.findById.mockResolvedValue(userView);
      accessTokensService.sign.mockReturnValue({
        accessToken: 'new-access-token',
      });

      const result = await service.refresh('old-refresh-token');

      expect(uow.transaction).toHaveBeenCalledTimes(1);
      expect(refreshTokensService.rotate).toHaveBeenCalledWith(
        'old-refresh-token',
        tx,
      );
      expect(usersRepository.findById).toHaveBeenCalledWith(userView.id, tx);
      expect(accessTokensService.sign).toHaveBeenCalledWith(userView);

      expect(result).toEqual({
        user: userView,
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      expect(logger.info).toHaveBeenCalledWith(
        { userId: userView.id },
        'Refresh token rotated successfully',
      );
    });

    it('throws UnauthorizedException when rotated token references a missing user', async () => {
      refreshTokensService.rotate.mockResolvedValue({
        userId: 'missing-user',
        nextRawToken: 'new-refresh-token',
      });
      usersRepository.findById.mockResolvedValue(null);

      await expect(service.refresh('old-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );

      await expect(service.refresh('old-refresh-token')).rejects.toThrow(
        'Invalid refresh token',
      );
    });
  });

  describe('logout', () => {
    it('revokes the refresh token', async () => {
      refreshTokensService.revoke.mockResolvedValue(undefined);

      await expect(
        service.logout('raw-refresh-token'),
      ).resolves.toBeUndefined();

      expect(refreshTokensService.revoke).toHaveBeenCalledWith(
        'raw-refresh-token',
      );
      expect(logger.info).toHaveBeenCalledWith('User logged out successfully');
    });
  });
});
