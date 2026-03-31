export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'default' | 'pastel-warm' | 'pastel-cool';

export interface PrivateUser {
  id: string;

  // active org used for request scoping + display
  orgId: string;
  organizationName: string;

  email: string;
  name: string;
  themeMode?: ThemeMode | null;
  colorScheme?: ColorScheme | null;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserView {
  id: string;

  // active org used for request scoping + display
  orgId: string;
  organizationName: string;

  email: string;
  name: string;
  themeMode?: ThemeMode | null;
  colorScheme?: ColorScheme | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAuthResponseDto {
  user: string;
}

// Request-scoped user (active org)
export type AuthUser = { id: string; orgId: string };

export type RefreshAuthUser = {
  user: UserView;
  rawRefreshToken: string;
};

// Signup still creates a first org and sets it active
export type CreateUserDto = {
  // NOTE: Keep this as the initial org created at signup
  orgId: string;

  email: string;
  name: string;
  passwordHash: string;
};
