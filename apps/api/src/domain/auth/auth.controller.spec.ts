import { Test } from '@nestjs/testing';
import { Request, Response } from 'express';
import { COOKIE } from '@repo/types';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookiesService } from './cookies/cookies.service';
import { UsersService } from '@api/domain/users/users.service';

describe('AuthController', () => {
  let controller: AuthController;

  const auth = {
    signup: jest.fn(),
    validateCredentials: jest.fn(),
    issueSession: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    hashPassword: jest.fn(),
  };

  const cookies = {
    clearAccessCookie: jest.fn(),
    clearRefreshCookie: jest.fn(),
  };

  const users = { update: jest.fn() };

  const res = {} as Response;

  const userView = {
    id: '1415c2fc-4067-4c4f-a7e1-748afc4e9b71',
    email: 'test@example.com',
    name: 'Theo',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const session = {
    user: userView,
    accessToken: 'at',
    refreshToken: 'rt',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const mod = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: CookiesService, useValue: cookies },
        { provide: UsersService, useValue: users },
      ],
    }).compile();

    controller = mod.get(AuthController);
  });

  it('signup → auth.signup', async () => {
    auth.signup.mockResolvedValue(session);
    const body = {
      email: 'a@b.com',
      name: 't',
      password: 'x',
      confirmPassword: 'x',
    };

    expect(await controller.signup(body as any)).toEqual(session);
    expect(auth.signup).toHaveBeenCalledWith({
      email: body.email,
      name: body.name,
      password: body.password,
    });
  });

  it('login chains validateCredentials + issueSession', async () => {
    auth.validateCredentials.mockResolvedValue(userView);
    auth.issueSession.mockResolvedValue(session);

    expect(
      await controller.login({ email: 'a@b.com', password: 'x' } as any),
    ).toEqual(session);
    expect(auth.issueSession).toHaveBeenCalledWith(userView);
  });

  it('refresh → auth.refresh', async () => {
    auth.refresh.mockResolvedValue(session);
    expect(await controller.refreshToken('raw')).toEqual(session);
  });

  it('logout clears cookies; only calls logout when refresh cookie present', async () => {
    auth.logout.mockResolvedValue(undefined);

    await controller.logout(
      { cookies: { [COOKIE.REFRESH]: 'rt' } } as Request,
      res,
    );
    expect(auth.logout).toHaveBeenCalledWith('rt');

    await controller.logout({ cookies: {} } as Request, res);
    expect(auth.logout).toHaveBeenCalledTimes(1);

    expect(cookies.clearAccessCookie).toHaveBeenCalledWith(res);
    expect(cookies.clearRefreshCookie).toHaveBeenCalledWith(res);
  });

  it('PATCH me: builds update payload; hashes password if sent', async () => {
    users.update.mockResolvedValue(userView);

    await controller.updateMe(userView, { name: 'New' } as any);
    expect(users.update).toHaveBeenCalledWith(userView.id, { name: 'New' });

    auth.hashPassword.mockResolvedValue('hashed');
    await controller.updateMe(userView, { password: 'Secret1!' } as any);
    expect(users.update).toHaveBeenCalledWith(userView.id, {
      passwordHash: 'hashed',
    });
  });
});
