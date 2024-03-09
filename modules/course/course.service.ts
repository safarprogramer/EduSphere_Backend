import httpStatus from "http-status";
import ErrorHandler from "../../utils/ErrorHandler";
import { TAnswer, TQuestion, TReplyReview, TReview } from "./course.interface";
import { cloudinaryHelper } from "../../cloudinary/cloudinaryHelper";
import { Course } from "./courese.model";
import { redis } from "../../server";
import { TUserCourse } from "../user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { nodemailerHelper } from "../../utils/sendMail";
import ejs from "ejs";
import path from "path";
import { User } from "../user/user.model";
import { Notification } from "../notification/notification.model";

const createCourse = async (
  courseInfo: any,
  thumbnail: Express.Multer.File | undefined
) => {
  const {
    name,
    description,
    price,
    tags,
    level,
    demoUrl,
    benefits,
    prerequisites,
    courseData,
  } = courseInfo;

  courseInfo.benefits = JSON.parse(benefits);
  courseInfo.prerequisites = JSON.parse(prerequisites);

  courseInfo.courseData = JSON.parse(courseData);

  if (!name || !description || !price || !tags || !level || !demoUrl) {
    throw new ErrorHandler(
      httpStatus.BAD_REQUEST,
      "Required properties are missing in courseInfo."
    );
  }

  if (!thumbnail)
    throw new ErrorHandler(
      httpStatus.BAD_REQUEST,
      "Must provide course thumbnail."
    );

  const uploadedThumbnail = await cloudinaryHelper.uploadToCloudinary(
    thumbnail,
    "edusphere/courses/thumbnails"
  );

  courseInfo.thumbnail = uploadedThumbnail!;

  const result = await Course.create(courseInfo);
  return result;
};

const editCourse = async (
  courseId: string,
  payload: any,
  thumbnail: Express.Multer.File | undefined
) => {
  const { benefits, prerequisites, courseData } = payload;

  payload.benefits = JSON.parse(benefits);
  payload.prerequisites = JSON.parse(prerequisites);
  payload.courseData = JSON.parse(courseData);

  const course = await Course.findById(courseId);
  if (!course) throw new ErrorHandler(httpStatus.NOT_FOUND, "Course not found");

  if (thumbnail && typeof thumbnail !== "string") {
    await cloudinaryHelper.deleteFromCloudinary(course.thumbnail?.publicId);

    const updatedThumbnail = await cloudinaryHelper.uploadToCloudinary(
      thumbnail,
      "courses"
    );

    payload.thumbnail = updatedThumbnail!;
  } else {
    payload.thumbnail = course.thumbnail;
  }

  const result = await Course.findByIdAndUpdate(courseId, payload, {
    new: true,
  });

  // need to update on redis for all course after edit course
  const allCourse = await Course.find().select(
    "-courseData.videoUrl -courseData.videoSection -courseData.links -courseData.course"
  );
  await redis.set("allCourse", JSON.stringify(allCourse));
  await redis.setex(courseId, 604800, JSON.stringify(course));

  return result;
};

// get single course without purchase
const getSingleCourse = async (courseId: string) => {
  const isCacheExist = await redis.get(courseId);

  if (isCacheExist) {
    const course = JSON.parse(isCacheExist);
    return course;
  }

  const course = await Course.findById(courseId)
    .select(
      "-courseData.videoUrl  -courseData.links -courseData.course -courseData.description"
    )
    .populate({
      path: "reviews.user",
      model: "User",
      select: "name",
    });

  if (!course) throw new ErrorHandler(httpStatus.NOT_FOUND, "Course not found");

  await redis.setex(courseId, 604800, JSON.stringify(course));

  return course;
};

// get all course without purchase
const getAllCourse = async () => {

  const cachedData = await redis.get("allCourse");
  
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const result = await Course.find({}).select(
    "-courseData.videoUrl -courseData.videoSection -courseData.links -courseData.course"
  );

  await redis.set("allCourse", JSON.stringify(result));

  return result;
};

const getCourseByUser = async (user: JwtPayload, courseId: string) => {
  const courseList = user.courses;

  const courseExist = courseList.find(
    (course: any) => course.courseId.toString() === courseId
  );

  if (!courseExist)
    throw new ErrorHandler(
      httpStatus.NOT_FOUND,
      "You are not eligible to access this course"
    );

  const result = await Course.findById(courseId, { courseData: 1, reviews: 1 })
    .populate({
      path: "courseData.questions.user",
      model: "User",
      select: "name avatar",
    })
    .populate({
      path: "courseData.questions.questionReplies.user",
      model: "User",
      select: "name avatar role",
    })
    .populate({
      path: "reviews.user",
      model: "User",
      select: "name avatar",
    });

  return result;
};

const addQuestion = async (payload: TQuestion, userId: string) => {
  const { courseId, contentId, question } = payload;

  const course = await Course.findById(courseId);

  if (!course) throw new ErrorHandler(httpStatus.NOT_FOUND, "Course not found");

  const courseContent = course.courseData.find((course) =>
    course._id.equals(contentId)
  );

  if (!courseContent)
    throw new ErrorHandler(httpStatus.NOT_FOUND, "Invalid content id");

  const newQuestion = {
    user: new mongoose.Types.ObjectId(userId),
    question: question,
    questionReplies: [],
  };

  courseContent.questions.push(newQuestion);
  await course.save();

  await Notification.create({
    userId: userId,
    title: "New question",
    message: `You have a new question in ${courseContent?.title}`,
  });

  return course;
};

const addAnswer = async (payload: TAnswer, userId: string) => {
  const { courseId, contentId, answer, questionId } = payload;

  const course = await Course.findById(courseId);

  if (!course) throw new ErrorHandler(httpStatus.NOT_FOUND, "Course not found");

  const courseContent = course.courseData.find((course) =>
    course._id.equals(contentId)
  );

  if (!courseContent)
    throw new ErrorHandler(httpStatus.NOT_FOUND, "Invalid content id");

  const question = courseContent?.questions.find((content) =>
    content._id!.equals(questionId)
  );

  if (!question)
    throw new ErrorHandler(httpStatus.NOT_FOUND, "Invalid question id");

  const newAnswer = {
    user: new mongoose.Types.ObjectId(userId),
    answer: answer,
  };

  question.questionReplies.push(newAnswer);
  await course?.save();

  if (userId === question.user?.toString()) {
    await Notification.create({
      userId: userId,
      title: "New Question Reply Recieved",
      message: `You have a new question reply in ${courseContent?.title}`,
    });
  } else {
    const user = await User.findById(question.user);
    if (user) {
      const data = { name: user.name, title: courseContent.title };

      const html = await ejs.renderFile(
        path.join(__dirname, "../../ejs/questionReply.ejs"),
        data
      );

      await nodemailerHelper.sendEmail({
        email: user.email,
        subject: "Question Reply",
        data,
        template: "questionReply.ejs",
      });
    }
  }

  return course;
};

const addReview = async (
  payload: TReview,
  courseId: string,
  user: JwtPayload
) => {
  const userCourseList = user.courses;

  const courseExist = userCourseList.find(
    (course: TUserCourse) => course?.courseId.toString() === courseId
  );

  if (!courseExist)
    throw new ErrorHandler(
      httpStatus.UNAUTHORIZED,
      "You are not elligible to access this course"
    );

  const course = await Course.findById(courseId);

  let review = course?.reviews.find(
    (review) => review.user.toString() === user._id
  );

  const newReview = {
    user: new mongoose.Types.ObjectId(user._id),
    comment: payload?.comment,
    rating: payload?.rating,
  };

  if (review) {
    review.comment = newReview.comment;
    review.rating = newReview.rating ? newReview.rating : review.rating;
  } else {
    course?.reviews.push(newReview);
  }

  const sum = course?.reviews.reduce(
    (prev, current) => prev + (current?.rating || 0),
    0
  );

  const average = (sum as number) / (course?.reviews?.length || 1);

  if (course) course.ratings = average;

  await course?.save();
  await redis.set(courseId, JSON.stringify(course));

  const notification = {
    userId: user?._id,
    title: "New Review Received",
    message: `${user.name} has given a review in ${course?.name}`,
  };

  await Notification.create(notification);

  return course;
};

// for admin
const getAllCourses = async () => {
  const result = await Course.find().sort({ createdAt: -1 });
  return result;
};

const deleteCourse = async (courseId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ErrorHandler(httpStatus.NOT_FOUND, "Course not found");

  const result = await Course.findByIdAndDelete(courseId);

  await redis.del(courseId);

  // set on redis after delete
  const allCourse = await Course.find({}).select(
    "-courseData.videoUrl -courseData.videoSection -courseData.links -courseData.course"
  );
  await redis.set("allCourse", JSON.stringify(allCourse));

  return result;
};

export const CourseService = {
  createCourse,
  editCourse,
  getSingleCourse,
  getAllCourse,
  getCourseByUser,
  addQuestion,
  addAnswer,
  addReview,
  getAllCourses,
  deleteCourse,
};
