import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentRefreshToken } from '@api/common';
import { SignupRequestDto, UserView, SignupInputDto } from '@repo/types';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RefreshAuthGuard, LocalAuthGuard } from '@api/common';
import { CookiesService } from './cookies/cookies.service';
import { SuccessResponse } from '@repo/types';

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
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: UserView,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserView> {
    const { accessToken, refreshToken } = await this.authService.login(user);

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
    @CurrentRefreshToken() rawRefreshToken: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponse> {
    if (rawRefreshToken) await this.authService.logout(rawRefreshToken);

    this.cookieService.clearAccessCookie(response);
    this.cookieService.clearRefreshCookie(response);

    return { success: true };
  }
}
