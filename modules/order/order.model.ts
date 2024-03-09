import { Schema, model } from "mongoose";
import { OrderModel, TOrder } from "./order.interface";

const OrderSchema = new Schema<TOrder, Record<string, unknown>>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    paymentInfo: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export const Order = model<TOrder, OrderModel>("Order", OrderSchema);
