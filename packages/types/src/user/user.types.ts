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
