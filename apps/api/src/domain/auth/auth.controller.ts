import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '@api/common/decorators/current-user.decorator';
import { CreateUserInput, CreateUserInputSchema, User } from '@repo/types';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Db } from '@api/prisma/types/db.type';
import { ZodBody } from '@api/common/decorators/zod-body.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signup(@ZodBody(CreateUserInputSchema) body: CreateUserInput) {
    this.authService.signup(body);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }
}
