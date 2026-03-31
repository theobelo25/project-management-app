import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Patch,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentRefreshToken, CurrentUser, Public } from '@api/common';
import {
  UpdateUserInputDto,
  UserView,
  SignupInputDto,
  LoginRequestDto as LoginInput,
  COOKIE,
  AuthSession,
} from '@repo/types';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from '@api/common';
import { CookiesService } from './cookies/cookies.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { SignupRequestDto } from './dto/signup-request.dto';
import { AuthCookiesInterceptor } from './interceptors/auth-cookies.interceptor';
import { Throttle } from '@nestjs/throttler';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserViewResponseDto } from '@api/common/swagger/response-dtos';
import { UpdateProfileDto } from '@api/domain/users/dto';
import { UsersService } from '@api/domain/users/users.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookiesService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @Public()
  @UseInterceptors(AuthCookiesInterceptor)
  @Throttle({ global: { ttl: 60_000, limit: 60 } })
  @ZodSerializerDto(UserViewResponseDto)
  async signup(@Body() body: SignupRequestDto): Promise<AuthSession> {
    const signupInput: SignupInputDto = {
      email: body.email,
      name: body.name,
      password: body.password,
    };

    return this.authService.signup(signupInput);
  }

  @Post('login')
  @Public()
  @UseInterceptors(AuthCookiesInterceptor)
  @Throttle({ global: { ttl: 60_000, limit: 20 } })
  @ZodSerializerDto(UserViewResponseDto)
  async login(@Body() body: LoginRequestDto): Promise<AuthSession> {
    const loginInput: LoginInput = {
      email: body.email,
      password: body.password,
    };

    const user = await this.authService.validateCredentials(
      loginInput.email,
      loginInput.password,
    );

    return this.authService.issueSession(user);
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshAuthGuard)
  @UseInterceptors(AuthCookiesInterceptor)
  @Throttle({ global: { ttl: 60_000, limit: 60 } })
  @ApiCookieAuth('Refresh')
  @ZodSerializerDto(UserViewResponseDto)
  async refreshToken(
    @CurrentRefreshToken() rawRefreshToken: string,
  ): Promise<AuthSession> {
    return this.authService.refresh(rawRefreshToken);
  }

  @Post('logout')
  @Public()
  @HttpCode(204)
  @Throttle({ global: { ttl: 60_000, limit: 60 } })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const cookies = req.cookies as Record<string, string> | undefined;
    const rawRefreshToken = cookies?.[COOKIE.REFRESH];

    if (typeof rawRefreshToken === 'string')
      await this.authService.logout(rawRefreshToken);

    this.cookieService.clearAccessCookie(response);
    this.cookieService.clearRefreshCookie(response);
  }

  @Get('me')
  @ApiCookieAuth('Authentication')
  @ZodSerializerDto(UserViewResponseDto)
  me(@CurrentUser() user: UserView): UserView {
    return user;
  }

  @Patch('me')
  @ApiCookieAuth('Authentication')
  @ZodSerializerDto(UserViewResponseDto)
  async updateMe(
    @CurrentUser() user: UserView,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserView> {
    const updateData: UpdateUserInputDto = {};

    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }

    if (dto.email !== undefined) {
      updateData.email = dto.email;
    }

    if (dto.themeMode !== undefined) {
      updateData.themeMode = dto.themeMode;
    }

    if (dto.colorScheme !== undefined) {
      updateData.colorScheme = dto.colorScheme;
    }

    if (dto.password !== undefined) {
      updateData.passwordHash = await this.authService.hashPassword(
        dto.password,
      );
    }

    return this.usersService.update(user.id, updateData);
  }
}
