import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  HASHING_SERVICE,
  HashingService,
} from './hashing/hashing.service.interface';
import {
  AuthSession,
  CreateUserDto,
  SignupInputDto,
  UserView,
} from '@repo/types';
import { UNIT_OF_WORK } from '@api/prisma';
import { UnitOfWork } from '@api/prisma/uow/unit-of-work.interface';
import { AccessTokensService } from './accessTokens/access-tokens.service';
import { RefreshTokensService } from './refreshTokens/refresh-tokens.service';
import { Db } from '@api/prisma';
import { toUserView } from '../users/mappers/user.mapper';
import { UsersService } from '../users/users.service';
import { PinoLogger } from 'nestjs-pino';
import {
  ORGANIZATION_WORKSPACE_BOOTSTRAP,
  OrganizationWorkspaceBootstrap,
} from '../organizations/organization-workspace-bootstrap.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(HASHING_SERVICE) private readonly hashingService: HashingService,
    private readonly accessTokensService: AccessTokensService,
    private readonly refreshTokenService: RefreshTokensService,
    @Inject(UNIT_OF_WORK) private readonly uow: UnitOfWork,
    private readonly logger: PinoLogger,
    @Inject(ORGANIZATION_WORKSPACE_BOOTSTRAP)
    private readonly organizationWorkspaceBootstrap: OrganizationWorkspaceBootstrap,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async signup(dto: SignupInputDto): Promise<AuthSession> {
    return this.uow.transaction(async (tx) => {
      await this.assertEmailAvailable(dto.email, tx);

      const org =
        await this.organizationWorkspaceBootstrap.createInitialOrganizationForUserName(
          dto.name,
          tx,
        );

      const newUser = await this.createUserWithHashedPassword(dto, org.id, tx);
      if (!newUser) throw new BadRequestException('Problem creating user');

      const { accessToken, refreshToken } = await this.createSession(
        newUser,
        tx,
      );

      this.logger.info(
        { userId: newUser.id, organizationId: org.id },
        'User signed up successfully',
      );

      return {
        user: newUser,
        accessToken,
        refreshToken,
      };
    });
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserView> {
    const user = await this.usersService.findPrivateUserByEmail(email);
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

  async issueSession(user: UserView): Promise<AuthSession> {
    const { accessToken, refreshToken } = await this.createSession(user);

    this.logger.info({ userId: user.id }, 'User logged in successfully');

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refresh(rawRefreshToken: string): Promise<AuthSession> {
    return this.uow.transaction(async (tx) => {
      const { userId, nextRawToken } = await this.refreshTokenService.rotate(
        rawRefreshToken,
        tx,
      );

      const user = await this.usersService.findById(userId, tx);

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

  async hashPassword(password: string): Promise<string> {
    return this.hashingService.hash(password);
  }

  private async createSession(user: UserView, tx?: Db): Promise<AuthSession> {
    const { accessToken } = this.accessTokensService.sign(user);
    const refreshToken = await this.refreshTokenService.issueInitial(
      user.id,
      tx,
    );

    return { user, accessToken, refreshToken };
  }

  private async createUserWithHashedPassword(
    dto: SignupInputDto,
    orgId: string,
    tx?: Db,
  ): Promise<UserView> {
    const hashedPassword = await this.hashingService.hash(dto.password);

    const createUserDto: CreateUserDto = {
      orgId,
      email: dto.email,
      name: dto.name,
      passwordHash: hashedPassword,
    };

    return this.usersService.create(createUserDto, tx);
  }

  private async assertEmailAvailable(email: string, tx: Db): Promise<void> {
    const existing = await this.usersService.findPrivateUserByEmail(
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
