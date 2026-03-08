import { UserView } from "../user/user.types";

export type SignupInputDto = {
  email: string;
  password: string;
  name: string;
};

export type SessionPayload = {
  user: UserView;
  accessToken: string;
  refreshToken: string;
};
