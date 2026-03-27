import { UnauthorizedException } from '@nestjs/common';
import type { AuthConfigService } from '@api/config';
import type { Request } from 'express';
import { RefreshTokenStrategy } from './refresh.strategy';

describe('RefreshTokenStrategy', () => {
  let strategy: RefreshTokenStrategy;

  const authConfig = {
    cookies: {
      refresh: {
        name: 'refresh_token',
      },
    },
  };

  beforeEach(() => {
    strategy = new RefreshTokenStrategy(
      authConfig as unknown as AuthConfigService,
    );
  });

  it('returns the raw refresh token when the cookie exists', () => {
    const request = {
      cookies: {
        refresh_token: 'raw-refresh-token',
      },
    } as unknown as Request;

    expect(strategy.validate(request)).toEqual({
      rawRefreshToken: 'raw-refresh-token',
    });
  });

  it('throws UnauthorizedException when the refresh cookie is missing', () => {
    const request = {
      cookies: {},
    } as unknown as Request;

    expect(() => strategy.validate(request)).toThrow(UnauthorizedException);
    expect(() => strategy.validate(request)).toThrow('Refresh token missing');
  });

  it('throws UnauthorizedException when cookies are undefined', () => {
    const request = {} as unknown as Request;

    expect(() => strategy.validate(request)).toThrow(UnauthorizedException);
  });
});
