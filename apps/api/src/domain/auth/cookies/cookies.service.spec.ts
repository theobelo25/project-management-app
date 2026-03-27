import { Response } from 'express';

import { CookiesService } from './cookies.service';
import { AuthConfigService } from '@api/config';

describe('CookiesService', () => {
  let service: CookiesService;

  let authConfig: {
    access: { ttlMs: number };
    refresh: { ttlMs: number };
    cookies: {
      access: {
        name: string;
        options: Record<string, unknown>;
      };
      refresh: {
        name: string;
        options: Record<string, unknown>;
      };
    };
  };

  let response: {
    cookie: jest.Mock;
    clearCookie: jest.Mock;
  };

  const fixedNow = new Date('2026-03-08T18:30:00.000Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);

    authConfig = {
      access: {
        ttlMs: 15 * 60 * 1000,
      },
      refresh: {
        ttlMs: 7 * 24 * 60 * 60 * 1000,
      },
      cookies: {
        access: {
          name: 'authentication',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/',
          },
        },
        refresh: {
          name: 'refresh',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/auth/refresh',
          },
        },
      },
    };

    response = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    service = new CookiesService(authConfig as unknown as AuthConfigService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('setAuthCookies', () => {
    it('sets both access and refresh cookies', () => {
      service.setAuthCookies(
        response as unknown as Response,
        'access-token',
        'refresh-token',
      );

      expect(response.cookie).toHaveBeenCalledTimes(2);

      expect(response.cookie).toHaveBeenNthCalledWith(
        1,
        authConfig.cookies.access.name,
        'access-token',
        {
          ...authConfig.cookies.access.options,
          expires: new Date(fixedNow.getTime() + authConfig.access.ttlMs),
        },
      );

      expect(response.cookie).toHaveBeenNthCalledWith(
        2,
        authConfig.cookies.refresh.name,
        'refresh-token',
        {
          ...authConfig.cookies.refresh.options,
          expires: new Date(fixedNow.getTime() + authConfig.refresh.ttlMs),
        },
      );
    });
  });

  describe('setAccessCookie', () => {
    it('sets the access cookie with the correct name, token, and expires', () => {
      service.setAccessCookie(response as unknown as Response, 'access-token');

      expect(response.cookie).toHaveBeenCalledTimes(1);
      expect(response.cookie).toHaveBeenCalledWith(
        authConfig.cookies.access.name,
        'access-token',
        {
          ...authConfig.cookies.access.options,
          expires: new Date(fixedNow.getTime() + authConfig.access.ttlMs),
        },
      );
    });
  });

  describe('setRefreshCookie', () => {
    it('sets the refresh cookie with the correct name, token, and expires', () => {
      service.setRefreshCookie(
        response as unknown as Response,
        'refresh-token',
      );

      expect(response.cookie).toHaveBeenCalledTimes(1);
      expect(response.cookie).toHaveBeenCalledWith(
        authConfig.cookies.refresh.name,
        'refresh-token',
        {
          ...authConfig.cookies.refresh.options,
          expires: new Date(fixedNow.getTime() + authConfig.refresh.ttlMs),
        },
      );
    });
  });

  describe('clearAccessCookie', () => {
    it('clears the access cookie with the configured options', () => {
      service.clearAccessCookie(response as unknown as Response);

      expect(response.clearCookie).toHaveBeenCalledTimes(1);
      expect(response.clearCookie).toHaveBeenCalledWith(
        authConfig.cookies.access.name,
        authConfig.cookies.access.options,
      );
    });
  });

  describe('clearRefreshCookie', () => {
    it('clears the refresh cookie with the configured options', () => {
      service.clearRefreshCookie(response as unknown as Response);

      expect(response.clearCookie).toHaveBeenCalledTimes(1);
      expect(response.clearCookie).toHaveBeenCalledWith(
        authConfig.cookies.refresh.name,
        authConfig.cookies.refresh.options,
      );
    });
  });
});
