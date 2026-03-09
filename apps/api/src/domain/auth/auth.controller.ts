import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CurrentRefreshToken } from '@api/common';
import {
  SignupRequestDto,
  UserView,
  SignupInputDto,
  LoginRequestDto as LoginInput,
  COOKIE,
} from '@repo/types';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from '@api/common';
import { CookiesService } from './cookies/cookies.service';
import { SuccessResponse } from '@repo/types';
import { LoginRequestDto } from './dto/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookiesService,
  ) {}

  @Post('signup')
  async signup(
    @Body() body: SignupRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserView> {
    const signupInput: SignupInputDto = {
      email: body.email,
      name: body.name,
      password: body.password,
    };

    const { user, accessToken, refreshToken } =
      await this.authService.signup(signupInput);

    this.cookieService.setAuthCookies(response, accessToken, refreshToken);

    return user;
  }

  @Post('login')
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserView> {
    const loginInput: LoginInput = {
      email: body.email,
      password: body.password,
    };

    const user = await this.authService.validateCredentials(
      loginInput.email,
      loginInput.password,
    );

    const { accessToken, refreshToken } =
      await this.authService.issueSession(user);

    this.cookieService.setAuthCookies(response, accessToken, refreshToken);

    return user;
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  async refreshToken(
    @CurrentRefreshToken() rawRefreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserView> {
    const { user, accessToken, refreshToken } =
      await this.authService.refresh(rawRefreshToken);

    this.cookieService.setAuthCookies(response, accessToken, refreshToken);

    return user;
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponse> {
    const rawRefreshToken = req.cookies?.[COOKIE.REFRESH];

    if (typeof rawRefreshToken === 'string')
      await this.authService.logout(rawRefreshToken);

    this.cookieService.clearAccessCookie(response);
    this.cookieService.clearRefreshCookie(response);

    return { success: true };
  }
}
