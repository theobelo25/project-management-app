import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@api/domain/users/users.service';
import { AccessTokensService } from '@api/domain/auth/accessTokens/access-tokens.service';
import { CookiesService } from '@api/domain/auth/cookies/cookies.service';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class OrganizationsAccessCookieRefreshInterceptor implements NestInterceptor {
  constructor(
    private readonly usersService: UsersService,
    private readonly accessTokensService: AccessTokensService,
    private readonly cookiesService: CookiesService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest();

    const userId: unknown = request?.user?.id;

    if (typeof userId !== 'string') {
      throw new UnauthorizedException('Missing authenticated user id');
    }

    return next
      .handle()
      .pipe(
        switchMap((value) =>
          from(this.refreshCookie(userId, response)).pipe(
            switchMap(() => [value]),
          ),
        ),
      );
  }

  private async refreshCookie(userId: string, response: Response) {
    const updatedUser = await this.usersService.findById(userId);
    if (!updatedUser) {
      throw new UnauthorizedException(
        'User not found while refreshing access cookie',
      );
    }

    const { accessToken } = this.accessTokensService.sign(updatedUser);
    this.cookiesService.setAccessCookie(response, accessToken);
  }
}
