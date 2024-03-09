import { Request, Response } from "express";
import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { NotificationService } from "./notification.service";

const getNotifications = catchAsyncError(
  async (req: Request, res: Response) => {
    const result = await NotificationService.getNotifications();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Notifications retrived uccessfully",
      data: result,
    });
  }
);

const updateNotification = catchAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await NotificationService.updateNotification(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Notification  marked as read successfully",
      data: result,
    });
  }
);

export const NotificationController = {
  getNotifications,
  updateNotification,
};
