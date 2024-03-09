/* eslint-disable no-console */
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../config";
import { TTokenOptons } from "./jwt.interface";
import { TUser } from "../modules/user/user.interface";
import { redis } from "../server";
    
const createOption = (tokenExpire: number) => {
  return {
    expires: new Date(Date.now() + tokenExpire * 1000 * 60 * 60 * 24),
    maxAge: tokenExpire * 1000 * 60 * 60 * 24,
    httpOnly: true,
    // development sameSite "lax", production "none"
    sameSite: "none",
    // secure true in production
    secure: true,
  };
};

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, { expiresIn: expireTime });
};

const sendToken = async (user: TUser) => {
  await redis.set(user._id as string, JSON.stringify(user));

  const accessToken = createToken(
    { id: user._id },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = createToken(
    { id: user._id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  const cookieExpire = Number(config.cookie.access_expire);
  const cookieRefreshExpire = Number(config.cookie.refresh_expire);

  const accessTokenOptions: TTokenOptons = createOption(cookieExpire);
  const refreshTokenOptions: TTokenOptons = createOption(cookieRefreshExpire);

  if (config.env === "production") accessTokenOptions.secure = true;

  return {
    accessTokenOptions,
    refreshTokenOptions,
    accessToken,
    refreshToken,
  };
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  sendToken,
  verifyToken,
  createToken,
};
