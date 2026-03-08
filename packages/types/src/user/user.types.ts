export interface User {
  id: string;
  email: string;
  name: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  refreshToken: string | null;
}

export interface UserView {
  id: string;
  email: string;
  name: string | null;
}

export interface UserAuthResponseDto {
  user: string;
}

export type AuthUser = { id: string };

export type RefreshAuthUser = {
  user: UserView;
  rawRefreshToken: string;
};

export type CreateUserDto = {
  email: string;
  name: string;
  passwordHash: string;
};
