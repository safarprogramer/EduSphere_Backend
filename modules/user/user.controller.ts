import { CookieOptions, Request, Response } from "express";
import catchAsyncError from "../../utils/catchAsyncError";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { redis } from "../../server";

const userRegistration = catchAsyncError(
  async (req: Request, res: Response) => {
    const userInfo = req.body;
    const result = await UserService.userRegistration(userInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
      message: "Please check your email to activate your account",
    });
  }
);
const socialAuth = catchAsyncError(async (req: Request, res: Response) => {
  const userInfo = req.body;

  const result = await UserService.socialAuth(userInfo);

  const {
    accessToken,
    refreshToken,
    accessTokenOptions,
    refreshTokenOptions,
    user,
  } = result;

  res.cookie("access_token", accessToken, accessTokenOptions as CookieOptions);
  res.cookie(
    "refresh_token",
    refreshToken,
    refreshTokenOptions as CookieOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: { user, accessToken },
    message: "Social authentication successful",
  });
});
const activateUser = catchAsyncError(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserService.activateUser(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
    message: "Your account activated successfully",
  });
});

const loginUser = catchAsyncError(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserService.loginUser(payload);
  const {
    accessToken,
    refreshToken,
    accessTokenOptions,
    refreshTokenOptions,
    sanitizedUser,
  } = result;

  res.cookie("access_token", accessToken, accessTokenOptions as CookieOptions);
  res.cookie(
    "refresh_token",
    refreshToken,
    refreshTokenOptions as CookieOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: { sanitizedUser, accessToken },
    message: "Logged in successfully",
  });
});

const logoutUser = catchAsyncError(async (req: Request, res: Response) => {
  res.cookie("access_token", "", { maxAge: 1 });
  res.cookie("refresh_token", "", { maxAge: 1 });

  redis.del(req.user?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out  successfully",
  });
});

const updateAccessToken = catchAsyncError(
  async (req: Request, res: Response) => {
    const token = req.cookies.refresh_token;

    const result = await UserService.updateAccessToken(token);
    const {
      accessToken,
      refreshToken,
      accessTokenOptions,
      refreshTokenOptions,
      user,
    } = result;

    req.user = user;

    res.cookie(
      "access_token",
      accessToken,
      accessTokenOptions as CookieOptions
    );
    res.cookie(
      "refresh_token",
      refreshToken,
      refreshTokenOptions as CookieOptions
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Regenarated access token successfully",
    });
  }
);

const getUserInfo = catchAsyncError(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await UserService.getUserInfo(user?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile info retrived successfully",
    data: result,
  });
});
const updateUserInfo = catchAsyncError(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;

  const result = await UserService.updateUserInfo(payload, user?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile info updated successfully",
    data: result,
  });
});

const updatePassword = catchAsyncError(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;

  const result = await UserService.updatePassword(payload, user?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password updated successfully",
    data: result,
  });
});

const updateProfilePicture = catchAsyncError(
  async (req: Request, res: Response) => {
    const user = req.user;
    const image = req.file;

    const result = await UserService.updateProfilePicture(image, user?._id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password picture updated successfully",
      data: result,
    });
  }
);

const getAllUsers = catchAsyncError(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users retrieved successfully",
    data: result,
  });
});

const updateRole = catchAsyncError(async (req: Request, res: Response) => {
  const { email } = req.params;
  const { role } = req.body;
  const result = await UserService.updateRole(email, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role changed successfully",
    data: result,
  });
});
const deleteUser = catchAsyncError(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = req.user;

  const result = await UserService.deleteUser(userId, user?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const UserController = {
  userRegistration,
  socialAuth,
  activateUser,
  loginUser,
  logoutUser,
  updateAccessToken,
  getUserInfo,
  updateUserInfo,
  updatePassword,
  updateProfilePicture,
  getAllUsers,
  updateRole,
  deleteUser,
};
