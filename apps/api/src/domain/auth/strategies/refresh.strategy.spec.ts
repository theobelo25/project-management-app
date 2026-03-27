import { UnauthorizedException } from '@nestjs/common';
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
    strategy = new RefreshTokenStrategy(authConfig as any);
  });

  it('returns the raw refresh token when the cookie exists', async () => {
    const request = {
      cookies: {
        refresh_token: 'raw-refresh-token',
      },
    } as any;

    await expect(strategy.validate(request)).resolves.toEqual({
      rawRefreshToken: 'raw-refresh-token',
    });
  });

  it('throws UnauthorizedException when the refresh cookie is missing', async () => {
    const request = {
      cookies: {},
    } as any;

    await expect(strategy.validate(request)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(strategy.validate(request)).rejects.toThrow(
      'Refresh token missing',
    );
  });

  it('throws UnauthorizedException when cookies are undefined', async () => {
    const request = {} as any;

    await expect(strategy.validate(request)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
