import { Model, Types } from "mongoose";

export type TOrder = {
  courseId: Types.ObjectId;
  userId: Types.ObjectId;
  paymentInfo: Record<string, unknown>;
};

export type OrderModel = Model<TOrder, Record<string, unknown>>;
