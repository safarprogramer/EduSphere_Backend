import { Schema, model } from "mongoose";
import { NotificationModel, TNotification } from "./notification.interface";

const NotificationSchema = new Schema<TNotification, Record<string, unknown>>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Notification = model<TNotification, NotificationModel>(
  "Notification",
  NotificationSchema
);
