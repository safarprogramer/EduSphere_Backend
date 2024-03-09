import httpStatus from "http-status";
import ErrorHandler from "../../utils/ErrorHandler";
import { Notification } from "./notification.model";
import cron from "node-cron";

const getNotifications = async () => {
  const result = await Notification.find().sort({ createdAt: -1 });
  return result;
};

const updateNotification = async (notificationId: string) => {
  const notification = await Notification.findById(notificationId);
  if (!notification)
    throw new ErrorHandler(httpStatus.NOT_FOUND, "Notification not found");
  notification.status = "read";

  await notification.save();

  return notification;
};

export const NotificationService = {
  getNotifications,
  updateNotification,
};

cron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await Notification.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
});
