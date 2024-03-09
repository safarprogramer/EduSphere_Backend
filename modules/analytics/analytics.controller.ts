import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AnalyticsService } from "./analytics.service";

const getUserAnalytics = catchAsyncError(
  async (req: Request, res: Response) => {
    const result = await AnalyticsService.getUserAnalytics();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User analytics retrieved successfully",
      data: result,
    });
  }
);
const getCourseAnalytics = catchAsyncError(
  async (req: Request, res: Response) => {
    const result = await AnalyticsService.getCourseAnalytics();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Course analytics retrieved successfully",
      data: result,
    });
  }
);
const getOrderAnalytics = catchAsyncError(
  async (req: Request, res: Response) => {
    const result = await AnalyticsService.getOrderAnalytics();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order analytics retrieved successfully",
      data: result,
    });
  }
);

export const AnalyticsController = {
  getUserAnalytics,
  getCourseAnalytics,
  getOrderAnalytics,
};
