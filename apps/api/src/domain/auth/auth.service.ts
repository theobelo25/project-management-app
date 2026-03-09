import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {
  HASHING_SERVICE,
  HashingService,
} from './hashing/hashing.service.interface';
import {
  CreateUserDto,
  SessionPayload,
  SignupInputDto,
  UserView,
} from '@repo/types';
import { UNIT_OF_WORK } from '@api/prisma';
import { UnitOfWork } from '@api/prisma/uow/unit-of-work.interface';
import { AccessTokensService } from './accessTokens/access-tokens.service';
import { RefreshTokensService } from './refreshTokens/refresh-tokens.service';
import { Db } from '@api/prisma';
import { toUserView } from '../users/mappers/user.mapper';
import { USERS_REPOSITORY } from '../users/types/users.tokens';
import { UsersRepository } from '../users/repositories/users.repository';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    @Inject(HASHING_SERVICE) private readonly hashingService: HashingService,
    private readonly accessTokensService: AccessTokensService,
    private readonly refreshTokenService: RefreshTokensService,
    @Inject(UNIT_OF_WORK) private readonly uow: UnitOfWork,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async signup(dto: SignupInputDto): Promise<SessionPayload> {
    return this.uow.transaction(async (tx) => {
      await this.assertEmailAvailable(dto.email, tx);

      const newUser = await this.createUserWithHashedPassword(dto, tx);
      if (!newUser) throw new BadRequestException('Problem creating user');

      const { accessToken, refreshToken } = await this.createSession(
        newUser,
        tx,
      );

      this.logger.info({ userId: newUser.id }, 'User signed up successfully');

      return {
        user: newUser,
        accessToken,
        refreshToken,
      };
    });
  }

  async login(user: UserView): Promise<SessionPayload> {
    const { accessToken, refreshToken } = await this.createSession(user);

    this.logger.info({ userId: user.id }, 'User logged in successfully');

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async authenticateUser(email: string, password: string): Promise<UserView> {
    const user = await this.usersRepository.findPrivateUserByEmail(email);
    if (!user) {
      this.logger.warn({ email }, 'Authentication failed: user not found');
      throw new UnauthorizedException('Credentials are not valid');
    }

    const authenticated = await this.hashingService.verify(
      password,
      user.passwordHash,
    );
    if (!authenticated) {
      this.logger.warn(
        { userId: user.id },
        'Authentication failed: invalid password',
      );
      throw new UnauthorizedException('Credentials are not valid');
    }

    this.logger.debug({ userId: user.id }, 'User credentials authenticated');
    return toUserView(user);
  }

  async authenticateRefreshToken(rawRefreshToken: string): Promise<UserView> {
    const matched =
      await this.refreshTokenService.findValidRefreshToken(rawRefreshToken);

    if (!matched) {
      this.logger.warn(
        'Refresh token authentication failed: token not found or invalid',
      );
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersRepository.findById(matched.userId);
    if (!user) {
      this.logger.warn(
        { userId: matched.userId },
        'Refresh token authentication failed: user not found',
      );
      throw new UnauthorizedException('Invalid refresh token');
    }

    return user;
  }

  async refresh(rawRefreshToken: string): Promise<SessionPayload> {
    return this.uow.transaction(async (tx) => {
      const { userId, nextRawToken } = await this.refreshTokenService.rotate(
        rawRefreshToken,
        tx,
      );

      const user = await this.usersRepository.findById(userId, tx);

      if (!user) {
        this.logger.warn(
          { userId },
          'Refresh failed: token rotated but user no longer exists',
        );
        throw new UnauthorizedException('Invalid refresh token');
      }

      const { accessToken } = this.accessTokensService.sign(user);

      this.logger.info({ userId }, 'Refresh token rotated successfully');

      return {
        user,
        accessToken,
        refreshToken: nextRawToken,
      };
    });
  }

  async logout(rawRefreshToken: string): Promise<void> {
    await this.refreshTokenService.revoke(rawRefreshToken);
    this.logger.info('User logged out successfully');
  }

  private async createSession(
    user: UserView,
    tx?: Db,
  ): Promise<SessionPayload> {
    const { accessToken } = this.accessTokensService.sign(user);
    const refreshToken = await this.refreshTokenService.issueInitial(
      user.id,
      tx,
    );

    return { user, accessToken, refreshToken };
  }

  private async createUserWithHashedPassword(
    dto: SignupInputDto,
    tx?: Db,
  ): Promise<UserView> {
    const hashedPassword = await this.hashingService.hash(dto.password);
    const createUserDto: CreateUserDto = {
      email: dto.email,
      name: dto.name,
      passwordHash: hashedPassword,
    };

    return this.usersRepository.create(createUserDto, tx);
  }

  private async assertEmailAvailable(email: string, tx: Db): Promise<void> {
    const existing = await this.usersRepository.findPrivateUserByEmail(
      email,
      tx,
    );
    if (existing) {
      this.logger.warn(
        { email },
        'Signup rejected because email is already in use',
      );
      throw new ConflictException('User already exists');
    }
  }
}
