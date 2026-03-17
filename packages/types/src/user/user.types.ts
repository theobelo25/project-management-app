export interface PrivateUser {
  id: string;
  orgId: string;
  organizationName: string;

  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserView {
  id: string;
  orgId: string;
  organizationName: string;

  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAuthResponseDto {
  user: string;
}

export type AuthUser = { id: string; orgId: string };

export type RefreshAuthUser = {
  user: UserView;
  rawRefreshToken: string;
};

export type CreateUserDto = {
  orgId: string;
  email: string;
  name: string;
  passwordHash: string;
};
