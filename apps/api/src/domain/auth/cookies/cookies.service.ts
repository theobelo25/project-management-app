import { AuthConfigService } from '@api/config';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookiesService {
  constructor(private readonly authConfig: AuthConfigService) {}

  private calculateExpiresAt(ttlMs: number) {
    return new Date(Date.now() + ttlMs);
  }

  setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    this.setAccessCookie(response, accessToken);
    this.setRefreshCookie(response, refreshToken);
  }

  setAccessCookie(response: Response, token: string) {
    response.cookie(this.authConfig.cookies.access.name, token, {
      ...this.authConfig.cookies.access.options,
      expires: this.calculateExpiresAt(this.authConfig.access.ttlMs),
    });
  }

  setRefreshCookie(response: Response, token: string) {
    response.cookie(this.authConfig.cookies.refresh.name, token, {
      ...this.authConfig.cookies.refresh.options,
      expires: this.calculateExpiresAt(this.authConfig.refresh.ttlMs),
    });
  }

  clearAccessCookie(response: Response) {
    response.clearCookie(
      this.authConfig.cookies.access.name,
      this.authConfig.cookies.access.options,
    );
  }

  clearRefreshCookie(response: Response) {
    response.clearCookie(
      this.authConfig.cookies.refresh.name,
      this.authConfig.cookies.refresh.options,
    );
  }
}
