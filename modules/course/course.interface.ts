import { Model, Types } from "mongoose";

type TComment = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  question: string;
  questionReplies: {
    user: Types.ObjectId;
    answer: string;
  }[];
};

export type TReview = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
};

type TLink = {
  title: string;
  url: string;
};

export type TCourseData = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: TLink[];
  suggestion: string;
  questions: TComment[];
};

// model interface
export type TCourse = {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: {
    publicId: string;
    url: string;
  };
  categories: string;
  tags: string[];
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: TReview[];
  courseData: TCourseData[];
  ratings?: number;
  purchased: number;
};

//  types of payloads
export type TQuestion = {
  courseId: string;
  contentId: string;
  question: string;
};

export type TReplyReview = {
  courseId: string;
  comment: string;
  reviewId: string;
};
export type TAnswer = {
  courseId: string;
  contentId: string;
  questionId: string;
  answer: string;
};

export type CourseModel = Model<TCourse, Record<string, unknown>>;
