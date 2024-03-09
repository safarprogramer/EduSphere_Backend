import express from "express";
import auth, { ENUM_USER_ROLE, authorizeRoles } from "../../middleware/auth";
import { NotificationController } from "./notification.controller";

const router = express.Router();

router.get(
  "/",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  NotificationController.getNotifications
);
router.patch(
  "/update-status/:id",
  auth,
  authorizeRoles(ENUM_USER_ROLE.ADMIN),
  NotificationController.updateNotification
);

export const NotificationRoutes = router;
