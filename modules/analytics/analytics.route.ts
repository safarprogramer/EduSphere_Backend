import express from "express";
import auth, { ENUM_USER_ROLE, authorizeRoles } from "../../middleware/auth";
import { AnalyticsController } from "./analytics.controller";

const router = express.Router();

router.get(
  "/get-user-analytics",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  AnalyticsController.getUserAnalytics
);
router.get(
  "/get-course-analytics",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  AnalyticsController.getCourseAnalytics
);
router.get(
  "/get-order-analytics",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  AnalyticsController.getOrderAnalytics
);

export const AnalyticsRoutes = router;
