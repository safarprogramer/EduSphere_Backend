import { analyticsHelper } from "../../utils/analytics.generator";
import { Course } from "../course/courese.model";
import { Order } from "../order/order.model";
import { User } from "../user/user.model";

const getUserAnalytics = async () => {
  const users = await analyticsHelper.generateLast12MonthsData(User);

  return users;
};
const getCourseAnalytics = async () => {
  const course = await analyticsHelper.generateLast12MonthsData(Course);

  return course;
};
const getOrderAnalytics = async () => {
  const order = await analyticsHelper.generateLast12MonthsData(Order);

  return order;
};

export const AnalyticsService = {
  getUserAnalytics,
  getCourseAnalytics,
  getOrderAnalytics,
};
