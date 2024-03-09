import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../utils/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import httpStatus from "http-status";
import { jwtHelpers } from "../jwt/jwtHelper";
import config from "../config";
import { Secret } from "jsonwebtoken";
import { redis } from "../server";

export const auth = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;
   
    if (!access_token)
      throw new ErrorHandler(
        httpStatus.NOT_FOUND,
        "Please login to access this resource"
      );
    const decoded = jwtHelpers.verifyToken(
      access_token,
      config.jwt.secret as Secret
    );
    
    if (!decoded)
      throw new ErrorHandler(httpStatus.NOT_FOUND, "Access token is not valid");

    const user = await redis.get(decoded.id);

    if (!user) throw new ErrorHandler(httpStatus.NOT_FOUND, "Please login");
    req.user = JSON.parse(user);

    next();
  }
);

export enum ENUM_USER_ROLE {
  ADMIN = "admin",
  USER = "user",
  SUPER_ADMIN = "super admin",
}

export const authorizeRoles =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (requiredRoles.length && !requiredRoles.includes(req.user?.role)) {
        throw new ErrorHandler(
          httpStatus.FORBIDDEN,
          `Role: ${req.user?.role} is not allowed access this resources `
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
