import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { COOKIE } from '@repo/types';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookiesService } from './cookies/cookies.service';

describe('AuthController', () => {
  let controller: AuthController;

  let authService: {
    signup: jest.Mock;
    validateCredentials: jest.Mock;
    issueSession: jest.Mock;
    refresh: jest.Mock;
    logout: jest.Mock;
  };

  let cookiesService: {
    setAuthCookies: jest.Mock;
    clearAccessCookie: jest.Mock;
    clearRefreshCookie: jest.Mock;
  };

  const response = {} as Response;

  const userView = {
    id: '1415c2fc-4067-4c4f-a7e1-748afc4e9b71',
    email: 'test@example.com',
    name: 'Theo',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    authService = {
      signup: jest.fn(),
      validateCredentials: jest.fn(),
      issueSession: jest.fn(),
      refresh: jest.fn(),
      logout: jest.fn(),
    };

    cookiesService = {
      setAuthCookies: jest.fn(),
      clearAccessCookie: jest.fn(),
      clearRefreshCookie: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: CookiesService,
          useValue: cookiesService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('signs up the user, sets auth cookies, and returns the user', async () => {
      const body = {
        email: 'test@example.com',
        name: 'Theo',
        password: 'password123',
        confirmPassword: 'password123',
      };

      authService.signup.mockResolvedValue({
        user: userView,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await controller.signup(body, response);

      expect(authService.signup).toHaveBeenCalledWith({
        email: body.email,
        name: body.name,
        password: body.password,
      });

      expect(cookiesService.setAuthCookies).toHaveBeenCalledWith(
        response,
        'access-token',
        'refresh-token',
      );

      expect(result).toEqual(userView);
    });
  });

  describe('login', () => {
    it('validates credentials, issues a session, and sets auth cookies', async () => {
      const loginBody = {
        email: 'test@example.com',
        password: 'password123',
      };

      authService.validateCredentials.mockResolvedValue(userView);
      authService.issueSession.mockResolvedValue({
        user: userView,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await controller.login(loginBody, response);

      expect(authService.validateCredentials).toHaveBeenCalledWith(
        loginBody.email,
        loginBody.password,
      );
      expect(authService.issueSession).toHaveBeenCalledWith(userView);
      expect(cookiesService.setAuthCookies).toHaveBeenCalledWith(
        response,
        'access-token',
        'refresh-token',
      );
      expect(result).toEqual(userView);
    });
  });

  describe('refreshToken', () => {
    it('refreshes the session, sets auth cookies, and returns the user', async () => {
      authService.refresh.mockResolvedValue({
        user: userView,
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      const result = await controller.refreshToken(
        'raw-refresh-token',
        response,
      );

      expect(authService.refresh).toHaveBeenCalledWith('raw-refresh-token');

      expect(cookiesService.setAuthCookies).toHaveBeenCalledWith(
        response,
        'new-access-token',
        'new-refresh-token',
      );

      expect(result).toEqual(userView);
    });
  });

  describe('logout', () => {
    it('logs out when refresh token exists, clears cookies, and returns no content', async () => {
      authService.logout.mockResolvedValue(undefined);
      const req = {
        cookies: { [COOKIE.REFRESH]: 'raw-refresh-token' },
      } as unknown as Request;
      const result = await controller.logout(req, response);
      expect(authService.logout).toHaveBeenCalledWith('raw-refresh-token');
      expect(cookiesService.clearAccessCookie).toHaveBeenCalledWith(response);
      expect(cookiesService.clearRefreshCookie).toHaveBeenCalledWith(response);
      expect(result).toBeUndefined();
    });

    it('does not call authService.logout when refresh token is missing', async () => {
      const req = { cookies: {} } as Request;
      const result = await controller.logout(req, response);
      expect(authService.logout).not.toHaveBeenCalled();
      expect(cookiesService.clearAccessCookie).toHaveBeenCalledWith(response);
      expect(cookiesService.clearRefreshCookie).toHaveBeenCalledWith(response);
      expect(result).toBeUndefined();
    });

    it('still clears cookies when refresh token is undefined', async () => {
      const req = { cookies: {} } as Request;
      const result = await controller.logout(req, response);
      expect(authService.logout).not.toHaveBeenCalled();
      expect(cookiesService.clearAccessCookie).toHaveBeenCalledWith(response);
      expect(cookiesService.clearRefreshCookie).toHaveBeenCalledWith(response);
      expect(result).toBeUndefined();
    });
  });
});
