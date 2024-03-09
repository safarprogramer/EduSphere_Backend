import { Document, Model } from "mongoose";

export type TUserCourse = {
  courseId: string;
};

export type TUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: {
    publicId: string;
    url: string;
  };
  role: "user" | "admin";
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
};

export type TUserMethods = {
  comparePassword(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
};
// account activate via otp
export type TActivationRequest = {
  activationToken: string;
  activationCode: string;
};
// login body
export type TUserLogin = {
  email: string;
  password: string;
};

export type TSocialAuth = {
  name: string;
  email: string;
  avatar: string;
};

export type TUpdatePassword = {
  oldPassword: string;
  newPassword: string;
};

export type UserModel = Model<TUser, Record<string, unknown>, TUserMethods>;
