export type IUserLoginResponse = {
  accessToken: string;
  refreshToken?: string;
};
export type IRefreshTokenResponse = {
  accessToken: string;
};

export type TTokenOptons = {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: string;
  secure?: boolean;
};
