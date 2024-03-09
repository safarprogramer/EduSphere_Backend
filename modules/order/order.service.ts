import httpStatus from "http-status";
import ErrorHandler from "../../utils/ErrorHandler";
import { User } from "../user/user.model";
import { TOrder } from "./order.interface";
import { Course } from "../course/courese.model";
import ejs from "ejs";
import path from "path";
import { nodemailerHelper } from "../../utils/sendMail";
import { Notification } from "../notification/notification.model";
import { Order } from "./order.model";
import mongoose from "mongoose";
import config from "../../config";
import { redis } from "../../server";

const stripe = require("stripe")(config.stripe_secret);

const createOrder = async (payload: Partial<TOrder>, userId: string) => {
  const { courseId, paymentInfo }: any = payload;
  if (!courseId)
    throw new ErrorHandler(httpStatus.NOT_FOUND, "Please provide Course id");

  if (paymentInfo) {
    if ("id" in paymentInfo) {
      const paymentIntentId = paymentInfo.id;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status !== "succeeded") {
        throw new ErrorHandler(
          httpStatus.UNAUTHORIZED,
          "Payment not authorized!"
        );
      }
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
    if (!user) throw new ErrorHandler(httpStatus.NOT_FOUND, "User not found");

    const courseExist = user?.courses.find(
      (course) => course.courseId.toString() === courseId?.toString()
    );

    if (courseExist)
      throw new ErrorHandler(
        httpStatus.BAD_REQUEST,
        "You have already purchased this course"
      );

    const course = await Course.findById(courseId);
    if (!course)
      throw new ErrorHandler(httpStatus.NOT_FOUND, "Course not found");

    const data = {
      courseId: course._id,
      userId: user._id,
      paymentInfo,
    };

    const order = await Order.create([data], { session });

    if (course) {
      course.purchased = course.purchased + 1;
    }

    await course.save({ session });
    await redis.setex(courseId, 604800, JSON.stringify(course));

    const mailData = {
      order: {
        _id: course._id.toString().slice(0, 6),
        name: course.name,
        price: course.price,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };

    const html = await ejs.renderFile(
      path.join(__dirname, "../../ejs/orderConfirm.ejs"),
      mailData
    );

    if (user) {
      await nodemailerHelper.sendEmail({
        email: user.email,
        subject: "Order Confirmation",
        data: mailData,
        template: "orderConfirm.ejs",
      });
    }

    user.courses.push({ courseId: course._id.toString() });

    await redis.set(userId, JSON.stringify(user));
    await user.save({ session });

    await Notification.create(
      [
        {
          userId: user._id,
          title: "New Order",
          message: `You have a new Order from ${course?.name}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { order: order[0] };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

const getAllOrders = async () => {
  const result = await Order.find().sort({ createdAt: -1 }).populate({
    path: "userId",
    model: "User",
    select: "name",
  });
  return result;
};

// get stripe publish key
const getStripeKey = async () => {
  return { publishableKey: config.stripe_publish };
};

// new payment
const newPayment = async (amount: number) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "USD",
    metadata: {
      company: "Learnify",
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return { client_secret: myPayment.client_secret };
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getStripeKey,
  newPayment,
};
