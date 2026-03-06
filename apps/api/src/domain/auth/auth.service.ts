import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HashingService } from './hashing/hashing.service.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CreateUserInput, User } from '@repo/types';
import { TokenPayload } from './types/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserInput) {
    const existing = await this.usersService.findPrivateUserByEmail(dto.email);
    if (existing) throw new ConflictException('User already exists');
  }

  async login(user: User, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`,
    });
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS')}ms`,
    });

    const hashedRefreshToken = await this.hashingService.hash(refreshToken);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAccessToken,
    });
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresRefreshToken,
    });
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.findPrivateUserByEmail(email);
      if (!user) throw new NotFoundException('User not found');

      const authenticated = await this.hashingService.compare(
        password,
        user.password,
      );
      if (!authenticated)
        throw new UnauthorizedException('Invalid credentials');

      return user;
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  async verifyUserRefreshToken(refreshToken: string, userId: string) {
    try {
      const user = await this.usersService.findPrivateUserById(userId);
      if (!user || !user.refreshToken) throw new UnauthorizedException();

      const authenticated = await this.hashingService.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!authenticated) throw new UnauthorizedException();

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
