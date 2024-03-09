import express from "express";
import { CourseController } from "./course.controller";
import singleUpload from "../../middleware/multer";
import auth, { ENUM_USER_ROLE, authorizeRoles } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/create-course",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  singleUpload,
  CourseController.createCourse
);

router.patch(
  "/edit-course/:courseId",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  singleUpload,
  CourseController.editCourse
);
router.get("/get-course/:courseId", CourseController.getSingleCourse);

router.get("/get-courses", CourseController.getAllCourse);

router.get(
  "/get-course-content/:courseId",
  auth,
  CourseController.getCourseByUser
);
router.patch("/add-question", auth, CourseController.addQuestion);
router.patch("/add-answer", auth, CourseController.addAnswer);
router.patch("/add-review/:courseId", auth, CourseController.addReview);

router.get(
  "/get-all-courses",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  CourseController.getAllCourses
);

router.post("/get-vdocipherOTP", CourseController.generateVideoUrl);

router.delete(
  "/delete-course/:courseId",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  CourseController.deleteCourse
);

export const CourseRoutes = router;
