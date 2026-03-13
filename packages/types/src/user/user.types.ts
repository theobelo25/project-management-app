export interface PrivateUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserView {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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
