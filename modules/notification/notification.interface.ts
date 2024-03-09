import { Model } from "mongoose";

export type TNotification = {
  title: string;
  message: string;
  status: "read" | "unread";
  userId: string;
};

export type NotificationModel = Model<TNotification, Record<string, unknown>>;