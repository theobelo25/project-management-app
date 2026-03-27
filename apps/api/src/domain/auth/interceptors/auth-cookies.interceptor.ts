import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { CookiesService } from '../cookies/cookies.service';
import { AuthSession, UserView } from '@repo/types';

function isUserView(value: unknown): value is UserView {
  if (!value || typeof value !== 'object') return false;

  const v = value as Record<string, unknown>;

  return (
    typeof v.id === 'string' &&
    typeof v.orgId === 'string' &&
    typeof v.organizationName === 'string' &&
    typeof v.email === 'string' &&
    typeof v.name === 'string' &&
    v.createdAt instanceof Date &&
    v.updatedAt instanceof Date
  );
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') return false;

  const v = value as Record<string, unknown>;

  return (
    typeof v.accessToken === 'string' &&
    typeof v.refreshToken === 'string' &&
    isUserView(v.user)
  );
}

@Injectable()
export class AuthCookiesInterceptor implements NestInterceptor {
  constructor(private readonly cookiesService: CookiesService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const res = http.getResponse<Response>();

    return next.handle().pipe(
      map((value: unknown) => {
        if (isAuthSession(value)) {
          this.cookiesService.setAuthCookies(
            res,
            value.accessToken,
            value.refreshToken,
          );

          return value.user;
        }

        return value;
      }),
    );
  }
}
