import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import httpStatus from "http-status";

export const globalErrorhandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal server error";

  if (error.name === "castError") {
    const message = `Duplicate ${Object.keys(error.keyValue)} entered`;
    error = new ErrorHandler(400, message);
  }
  if (error.code === 11000) {
    const message = `Not found. InvalidId: ${error.path}`;
    error = new ErrorHandler(400, message);
  }
  if (error.name === "JsonWebTokenError") {
    const message = `Json web token is invalid, try again`;
    error = new ErrorHandler(400, message);
  }
  if (error.name === "TokenExpiredError") {
    const message = `Json web token is expired, try again`;
    error = new ErrorHandler(400, message);
  }

  res.status(httpStatus.BAD_REQUEST).json({
    success: false,
    message: error.message,
  });
  next();
};
