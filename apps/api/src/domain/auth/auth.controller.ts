import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentRefreshToken, CurrentUser, JwtAuthGuard } from '@api/common';
import {
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookiesService,
  ) {}

  @Post('signup')
  @UseInterceptors(AuthCookiesInterceptor)
  async signup(@Body() body: SignupRequestDto): Promise<AuthSession> {
    const signupInput: SignupInputDto = {
      email: body.email,
      name: body.name,
      password: body.password,
    };

    return this.authService.signup(signupInput);
  }

  @Post('login')
  @UseInterceptors(AuthCookiesInterceptor)
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
  @UseGuards(RefreshAuthGuard)
  @UseInterceptors(AuthCookiesInterceptor)
  async refreshToken(
    @CurrentRefreshToken() rawRefreshToken: string,
  ): Promise<AuthSession> {
    return this.authService.refresh(rawRefreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const rawRefreshToken = req.cookies?.[COOKIE.REFRESH];

    if (typeof rawRefreshToken === 'string')
      await this.authService.logout(rawRefreshToken);

    this.cookieService.clearAccessCookie(response);
    this.cookieService.clearRefreshCookie(response);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: UserView): Promise<UserView> {
    return user;
  }
}
